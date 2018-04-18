import {
  AfterViewChecked, AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, OnInit, Optional,
  Renderer2
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { easing } from '../animations/easings';
import { NavigationStart, Router } from '@angular/router';
import { ScrollbarConfig } from '../models/scrolbar-config';
import { WindowService } from '../services/window.service';
import { ScrollbarService } from '../services/scrollbar.service';

@Directive({
  selector: '[cbjScrollbar]'
})
export class CbjScrollbarDirective implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  /**
   * The scrollbars configuration object
   *
   * @type {ScrollbarConfig}
   */
  @Input('cbjScrollbar') config: ScrollbarConfig;

  /**
   * The wrapper Element
   *
   * @type {HTMLElement}
   */
  private wrapper: HTMLElement;

  /**
   * The grid Element
   *
   * @type {HTMLElement}
   */
  private grid: HTMLElement;

  /**
   * The bar Element
   *
   * @type {HTMLElement}
   */
  private bar: HTMLElement;

  /**
   * The height of the scrollable content.
   *
   * @type {number}
   */
  private scrollHeight: number;

  /**
   * The timeout for hiding the scrollbar
   *
   * @type {number | timeout}
   */
  private timeout: any;

  /**
   * Indicates whether the scrollbar needs to be shown
   *
   * @type {boolean}
   */
  private notNeeded: boolean;

  /**
   * Indicates whether the scrollbar is hidden
   *
   * @type {boolean}
   */
  private hidden: boolean;

  /**
   * Subject to unsubscribe from Observables
   *
   * @type {Subject<void>}
   */
  private unsubscribe = new Subject<void>();

  /**
   * @constructor
   *
   * @param {ElementRef} el
   * @param {Renderer2} renderer
   * @param {ScrollbarService} scroll
   * @param {WindowService} ws
   * @param {Document} doc
   * @param {Router} router
   */
  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private scroll: ScrollbarService,
              private ws: WindowService,
              @Inject(DOCUMENT) private doc: Document,
              @Optional() private router: Router) {
  }

  ngOnInit() {
    // Start Working
    this.createScrollbar();
  }

  ngAfterViewInit() {
    // Wait 250ms or else scrollbar breaks on page load in FF, then calculate and set the bar height
    setTimeout(this.setBarHeight, 250);
  }

  ngAfterViewChecked() {
    // Check if scrollHeight has changed and recalculate bar height if so
    const dif = this.scrollHeight !== Math.round(this.el.nativeElement.scrollHeight);
    if (dif) {
      this.setBarHeight();
    }
  }

  ngOnDestroy() {
    // do some cleanup and unsubscribe from our Observables
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private createScrollbar() {
    this.setParentsStyles();
    this.setElementStyle();
    this.renderWrapper();
    this.renderGrid();
    this.renderBar();
    this.subscribe();
  }

  /**
   * Here we set the hosts parent to position relative
   * Additionally, to prevent a scrollbar from appearing in FF, we set the body to overflow hidden
   */
  private setParentsStyles(): void {
    const natEl = this.el.nativeElement;
    const parent = this.renderer.parentNode(natEl);
    this.renderer.setStyle(parent, 'position', 'relative');

    const body = this.doc.getElementsByTagName('BODY')[0];
    this.renderer.setStyle(body, 'overflow', 'hidden');
  }

  /**
   * Sets styles on host element
   *
   */
  private setElementStyle(): void {
    const natEl = this.el.nativeElement;
    this.renderer.setStyle(natEl, 'overflow', 'hidden');
  }

  /**
   * Creates, configures, and inserts wrapper element
   * The wrapper will go around all elements, including the host element
   *
   * Element Properties
   * -- classes defined in config. @default: 'cbj-scroll-wrapper'
   * -- margin and height are obtained from the host element
   * -- width set to 100% to fix issue in FF where content did not fill available space (can be overridden with wrapperWidth options)
   * -- styles defined in config. @default: {}
   */
  private renderWrapper(): void {
    // Get ref to containing div and create element
    const natEl = this.el.nativeElement;
    this.wrapper = this.renderer.createElement('div');

    // Add Classes
    for (const cls of this.config.wClass) {
      this.renderer.addClass(this.wrapper, cls);
    }

    // Set Dynamic Styles. Wait 250ms since FF was too fast & height was still undefined
    setTimeout(() => {
      this.renderer.setStyle(this.wrapper, 'margin', getComputedStyle(natEl).margin);
      this.renderer.setStyle(this.wrapper, 'height', getComputedStyle(natEl).height);
    }, 250);

    // Set Other Styles
    if (this.config.wrapperWidth) {
      this.renderer.setStyle(this.wrapper, 'width', this.config.wrapperWidth); // Fixes main scrollbar issue in FF
    }
    for (const prop in this.config.wStyles) {
      if (this.config.wStyles.hasOwnProperty(prop)) {
        this.renderer.setStyle(this.wrapper, prop, this.config.wStyles[prop]);
      }
    }

    // Insert the wrapper before the host el and then move the host and its contents inside the wrapper
    this.renderer.insertBefore(this.renderer.parentNode(natEl), this.wrapper, natEl);
    this.renderer.appendChild(this.wrapper, natEl);
  }

  /**
   * Creates, configures, and inserts grid element
   * The grid is the element placed behind the scrollbar. It goes from the top to the bottom of the wrapper
   *
   * ElementProperties
   * -- classes defined in config @default: 'cbj-scroll-grid'
   * -- config.position set to config.gridOffset @default: 'right': 0
   * -- opacity set to 0 if alwaysVisible false
   * -- styles set in config @default: {
                                          'position': 'absolute',
                                          'top': 0,
                                          'bottom': 0,
                                          'display': 'block',
                                          'cursor': 'pointer',
                                          'z-index': 99999,
                                          'background': 'transparent',
                                          'width': '1rem',
                                          'border-radius': 0,
                                          'margin': 0,
                                          'transition': 'opacity 250ms ease-in-out'
                                        }
   *
   */
  private renderGrid(): void {
    // Create element
    this.grid = this.renderer.createElement('div');

    // Add Classes
    for (const cls of this.config.gClass) {
      this.renderer.addClass(this.grid, cls);
    }

    // Set Styles
    this.renderer.setStyle(this.grid, this.config.position, this.config.gridOffset);
    for (const prop in this.config.gStyles) {
      if (this.config.gStyles.hasOwnProperty(prop)) {
        this.renderer.setStyle(this.grid, prop, this.config.gStyles[prop]);
      }
    }

    // Hide grid if alwaysVisible not set
    if (!this.config.alwaysVisible) {
      this.renderer.setStyle(this.grid, 'opacity', 0);
    }

    // Insert the element
    this.renderer.appendChild(this.wrapper, this.grid);
  }

  /**
   * Creates, configures, and inserts bar element
   *
   * ElementProperties
   * -- classes defined in config @default: 'cbj-scroll-bar'
   * -- config.position set to config.gridOffset @default: 'right': '.5rem'
   * -- transform set to translate3d([50% | -50%], 0, 0) to center the bar. translate3d used to work on the gpu
   * -- opacity set to 0 if alwaysVisible false
   * -- styles set in config @default: {
                                          'position': 'absolute',
                                          'top': 0,
                                          'display': 'block',
                                          'cursor': 'pointer',
                                          'transition': 'opacity 250ms ease-in-out',
                                          'z-index': 100000,
                                          'background': '#495057',
                                          'width': '.7rem',
                                          'border-radius': '10px',
                                          'margin': 0
                                        }
   *
   */
  private renderBar(): void {
    // Create element
    this.bar = this.renderer.createElement('div');

    // Add Classes
    for (const cls of this.config.bClass) {
      this.renderer.addClass(this.bar, cls);
    }

    // Center the bar in the grid. Using translate3d to utilize gpu
    const translate = this.config.position === 'right' ? 'translate3d(50%, 0, 0)' : 'translate3d(-50%, 0, 0)';
    this.renderer.setStyle(this.bar, 'transform', translate);

    // Set Styles
    this.renderer.setStyle(this.bar, this.config.position, this.config.barOffset);
    for (const prop in this.config.bStyles) {
      if (this.config.bStyles.hasOwnProperty(prop)) {
        this.renderer.setStyle(this.bar, prop, this.config.bStyles[prop]);
      }
    }

    // Hide bar if alwaysVisible not set
    if (!this.config.alwaysVisible) {
      this.renderer.setStyle(this.bar, 'opacity', 0);
      this.hidden = true;
    } else {
      this.hidden = false;
    }

    // Insert the element
    this.renderer.appendChild(this.wrapper, this.bar);
  }

  /**
   * Measure the window and set the bars height
   */
  private setBarHeight = () => {
    const natEl = this.el.nativeElement;
    this.scrollHeight = Math.round(natEl.scrollHeight);

    const barHeight = (natEl.offsetHeight / natEl.scrollHeight) * natEl.offsetHeight;

    this.renderer.setStyle(this.bar, 'height', `${barHeight}px`);

    if (!this.barNeeded(natEl.offsetHeight, barHeight) ||
        !this.config.alwaysVisible ||
        this.hidden
    ) {
      this.showHideBarGrid();
    }

    if (this.config.isRoot) {
      this.ws.height = natEl.clientHeight;
      this.scroll.scrollHeight = this.scrollHeight;
    }
  }

  /**
   * Subscribe to all the Observables
   */
  private subscribe(): void {
    const natEl = this.el.nativeElement;
    const drag = this.scroll.initDrag(natEl, this.bar);

    this.scroll.initWheel(natEl)
      .takeUntil(this.unsubscribe)
      .subscribe(this.scrollWheel);

    this.ws.resizeObs.takeUntil(this.unsubscribe).subscribe(this.setBarHeight);

    drag.start.takeUntil(this.unsubscribe).subscribe(this.dragStart);

    drag.end.takeUntil(this.unsubscribe).subscribe(this.dragEnd);

    if (!this.config.alwaysVisible) {
      drag.move.takeUntil(this.unsubscribe).subscribe(this.resetTime);
    }

    if (this.config.isRoot && this.router) {
      this.router.events
        .filter(event => event instanceof NavigationStart)
        .subscribe((e: NavigationStart) => {
          this.scrollTo(0, 100, 'linear');
        });
    }

    if (this.config.toggleClasses) {
      Observable.from(this.config.toggleClasses)
        .takeUntil(this.unsubscribe)
        .subscribe(this.toggleClasses);
    }
  }

  /**
   * Toggle a class on one of the 3 created elements
   *
   * @param nxt { {el: string, classes: string, remove: boolean} }
   */
  private toggleClasses = (nxt: {el: string, classes: string, remove: boolean}) => {
    if (nxt.remove) {
      this.renderer.removeClass(this[nxt.el], nxt.classes);
    } else {
      this.renderer.addClass(this[nxt.el], nxt.classes);
    }
  }

  private showHideBarGrid = () => {
    const natEl = this.el.nativeElement;
    const barHeight = (natEl.offsetHeight / natEl.scrollHeight) * natEl.offsetHeight;

    this.notNeeded = !this.barNeeded(natEl.offsetHeight, barHeight);

    if (!this.hidden) {
      if (this.notNeeded || !this.config.alwaysVisible) {
        this.renderer.setStyle(this.grid, 'opacity', 0);
        this.renderer.setStyle(this.bar, 'opacity', 0);
        this.hidden = true;
      }
    } else {
      if (!this.notNeeded) {
        this.renderer.setStyle(this.grid, 'opacity', 1);
        this.renderer.setStyle(this.bar, 'opacity', 1);
        this.hidden = false;

        if (!this.config.alwaysVisible) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(this.showHideBarGrid, this.config.visibleTimeout);
        }
      }
    }
  }

  /**
   * Checks difference between bar height and content height. returns true if bar is needed
   *
   * @param {number} elHeight
   * @param {number} barHeight
   *
   * @returns {boolean} calculated bar height is less than the height of content + 2px
   */
  private barNeeded(elHeight: number, barHeight: number): boolean {
    return Math.round(elHeight) - Math.round(barHeight) > 2;
  }

  /**
   * Resets the timeout for hiding the scrollbar
   */
  private resetTime = () => {
    clearTimeout(this.timeout);

    if (this.hidden && !this.notNeeded) {
      this.renderer.setStyle(this.grid, 'opacity', 1);
      this.renderer.setStyle(this.bar, 'opacity', 1);
      this.hidden = false;
    }

    this.timeout = setTimeout(this.showHideBarGrid, this.config.visibleTimeout);
  }

  /**
   * Called on mouse drag while mouse down or called on touch drag while touch down
   *
   * @param {number} top
   */
  private dragStart = (top: number) => {
    if (!this.config.isRoot) {
      this.scroll.childScrolling = true;
    }
    if (!this.config.isRoot || (this.config.isRoot && this.scroll.childScrolling === false)) {
      this.renderer.setStyle(this.bar, 'top', `${top}px`);
      this.scrollContent();
    }
  }

  private scrollContent = () => {
    const natEl = this.el.nativeElement;
    const maxTop = natEl.offsetHeight - this.bar.offsetHeight;
    let percentScroll: number;

    let delta = parseInt(getComputedStyle(this.bar).top, 10);
    delta = Math.min(Math.max(delta, 0), maxTop);
    delta = Math.floor(delta);
    this.renderer.setStyle(this.bar, 'top', delta + 'px');

    percentScroll = parseInt(getComputedStyle(this.bar).top, 10) / (natEl.offsetHeight - this.bar.offsetHeight);
    delta = percentScroll * (natEl.scrollHeight - natEl.offsetHeight);

    natEl.scrollTop = delta;

    if (this.config.isRoot) {
      this.scroll.scrollPos = delta;
      this.scroll.scrollSubj.next(delta);
    }
  }

  /**
   * Called on drag-end event
   */
  private dragEnd = () => {
    const natEl = this.el.nativeElement;
    const paddingTop = parseInt(natEl.style.paddingTop, 10);
    const paddingBottom = parseInt(natEl.style.paddingBottom, 10);

    if (paddingTop > 0 || paddingBottom > 0) {
      this.scrollTo(0, 300, 'inOutCubic');
    }
    if (!this.config.isRoot) {
      this.scroll.childScrolling = false;
    }
  }

  private scrollWheel = (event: { x: number, y: number, type: string }) => {
    if (!this.config.isRoot) {
      this.scroll.childScrolling = true;
    }
    const natEl = this.el.nativeElement;
    const start = Date.now();
    const maxTop = natEl.offsetHeight - this.bar.offsetHeight;
    let percentScroll: number;
    let delta;

    const scroll = () => {
      const currentTime = Date.now();
      const time = Math.min(1, ((currentTime - start) / 200));
      const easedTime = easing.inOutQuad(time);

      delta = parseInt(getComputedStyle(this.bar).top, 10) + event.y * easedTime;

      delta = Math.min(Math.max(delta, 0), maxTop);
      delta = (event.y > 0) ? Math.ceil(delta) : Math.floor(delta);
      this.renderer.setStyle(this.bar, 'top', delta + 'px');

      percentScroll = parseInt(getComputedStyle(this.bar).top, 10) / (natEl.offsetHeight - this.bar.offsetHeight);
      delta = percentScroll * (natEl.scrollHeight - natEl.offsetHeight);

      natEl.scrollTop = delta;

      if (this.config.isRoot) {
        this.scroll.scrollPos = delta;
        this.scroll.scrollSubj.next(delta);
      }

      if (time < 1) {
        requestAnimationFrame(scroll);
      }
      if (!this.config.isRoot) {
        this.scroll.childScrolling = false;
      }
    };

    if (!this.config.isRoot || (this.config.isRoot && this.scroll.childScrolling === false)) {
      requestAnimationFrame(scroll);
    }
  }

  private scrollTo(y: number, duration: number, easingFunc: string): void {
    const natEl = this.el.nativeElement;
    const start = Date.now();
    const from = natEl.scrollTop;
    const maxElScrollTop = natEl.scrollHeight - natEl.clientHeight;
    const barHeight = Math.max((natEl.offsetHeight / natEl.scrollHeight) * natEl.offsetHeight, 30);
    const paddingTop = parseInt(natEl.style.paddingTop, 10) || 0;
    const paddingBottom = parseInt(natEl.style.paddingBottom, 10) || 0;

    const scroll = () => {
      const currentTime = Date.now();
      const time = Math.min(1, ((currentTime - start) / duration));
      const easedTime = easing[easingFunc](time);

      if (paddingTop > 0 || paddingBottom > 0) {
        let fromY = null;

        if (paddingTop > 0) {
          fromY = -paddingTop;
          fromY = -((easedTime * (y - fromY)) + fromY);
          this.renderer.setStyle(natEl, 'paddingTop', `${fromY}px`);
        }

        if (paddingBottom > 0) {
          fromY = paddingBottom;
          fromY = ((easedTime * (y - fromY)) + fromY);
          this.renderer.setStyle(natEl, 'paddingBottom', `${fromY}px`);
        }
      } else {
        natEl.scrollTop = (easedTime * (y - from)) + from;
      }

      const percentScroll = natEl.scrollTop / maxElScrollTop;
      if (paddingBottom === 0) {
        const delta = Math.round(Math.round(natEl.clientHeight * percentScroll) - barHeight);
        if (delta > 0) {
          this.renderer.setStyle(this.bar, 'top', `${delta}px`);
        } else {
          this.renderer.setStyle(this.bar, 'top', `0`);
        }
      }

      if (time < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  }
}

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
   * The wrappers Element
   *
   * @type {HTMLElement}
   */
  private wrapper: HTMLElement;

  /**
   * The grids Element
   *
   * @type {HTMLElement}
   */
  private grid: HTMLElement;

  /**
   * The bars Element
   *
   * @type {HTMLElement}
   */
  private bar: HTMLElement;

  /**
   * The height of the scrollable content
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
   * Subject to call to unsubscribe from Observables
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
    const el = this.el.nativeElement;
    const parent = this.renderer.parentNode(el);
    this.renderer.setStyle(parent, 'position', 'relative');

    const body = this.doc.getElementsByTagName('BODY')[0];
    this.renderer.setStyle(body, 'overflow', 'hidden');
  }

  /**
   * Sets styles on host element
   */
  private setElementStyle(): void {
    const el = this.el.nativeElement;
    this.renderer.setStyle(el, 'overflow', 'hidden');
    this.renderer.setStyle(el, 'position', 'relative');
    this.renderer.setStyle(el, 'display', 'block');
  }

  /**
   * Creates, configures, and inserts wrapper element
   * The wrapper will go around all elements, including the host element
   */
  private renderWrapper(): void {
    // Get ref to containing div and create element
    const el = this.el.nativeElement;
    this.wrapper = this.renderer.createElement('div');

    // Add Classes
    this.renderer.addClass(this.wrapper, this.config.wClass);

    // Set Dynamic Styles. Wait a tick since FF was too fast & height was still undefined
    setTimeout(() => {
      this.renderer.setStyle(this.wrapper, 'margin', getComputedStyle(el).margin);
      this.renderer.setStyle(this.wrapper, 'height', getComputedStyle(el).height);
    }, 0);

    // Set Other Styles
    for (const prop in this.config.wStyles) {
      if (this.config.wStyles.hasOwnProperty(prop)) {
        this.renderer.setStyle(this.wrapper, prop, this.config.wStyles[prop]);
      }
    }

    // Insert the wrapper before the host el and then move the host and its contents inside the wrapper
    this.renderer.insertBefore(this.renderer.parentNode(el), this.wrapper, el);
    this.renderer.appendChild(this.wrapper, el);
  }

  /**
   * Creates, configures, and inserts grid element
   */
  private renderGrid(): void {
    // Create element
    this.grid = this.renderer.createElement('div');

    // Add Classes
    this.renderer.addClass(this.grid, this.config.gClass);

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
   */
  private renderBar(): void {
    // Create element
    this.bar = this.renderer.createElement('div');

    // Add Classes
    this.renderer.addClass(this.bar, this.config.bClass);

    // Set Dynamic Styles
    const translate = this.config.position === 'right' ? 'translateX(50%)' : 'translateX(-50%)';
    this.renderer.setStyle(this.bar, 'transform', translate);

    // Set Other Styles
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
    const el = this.el.nativeElement;
    this.scrollHeight = Math.round(el.scrollHeight);
    const barHeight = Math.max((el.offsetHeight / el.scrollHeight) * el.offsetHeight, 30);

    this.renderer.setStyle(this.bar, 'height', `${barHeight}px`);

    const dif = Math.round(el.offsetHeight) - Math.round(barHeight);
    if (dif < 2 || !this.config.alwaysVisible || this.hidden) {
      this.showHideBarGrid();
    }
  }

  private subscribe(): void {
    const el = this.el.nativeElement;
    const drag = this.scroll.initDrag(el, this.bar);

    this.scroll.initWheel(el)
      .takeUntil(this.unsubscribe)
      .subscribe(this.scrollWheel);

    this.ws.resizeObs.takeUntil(this.unsubscribe).subscribe(() => {
      this.setBarHeight();
      if (this.config.isRoot) {
        this.ws.height = el.clientHeight;
      }
    });

    drag.start.takeUntil(this.unsubscribe).subscribe(this.dragStart);

    drag.end.takeUntil(this.unsubscribe).subscribe(this.dragEnd);

    if (!this.config.alwaysVisible) {
      Observable.fromEvent(el, 'mousemove')
        .takeUntil(this.unsubscribe)
        .subscribe(this.resetTime);
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

  private toggleClasses = ({el: el, classes: classes, remove: remove}) => {
    switch (el) {
      case 'wrapper':
        if (remove) {
          this.renderer.removeClass(this.wrapper, classes);
        } else {
          this.renderer.addClass(this.wrapper, classes);
        }
        break;
      case 'grid':
        if (remove) {
          this.renderer.removeClass(this.grid, classes);
        } else {
          this.renderer.addClass(this.grid, classes);
        }
        break;
      case 'bar':
        if (remove) {
          this.renderer.removeClass(this.bar, classes);
        } else {
          this.renderer.addClass(this.bar, classes);
        }
        break;
    }
  }

  private showHideBarGrid = () => {
    const el = this.el.nativeElement;
    const barHeight = (el.offsetHeight / el.scrollHeight) * el.offsetHeight;
    const dif = Math.round(el.offsetHeight) - Math.round(barHeight);

    this.notNeeded = dif < 2;

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

  private resetTime = () => {
    clearTimeout(this.timeout);

    if (this.hidden && !this.notNeeded) {
      this.renderer.setStyle(this.grid, 'opacity', 1);
      this.renderer.setStyle(this.bar, 'opacity', 1);
      this.hidden = false;
    }

    this.timeout = setTimeout(this.showHideBarGrid, this.config.visibleTimeout);
  }

  private dragStart = (top: number) => {
    if (!this.config.isRoot) {
      this.scroll.childScrolling = true;
    }
    if (!this.config.isRoot || (this.config.isRoot && this.scroll.childScrolling === false)) {
      this.renderer.setStyle(this.bar, 'top', `${top}px`);
      this.scrollContent();
    }
  }

  private dragEnd = () => {
    const el = this.el.nativeElement;
    const paddingTop = parseInt(el.style.paddingTop, 10);
    const paddingBottom = parseInt(el.style.paddingBottom, 10);

    if (paddingTop > 0 || paddingBottom > 0) {
      this.scrollTo(0, 300, 'inOutCubic');
    }
    if (!this.config.isRoot) {
      this.scroll.childScrolling = false;
    }
  }

  private scrollContent = () => {
    const el = this.el.nativeElement;
    const maxTop = el.offsetHeight - this.bar.offsetHeight;
    let percentScroll: number;

    let delta = parseInt(getComputedStyle(this.bar).top, 10);
    delta = Math.min(Math.max(delta, 0), maxTop);
    delta = Math.floor(delta);
    this.renderer.setStyle(this.bar, 'top', delta + 'px');

    percentScroll = parseInt(getComputedStyle(this.bar).top, 10) / (el.offsetHeight - this.bar.offsetHeight);
    delta = percentScroll * (el.scrollHeight - el.offsetHeight);

    el.scrollTop = delta;

    if (this.config.isRoot) {
      this.scroll.scrollPos = delta;
      this.scroll.scrollSubj.next(delta);
    }
  }

  private scrollWheel = (event: { x: number, y: number, type: string }) => {
    if (!this.config.isRoot) {
      this.scroll.childScrolling = true;
    }
    const el = this.el.nativeElement;
    const start = Date.now();
    const maxTop = el.offsetHeight - this.bar.offsetHeight;
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

      percentScroll = parseInt(getComputedStyle(this.bar).top, 10) / (el.offsetHeight - this.bar.offsetHeight);
      delta = percentScroll * (el.scrollHeight - el.offsetHeight);

      el.scrollTop = delta;

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
    const el = this.el.nativeElement;
    const start = Date.now();
    const from = el.scrollTop;
    const maxElScrollTop = el.scrollHeight - el.clientHeight;
    const barHeight = Math.max((el.offsetHeight / el.scrollHeight) * el.offsetHeight, 30);
    const paddingTop = parseInt(el.style.paddingTop, 10) || 0;
    const paddingBottom = parseInt(el.style.paddingBottom, 10) || 0;

    const scroll = () => {
      const currentTime = Date.now();
      const time = Math.min(1, ((currentTime - start) / duration));
      const easedTime = easing[easingFunc](time);

      if (paddingTop > 0 || paddingBottom > 0) {
        let fromY = null;

        if (paddingTop > 0) {
          fromY = -paddingTop;
          fromY = -((easedTime * (y - fromY)) + fromY);
          this.renderer.setStyle(el, 'paddingTop', `${fromY}px`);
        }

        if (paddingBottom > 0) {
          fromY = paddingBottom;
          fromY = ((easedTime * (y - fromY)) + fromY);
          this.renderer.setStyle(el, 'paddingBottom', `${fromY}px`);
        }
      } else {
        el.scrollTop = (easedTime * (y - from)) + from;
      }

      const percentScroll = el.scrollTop / maxElScrollTop;
      if (paddingBottom === 0) {
        const delta = Math.round(Math.round(el.clientHeight * percentScroll) - barHeight);
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

import {
  AfterViewChecked, AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Optional,
  Renderer2
} from '@angular/core';
import {ScrollbarOptions} from '../models';
import {ScrollbarService, WindowService} from '../services';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import {easing} from '../animations';
import {Observable} from 'rxjs/Observable';
import {NavigationStart, Router} from '@angular/router';


const DEFAULT_SCROLLBAR: ScrollbarOptions = {
  isRoot: false,
  position: 'right',
  barOffset: '.5rem',
  barBackground: '#495057',
  barWidth: '.7rem',
  barBorderRadius: '10px',
  barMargin: '0',
  barStyles: [],
  wrapperWidth: '100%',
  wrapperStyles: [],
  wrapperClasses: '',
  gridBackground: 'transparent',
  gridWidth: '1rem',
  gridOffset: '0',
  gridBorderRadius: '0',
  gridMargin: '0',
  gridStyles: [],
  alwaysVisible: false,
  visibleTimeout: 3000
};

@Directive({
  selector: '[cbjScrollbar]'
})
export class CbjScrollbarDirective implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input('cbjScrollbar') config: ScrollbarOptions;

  private wrapper: HTMLElement;
  private grid: HTMLElement;
  private bar: HTMLElement;
  private scrollHeight: number;
  private timeout: any;
  private notNeeded: boolean;
  private hidden: boolean;
  private unsubscribe = new Subject<void>();

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private scroll: ScrollbarService,
              private window: WindowService,
              @Optional() private router: Router) {
  }

  ngOnInit() {
    this.config = {...DEFAULT_SCROLLBAR, ...this.config};
    this.createScrollbar();
  }

  ngAfterViewInit() {
    setTimeout(this.setBarHeight, 0);
  }

  ngAfterViewChecked() {
    const dif = this.scrollHeight !== Math.round(this.el.nativeElement.scrollHeight);
    if (dif) {
      this.setBarHeight();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private createScrollbar() {
    this.setElementStyle();
    this.renderWrapper();
    this.renderGrid();
    this.renderBar();
    this.subscribe();
  }

  private setElementStyle(): void {
    const el = this.el.nativeElement;
    this.renderer.setStyle(el, 'overflow', 'hidden');
    this.renderer.setStyle(el, 'position', 'relative');
    this.renderer.setStyle(el, 'display', 'block');

    const parent = this.renderer.parentNode(el);
    this.renderer.setStyle(parent, 'position', 'relative');
  }

  private renderWrapper(): void {
    const el = this.el.nativeElement;
    this.wrapper = this.renderer.createElement('div');

    if (this.config.wrapperClasses) {
      this.renderer.addClass(this.wrapper, this.config.wrapperClasses);
    }

    this.renderer.setStyle(this.wrapper, 'padding', 0);
    this.renderer.addClass(this.wrapper, 'cbj-scroll-wrapper');
    this.renderer.addClass(this.wrapper, 'show');
    this.renderer.setStyle(this.wrapper, 'overflow', 'hidden');
    this.renderer.setStyle(this.wrapper, 'display', 'flex');
    this.renderer.setStyle(this.wrapper, 'margin', getComputedStyle(el).margin);
    this.renderer.setStyle(this.wrapper, 'width', this.config.wrapperWidth);
    this.renderer.setStyle(this.wrapper, `padding-${this.config.position}`, `${this.config.gridWidth}`);
    this.renderer.setStyle(this.wrapper, 'height', getComputedStyle(el).height);

    if (this.config.wrapperStyles.length > 0) {
      for (const style of this.config.wrapperStyles) {
        this.renderer.setStyle(this.wrapper, style.prop, style.val);
      }
    }

    this.renderer.insertBefore(this.renderer.parentNode(el), this.wrapper, el);
    this.renderer.appendChild(this.wrapper, el);
  }

  private renderGrid(): void {
    this.grid = this.renderer.createElement('div');

    this.renderer.addClass(this.grid, 'cbj-scroll-grid');
    this.renderer.addClass(this.grid, 'show');
    this.renderer.setStyle(this.grid, 'position', 'absolute');
    this.renderer.setStyle(this.grid, 'top', '0');
    this.renderer.setStyle(this.grid, 'bottom', '0');
    this.renderer.setStyle(this.grid, this.config.position, this.config.gridOffset);
    this.renderer.setStyle(this.grid, 'width', this.config.gridWidth);
    this.renderer.setStyle(this.grid, 'background', this.config.gridBackground);
    this.renderer.setStyle(this.grid, 'display', 'block');
    this.renderer.setStyle(this.grid, 'cursor', 'pointer');
    this.renderer.setStyle(this.grid, 'z-index', '99');
    this.renderer.setStyle(this.grid, 'border-radius', this.config.gridBorderRadius);
    this.renderer.setStyle(this.grid, 'margin', this.config.gridMargin);
    this.renderer.setStyle(this.grid, 'transition', 'opacity 250ms ease-in-out');

    if (this.config.gridStyles.length > 0) {
      for (const style of this.config.gridStyles) {
        this.renderer.setStyle(this.grid, style.prop, style.val);
      }
    }

    if (!this.config.alwaysVisible) {
      this.renderer.setStyle(this.grid, 'opacity', 0);
    }

    this.renderer.appendChild(this.wrapper, this.grid);
  }

  private renderBar(): void {
    this.bar = this.renderer.createElement('div');

    const translate = this.config.position === 'right' ? 'translateX(50%)' : 'translateX(-50%)';

    this.renderer.addClass(this.bar, 'cbj-scroll-bar');
    this.renderer.addClass(this.bar, 'show');
    this.renderer.setStyle(this.bar, 'position', 'absolute');
    this.renderer.setStyle(this.bar, 'top', '0');
    this.renderer.setStyle(this.bar, this.config.position, this.config.barOffset);
    this.renderer.setStyle(this.bar, 'width', this.config.barWidth);
    this.renderer.setStyle(this.bar, 'background', this.config.barBackground);
    this.renderer.setStyle(this.bar, 'display', 'block');
    this.renderer.setStyle(this.bar, 'cursor', 'pointer');
    this.renderer.setStyle(this.bar, 'z-index', '100');
    this.renderer.setStyle(this.bar, 'border-radius', this.config.barBorderRadius);
    this.renderer.setStyle(this.bar, 'margin', this.config.barMargin);
    this.renderer.setStyle(this.bar, 'transform', translate);
    this.renderer.setStyle(this.bar, 'transition', 'opacity 250ms ease-in-out');

    if (this.config.barStyles.length > 0) {
      for (const style of this.config.barStyles) {
        this.renderer.setStyle(this.bar, style.prop, style.val);
      }
    }

    if (!this.config.alwaysVisible) {
      this.renderer.setStyle(this.grid, 'opacity', 0);
      this.hidden = true;
    } else {
      this.hidden = false;
    }

    this.renderer.appendChild(this.wrapper, this.bar);
  }

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

    this.window.resizeObs.takeUntil(this.unsubscribe).subscribe(() => {
      this.setBarHeight();
      if (this.config.isRoot) {
        this.scroll.scrollHeight = el.offsetHeight;
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
      this.renderer.setStyle(this.wrapper, 'padding', '0 1rem 0 0');
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

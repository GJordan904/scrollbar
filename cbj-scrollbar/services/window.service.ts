import {Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {WINDOW} from './window.token';
import {Observable} from 'rxjs/Observable';
import {ScrollbarService} from './scrollbar.service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';

@Injectable()
export class WindowService implements OnInit, OnDestroy {
  resizeObs: Observable<any>;
  isMobile: boolean;

  private unsubscribe = new Subject<void>();

  constructor(@Inject(WINDOW) public w: Window,
              private scroll: ScrollbarService) {
    this.resizeObs = Observable.fromEvent(this.w, 'resize');
  }

  ngOnInit() {
    this.resizeObs.takeUntil(this.unsubscribe).subscribe(() => {
      this.isMobile = this.w.innerWidth <= 992;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get innerWidth() {
    return this.w.innerWidth;
  }

  /**
   * get window height utility function
   *
   * @returns void
   */
  public getWinHeight(): number {
    return this.scroll.scrollHeight;
  }

  /**
   * get offsetTop value for element
   *
   * @returns void
   */
  public getOffsetTop(el): number {
    const viewportTop = el.nativeElement.getBoundingClientRect().top;
    const clientTop = el.nativeElement.clientTop;

    return viewportTop + this.scroll.scrollPos - clientTop;

  }

  /**
   * get offsetBottom value for element
   *
   * @returns void
   */
  public getOffsetBottom(el): number {
    const viewportTop = el.nativeElement.getBoundingClientRect().top;
    const clientBottom = el.nativeElement.clientTop + el.nativeElement.clientHeight;

    return viewportTop + this.scroll.scrollPos - clientBottom;

  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import {WindowService} from './window.service';

@Injectable()
export class ScrollbarService implements OnDestroy {
    scrollObs: Observable<number>;
    scrollPos: number;
    scrollHeight: number;
    childScrolling: boolean;

    scrollSubj: Subject<number> = new Subject();

    private ngUnsubscribe: Subject<void> = new Subject();

    constructor(private ws: WindowService) {
        this.scrollObs = Observable.from(this.scrollSubj);
        this.childScrolling = false;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public initWheel(el: HTMLElement): Observable<any> {
        const dommousescroll = Observable.fromEvent(el, 'DOMMouseScroll');
        const mousewheel = Observable.fromEvent(el, 'mousewheel');
        const wheel = Observable.fromEvent(el, 'wheel');

        return Observable.merge(...[dommousescroll, mousewheel, wheel])
            .map((e: WheelEvent) => {
                e.preventDefault();

                const data = {x: 0, y: 0, type: 'wheel'};
                if (e.wheelDelta) {
                    data.y = - 1 / 40 * e.wheelDelta;
                    data.x = e.wheelDeltaX ? - 1 / 40 * e.wheelDeltaX : 0;
                } else {
                    data.y = e.deltaY || e.detail;
                }
                return data;
            });
    }

    public initDrag(el: HTMLElement, bar: HTMLElement): {start: Observable<any>, end: Observable<any>} {
        let observs;

        const mousemove = Observable.fromEvent(this.ws.window, 'mousemove');
        const mousedown = Observable.fromEvent(bar, 'mousedown');
        const mouseup = Observable.fromEvent(this.ws.window, 'mouseup');

        const mousedrag = mousedown.mergeMap((e: MouseEvent) => {
            const pageY = e.pageY;
            const top   = parseFloat(getComputedStyle(bar).top);

            return mousemove.map((emove: MouseEvent) => {
                emove.preventDefault();
                return top + emove.pageY - pageY;
            }).takeUntil(mouseup);
        });

        observs = {
            start: mousedrag,
            end: mouseup
        };

        if (this.ws.width <= 992) {
            const touchmove = Observable.fromEvent(this.ws.window, 'touchmove');
            const touchstart = Observable.fromEvent(el, 'touchstart');
            const touchend = Observable.fromEvent(this.ws.window, 'touchend');

            const touchdrag = touchstart.mergeMap((e: TouchEvent) => {
                const pageY = e.targetTouches[0].pageY;
                const top = -parseFloat(getComputedStyle(bar).top);

                return touchmove.map((tmove: TouchEvent) => {
                    return -(top + tmove.targetTouches[0].pageY - pageY);
                }).takeUntil(touchend);
            });

            observs = {
                start: Observable.merge(...[mousedrag, touchdrag]),
                end: Observable.merge(...[mouseup, touchend])
            };
        }

        return observs;
    }

  /**
   * Get an elements distance in pixels from the top
   *
   * @returns {number}
   */
  public getElOffsetTop(el): number {
    const viewportTop = el.nativeElement.getBoundingClientRect().top;
    const clientTop = el.nativeElement.clientTop;

    return viewportTop + this.scrollPos - clientTop;

  }

  /**
   * Get an elements distance in pixels from the bottom
   *
   * @returns {number}
   */
  public getElOffsetBottom(el): number {
    const viewportTop = el.nativeElement.getBoundingClientRect().top;
    const clientBottom = el.nativeElement.clientTop + el.nativeElement.clientHeight;

    return viewportTop + this.scrollPos - clientBottom;
  }
}

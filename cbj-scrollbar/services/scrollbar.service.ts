import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { WINDOW } from './window.token';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';

@Injectable()
export class ScrollbarService implements OnDestroy {
    scrollObs: Observable<number>;
    scrollPos: number;
    scrollHeight: number;
    childScrolling: boolean;

    scrollSubj: Subject<number> = new Subject();

    private ngUnsubscribe: Subject<void> = new Subject();

    constructor(@Inject(WINDOW) private window: Window) {
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

        const mousemove = Observable.fromEvent(this.window, 'mousemove');
        const mousedown = Observable.fromEvent(bar, 'mousedown');
        const mouseup = Observable.fromEvent(this.window, 'mouseup');

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

        if (this.window.innerWidth <= 992) {
            const touchmove = Observable.fromEvent(this.window, 'touchmove');
            const touchstart = Observable.fromEvent(el, 'touchstart');
            const touchend = Observable.fromEvent(this.window, 'touchend');

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
}

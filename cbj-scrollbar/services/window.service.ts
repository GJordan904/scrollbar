import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';
import { WINDOW } from './window.token';

@Injectable()
export class WindowService implements OnInit, OnDestroy {
  resizeObs: Observable<any>;
  isMobile: boolean;

  private _height: number;
  private unsubscribe = new Subject<void>();

  constructor(@Inject(WINDOW) private w: Window) {
    this.resizeObs = Observable.fromEvent(w, 'resize');
  }

  ngOnInit(): void {
    this.resizeObs.takeUntil(this.unsubscribe).subscribe(() => {
      this.isMobile = this.w.innerWidth <= 992;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Get the browsers window object
   *
   * @returns {Window}
   */
  get window() {
    return this.w;
  }

  /**
   * Get the width of the window
   *
   * @returns {number}
   */
  get width(): number {
    return this.w.innerWidth;
  }

  /**
   * Get the height of the window
   *
   * @returns {number}
   */
  get height(): number {
    return this._height ? this._height : this.w.innerHeight;
  }

  /**
   * Set the height of the window
   *
   */
  set height(height: number) {
    this._height = height;
  }
}

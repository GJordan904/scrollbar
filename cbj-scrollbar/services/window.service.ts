import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { WINDOW } from './window.token';

@Injectable()
export class WindowService {
  /**
   * Observable of the window resize event
   */
  resizeObs: Observable<any>;

  private _height: number;

  constructor(@Inject(WINDOW) private w: Window) {
    this.resizeObs = Observable.fromEvent(w, 'resize');
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
   * Return whether device is on a screen < 992px wide
   *
   * @returns {boolean}
   */
  get isMobile() {
    return this.width < 992;
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

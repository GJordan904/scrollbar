import {InjectionToken} from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }
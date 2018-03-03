import { Component, OnInit } from '@angular/core';
import {ScrollbarConfig} from '../../../cbj-scrollbar/models';
import {ScrollbarOptions} from '../../../cbj-scrollbar/models/scrollbar-options';

@Component({
  selector: 'cbj-usage',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  configCode = {
    language: 'typescript',
    code: `export interface ScrollbarOptions {
  isRoot?: boolean;
  position?: string;
  alwaysVisible?: boolean;
  visibleTimeout?: number;
  gridOffset?: string | number;
  barOffset?: string | number;
  toggleClasses?: Subject<{ el: string, classes: string, remove: boolean }>;
  styles?: ScrollbarStyles;
  classes?: ScrollbarClasses;
}

export interface ScrollbarStyles {
  wrapper?: { [prop: string]: string | number };
  grid?: { [prop: string]: string | number };
  bar?: { [prop: string]: string | number };
}

export interface ScrollbarClasses {
  wrapper?: string;
  grid?: string;
  bar?: string;
}`
  };

  defaultCode = {
    language: 'typescript',
    code: `export const DEFAULT_SCROLLBAR: ScrollbarOptions = {
  isRoot: false,
  position: 'right',
  alwaysVisible: false,
  visibleTimeout: 3000,
  gridOffset: 0,
  barOffset: '.5rem',
  styles: {
    wrapper: {
      'width': '100%',
      'overflow': 'hidden',
      'display': 'flex'
    },
    grid: {
      'position': 'absolute',
      'top': 0,
      'bottom': 0,
      'display': 'block',
      'cursor': 'pointer',
      'z-index': 99,
      'background': 'transparent',
      'width': '1rem',
      'border-radius': 0,
      'margin': 0,
      'transition': 'opacity 250ms ease-in-out'
    },
    bar: {
      'position': 'absolute',
      'top': 0,
      'display': 'block',
      'cursor': 'pointer',
      'transition': 'opacity 250ms ease-in-out',
      'z-index': 100,
      'background': '#495057',
      'width': '.7rem',
      'border-radius': '10px',
      'margin': 0
    }
  },
  classes: {
    wrapper: 'cbj-scroll-wrapper',
    grid: 'cbj-scroll-grid',
    bar: 'cbj-scroll-bar'
  }
};`
  };

  constructor() { }

  ngOnInit() {
  }

}

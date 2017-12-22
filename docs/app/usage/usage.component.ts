import { Component, OnInit } from '@angular/core';
import {ScrollbarOptions} from '../../../cbj-scrollbar/models';

@Component({
  selector: 'cbj-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss']
})
export class UsageComponent implements OnInit {
  configCode = {
    language: 'typescript',
    code: `import {Subject} from 'rxjs/Subject';

export interface ScrollbarOptions {
  isRoot?: boolean;
  position?: string;
  barOffset?: string;
  barBackground?: string;
  barWidth?: string;
  barBorderRadius?: string;
  barMargin?: string;
  barStyles?: Array<{ prop: string, val: string }>;
  wrapperWidth?: string;
  wrapperStyles?: Array<{ prop: string, val: string }>;
  wrapperClasses?: string;
  gridBackground?: string;
  gridWidth?: string;
  gridOffset?: string;
  gridBorderRadius?: string;
  gridMargin?: string;
  gridStyles?: Array<{ prop: string, val: string }>;
  alwaysVisible?: boolean;
  visibleTimeout?: number;
  toggleClasses?: Subject<{ el: string, classes: string, remove: boolean }>;
}

// from scrollbar.directive.ts
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
};`
  };

  constructor() { }

  ngOnInit() {
  }

}

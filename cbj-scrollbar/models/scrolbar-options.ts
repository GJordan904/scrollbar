import {Subject} from 'rxjs/Subject';

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

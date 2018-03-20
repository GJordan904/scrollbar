import {Subject} from 'rxjs/Subject';

/**
 * @interface {ScrollbarOptions}
 *
 * @property {boolean}          - isRoot         - flag to set when the scrollbar is used as the main windows scrollbar
 * @property {string}           - position       - The side of the window the scrollbar appears
 * @property {boolean}          - alwaysVisible  - flag to set when the scrollbar should remain visible
 * @property {number}           - visibleTimeout - the time before the scrollbar auto hides
 * @property {string}           - wrapperWidth   - the css value for the width property of the wrapper element
 * @property {number}           - gridOffset     - the css value for the {position} property that is applied to the grid
 * @property {number}           - barOffset      - the css value for the {position} property that is applied to the bar
 * @property {Subject}          - toggleClasses  - for toggling classes on the 3 generated elements
 * @property {ScrollbarStyles}  - styles         - the styles to be applied to the 3 generated elements
 * @property {ScrollbarClasses} - classes        - the classes to be applied to the 3 generated elements
 */
export interface ScrollbarOptions {
  isRoot?: boolean;
  position?: string;
  alwaysVisible?: boolean;
  visibleTimeout?: number;
  wrapperWidth?: string | boolean;
  gridOffset?: string | number;
  barOffset?: string | number;
  toggleClasses?: Subject<{ el: string, classes: string, remove: boolean }>;
  styles?: ScrollbarStyles;
  classes?: ScrollbarClasses;
}

/**
 * @interface {ScrollbarStyles}
 *
 * Can contain a key for any of the three elements created by the directive (wrapper, grid, bar)
 * Each with an object containing any valid css properties as keys with a valid value as a string or number
 */
export interface ScrollbarStyles {
  wrapper?: { [prop: string]: string | number };
  grid?: { [prop: string]: string | number };
  bar?: { [prop: string]: string | number };
}

/**
 * @interface {ScrollbarClasses}
 *
 * Can contain a key for any of the three elements created by the directive (wrapper, grid, bar)
 * Each key can take an array of class names
 */
export interface ScrollbarClasses {
  wrapper?: string[];
  grid?: string[];
  bar?: string[];
}

/**
 * The default Scrollbar options
 *
 */
export const DEFAULT_SCROLLBAR: ScrollbarOptions = {
  isRoot: false,
  position: 'right',
  alwaysVisible: false,
  visibleTimeout: 3000,
  wrapperWidth: '100%',
  gridOffset: 0,
  barOffset: '.5rem',
  styles: {
    grid: {
      'position': 'absolute',
      'top': 0,
      'bottom': 0,
      'display': 'block',
      'cursor': 'pointer',
      'z-index': 99999,
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
      'z-index': 100000,
      'background': '#495057',
      'width': '.7rem',
      'border-radius': '10px',
      'margin': 0
    }
  },
  classes: {
    wrapper: ['cbj-scroll-wrapper'],
    grid: ['cbj-scroll-grid'],
    bar: ['cbj-scroll-bar']
  }
};

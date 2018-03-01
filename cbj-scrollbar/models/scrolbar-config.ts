import {Subject} from 'rxjs/Subject';

export interface ScrollbarOptions {
  isRoot?: boolean;
  position?: string;
  alwaysVisible?: boolean;
  visibleTimeout?: number;
  toggleClasses?: Subject<{ el: string, classes: string, remove: boolean }>;
  styles?: ScrollbarStyles;
  classes?: ScrollbarClasses;
}

export interface ScrollbarStyles {
  wrapper?: Array<{ prop: string, val: string }>;
  grid?: Array<{ prop: string, val: string }>;
  bar?: Array<{ prop: string, val: string }>;
}

export interface ScrollbarClasses {
  wrapper?: string;
  grid?: string;
  bar?: string;
}

/**
 * The default Scrollbar options
 *
 * @type {ScrollbarOptions}
 */
export const DEFAULT_SCROLLBAR: ScrollbarOptions = {
  isRoot: false,
  position: 'right',
  alwaysVisible: false,
  visibleTimeout: 3000,
  styles: {
    wrapper: [
      {prop: 'width', val: '100%'},
      {prop: 'overflow', val: 'hidden'},
      {prop: 'display', val: 'flex'}
    ],
    grid: [
      {prop: 'position', val: 'absolute'},
      {prop: 'top', val: '0'},
      {prop: 'bottom', val: '0'},
      {prop: 'display', val: 'block'},
      {prop: 'cursor', val: 'pointer'},
      {prop: 'z-index', val: '99'},
      {prop: 'background', val: 'transparent'},
      {prop: 'width', val: '1rem'},
      {prop: 'offset', val: '0'},
      {prop: 'borderRadius', val: '0'},
      {prop: 'margin', val: '0'},
      {prop: 'transition', val: 'opacity 250ms ease-in-out'}
    ],
    bar: [
      {prop: 'position', val: 'absolute'},
      {prop: 'top', val: '0'},
      {prop: 'display', val: 'block'},
      {prop: 'cursor', val: 'pointer'},
      {prop: 'transition', val: 'opacity 250ms ease-in-out'},
      {prop: 'z-index', val: '100'},
      {prop: 'offset', val: '.5rem'},
      {prop: 'background', val: '#495057'},
      {prop: 'width', val: '.7rem'},
      {prop: 'borderRadius', val: '10px'},
      {prop: 'margin', val: '0'}
    ]
  },
  classes: {}
};

/**
 * @class ScrollbarConfig
 *
 */
export class ScrollbarConfig {
  /**
   * The scrollbars options.
   * A deep merge of the default options and the user provided options
   *
   * @type {ScrollbarOptions}
   */
  private options: ScrollbarOptions;

  /**
   * @constructor
   * @param {ScrollbarOptions} opt
   */
  constructor(opt: ScrollbarOptions) {
    if (opt.styles) {
      const styles = {};
      const keys = Object.keys(opt.styles);

      for (const key of keys) {
        styles[key] = [ ...DEFAULT_SCROLLBAR.styles[key], ...opt.styles[key] ];
      }
      this.options = { ...DEFAULT_SCROLLBAR, ...opt, ...{styles} };
      console.log(this.options);
    }else {
      this.options = { ...DEFAULT_SCROLLBAR, ...opt };
    }
  }

  /**
   *
   * @returns {boolean | undefined}
   */
  get isRoot() {
    return this.options.isRoot;
  }

  /**
   *
   * @returns {string | undefined}
   */
  get position() {
    return this.options.position;
  }

  /**
   *
   * @returns {boolean | undefined}
   */
  get alwaysVisible() {
    return this.options.alwaysVisible;
  }

  /**
   *
   * @returns {number | undefined}
   */
  get visibleTimeout() {
    return this.options.visibleTimeout;
  }

  /**
   *
   * @returns {Subject | undefined}
   */
  get toggleClasses() {
    return this.options.toggleClasses;
  }

  /**
   *
   * @returns {Array | undefined}
   */
  get wStyles() {
    return this.options.styles.wrapper;
  }

  /**
   *
   * @returns {Array | undefined}
   */
  get gStyles() {
    return this.options.styles.grid;
  }

  /**
   *
   * @returns {Array | undefined}
   */
  get bStyles() {
    return this.options.styles.bar;
  }

  /**
   *
   * @returns {string | undefined}
   */
  get wClass() {
    return this.options.classes.wrapper;
  }

  /**
   *
   * @returns {string | undefined}
   */
  get gClass() {
    return this.options.classes.grid;
  }

  /**
   *
   * @returns {string | undefined}
   */
  get bClass() {
    return this.options.classes.bar;
  }
}

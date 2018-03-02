import {Subject} from 'rxjs/Subject';
import {DEFAULT_SCROLLBAR, ScrollbarOptions} from './scrollbar-options';

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
    let styles = {};
    let classes = {};

    // Perform a deep merge of the styles objects if user passes any
    if (opt.styles) {
      const keys = Object.keys(opt.styles);
      for (const key of keys) {
        styles[key] = { ...DEFAULT_SCROLLBAR.styles[key], ...opt.styles[key] };
      }

      styles = { ...DEFAULT_SCROLLBAR.styles, ...styles};
    }else {
      styles = {...DEFAULT_SCROLLBAR.styles};
    }

    // Concatenate any user defined classes with the defaults
    if (opt.classes) {
      const keys = Object.keys(opt.classes);
      for (const key of keys) {
        classes[key] = `${DEFAULT_SCROLLBAR.classes[key]} ${opt.classes[key]}`;
      }

      classes = { ...DEFAULT_SCROLLBAR.classes, ...classes};
    }else {
      classes = {...DEFAULT_SCROLLBAR.classes};
    }

    this.options = { ...DEFAULT_SCROLLBAR, ...opt, ...{styles}, ...{classes} };
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
   * @returns {string | number | undefined}
   */
  get gridOffset() {
    return this.options.gridOffset;
  }

  /**
   *
   * @returns {string | number | undefined}
   */
  get barOffset() {
    return this.options.barOffset;
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

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
    this.mergeOptions(opt, true);
  }

  /**
   * Merge the defaults and options by performing a deep merge
   *
   * @param {ScrollbarOptions} opt the scrollbar options to merge with the defaults
   * @param {boolean} setOpt flag indicating whether the created options should be assigned to the options member variable
   * @param {ScrollbarOptions} mergeWith optional default scrollbar options to be used instead of the package defaults
   *
   * @return {ScrollbarOptions}
   */
  mergeOptions(opt: ScrollbarOptions, setOpt: boolean = false, mergeWith?: ScrollbarOptions) {
    let defaults = DEFAULT_SCROLLBAR;
    if (mergeWith) {
      defaults = mergeWith;
    }
    let styles = {};
    let classes = {};

    // Perform a deep merge of the styles objects if user passes any
    if (opt.styles) {
      const keys = Object.keys(opt.styles);
      for (const key of keys) {
        styles[key] = { ...defaults.styles[key], ...opt.styles[key] };
      }

      styles = { ...defaults.styles, ...styles};
    }else {
      styles = {...defaults.styles};
    }

    // Concatenate any user defined classes with the defaults
    if (opt.classes) {
      const keys = Object.keys(opt.classes);
      for (const key of keys) {
        classes[key] = [...defaults.classes[key], ...opt.classes[key]];
      }

      classes = { ...defaults.classes, ...classes};
    }else {
      classes = {...defaults.classes};
    }

    const out = { ...defaults, ...opt, ...{styles}, ...{classes} };
    if (setOpt) {
      this.options = out;
    }

    return out;
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
   * @returns {string}
   */
  get wrapperWidth() {
    return this.options.wrapperWidth;
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

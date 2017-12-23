# Scrollbar

This package allows you to easily create custom scrollbars with Angular 5. It is still a work in progress and some browsers
are better than others.  It is a great start and just needs some minor adjustments and it could be production ready. Anyone 
wanting to contribute, I am gladly accepting PR's.

## Usage

Below is the basic setup to get started, for more details please see the [Docs/Example](https://scrollbar.codebyjordan.com) page (work-in-progress).
The install and import steps are going to be universal with variable ways to implement. The component and markup code
below come from the home page of the [Docs/Example](https://scrollbar.codebyjordan.com)

### Install

```bash
npm i --save @codebyjordan/scrollbar
```

### Import

```typescript
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CbjScrollbarModule } from '@codebyjordan/scrollbar';
 
@NgModule({
  imports: [
    BrowserModule,
    CbjScrollbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### Markup

```html
<style>
    .scroll-card {
      height: 350px;
      padding: 0 1.5rem;
      border: none;
    }
</style>
<div class="container py-4">
    <div class="row">
        <div class="col">
            <div class="card scroll-card">
                <div class="card-body" [cbjScrollbar]="firstCardScroll">
                    ...
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <div class="card mt-4 scroll-card bg-secondary text-white">
                <div class="card-body" [cbjScrollbar]="secondCardScroll">
                    ...
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <div class="card mt-4 scroll-card bg-primary text-white">
                <div class="card-body" [cbjScrollbar]="thirdCardScroll">
                    ...
                </div>
            </div>
        </div>
    </div>
</div>
```

### Component

```typescript
import { Component } from '@angular/core';
import {ScrollbarOptions} from '@codebyjordan/scrollbar';

@Component({
  selector: 'cbj-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  firstCardScroll: ScrollbarOptions = {
    barBackground: '#216869',
    gridBackground: '#1F2421',
    gridStyles: [
      { prop: 'border-top-right-radius', val: '.25rem' },
      { prop: 'border-bottom-right-radius', val: '.25rem' },
      { prop: 'opacity', val: '.75' }
    ],
    alwaysVisible: true
  };

  secondCardScroll: ScrollbarOptions = {
    barBackground: '#2274A5',
  };

  thirdCardScroll: ScrollbarOptions = {
    barBackground: '#1F2421',
    barStyles: [
      { prop: 'opacity', val: '.65' }
    ],
    alwaysVisible: true
  };

  constructor() { }

}
```

## ScrollbarOptions
The ScrollbarOptions interface is used for configuring the scrollbar. Below is the interface declaration and the default 
config used in the directive. 

```typescript
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
};
``` 

#### isRoot
* **Type:** boolean
* **Default:** false

You should set this to true when using the directive as the main scrollbar. It activates features unique to that use case.
Setting isRoot to true does the following things:  
* Prevents the main window from scrolling if an inner window is scrolling.
* Creates an observable that broadcasts the current scroll position on scroll.
* Sets the scroll position and height on the ScrollbarService
* If the RouterModule is present it will listen for Route changes and scroll to top on route change

#### position
* **Type:** string
* **Default:** 'right'

The position of the scrollbar. Valid options are 'right' and 'left'.

#### barOffset
* **Type:** string
* **Default:** '.5rem'

The right or left position of the bar. Any valid css value for the property right or left is valid.

#### barBackground
* **Type:** string
* **Default:** '#495057'

The background color of the scrollbar. Any valid css value for the property background-color is valid.

#### barWidth
* **Type:** string
* **Default:** '.7rem'

The width of the scrollbar. Any valid css value for the property width is valid.

#### barBorderRadius
* **Type:** string
* **Default:** '10px'

Border radius of scrollbar. Any valid css value for the property border-radius is valid.

#### barMargin
* **Type:** string
* **Default:** '0'

The bars margin property. Any valid css value for the property margin is valid.

#### barStyles
* **Type:** Array<{prop: string, val: string}>
* **Default:** []

Additional styles to be applied to the scrollbar. An array of objects with the properties prop and val that are both strings.
Any valid css property and value are acceptable and any styles set here will override all other styles set. 

#### wrapperWidth
* **Type:** string
* **Default:** '100%'

The wrapper width. Any valid css value for the property width is valid.

#### wrapperStyles
* **Type:** Array<{prop: string, val: string}>
* **Default:** []

Additional styles to be applied to the wrapper. An array of objects with the properties prop and val that are both strings.
Any valid css property and value are acceptable and any styles set here will override all other styles set. 

#### wrapperClasses
* **Type:** string
* **Default:** ''

Classes to be applied to the wrapper.

#### gridBackground
* **Type:** string
* **Default:** 'transparent'

The background color of the grid. Any valid css value for the property background-color is valid.

#### gridWidth
* **Type:** string
* **Default:** '1rem'

The grids width property. Any valid css value for the property width is valid.

#### gridOffset
* **Type:** string
* **Default:** '0'

The right or left position of the grid. Any valid css value for the property right or left is valid.

#### gridBorderRadius
* **Type:** string
* **Default:** '0'

Border radius of grid. Any valid css value for the property border-radius is valid.

#### gridMargin
* **Type:** string
* **Default:** '0'

The grids margin property. Any valid css value for the property margin is valid.

#### gridStyles
* **Type:** Array<{prop: string, val: string}>
* **Default:** []

Additional styles to be applied to the grid. An array of objects with the properties prop and val that are both strings.
Any valid css property and value are acceptable and any styles set here will override all other styles set. 

#### alwaysVisible
* **Type:** boolean
* **Default:** false

Boolean setting whether the scrollbar hides after a timeout.

#### visibleTimeout
* **Type:** number
* **Default:** 3000

The timeout in milliseconds for hiding the scrollbar.



## Services
The package provides 2 services and an Injectable token.

### ScrollbarService
The scrollbar service provides an observable that broadcasts the scroll position on scroll and public properties with the scroll position
and scroll height.

#### Properties
The ScrollbarService properties

##### scrollObs
* **Type:** Observable\<number>

Subscribe to this observable to watch scrolling and get the scroll position.

##### scrollPos
* **Type:** number

The current scroll position.

##### scrollHeight
* **Type:** number

The height of the root scrollbars window.

##### childScrolling
* **Type:** boolean

Boolean indicating whether a non root scrollbar is currently scrolling.

#### Methods
ScrollbarService Methods

##### initWheel(el: HTMLElement): Observable<any>
Returns Observable created from the wheel event.

#### initDrag(el: HTMLElement, bar: HTMLElement): {start: Observable<any>, end: Observable<any>}
Returns Observables of drag start and drag end events

### WindowService

#### Properties
The WindowService properties

##### w
The Window object

##### resizeObs
* **Type:** Observable\<any>

Observable of the window resize event.

##### isMobile
* **Type:** number

Boolean indicating if on mobile sized display.

##### innerWidth
* **Type:** number

The width of the window.

#### Methods
WindowService Methods

##### getWinHeight(): number
Returns the "Window" height. This is actually the height of the root scrollbar wrapper. This is returning the value of scrollHeight
from the ScrollbarService

#### getOffsetTop(el): number
Returns the passed elements offset top value

#### getOffsetBottom(el): number
Returns the passed elements offset bottom value
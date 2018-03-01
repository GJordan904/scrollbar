# Scrollbar

This package allows you to easily create custom scrollbars with Angular 5. It is still a work in progress and some browsers
are better than others.  It is a great start and just needs some minor adjustments and it could be production ready. Anyone 
wanting to contribute, I am gladly accepting PR's.

## Table of Contents
* [Install](#install)
* [Import](#import)
* [Usage](#usage)
    * [Main Scrollbar](#root)
    * [Cards](#cards)
* [Config](#config)
* [Defaults](#defaults)
* [Services](#services)


## <a name="install"></a>Install

```bash
npm i --save @codebyjordan/scrollbar
```

## <a name="import"></a> Import

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

## <a name="usage"></a> Usage
Below are a couple example usages to get started. I use Bootstrap 4 but this not required, although other styles may need
be applied. 

### <a name="root"></a> As the windows main scrollbar
Here I am going to override the browsers scrollbar and use this as the main windows scrollbar. I will be using a minimal 
setup for demonstration purposes, see the Configuration section for more options.  

#### app.component.ts
```typescript
import {Component, OnInit} from '@angular/core';
import {ScrollbarOptions, ScrollbarConfig} from '@codebyjordan/scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mainScrollbar: ScrollbarConfig;

  ngOnInit() {
    this.mainScrollbar = new ScrollbarConfig({
      isRoot: true,
      alwaysVisible: true
    });
  }
}
```

#### app.component.html
```html
<div class="container-fluid wrapper">
     <div class="row">
         <nav class="navbar cbj-elevation-3 navbar-expand navbar-dark bg-primary w-100">
             <div class="collapse navbar-collapse">
                 <ul class="navbar-nav mr-auto">
                     <li class="nav-item">
                         <a routerLink="/home" routerLinkActive="active" class="nav-link">Home</a>
                     </li>
                     <li class="nav-item">
                         <a class="nav-link" routerLink="/getting-started" routerLinkActive="active">Getting Started</a>
                     </li>
                     <li class="nav-item">
                         <a class="nav-link" routerLink="/usage" routerLinkActive="active">Usage</a>
                     </li>
                 </ul>
             </div>
         </nav>
     </div>
 
     <div class="row">
         <div class="main-content" [cbjScrollbar]="mainScrollbar">
             <router-outlet></router-outlet>
         </div>
     </div>
 </div>
```

#### app.component.scss
```scss
$navbar-height: 3.25rem;

.wrapper {
  overflow: hidden;
}

.main-content {
  height: calc(100vh - #{$navbar-height});
  width: 100%;
}
```

### <a name="cards"></a> Cards (multiple)
In this example I make three BS4 cards with a height of 350px and some Lipsum text. Each one has a slightly different 
configuration and look. 

#### card-demo.component.ts
```typescript
import {Component, OnInit} from '@angular/core';
import {ScrollbarOptions, ScrollbarConfig} from '@codebyjordan/scrollbar';

@Component({
  selector: 'app-card-demo',
  templateUrl: './card-demo.component.html',
  styleUrls: ['./card-demo.component.scss']
})
export class CardDemoComponent implements OnInit {
  firstCardScroll: ScrollbarConfig;
  secondCardScroll: ScrollbarConfig;
  thirdCardScroll: ScrollbarConfig;

  ngOnInit(): void {
    this.firstCardScroll = new ScrollbarConfig({
      styles: {
        grid: [
          { prop: 'border-top-right-radius', val: '.25rem' },
          { prop: 'border-bottom-right-radius', val: '.25rem' },
          { prop: 'opacity', val: '.75' },
          { prop: 'background', val: '#1F2421' },
        ],
        bar: [
          { prop: 'background', val: '#216869' }
        ],
      },
      alwaysVisible: true
    });

    this.secondCardScroll = new ScrollbarConfig({styles: {bar: [{ prop: 'background', val: '#2274A5' }]}});

    this.thirdCardScroll = new ScrollbarConfig({
      styles: {
        bar: [
          { prop: 'opacity', val: '.65'},
          { prop: 'background', val: '#1F2421' }
        ]
      },
      alwaysVisible: true
    });
  }
}

```

#### card-demo.component.html
```html
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

#### card-demo.component.scss
```scss
.scroll-card {
  height: 350px;
  padding: 0 1.5rem;
  border: none;
  overflow: hidden;
}
```

## <a name="config"></a> Configuration
You must pass an instance of ScrollbarConfig to the directive for it to function. However, how much you configure is up to
you. It is possible to go with no configuration at all and only pass `{}` to the ScrollbarConfig constructor.

### ScrollbarConfig
The ScrollbarConfig constructor takes a single argument using the ScrollbarOptions interface. Use this interface to 
configure the scrollbar. The available options are:
```typescript
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
* **Type:** `string`
* **Default:** `'right'`

The position of the scrollbar. Valid options are 'right' and 'left'.

#### alwaysVisible
* **Type:** `boolean`
* **Default:** `false`

Boolean setting whether the scrollbar hides after a timeout.

#### visibleTimeout
* **Type:** `number`
* **Default:** `3000`

The timeout in milliseconds for hiding the scrollbar.

#### toggleClasses
* **Type:** `Subject<{ el: string, classes: string, remove: boolean }>`
* **Default:** `undefined`

A Subject that can be used to toggle classes on the wrapper, grid, or bar elements. 

#### styles
* **Type:** `ScrollbarStyles`
* **Default:** `See Below`

A ScrollbarStyles object can hold an array of styles properties stored as`{prop: string, val: string}` objects. The ScrollbarStyles 
interface has a key for each the wrapper, grid, and bar element, each of which can take an array of styles. Any valid 
css property can be passed with a valid value as a string.

#### classes
* **Type:** `ScrollbarClasses`
* **Default:** `See Below`

The ScrollbarClasses interface has a key for each the wrapper, grid, and bar element that accept a string of class(es) to
be applied to the element.

## <a name="defaults"></a> Defaults
```typescript
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
```

## <a name="services"></a> Services
The package provides 2 services and an Injectable token.

### ScrollbarService
The scrollbar service provides an observable that broadcasts the scroll position on scroll and public properties with the scroll position
and scroll height.

#### Properties
The ScrollbarService properties

##### scrollObs
* **Type:** `Observable<number>`

Subscribe to this observable to watch scrolling and get the scroll position.

##### scrollPos
* **Type:** `number`

The current scroll position.

##### scrollHeight
* **Type:** `number`

The height of the root scrollbars window.

##### childScrolling
* **Type:** `boolean`

Boolean indicating whether a non root scrollbar is currently scrolling.

#### Methods
ScrollbarService Methods

#### getOffsetTop(el): number
Returns the passed elements offset top value

#### getOffsetBottom(el): number
Returns the passed elements offset bottom value

### WindowService

#### Properties
The WindowService properties

##### window
* **Type:** `Window`

The browsers Window object

##### resizeObs
* **Type:** `Observable<any>`

Observable of the window resize event.

##### isMobile
* **Type:** `number`

Boolean indicating if on mobile sized display.

##### width
* **Type:** `number`

The width of the window.


##### height
* **Type:** `number`

The width of the window.
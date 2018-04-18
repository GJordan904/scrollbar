import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cbj-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {
  installCode = {
    language: 'bash',
    code: 'npm i --save @codebyjordan/scrollbar'
  };
  buildCode = {
    language: 'bash',
    code: 'npm run build:lib'
  };
  importCode = {
    language: 'typescript',
    code: `import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CbjScrollbarModule } from '@codebyjordan/scrollbar';

@NgModule({
  imports: [
    BrowserModule,
    CbjScrollbarModule.forRoot({}) // Only use forRoot in your root module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`
  };
  templateCode = {
    language: 'markup',
    code: `<div class="container-fluid">
  <div class="row">
      <nav class="navbar">
          ...
      </nav>
  </div>
  
  <div class="row"> <!-- This element will be made position: relative  
    <!-- cbj-scroll-wrapper open tag will be inserted here -->
      <div class="main-content" [cbjScrollbar]="mainScrollbar">
        <router-outlet></router-outlet>
      </div>
      <!-- cbj-scroll-grid element will be inserted here -->
      <!-- cbj-scroll-bar element will be inserted here -->
    <!-- cbj-scroll-wrapper close tag will be inserted here -->  
  </div>
</div>`
  };
  componentCode = {
    language: 'typescript',
    code: `import { Component } from '@angular/core';
import {ScrollbarConfig} from '@codebyjordan/scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mainScrollbar: ScrollbarConfig;

  ngOnInit() {
    this.mainScrollbar = new ScrollbarConfig({
      isRoot: true,
      alwaysVisible: true
    });
  }
}`
  };
  stylesCode = {
    language: 'scss',
    code: `
$navbar-height: 3.25rem;

.main-content {
  height: calc(100vh - #{$navbar-height});
  width: 100%;
}`
  };

  constructor() { }

  ngOnInit() {
  }

}

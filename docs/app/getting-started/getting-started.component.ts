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
    CbjScrollbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`
  };
  templateCode = {
    language: 'markup',
    code: `<div class="container-fluid wrapper">
    <div class="row">
        <nav class="navbar cbj-elevation-3 navbar-expand navbar-dark bg-primary w-100">
            ...
        </nav>
    </div>

    <div class="row">
        <div class="main-content" [cbjScrollbar]="mainScrollbar">
            <router-outlet></router-outlet>
        </div>
    </div>
</div>`
  };
  componentCode = {
    language: 'typescript',
    code: `import { Component } from '@angular/core';
import {ScrollbarOptions} from '@codebyjordan/scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mainScrollbar: ScrollbarOptions = {
    isRoot: true,
    alwaysVisible: true
  };
}`
  };
  stylesCode = {
    language: 'scss',
    code: `@import '~bootstrap/scss/bootstrap';

$navbar-height: 3.25rem;

.navbar {
  height: $navbar-height;
}     
.wrapper {
  overflow: hidden;
}

.main-content {
  height: calc(100vh - #{$navbar-height});
  padding: 0 0 2rem 0;
  width: 100%;
}`
  };

  constructor() { }

  ngOnInit() {
  }

}

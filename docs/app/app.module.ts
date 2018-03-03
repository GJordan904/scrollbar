import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CbjScrollbarModule } from '@codebyjordan/scrollbar';
import { HomeComponent } from './home/home.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import {RouterModule} from '@angular/router';
import {HighlightDirective} from './directives/highlight.directive';
import { DemoComponent } from './demo/demo.component';
import { FooterComponent } from './footer/footer.component';

const ROUTES = [
  { path: 'home', component: HomeComponent },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'demo', component: DemoComponent },
  { path: '', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GettingStartedComponent,
    ConfigurationComponent,
    HighlightDirective,
    DemoComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    CbjScrollbarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

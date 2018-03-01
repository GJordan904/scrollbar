import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WINDOW, _window } from './services/window.token';
import { WindowService } from './services/window.service';
import { ScrollbarService } from './services/scrollbar.service';
import { CbjScrollbarDirective } from './directives/scrollbar.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: WINDOW, useFactory: _window },
    WindowService,
    ScrollbarService
  ],
  declarations: [
    CbjScrollbarDirective
  ],
  exports: [
    CbjScrollbarDirective
  ]
})
export class CbjScrollbarModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CbjScrollbarModule,
      providers: [
        { provide: WINDOW, useFactory: _window },
        WindowService,
        ScrollbarService
      ]
    };
  }
}

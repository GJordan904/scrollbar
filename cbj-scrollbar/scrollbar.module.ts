import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {ScrollbarService, WINDOW, WindowService} from './services';
import {CbjScrollbarDirective} from './directives';

@NgModule({
  declarations: [
    CbjScrollbarDirective
  ],
  exports: [
    CbjScrollbarDirective
  ]
})
export class CbjScrollbarModule {
  constructor(@Optional() @SkipSelf() parentModule: CbjScrollbarModule) {
    if (parentModule) {
      throw new Error(
        'CbjScrollbarModule is already loaded. Import it with the forRoot method in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CbjScrollbarModule,
      providers: [
        WindowService,
        ScrollbarService,
        {provide: WINDOW, useValue: window}
      ]
    };
  }
}

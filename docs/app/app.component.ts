import { Component } from '@angular/core';
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
}

import {Component, OnInit} from '@angular/core';
import {ScrollbarOptions, ScrollbarConfig} from '@codebyjordan/scrollbar';

@Component({
  selector: 'cbj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

import { Component, OnInit } from '@angular/core';
import {ScrollbarConfig} from '@codebyjordan/scrollbar';

@Component({
  selector: 'cbj-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  firstCardScroll: ScrollbarConfig;
  secondCardScroll: ScrollbarConfig;
  thirdCardScroll: ScrollbarConfig;

  ngOnInit(): void {
    this.firstCardScroll = new ScrollbarConfig({
      styles: {
        grid: {
          'border-top-right-radius': '.25rem',
          'border-bottom-right-radius': '.25rem',
          'opacity': '.75',
          'background': '#1F2421',
        },
        bar: {
          'background': '#216869'
        },
      },
      alwaysVisible: true
    });

    this.secondCardScroll = new ScrollbarConfig({styles: {bar: {'background': '#2274A5'}}});

    this.thirdCardScroll = new ScrollbarConfig({
      styles: {
        bar: {
          'opacity': '.65',
          'background': '#1F2421'
        }
      },
      alwaysVisible: true
    });
  }
}

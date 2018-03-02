import {Component, OnInit} from '@angular/core';
import {ScrollbarOptions, ScrollbarConfig} from '@codebyjordan/scrollbar';

@Component({
  selector: 'cbj-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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

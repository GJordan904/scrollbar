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

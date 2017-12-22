import { Component, OnInit } from '@angular/core';
import {ScrollbarOptions} from '@codebyjordan/scrollbar';

@Component({
  selector: 'cbj-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  firstCardScroll: ScrollbarOptions = {
    barBackground: '#216869',
    gridBackground: '#1F2421',
    gridStyles: [
      { prop: 'border-top-right-radius', val: '.25rem' },
      { prop: 'border-bottom-right-radius', val: '.25rem' },
      { prop: 'opacity', val: '.75' }
    ],
    alwaysVisible: true
  };

  secondCardScroll: ScrollbarOptions = {
    barBackground: '#2274A5',
  };

  thirdCardScroll: ScrollbarOptions = {
    barBackground: '#1F2421',
    barStyles: [
      { prop: 'opacity', val: '.65' }
    ],
    alwaysVisible: true
  };

  constructor() { }

  ngOnInit() {
  }

}

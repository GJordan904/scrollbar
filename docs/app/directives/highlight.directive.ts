import {AfterViewInit, Directive, ElementRef, Input, OnInit} from '@angular/core';
import {HighlightCode} from '../models';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';

@Directive({
  selector: '[cbjHighlight]'
})
export class HighlightDirective implements OnInit, AfterViewInit {
  @Input('cbjHighlight')cbjHighlight: HighlightCode;
  private fCode: string;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.fCode = Prism.highlight(
      this.cbjHighlight.code,
      Prism.languages[this.cbjHighlight.language]
    );
  }

  ngAfterViewInit() {
    this.el.nativeElement.innerHTML = this.fCode;
  }
}

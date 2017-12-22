import {Directive, Input, OnInit} from '@angular/core';
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
export class HighlightDirective implements OnInit {
  @Input('cbjHighlight')cbjHighlight: any;

  constructor() { }

  ngOnInit() {
    const code = this.cbjHighlight.code;
    const language = this.getLanguage();
    this.cbjHighlight.code = Prism.highlight(code, language);
  }

  private getLanguage(): Prism.LanguageDefinition {
    let lang: Prism.LanguageDefinition;
    switch (this.cbjHighlight.language) {
      case 'javascript':
        lang = Prism.languages.javascript;
        break;
      case 'typescript':
        lang = Prism.languages.typescript;
        break;
      case 'markup':
        lang = Prism.languages.markup;
        break;
      case 'php':
        lang = Prism.languages.php;
        break;
      case 'scss':
        lang = Prism.languages.scss;
        break;
      case 'bash':
        lang = Prism.languages.bash;
        break;
      default:
        lang = Prism.languages.typescript;
        break;
    }
    return lang;
  }
}

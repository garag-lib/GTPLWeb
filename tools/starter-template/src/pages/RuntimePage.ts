import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'runtime-page',
  template: './RuntimePage.html',
  aot: false,
  style: './RuntimePage.css',
  styleMode: 'global'
})
export class RuntimePage extends GTplComponentBase {
  clicks = 0;

  increment() {
    this.clicks++;
  }
}

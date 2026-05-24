import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'lazy-page',
  template: './LazyPage.html',
  style: './LazyPage.scss',
  styleMode: 'global'
})
export class LazyPage extends GTplComponentBase {
}

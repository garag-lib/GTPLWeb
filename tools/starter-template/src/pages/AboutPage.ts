import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'about-page',
  template: './AboutPage.html',
  style: './AboutPage.scss',
  styleMode: 'global'
})
export class AboutPage extends GTplComponentBase {
  clicks = 0;

  increment() {
    this.clicks++;
  }
}

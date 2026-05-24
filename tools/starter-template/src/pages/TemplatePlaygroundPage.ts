import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'template-playground-page',
  template: './TemplatePlaygroundPage.html',
  style: './TemplatePlaygroundPage.scss',
  styleMode: 'global'
})
export class TemplatePlaygroundPage extends GTplComponentBase {
  isVisible = true;
  kind = 'A';
  text = 'hola';
  list = ['uno', 'dos', 'tres'];
  form = { name: 'Ada', role: 'dev' };

  format = (value) => String(value).toUpperCase();

  toggle() {
    this.isVisible = !this.isVisible;
  }

  nextKind() {
    this.kind = this.kind === 'A' ? 'B' : this.kind === 'B' ? 'C' : 'A';
  }

  pushItem() {
    this.list.push('item-' + (this.list.length + 1));
  }

  popItem() {
    this.list.pop();
  }
}

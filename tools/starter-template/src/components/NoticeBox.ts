import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'notice-box',
  template: './NoticeBox.html',
  style: './NoticeBox.scss',
  styleMode: 'global'
})
export class NoticeBox extends GTplComponentBase {
  title = 'Dynamic component';
  text = 'This block is rendered through g-component.';
}

import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'notice-box',
  template: './NoticeBox.html',
  style: './NoticeBox.scss',
  styleMode: 'global'
})
export class NoticeBox extends GTplComponentBase {
  title = 'Componente dinámico';
  text = 'Este bloque se monta con g-component.';
}

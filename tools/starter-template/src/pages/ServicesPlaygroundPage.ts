import { Component, GBus, GRouterService, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'services-playground-page',
  template: './ServicesPlaygroundPage.html',
  style: './ServicesPlaygroundPage.scss',
  styleMode: 'global'
})
export class ServicesPlaygroundPage extends GTplComponentBase {
  busMessages = [];
  routeUrl = '-';
  off = null;

  onInit() {
    this.off = GBus.subscribe('starter.note', (payload) => {
      this.busMessages.push(payload.message);
    });

    const router = GRouterService.getRouter();
    const match = router?.getMatch();
    this.routeUrl = match?.fullPath || '(router no listo)';
  }

  onDestroy() {
    if (this.off) this.off.off();
  }

  emitMessage() {
    const text = 'evento #' + (this.busMessages.length + 1);
    GBus.emit('starter.note', { message: text });
  }
}

import { Animations, AppGTplComponent, Component } from '@mpeliz/gtplweb';

@Component({
  tag: '__APP_TAG_NAME__',
  template: './App.html',
  style: './App.scss',
  styleMode: 'global'
})
export class App extends AppGTplComponent {
  page = null;
  pageHostEl: HTMLElement | null = null;

  async onRouteChange(state, current) {
    const isChildRoute = !current.classRef;
    const ref = isChildRoute ? current.gurl.parent?.classRef : current.classRef;
    if (!ref) return;

    let componentFactory = ref;
    if (typeof ref === 'function' && !ref.prototype) {
      componentFactory = await ref();
    }

    const existingComponent = isChildRoute ? current.gurl.parent?.component : current.gurl.component;
    if (state === 'new' && !existingComponent) {
      const instance = new componentFactory();
      if (isChildRoute) {
        current.gurl.parent.component = instance;
      } else {
        current.gurl.component = instance;
      }
    }
    this.page = isChildRoute ? current.gurl.parent?.component : current.gurl.component;

    queueMicrotask(async () => {
      if (!this.pageHostEl) return;
      await Animations.slideFadeInY(this.pageHostEl, '16px', 220);
      Animations.resetStyles(this.pageHostEl);
    });
  }
}

import { Animations, Component, GTplComponentBase, getControllerFromComponent } from '@mpeliz/gtplweb';
import { NoticeBox } from '../components/NoticeBox.js';

@Component({
  tag: 'webgtpl-directives-page',
  template: './WebGtplDirectivesPage.html',
  style: './WebGtplDirectivesPage.scss',
  styleMode: 'global'
})
export class WebGtplDirectivesPage extends GTplComponentBase {
  classList = 'card';
  enabled = true;
  currentComponent = 'notice-box';
  injectedTitle = 'Injected via g-set';
  setTitleValue = '(no value yet)';
  dynamicCtrl: any = null;
  dynamicHostEl: any = null;

  title = 'Performance';
  subtitle = 'Dynamic metric';
  value = 96;
  unit = 'pts';
  trend = '+2%';
  status = 'up';
  items = [
    { label: 'Min', value: '90' },
    { label: 'Max', value: '102' },
    { label: 'Average', value: '96' }
  ];

  onTemplateReady() {
    this.syncDynamicController();
    this.applyToDynamicComponent();
    this.animatePageBlocks();
  }

  toggleClass() {
    this.enabled = !this.enabled;
    this.classList = this.enabled ? 'card gtpl-ok' : 'card gtpl-warn';
  }

  setNotice() {
    this.currentComponent = 'notice-box';
    queueMicrotask(() => {
      this.syncDynamicController();
      this.applyToDynamicComponent();
      this.animateDynamicHost();
    });
  }

  setStats() {
    this.currentComponent = 'stats-card';
    queueMicrotask(() => {
      this.syncDynamicController();
      this.applyToDynamicComponent();
      this.animateDynamicHost();
    });
  }

  clearDynamic() {
    this.currentComponent = '';
    this.dynamicCtrl = null;
  }

  randomizeTitle() {
    this.injectedTitle = 'Injected #' + Math.floor(Math.random() * 1000);
    this.setTitleValue = this.injectedTitle;
    this.applyToDynamicComponent();
  }

  randomizeStats() {
    const value = 80 + Math.floor(Math.random() * 40);
    const delta = -5 + Math.floor(Math.random() * 11);
    const trend = (delta > 0 ? '+' : '') + delta + '%';
    const status = delta > 0 ? 'up' : delta < 0 ? 'down' : 'stable';

    const min = value - (5 + Math.floor(Math.random() * 5));
    const max = value + (5 + Math.floor(Math.random() * 5));
    const avg = Math.round((min + max + value) / 3);

    this.title = 'Performance';
    this.subtitle = 'Dynamic metric';
    this.value = value;
    this.unit = 'pts';
    this.trend = trend;
    this.status = status;
    this.items = [
      { label: 'Min', value: String(min) },
      { label: 'Max', value: String(max) },
      { label: 'Average', value: String(avg) }
    ];
    this.applyToDynamicComponent();
  }

  private syncDynamicController() {
    const childComponent = this.dynamicHostEl?.firstElementChild;
    this.dynamicCtrl = childComponent ? getControllerFromComponent(childComponent) : null;
  }

  private applyToDynamicComponent() {
    if (!this.dynamicCtrl) return;

    if (this.currentComponent === 'stats-card') {
      this.dynamicCtrl.title = this.title;
      this.dynamicCtrl.subtitle = this.subtitle;
      this.dynamicCtrl.value = this.value;
      this.dynamicCtrl.unit = this.unit;
      this.dynamicCtrl.trend = this.trend;
      this.dynamicCtrl.status = this.status;
      this.dynamicCtrl.items = this.items;
      return;
    }

    if (this.currentComponent === 'notice-box') {
      this.dynamicCtrl.title = this.injectedTitle;
      this.dynamicCtrl.text = 'Updated from parent controller by reference';
    }
  }

  private async animatePageBlocks() {
    const blocks = this.$el?.querySelectorAll('.grid-2 > .card');
    if (!blocks?.length) return;
    let i = 0;
    for (const block of blocks as any) {
      await Animations.enter(block, {
        yFrom: `${10 + i * 3}px`,
        opacityFrom: '0',
        duration: 180
      });
      Animations.resetStyles(block);
      i++;
    }
  }

  private async animateDynamicHost() {
    if (!this.dynamicHostEl) return;
    await Animations.zoomIn(this.dynamicHostEl, '0.96', 180);
    Animations.resetStyles(this.dynamicHostEl);
  }

}

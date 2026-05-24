import './App.js';
import { GRouterService } from '@mpeliz/gtplweb';
import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { RuntimePage } from './pages/RuntimePage.js';
import { TemplatePlaygroundPage } from './pages/TemplatePlaygroundPage.js';
import { WebGtplDirectivesPage } from './pages/WebGtplDirectivesPage.js';
import { ServicesPlaygroundPage } from './pages/ServicesPlaygroundPage.js';
import './components/NoticeBox.js';
import './components/StatsCard.js';

GRouterService.init([
  {
    id: 'home',
    url: '/',
    default: true,
    classRef: HomePage.__gcomponent__
  },
  {
    id: 'about',
    url: '/about',
    classRef: AboutPage.__gcomponent__
  },
  {
    id: 'lazy',
    url: '/lazy',
    classRef: async () => {
      const mod = await import('./pages/LazyPage.js');
      return mod.LazyPage.__gcomponent__;
    }
  },
  {
    id: 'runtime',
    url: '/runtime',
    classRef: RuntimePage.__gcomponent__
  },
  {
    id: 'templates',
    url: '/templates',
    classRef: TemplatePlaygroundPage.__gcomponent__
  },
  {
    id: 'directives',
    url: '/directives',
    classRef: WebGtplDirectivesPage.__gcomponent__
  },
  {
    id: 'services',
    url: '/services',
    classRef: ServicesPlaygroundPage.__gcomponent__
  }
]);

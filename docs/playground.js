import { Component } from '../src/decorators/component.decorator.ts';
import { GTplComponentBase } from '../src/core/GTplComponentBase.ts';
import { GBus } from '../src/services/GBus.ts';
import { GRouter } from '../src/core/GRouter.ts';
import '../src/directives/GSet.ts';
import '../src/directives/GClass.ts';
import '../src/directives/GComponent.ts';

// Each displayed controller and template below powers its corresponding live demo.
// Function-call decorators keep these examples directly usable in JavaScript.
const definitions = [];
function define(tag, Controller, template, options = {}) {
    Component({ tag, template: { html: template }, ...options })(Controller);
    definitions.push({ tag, Controller, template, options });
}

class CounterCard extends GTplComponentBase {
    count = 0;
    label = 'My first component';
    increment() { this.count++; }
    reset() { this.count = 0; }
}
define('docs-counter-card', CounterCard, `
<label>Card title <input [value]="{{ label }}" /></label>
<h3>{{ label }}</h3>
<p class="metric" aria-live="polite">{{ count }}</p>
<div class="actions">
    <button onclick="{{ increment }}">Increment</button>
    <button class="secondary" onclick="{{ reset }}">Reset</button>
</div>`);

class ProfileCard extends GTplComponentBase {
    profile = { name: 'Waiting for parent', role: 'Guest' };
}
define('docs-profile-card', ProfileCard, `
<article class="profile">
    <span class="avatar" aria-hidden="true">G</span>
    <div><strong data-profile-name>{{ profile.name }}</strong><p>{{ profile.role }}</p></div>
</article>`);

class ParentProfile extends GTplComponentBase {
    name = 'Ada Lovelace';
    role = 'Template engineer';
    changePerson() {
        this.name = this.name === 'Ada Lovelace' ? 'Grace Hopper' : 'Ada Lovelace';
        this.role = this.name === 'Ada Lovelace' ? 'Template engineer' : 'Compiler engineer';
    }
}
define('docs-parent-profile', ParentProfile, `
<label>Name <input [value]="{{ name }}" /></label>
<label>Role <input [value]="{{ role }}" /></label>
<docs-profile-card g-set:profile.name="{{ name }}" g-set:profile.role="{{ role }}"></docs-profile-card>
<button onclick="{{ changePerson }}">Change person</button>`);

class ClassBadge extends GTplComponentBase {
    active = true;
    classes = ['status', 'status-ok'];
    toggle() {
        this.active = !this.active;
        this.classes = this.active ? ['status', 'status-ok'] : ['status', 'status-paused'];
    }
}
define('docs-class-badge', ClassBadge, `
<p g-class="{{ classes }}">{{ return active ? 'System online' : 'System paused' }}</p>
<button onclick="{{ toggle }}">Toggle status</button>`);

class WeatherWidget extends GTplComponentBase {
    temperature = 21;
    warmUp() { this.temperature++; }
}
define('docs-weather-widget', WeatherWidget, `
<article class="widget"><h3>Weather widget</h3>
<p><strong>{{ temperature }}</strong> °C in Madrid</p>
<button onclick="{{ warmUp }}">Warm up</button></article>`);

class TasksWidget extends GTplComponentBase {
    tasks = [{ title: 'Build components' }, { title: 'Ship documentation' }];
    add() { this.tasks.push({ title: 'Task ' + (this.tasks.length + 1) }); }
}
define('docs-tasks-widget', TasksWidget, `
<article class="widget"><h3>Tasks widget</h3>
<ul><li g-for="tasks;index;task">{{ task.title }}</li></ul>
<button onclick="{{ add }}">Add task</button></article>`);

class DynamicDashboard extends GTplComponentBase {
    current = 'docs-weather-widget';
    showWeather() { this.current = 'docs-weather-widget'; }
    showTasks() { this.current = 'docs-tasks-widget'; }
    clear() { this.current = ''; }
}
define('docs-dynamic-dashboard', DynamicDashboard, `
<div class="actions">
    <button onclick="{{ showWeather }}">Weather</button>
    <button onclick="{{ showTasks }}">Tasks</button>
    <button class="secondary" onclick="{{ clear }}">Clear</button>
</div>
<div g-component="{{ current }}"></div>`);

class BusReceiver extends GTplComponentBase {
    messages = [];
    subscription = null;
    onInit() {
        this.subscription = GBus.subscribe('docs.note', (payload) => {
            this.messages.push(payload.text);
        }, { namespace: 'playground' });
    }
    onDestroy() { this.subscription?.off(); }
}
define('docs-bus-receiver', BusReceiver, `
<p>Received: <strong data-message-count>{{ return messages.length }}</strong></p>
<ul class="event-log" aria-live="polite"><li g-for="messages;index;message">{{ message }}</li></ul>`);

class BusSender extends GTplComponentBase {
    text = 'Hello from another component';
    count = 0;
    send() {
        this.count++;
        GBus.emit('docs.note', { text: '#' + this.count + ': ' + this.text }, 'playground');
    }
}
define('docs-bus-sender', BusSender, `
<label>Message <input [value]="{{ text }}" /></label>
<button onclick="{{ send }}">Publish message</button>`);

class BusPlayground extends GTplComponentBase {}
define('docs-bus-playground', BusPlayground, `
<div class="columns"><docs-bus-sender></docs-bus-sender><docs-bus-receiver></docs-bus-receiver></div>`);

// A router can resolve paths without taking over the documentation's anchor links.
const routeResolver = new GRouter([
    { id: 'home', url: '/' },
    { id: 'project', url: '/projects/:id', regex: { id: '([0-9]+)' } },
    { id: 'guide', url: '/guides/:topic' }
]);
class RouteExplorer extends GTplComponentBase {
    path = '/projects/42';
    result = 'Click Resolve route';
    generated = '';
    async resolve() {
        const match = await routeResolver.matchPath(this.path);
        this.result = match ? JSON.stringify({ id: match.id, params: match.params }, null, 2) : 'No matching route';
    }
    project() { this.path = '/projects/128'; this.resolve(); }
    guide() { this.path = '/guides/components'; this.resolve(); }
    missing() { this.path = '/projects/not-a-number'; this.resolve(); }
    build() { this.generated = routeResolver.getUrlFromParams('project', { id: 7 }); }
}
define('docs-route-explorer', RouteExplorer, `
<label>Path <input [value]="{{ path }}" /></label>
<div class="actions"><button onclick="{{ resolve }}">Resolve route</button>
<button class="secondary" onclick="{{ project }}">Project</button>
<button class="secondary" onclick="{{ guide }}">Guide</button>
<button class="secondary" onclick="{{ missing }}">Invalid ID</button></div>
<pre class="route-result" aria-live="polite">{{ result }}</pre>
<button class="secondary" onclick="{{ build }}">Build project URL</button><output>{{ generated }}</output>`);

class LifecycleChild extends GTplComponentBase {
    onConstruct() { GBus.emit('docs.lifecycle', 'onConstruct', 'lifecycle'); }
    onInit() { GBus.emit('docs.lifecycle', 'onInit', 'lifecycle'); }
    onTemplateReady() { GBus.emit('docs.lifecycle', 'onTemplateReady', 'lifecycle'); }
    onConnect() { GBus.emit('docs.lifecycle', 'onConnect', 'lifecycle'); }
    onDisconnect() { GBus.emit('docs.lifecycle', 'onDisconnect', 'lifecycle'); }
    onDestroy() { GBus.emit('docs.lifecycle', 'onDestroy', 'lifecycle'); }
}
define('docs-lifecycle-child', LifecycleChild, '<p class="status status-ok">Child component mounted.</p>');

class LifecyclePlayground extends GTplComponentBase {
    current = '';
    events = [];
    subscription = null;
    onInit() {
        this.subscription = GBus.subscribe('docs.lifecycle', (event) => {
            this.events.push(event);
        }, { namespace: 'lifecycle' });
    }
    mount() { this.current = 'docs-lifecycle-child'; }
    unmount() { this.current = ''; }
    clear() { this.events = []; }
    onDestroy() { this.subscription?.off(); }
}
define('docs-lifecycle-playground', LifecyclePlayground, `
<div class="actions"><button onclick="{{ mount }}">Mount child</button>
<button class="secondary" onclick="{{ unmount }}">Destroy child</button>
<button class="secondary" onclick="{{ clear }}">Clear log</button></div>
<div g-component="{{ current }}"></div>
<ol class="event-log" aria-live="polite"><li g-for="events;index;event">{{ event }}</li></ol>`);

class ShadowCard extends GTplComponentBase {
    count = 0;
    increment() { this.count++; }
}
define('docs-shadow-card', ShadowCard, `
<h3>Inside a ShadowRoot</h3>
<p>Local clicks: <strong>{{ count }}</strong></p>
<button onclick="{{ increment }}">Shadow counter +1</button>
<slot></slot>`, {
    shadow: true,
    styleMode: 'inline',
    style: ':host{display:block;padding:1rem;border:2px solid #1e855f;border-radius:12px;background:#f3faef;color:#132218;font:inherit}h3{color:#1e855f;margin:0 0 .75rem}button{padding:.55rem .85rem;border:0;border-radius:7px;background:#1e855f;color:white;cursor:pointer}::slotted(p){font-style:italic}'
});

const sections = [
    { id: 'components', title: 'Components, state & two-way inputs', description: 'A controller owns state. GTPL binds its fields directly to DOM and routes template events to methods.', tag: 'docs-counter-card', tags: ['docs-counter-card'] },
    { id: 'inputs', title: 'Parent → child: nested g-set inputs', description: 'Edit both inputs. g-set:profile.name and g-set:profile.role assign reactive values to the registered child controller, including nested paths.', tag: 'docs-parent-profile', tags: ['docs-profile-card', 'docs-parent-profile'] },
    { id: 'classes', title: 'Dynamic classes with g-class', description: 'Pass an array or a space-separated string. Each update replaces the complete class list, so include base classes in the value.', tag: 'docs-class-badge', tags: ['docs-class-badge'] },
    { id: 'dynamic', title: 'Dynamic components & nested lists', description: 'g-component mounts a registered tag, destroys the previous component when switching, and clears the slot for an empty string. Switch back to see fresh local state.', tag: 'docs-dynamic-dashboard', tags: ['docs-weather-widget', 'docs-tasks-widget', 'docs-dynamic-dashboard'] },
    { id: 'events', title: 'Component communication with GBus', description: 'Independent sender and receiver communicate through a namespace. Keep the subscription handle and call off() in onDestroy().', tag: 'docs-bus-playground', tags: ['docs-bus-sender', 'docs-bus-receiver', 'docs-bus-playground'] },
    { id: 'router', title: 'Route explorer: params, validation & URLs', description: 'Resolve real GRouter patterns without navigating away. Try /projects/42, /guides/components or an invalid numeric ID. Custom regex fragments include a capture group for their parameter. Production navigation uses GRouterService.init(routes).', tag: 'docs-route-explorer', tags: ['docs-route-explorer'], prelude: "const routeResolver = new GRouter([\n  { id: 'home', url: '/' },\n  { id: 'project', url: '/projects/:id', regex: { id: '([0-9]+)' } },\n  { id: 'guide', url: '/guides/:topic' }\n]);" },
    { id: 'lifecycle', title: 'Lifecycle & explicit cleanup', description: 'Mount, destroy, then mount again. Observe actual hook order: construction, connection and asynchronous template availability can interleave. onTemplateReady signals template insertion; it does not await every asynchronous binding.', tag: 'docs-lifecycle-playground', tags: ['docs-lifecycle-child', 'docs-lifecycle-playground'] },
    { id: 'shadow', title: 'Shadow DOM, scoped styles & slots', description: 'shadow: true creates an open ShadowRoot. Inline styles stay scoped; the slot projects content supplied by the parent. The counter remains reactive inside the shadow tree.', tag: 'docs-shadow-card', tags: ['docs-shadow-card'], lightDOM: '<p>Projected from the light DOM through a native slot.</p>' }
];

const importLine = "import { Component, GTplComponentBase, GBus, GRouter } from '@mpeliz/gtplweb';";
const main = document.querySelector('#examples');
const toc = document.querySelector('#example-links');
for (const [index, section] of sections.entries()) {
    const article = document.createElement('section');
    article.className = 'demo';
    article.id = section.id;
    const heading = document.createElement('h2');
    heading.textContent = `${String(index + 1).padStart(2, '0')} / ${section.title}`;
    const description = document.createElement('p');
    description.className = 'demo-intro';
    description.textContent = section.description;
    const preview = document.createElement('div');
    preview.className = 'preview';
    const previewLabel = document.createElement('p');
    previewLabel.className = 'panel-label';
    previewLabel.textContent = 'LIVE EXAMPLE';
    const host = document.createElement(section.tag);
    if (section.lightDOM) host.innerHTML = section.lightDOM;
    preview.append(previewLabel, host);
    article.append(heading, description, preview);
    const details = document.createElement('details');
    details.className = 'source';
    const summary = document.createElement('summary');
    summary.textContent = 'View complete example source';
    details.append(summary);
    const imported = document.createElement('pre');
    imported.textContent = importLine + (section.prelude ? '\n\n' + section.prelude : '');
    details.append(imported);
    for (const tag of section.tags) {
        const def = definitions.find(item => item.tag === tag);
        const label = document.createElement('h3');
        label.textContent = tag;
        const html = document.createElement('pre');
        const htmlCode = document.createElement('code');
        htmlCode.textContent = def.template.trim();
        html.append(htmlCode);
        const js = document.createElement('pre');
        const jsCode = document.createElement('code');
        jsCode.textContent = 'const ' + def.Controller.name + ' = ' + def.Controller.toString() + ';\n\nComponent(' + JSON.stringify({ tag, template: { html: def.template }, ...def.options }, null, 2) + ')(' + def.Controller.name + ');';
        js.append(jsCode);
        details.append(label, html, js);
    }
    const mount = document.createElement('pre');
    mount.textContent = '<' + section.tag + '>' + (section.lightDOM || '') + '</' + section.tag + '>';
    details.append(mount);
    article.append(details);
    main.append(article);
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + section.id;
    link.textContent = section.title;
    li.append(link);
    toc.append(li);
}

document.documentElement.dataset.playground = 'ready';

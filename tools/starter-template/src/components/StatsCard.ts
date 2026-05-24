import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'stats-card',
  template: './StatsCard.html',
  style: './StatsCard.scss',
  styleMode: 'global'
})
export class StatsCard extends GTplComponentBase {
  title = 'Metric';
  subtitle = 'Daily summary';
  value = 0;
  unit = 'pts';
  trend = '+0%';
  status = 'stable';
  items = [
    { label: 'Min', value: '0' },
    { label: 'Max', value: '0' },
    { label: 'Average', value: '0' }
  ];
}

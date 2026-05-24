import { Component, GTplComponentBase } from '@mpeliz/gtplweb';

@Component({
  tag: 'stats-card',
  template: './StatsCard.html',
  style: './StatsCard.scss',
  styleMode: 'global'
})
export class StatsCard extends GTplComponentBase {
  title = 'Estadística';
  subtitle = 'Resumen diario';
  value = 0;
  unit = 'pts';
  trend = '+0%';
  status = 'stable';
  items = [
    { label: 'Mínimo', value: '0' },
    { label: 'Máximo', value: '0' },
    { label: 'Promedio', value: '0' }
  ];
}

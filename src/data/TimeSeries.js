// @flow
import * as moment from 'moment';

export type Color = { line: string, epoch: string };

const DEFUALT_COLORS: Array<Color> = [
  { line: '#E23E31', epoch: '#FF8D84' },
  { line: '#E2B831', epoch: '#FFE284' },
  { line: '#39349D', epoch: '#7873C5' },
  { line: '#42BD29', epoch: '#86DF73' }
];

export class Epoch {
  interval: [number, number];
  color: Color;
  constructor(interval: [number, number]) {
    this.interval = interval;
  }
}

export class Channel {
  duration: moment.Duration
  timeStep: moment.Duration
  data: Float32Array
  epochs: Array<Epoch>
  color: Color;
  static colorIndex = 0;
  constructor(duration: moment.Duration, data: Float32Array, epochs?: Array<Epoch>, color?: Color) {
    this.data = data;
    if (this.data.length === 0) {
      this.timeStep = duration;
    } else {
      this.timeStep = moment.duration(duration.asMilliseconds() / data.length);
    }
    this.epochs = epochs || [];
    if (color) {
      this.color = color ;
      return;
    }
    this.color = DEFUALT_COLORS[Channel.colorIndex];
    Channel.colorIndex = (Channel.colorIndex + 1) % DEFUALT_COLORS.length;
  }
}

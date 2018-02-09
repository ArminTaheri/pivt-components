// @flow
import React, { Component } from 'react';
import { Epoch, Channel } from '../data';
import './TimeSeriesPlot.css';

type EpochProps = {
  height: number,
  epochs: Array<Epoch>,
  channels: Array<Channel>,
  traceColors: Array<String>,
  resolution?: { width: number, height: number }
};

const Label = () =>
  <div className="time-series-label">
    label
  </div>
;

export default class TimeSeriesPlot extends Component<EpochProps> {
  canvas: any;
  constructor(props: EpochProps) {
    super(props)
    this.canvas = null;
  }
  render() {
    let width = 512;
    let height = 128;
    if (this.props.resolution) {
      width = this.props.resolution.width;
      height = this.props.resolution.height;
    }
    return (
      <div className="time-series-plot-container" style={{ height: `${this.props.height}px` }}>
        <Label />
        <canvas
          width={width}
          height={height}
          className="time-series-canvas"
          ref={(ref: any) => { this.canvas = ref; }}
        />
      </div>
    )
  }
}

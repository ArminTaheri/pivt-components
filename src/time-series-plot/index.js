// @flow
import React, { Component } from 'react';
import * as moment from 'moment';
import ResizeObserver from 'resize-observer-polyfill';

import d3 from 'd3-scale';
import { Channel } from '../data';
import './TimeSeriesPlot.css';

export type TimeSeriesProps = {
  height: number,
  label: string,
  channels: Array<Channel>,
  dimensions: { t0: moment.Duration, interval: moment.Duration, min: number, max: number },
  controlPanel?: React.createElement,
};

const DefaultControls = ({ label }: { label?: string }) =>
  <div className="time-series-label">
    {label}
  </div>
;

export default class TimeSeriesPlot extends Component<TimeSeriesProps> {
  canvasDiv: HTMLDivElement | null
  canvas: HTMLCanvasElement | null
  context: CanvasRenderingContext2D | null
  resizeObserver: ResizeObserver | null
  constructor(props: TimeSeriesProps) {
    super(props)
    this.canvas = null;
    this.resizeObserver = null;
  }
  componentDidMount() {
    if (!this.canvas || !this.canvasDiv) {
      return;
    }
    const { canvas, canvasDiv } = this;
    this.context = canvas.getContext('2d');
    this.resizeObserver = new ResizeObserver(() => {
      const { width, height } = canvasDiv.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      this.clearPlot();
      this.updateLines()
    });
    this.resizeObserver.observe(canvasDiv);
    this.clearPlot();
    this.updateLines()
  }
  componentDidUpdate() {
    this.clearPlot();
    this.updateLines()
  }
  resolution() {
    if (!this.canvas) {
      return { width: 1, height: 1 };
    }
    const { width, height } = this.canvas.getBoundingClientRect();
    return { width, height };
  }
  clearPlot() {
    if (!this.canvas || !this.context) {
      return;
    }
    const { canvas, context } = this;
    const { width, height } = canvas.getBoundingClientRect();
    context.clearRect(0, 0, width, height);
  }
  updateLines() {
    const { width, height } = this.resolution();
    const { min, max } = this.props.dimensions;
    if (!this.context) {
      return;
    }
    const context = this.context;
    this.props.channels.forEach(channel => {
      context.strokeStyle = channel.color.line;
      context.beginPath();
      channel.data.forEach((value, i) => {
        const mid = (min + max) / 2;
        const x = width * (i / channel.data.length);
        const y = height * (0.9 * (1 - (0.5 + (value - mid) / (max - min))) + 0.1);
        context.lineTo(x, y);
      });
      context.stroke();
    });
  }
  render() {
    const { width, height } = this.resolution();
    let controlPanel = <DefaultControls label={this.props.label} /> ;
    if (this.props.controlPanel) {
      controlPanel = React.cloneElement(this.props.controlPanel, { label: this.props.label });
    }
    return (
      <div
        className="time-series-plot-container"
        style={{ height: `${this.props.height}px` }}
      >
        {controlPanel}
        <div
          className="time-series-canvas-container"
          ref={(ref: HTMLDivElement | null) => { this.canvasDiv = ref; }}
        >
          <canvas
            className="time-series-canvas"
            ref={(ref: HTMLCanvasElement | null) => { this.canvas = ref; }}
          />
        </div>
      </div>
    )
  }
}

// @flow
import React, { Component } from 'react';
import * as moment from 'moment';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import TimeSeriesPlot from '../src/time-series-plot';
import type { TimeSeriesProps } from '../src/time-series-plot';
import { Channel, /* Epoch */ } from '../src/data';

type State = { groups?: { [string]: { label: string, channels: Array<Channel> } } };

// Take all the props from TimeSeriesPlot but assume label and channels are fetched. Use groupIndex to pick the group for this time series plot.
type AsyncTimeSeriesProps = $Diff<TimeSeriesProps, { label: string, channels: Array<Channel> }> & { channelName: string };

class AsyncTimeSeriesPlot extends Component<AsyncTimeSeriesProps, State> {
  state: State
  constructor(props: AsyncTimeSeriesProps) {
    super(props)
    this.state = {};
    window.fetch('JSONFile_Raw.json').then(res => res.json()).then(json => {
      const groups = json.JSONFILE_Raw.Raw_Signal;
      const groupInfo = json.JSONFILE_Raw.header.device_information;
      Object.keys(groups).forEach(label => {
        let channels = groups[label].data;
        if (channels.length > 0 && channels[0] instanceof Array) {
          let durations = channels.map(() => moment.duration(0));
          if (groupInfo[label]) {
            durations = channels.map((_, i) => moment.duration(groupInfo[label].data.duration[i]));
          }
          channels = channels.map((data, i) => new Channel(durations[i], new Float32Array(data), []));
        } else {
          let duration = moment.duration(0);
          if (groupInfo[label]) {
            duration = moment.duration(groupInfo[label].data.duration);
          }
          channels = [new Channel(duration, new Float32Array(channels), [])];
        }
        groups[label] = { label, channels };
      });
      this.setState({ groups });
    })
  }
  render() {
    if (!this.state.groups) {
      return <div style={{ height: this.props.height }}>Loading...</div>;
    }
    const { channelName, ...props } = this.props;
    const group = this.state.groups[channelName];
    if (!group) {
      return null;
    }
    return (
      <TimeSeriesPlot
        label={group.label}
        channels={group.channels}
        {...props}
      />
    )
  }
}

storiesOf('TimeSeriesPlot', module)
  .add('Group of one channel', () =>
      <AsyncTimeSeriesPlot
        channelName={'channel2'}
        height={100}
        dimensions={{ t0: moment.duration(0), interval: moment.duration(60, 'seconds'), min: -500, max: 500 }}
      />
  )
  .add('Group of many channels', () =>
    <AsyncTimeSeriesPlot
      channelName={'channel5'}
      height={100}
      dimensions={{ t0: moment.duration(0), interval: moment.duration(60, 'seconds'), min: -200, max: 200 }}
    />
  )
;

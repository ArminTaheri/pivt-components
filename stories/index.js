import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import TimeSeriesPlot from '../src/time-series-plot';

storiesOf('TimeSeriesPlot', module)
  .add('Group of one channel', () => <TimeSeriesPlot height={100}/>)
  .add('Group of many channels', () => <TimeSeriesPlot height={100}/>)
  .add('Epoch markers', () => <TimeSeriesPlot height={100}/>)
;

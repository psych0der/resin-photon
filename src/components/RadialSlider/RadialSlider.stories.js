import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RadialSlider from './index';

storiesOf('RadialSlider', module)
  .add('visible state', () => <RadialSlider />)
  .add('with custom colors', () => (
    <RadialSlider dimmestColor="#2D5E4E" brightestColor="#88E4A4" value={60} />
  ))
  .add('with custom value', () => (
    <RadialSlider dimmestColor="#2D5E4E" value={35} />
  ))
  .add('With custom onChange  event', () => (
    <RadialSlider value={60} handleChange={action('Value changed')} />
  ))
  .add('With child', () => (
    <RadialSlider value={60}>
      <span>I can be anything</span>
    </RadialSlider>
  ));

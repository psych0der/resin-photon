import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Popover from './index';

storiesOf('Popover', module)
  .add('visible state', () => <Popover />)
  .add('with child element', () => <Popover>😀 😎 👍 💯</Popover>)
  .add('With custom close popover event button', () => (
    <Popover closePopOver={action('close button clicked')}>
      <span style={{ color: '#FFF' }}>
        with custom close popover event handler
      </span>
    </Popover>
  ))
  .add('Mobile view', () => <Popover isMobile={true}>😀 😎 👍 💯</Popover>);

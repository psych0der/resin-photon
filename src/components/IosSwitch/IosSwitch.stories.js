import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import IosSwitch from './index';

storiesOf('IosSwitch', module)
  .add('visible state', () => <IosSwitch />)
  .add('Checked ', () => <IosSwitch defaultChecked={true} />)
  .add('small size', () => <IosSwitch small={true} />)
  .add('With custom handle change function', () => (
    <IosSwitch handleChange={action('checked')} />
  ));

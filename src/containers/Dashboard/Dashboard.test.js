import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { Dashboard } from './index';
import { Retry, TableWrapper } from '../../components';
import * as Constants from '../../commons/constants';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dashboard devices={{}} fetchCompleteData={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders retry if data fetch status is failed', () => {
  const wrapper = shallow(
    <Dashboard
      devices={{ fetchCompleteDataState: Constants.FAILED }}
      fetchCompleteData={() => {}}
    />
  );
  expect(wrapper.find(Retry).length).toBe(1);
});

it('renders retry table if data is passed', () => {
  const wrapper = shallow(
    <Dashboard
      devices={{
        fetchCompleteDataState: Constants.SUCCESS,
        dataHash: {},
        dataOrder: [],
      }}
      fetchCompleteData={() => {}}
    />
  );
  expect(wrapper.find(TableWrapper).length).toBe(1);
});

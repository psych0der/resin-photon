import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import IosSwitch from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IosSwitch />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('initializes correctly with the default state passed ', () => {
  const wrapper = mount(<IosSwitch defaultChecked={true} />);
  let checkbox = wrapper.find({ type: 'checkbox' });
  expect(checkbox.prop('defaultChecked')).toBe(true);
});

it('Calls handleChange function on toggling the checkbox', () => {
  let onHandleChange = jest.fn();
  const wrapper = mount(<IosSwitch handleChange={onHandleChange} />);
  wrapper
    .find({ type: 'checkbox' })
    .simulate('change', { target: { checked: true } });
  expect(onHandleChange).toHaveBeenCalled();
});

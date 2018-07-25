import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import RadialSlider from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RadialSlider />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it('Calls handleChange function on dragging slider', () => {
  let onHandleChange = jest.fn();
  const wrapper = shallow(<RadialSlider handleChange={onHandleChange} />);
  wrapper.instance().handleDrag(20, 20);
  expect(onHandleChange).toHaveBeenCalled();
});

it('Renders correct type of arc for angles', () => {
  const wrapper = mount(<RadialSlider arcStartAngle={40} arcEndAngle={140} />);
  const pathData = wrapper.find('#baseRadial').props().d;

  const fragments = pathData.split(' ');
  //   check arc start coordinates
  expect(Math.trunc(fragments[1])).toBe(43);
  expect(Math.trunc(fragments[2])).toBe(184);
  //   check arc end coordinates
  expect(Math.trunc(fragments[9])).toBe(196);
  expect(Math.trunc(fragments[10])).toBe(184);
});

it('Renders slider with custom value correctly', () => {
  const wrapper = mount(<RadialSlider value={90} />);
  const pathData = wrapper.find('#valueRadial').props().d;

  const fragments = pathData.split(' ');

  //   check arc start coordinates
  expect(Math.trunc(fragments[1])).toBe(43);
  expect(Math.trunc(fragments[2])).toBe(184);
  //   check arc end coordinates
  expect(Math.trunc(fragments[9])).toBe(217);
  expect(Math.trunc(fragments[10])).toBe(144);
});

import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Popover from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Popover />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Calls closePopover function on clicking close button', () => {
  let onClosePopOver = jest.fn();
  const popover = shallow(<Popover closePopOver={onClosePopOver} />);
  popover.find('#popoverCloseButton').simulate('click');
  expect(onClosePopOver).toHaveBeenCalled();
});

it('should not render when show is false', () => {
  const popover = shallow(<Popover show={false} />);
  expect(popover.contains('div')).toBe(false);
});

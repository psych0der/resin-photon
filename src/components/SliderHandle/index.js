// @flow

import React from 'react';

type Props = {
  centerX: number,
  centerY: number,
  radius: number,
  outerCircleColor?: string,
  innerCircleColor?: string,
  isPressed: boolean,
  onMouseDown?: () => *,
  onTouchStart?: () => *,
};

type State = {
  pressed: boolean,
};

/* event helpers */
const pauseEvent = (e: Event) => {
  e.stopPropagation();
  e.preventDefault();
};

const getAbsoluteTouchPosition = (targetElement: React.Node) => ({
  x: targetElement.touches[0].pageX - (window.scrollX || window.pageXOffset),
  y: targetElement.touches[0].pageY - (window.scrollY || window.pageYOffset),
});

const getAbsoluteMousePosition = (targetElement: React.Node) => ({
  x: targetElement.pageX - (window.scrollX || window.pageXOffset),
  y: targetElement.pageY - (window.scrollY || window.pageYOffset),
});

export class SliderHandle extends React.Component<Props, State> {
  static defaultProps = {
    centerX: 0,
    centerY: 0,
    radius: 10,
    outerCircleColor: '#FFF',
    innerCircleColor: '#F7C544',
    isPressed: false,
    onMouseDown: () => {},
    onTouchStart: () => {},
  };
  state = {
    pressed: false,
  };

  render() {
    const {
      centerX,
      centerY,
      radius,
      outerCircleColor,
      innerCircleColor,
    } = this.props;
    return (
      //   return a circle wrapped in a group element
      <g style={{ cursor: 'pointer' }}>
        <filter
          id="dropshadow"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="3" dy="3" result="offsetblur" />
          <feOffset dx="-3" dy="-3" result="offsetblur" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* outer circle */}
        <circle
          cx={centerX}
          cy={centerY}
          fill={outerCircleColor}
          style={{ filter: 'url(#dropshadow)' }}
          r={radius + 3}
        />
        <circle
          cx={centerX}
          cy={centerY}
          fill={innerCircleColor}
          r={radius - 2}
        />
      </g>
    );
  }
}

export default SliderHandle;

// @flow

import React from 'react';

type Props = {
  handlerX: number,
  handlerY: number,
  radius: number,
  outerCircleColor?: string,
  innerCircleColor?: string,
  isPressed: boolean,
  onMove?: () => *,
  getAbsoluteContainerPosition: () => *,
  sliderCenterPosition: Object,
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
    handlerX: 0,
    handlerY: 0,
    radius: 10,
    outerCircleColor: '#FFF',
    innerCircleColor: '#F7C544',
    isPressed: false,
    onMove: () => {},
  };
  // As soon as slider handle is pushed or touched, we attach mouseMove and touchmove events to document.
  // This works because when the handle is pushed or touched no other simultaneous move or touch events can
  // be triggered on any other element
  state = {
    pressed: false,
  };

  componentDidMount() {
    /* Trigger this function to get initial value */
    this.props.getAbsoluteContainerPosition();
    this.props.onMove({ x: null, y: null });
  }

  /**
   * Returns eventListener arguments for both mouse and touch move events
   */
  moveEventListenerArgs = (isTouch: boolean) => [
    isTouch ? 'touchmove' : 'mousemove',
    isTouch ? this.handleTouchMove : this.handleMouseMove,
    { passive: false },
  ];

  /**
   * Returns eventListener arguments for both mouse and touch end events
   */
  endEventListenerArgs = (isTouch: boolean) => [
    isTouch ? 'touchend' : 'mouseup',
    isTouch ? this.handleTouchEnd : this.handleMouseUp,
    { passive: false },
  ];
  addEventListeners = (isTouch: boolean) => {
    this.setState({ pressed: true });
    document.addEventListener(...this.moveEventListenerArgs(isTouch));
    document.addEventListener(...this.endEventListenerArgs(isTouch));
  };
  removeEventListeners = (isTouch: boolean) => {
    this.setState({ pressed: false });
    document.removeEventListener(...this.moveEventListenerArgs(isTouch));
    document.removeEventListener(...this.endEventListenerArgs(isTouch));
  };
  handleMouseDown = (e: Event) => {
    pauseEvent(e);
    this.addEventListeners(false);
  };
  handleTouchStart = (e: Event) => {
    pauseEvent(e);
    this.addEventListeners(true);
  };
  handleMouseUp = (e: Event) => {
    pauseEvent(e);
    this.removeEventListeners(false);
  };
  handleTouchEnd = (e: Event) => {
    pauseEvent(e);
    this.removeEventListeners(true);
  };
  handleMouseMove = (e: Event) => {
    pauseEvent(e);
    const radialPos = this.calcRadialPos(getAbsoluteMousePosition(e));
    this.props.onMove(radialPos);
  };
  handleTouchMove = (e: Event) => {
    pauseEvent(e);
    const radialPos = this.calcRadialPos(getAbsoluteTouchPosition(e));
    this.props.onMove(radialPos);
  };
  /**
   * Calculates radial position of mouse or touch event in context of parent container.
   * These values are clipped to ensure
   */
  calcRadialPos = ({ x: pointerX, y: pointerY }) => {
    const {
      x: containerX,
      y: containerY,
    } = this.props.getAbsoluteContainerPosition();
    const { sliderCenterPosition } = this.props;
    return {
      x: pointerX - containerX - sliderCenterPosition.x,
      y: -(pointerY - containerY - sliderCenterPosition.y),
    };
  };

  render() {
    const {
      handlerX,
      handlerY,
      radius,
      outerCircleColor,
      innerCircleColor,
      sliderCenterPosition,
    } = this.props;
    return (
      //   return a circle wrapped in a group element
      <g
        style={{ cursor: 'pointer' }}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        id="sliderKnob"
      >
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
          cx={handlerX + sliderCenterPosition.x}
          cy={handlerY + sliderCenterPosition.y}
          fill={outerCircleColor}
          style={{ filter: 'url(#dropshadow)' }}
          r={radius + 3}
        />
        <circle
          cx={handlerX + sliderCenterPosition.x}
          cy={handlerY + sliderCenterPosition.y}
          fill={innerCircleColor}
          r={radius - 2}
        />
      </g>
    );
  }
}

export default SliderHandle;

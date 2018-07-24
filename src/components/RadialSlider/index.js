// @flow
import React from 'react';
import style from './index.css';
import { SliderHandle } from '../index';
import {
  polarToCartesian,
  calcAngleDiff,
  createCircularArc,
  normalizeAngle,
} from '../../commons/helpers';

type Props = {
  radius: number, // in degrees
  arcStartAngle: number, // in degrees
  arcEndAngle: number, // in degrees
  useLargerArc?: number | null,
  arcSweep?: number,
  baseStrokeColor?: string,
  brightestColor?: string,
  dimmestColor?: string,
  strokeWidth?: number,
  handleChange?: () => *,
  value: number,
  children?: React.ChildrenArray<React.node>,
};

type State = {
  handleAngle: number,
};

export class RadialSlider extends React.Component<Props, State> {
  //   basic dimensions of svg container and radial slider
  static defaultProps = {
    radius: 100,
    arcStartAngle: 40,
    arcEndAngle: 140,
    useLargerArc: null,
    arcSweep: 0,
    baseStrokeColor: '#727377',
    dimmestColor: '#82671F',
    brightestColor: '#F7C544',
    strokeWidth: 20.4,
    handleChange: () => {},
    value: 0,
  };
  Geometry = {
    svgWidth: 2 * (this.props.radius + 20),
    svgHeight: 2 * (this.props.radius + 20),
    sliderCenterX: this.props.radius + 20,
    sliderCenterY: this.props.radius + 20,
  };

  /**
   * Converts initial value to angle.
   * This is used to set initial position of the handle
   */
  convertValueToAngle = (value: number) => {
    // clip percentage
    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    }

    let total = 360 - this.props.arcEndAngle + this.props.arcStartAngle;
    let angle = normalizeAngle(this.props.arcEndAngle + total * value * 0.01);
    this.props.handleChange(value);
    return angle;
  };
  state = {
    handleAngle: this.convertValueToAngle(this.props.value),
  };

  containerNode = React.createRef();

  /**
   * Returns coordinates for container svg element
   * These coordinates will be used to calculate
   * touch/mouse move coordinates for user initiated event
   */
  absoluteContainerPosition = (): { x: number, y: number } | null => {
    if (!this.containerNode.current) {
      return null;
    }
    const {
      left: x,
      top: y,
    } = this.containerNode.current.getBoundingClientRect();
    return { x, y };
  };

  /**
   * Drag(mouse/touch event ) postprocessing handler
   * This function calculates position on radial path
   */
  handleDrag = ({ x, y }: { x: number, y: number }) => {
    if (x === null) {
      /* trigger change */
      this.setState({});
      return;
    }
    const { x: initialX, y: initialY } = polarToCartesian(
      0,
      0,
      this.props.radius,
      this.state.handleAngle
    );
    // get new angle by adding delta
    const deltaTheta = calcAngleDiff(x, y, initialX, -initialY);
    let newAngle = normalizeAngle(this.state.handleAngle + deltaTheta);

    // clip off new angle within the bounds of start and end angle
    if (
      newAngle > this.props.arcStartAngle &&
      newAngle < this.props.arcEndAngle
    ) {
      if (deltaTheta >= 0) {
        newAngle = this.props.arcStartAngle;
      } else {
        newAngle = this.props.arcEndAngle;
      }
    }
    // calculate percentage value
    const total = 360 - this.props.arcEndAngle + this.props.arcStartAngle;
    let value = null;
    if (newAngle > 0 && newAngle <= this.props.arcStartAngle) {
      value = 360 - this.props.arcEndAngle + newAngle;
    } else {
      value = newAngle - this.props.arcEndAngle;
    }
    /* pass % change in change function */
    this.props.handleChange(Math.round((value / total) * 100));
    this.setState({ handleAngle: newAngle });
  };

  render() {
    let {
      radius,
      arcStartAngle,
      arcEndAngle,
      baseStrokeColor,
      brightestColor,
      dimmestColor,
      strokeWidth,
    } = this.props;

    // create base radial
    const baseRadialSlider = createCircularArc(
      this.Geometry.sliderCenterX,
      this.Geometry.sliderCenterY,
      radius,
      arcStartAngle,
      arcEndAngle
    );
    // create values radial for overlay
    const filledRadialSlider = createCircularArc(
      this.Geometry.sliderCenterX,
      this.Geometry.sliderCenterY,
      radius,
      this.state.handleAngle,
      arcEndAngle
    );

    const handlerStartPosition = polarToCartesian(
      0,
      0,
      radius,
      this.state.handleAngle
    );
    let containerPosition = this.absoluteContainerPosition();
    let childContainerStyle = {};
    if (containerPosition == null) {
      childContainerStyle = {
        display: 'none',
      };
    } else {
      childContainerStyle = {
        position: 'absolute',
        left: containerPosition.x + this.Geometry.sliderCenterX,
        top: containerPosition.y + this.Geometry.sliderCenterY,
        transform: 'translate(-50%, -50%)',
      };
    }

    return (
      <div>
        <div>radial slider</div>
        <svg
          style={{
            width: this.Geometry.svgWidth + 'px',
            height: this.Geometry.svgHeight + 'px',
          }}
          ref={this.containerNode}
          viewBox={`0 0 ${this.Geometry.svgWidth} ${this.Geometry.svgHeight}`}
        >
          <defs>
            <linearGradient id="exampleGradient">
              <stop offset="0%" stopColor={dimmestColor} />
              <stop offset="100%" stopColor={brightestColor} />
            </linearGradient>
          </defs>
          <path
            id="baseRadial"
            d={baseRadialSlider}
            fill="transparent"
            stroke={baseStrokeColor}
            strokeLinecap="round"
            strokeWidth={`${strokeWidth}`}
          />
          <path
            id="valueRadial"
            d={filledRadialSlider}
            fill="transparent"
            stroke="url(#exampleGradient)"
            strokeLinecap="round"
            strokeWidth={`${strokeWidth}`}
          />
          <SliderHandle
            handlerX={handlerStartPosition.x}
            handlerY={handlerStartPosition.y}
            getAbsoluteContainerPosition={this.absoluteContainerPosition}
            onMove={this.handleDrag}
            sliderCenterPosition={{
              x: this.Geometry.sliderCenterX,
              y: this.Geometry.sliderCenterY,
            }}
          />
        </svg>
        <div style={childContainerStyle}>{this.props.children}</div>
      </div>
    );
  }
}
export default RadialSlider;

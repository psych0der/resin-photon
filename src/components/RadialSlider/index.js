import React from 'react';
import style from './index.css';
import { SliderHandle } from '../index';
import {
  polarToCartesian,
  calcAngleDiff,
  createCircularArc,
} from '../../commons/helpers';

type Props = {
  radius: number, // in degrees
  arcStartAngle: number, // in degrees
  arcEndAngle: number, // in degrees
  useLargerArc?: number | null,
  sweep?: number,
  baseStrokeColor?: string,
  brightestColor?: string,
  dimmestColor?: string,
  strokeWidth?: number,
};

export class RadialSlider extends React.Component<Props> {
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
  };
  Geometry = {
    svgWidth: 2 * (this.props.radius + 20),
    svgHeight: 2 * (this.props.radius + 20),
    sliderCenterX: this.props.radius + 20,
    sliderCenterY: this.props.radius + 20,
  };

  render() {
    let {
      radius,
      arcStartAngle,
      arcEndAngle,
      useLargerArc,
      arcSweep,
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
      arcEndAngle,
      useLargerArc,
      arcSweep
    );
    // create values radial for overlay
    const filledRadialSlider = createCircularArc(
      this.Geometry.sliderCenterX,
      this.Geometry.sliderCenterY,
      radius,
      -20,
      arcEndAngle,
      useLargerArc,
      arcSweep
    );

    const handlerPosition = polarToCartesian(
      this.Geometry.sliderCenterX,
      this.Geometry.sliderCenterY,
      radius,
      arcEndAngle
    );
    return (
      <div>
        <div>radial slider</div>
        <svg
          style={{
            width: this.Geometry.svgWidth + 'px',
            height: this.Geometry.svgHeight + 'px',
          }}
          innerRef={x => {
            this.containerNode = x;
          }}
          viewBox={`0 0 ${this.Geometry.svgWidth} ${this.Geometry.svgHeight}`}
        >
          <defs>
            <linearGradient id="exampleGradient">
              <stop offset="0%" stopColor={dimmestColor} />
              <stop offset="100%" stopColor={brightestColor} />
            </linearGradient>
          </defs>
          <path
            d={baseRadialSlider}
            fill="transparent"
            stroke={baseStrokeColor}
            strokeLinecap="round"
            strokeWidth={`${strokeWidth}`}
          />
          <path
            d={filledRadialSlider}
            fill="transparent"
            stroke="url(#exampleGradient)"
            strokeLinecap="round"
            strokeWidth={`${strokeWidth}`}
          />
          <SliderHandle
            centerX={handlerPosition.x}
            centerY={handlerPosition.y}
          />
        </svg>
      </div>
    );
  }
}
export default RadialSlider;

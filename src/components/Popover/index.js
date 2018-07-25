// @flow
import React from 'react';
import style from './index.css';

type Props = {
  triggerTop?: number,
  triggerLeft?: number,
  triggerHeight?: number,
  triggerWidth?: number,
  show?: boolean,
  isMobile?: boolean,
  closePopOver?: () => *,
  children?: React.ChildrenArray<React.node>,
};

export class Popover extends React.Component<Props> {
  static defaultProps = {
    show: true,
    triggerTop: 40,
    triggerLeft: 150,
    triggerWidth: 400,
    triggerHeight: 60,
    isMobile: false,
    closePopOver: () => {},
  };

  /**
   * Method to calculate Popover position
   * This position is based on target element and browser resolution
   * If the device is not mobile then Popover will open on right
   * side of the target element else it will appear on the bottom of
   * the element. Element's position and dimensions are used to calculate
   * the exact position of the Popover and it's indicator triangle
   *
   * `~~` This operator converts data to nearest integer by dropping the decimal fields
   *
   * This function is memoized for performance reasons
   */
  calculatePopOverPosition = (
    triggerTop: number,
    triggerLeft: number,
    triggerWidth: number,
    triggerHeight: number,
    isMobile: boolean
  ) => {
    let popOverTop,
      popOverLeft,
      popOverHeight,
      popOverWidth,
      arrowLeft,
      arrowTop = null;

    if (isMobile) {
      // Popover will appear on the bottom of the element
      popOverWidth = ~~(window.innerWidth * 0.8);
      popOverHeight = 400; //Make it constant. ~~(window.innerHeight - triggerTop);
      popOverLeft = ~~window.innerWidth * 0.1;
      popOverTop = ~~triggerTop + ~~triggerHeight + 10;
      arrowTop = -10;
      arrowLeft = ~~(popOverWidth / 2) - 10;
    } else {
      popOverWidth = window.innerWidth / 2 - 40; //make it constant ~~(window.innerWidth * 0.4);
      popOverHeight = ~~(window.innerHeight - 60);
      popOverLeft = triggerLeft + triggerWidth + 20;
      popOverTop = 60;
      arrowLeft = -10;
      arrowTop = ~~triggerTop + triggerHeight / 2 - 70;
    }

    return {
      popOverTop,
      popOverLeft,
      popOverHeight,
      popOverWidth,
      arrowTop,
      arrowLeft,
    };
  };

  //   This closes the popover
  closePopover = () => {
    this.props.closePopOver();
  };

  render() {
    const { show } = this.props;
    // return early on no show
    if (!show) {
      return null;
    }
    const { isMobile } = this.props;
    const arrowClass = isMobile ? style.upArrow : style.leftArrow;
    const {
      popOverTop,
      popOverLeft,
      popOverHeight,
      popOverWidth,
      arrowTop,
      arrowLeft,
    } = this.calculatePopOverPosition(
      this.props.triggerTop,
      this.props.triggerLeft,
      this.props.triggerWidth,
      this.props.triggerHeight,
      this.props.isMobile
    );

    // create style objects for popover and arrow
    const popOverStyle = {
      top: popOverTop + 'px',
      left: popOverLeft + 'px',
      width: popOverWidth + 'px',
      height: popOverHeight + 'px',
    };
    const arrowStyles = {
      top: arrowTop + 'px',
      left: arrowLeft + 'px',
    };

    return (
      <div className={style.popOver} style={popOverStyle}>
        <div className={arrowClass} style={arrowStyles} />
        <div
          className={style.closeButton}
          onClick={this.closePopover}
          id="popoverCloseButton"
        />
        {this.props.children}
      </div>
    );
  }
}

export default Popover;

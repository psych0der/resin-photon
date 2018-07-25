// @flow
import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import {
  Popover,
  RadialSlider,
  TableWrapper,
  Retry,
  BrightnessSwatch,
} from '../../components';
import styles from './index.css';
import { ClipLoader } from 'react-spinners';

import * as Constants from '../../commons/constants';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  fetchCompleteData,
  setBrightness,
  setBulbName,
} from '../../redux/reducers/devices';

type Props = {
  devices: Object,
  fetchCompleteData: () => *,
  setBrightness: () => *,
  setBulbName: () => *,
};
type State = {
  showPopover: boolean,
  triggerTop?: number,
  triggerLeft?: number,
  triggerHeight?: number,
  triggerWidth?: number,
  targetDeviceData: null | Object,
};

export class Dashboard extends React.Component<Props, State> {
  state = {
    showPopover: false,
    triggerTop: 0,
    triggerLeft: 0,
    triggerHeight: 0,
    triggerWidth: 0,
    targetDeviceData: null,
  };

  /**
   * Handles toggling of switch buttons
   * Assumption: If the bulb is being turned on,
   * its brightness is set to 50%
   */
  handleBulbSwitchToggle = (id: number, state: boolean) => {
    this.props.setBrightness(id, state ? 50 : 0);
  };
  brightnessChange = (id: number, newValue: number) => {
    this.setState({
      targetDeviceData: {
        ...this.state.targetDeviceData,
        brightness: newValue,
      },
    });
    this.props.setBrightness(id, newValue);
  };

  /**
   * isIterim means that event fired on value change. We want
   * to update changes to redux only when input field is blurred
   * and not on every character change
   * @memberof Dashboard
   */
  handleBulbNameChange = (
    id: number,
    name: string,
    isInterim: boolean = true
  ) => {
    this.setState({
      targetDeviceData: {
        ...this.state.targetDeviceData,
        name,
      },
    });
    if (!isInterim) this.props.setBulbName(id, name);
  };

  /* Close Popover */
  closePopOver = () => {
    this.setState({
      showPopover: false,
      triggerTop: 0,
      triggerLeft: 0,
      triggerHeight: 0,
      triggerWidth: 0,
    });
  };
  handleRowClick = (data: Object, e: Event) => {
    /**
     * We want to capture dimensions of table row and not of anchor tag
     * Table element of rendition library attaches event on anchor tags and not
     * on whole row
     */
    let targetNode = e.currentTarget;
    let targetNodeType = e.currentTarget.tagName;
    if (targetNodeType === 'A') {
      targetNode = e.currentTarget.parentNode;
    }
    let containerDimensions = targetNode.getBoundingClientRect();
    this.setState({
      showPopover: true,
      triggerTop: containerDimensions.top,
      triggerLeft: containerDimensions.left,
      triggerHeight: containerDimensions.height,
      triggerWidth: containerDimensions.width,
      targetDeviceData: data,
    });
  };

  componentDidMount() {
    // fetch bulb data as component is mounted
    this.props.fetchCompleteData();
  }
  requestBulbData = () => {
    this.props.fetchCompleteData();
  };

  render() {
    const isMobile = window.innerWidth <= 760;
    const {
      fetchCompleteDataState: fetchState,
      dataHash,
      dataOrder,
    } = this.props.devices;

    const {
      showPopover,
      targetDeviceData,
      triggerTop,
      triggerLeft,
      triggerHeight,
      triggerWidth,
    } = this.state;

    // create slider element if possible
    let slider = null;
    if (showPopover) {
      slider = (
        <RadialSlider
          value={targetDeviceData.brightness}
          handleChange={newValue => {
            this.brightnessChange(targetDeviceData.id, newValue);
          }}
        >
          <BrightnessSwatch brightness={targetDeviceData.brightness} />
        </RadialSlider>
      );
    }

    let dashboardContent = null;
    if (fetchState === Constants.IN_PROGRESS) {
      dashboardContent = (
        <div className={styles.loadingContainer}>
          <ClipLoader color={'#444'} className={styles.loadingSpinner} />
          <div className={styles.loadingText}>Loading data ...</div>
        </div>
      );
    } else if (fetchState === Constants.FAILED) {
      dashboardContent = <Retry handleRetry={this.requestBulbData} />;
    } else if (fetchState === Constants.SUCCESS) {
      dashboardContent = (
        <div className={styles.dataContainer}>
          <TableWrapper
            data={dataOrder.map((id, index) => dataHash[id])}
            handleRowClick={this.handleRowClick}
            handleBulbNameChange={this.handleBulbNameChange}
            handleBulbSwitchToggle={this.handleBulbSwitchToggle}
          />
        </div>
      );
    }
    return (
      <div className={styles.dashboardContainer}>
        <Container>
          <Row>
            <Col lg={6} style={{ overflow: 'scroll' }}>
              <div>{dashboardContent}</div>
            </Col>
          </Row>
        </Container>
        <Popover
          show={showPopover}
          triggerTop={triggerTop}
          triggerLeft={triggerLeft}
          triggerHeight={triggerHeight}
          triggerWidth={triggerWidth}
          isMobile={isMobile}
          closePopOver={this.closePopOver}
        >
          {slider}
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = ({ devices }) => ({ devices });

// connect redux to the container
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCompleteData,
      setBrightness,
      setBulbName,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

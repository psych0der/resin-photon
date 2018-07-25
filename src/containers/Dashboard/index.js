// @flow
import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { IosSwitch, Popover, RadialSlider } from '../../components';
import styles from './index.css';
import { Button, Table, Input } from 'rendition';
import { ClipLoader } from 'react-spinners';
import FaRefresh from 'react-icons/lib/fa/refresh';
import FaSunO from 'react-icons/lib/fa/sun-o';

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
    let containerDimensions = e.currentTarget.getBoundingClientRect();
    this.setState({
      showPopover: true,
      triggerTop: containerDimensions.top,
      triggerLeft: containerDimensions.left,
      triggerHeight: containerDimensions.height,
      triggerWidth: containerDimensions.width,
      targetDeviceData: data,
    });
  };

  TableColumns = [
    {
      field: 'name',
      label: 'Room',
      sortable: true,
      render: (value: string, all: Object) => (
        <span style={{ fontWeight: 700 }}>
          {' '}
          <Input
            m={2}
            onBlur={(e: Event) => {
              this.handleBulbNameChange(all.id, e.target.value, false);
            }}
            onChange={(e: Event) => {
              this.handleBulbNameChange(all.id, e.target.value, false);
            }}
            placeholder="Placeholder Text"
            value={value}
          />
        </span>
      ),
    },
    {
      field: 'active',
      label: 'State',
      sortable: false,
      render: (value: boolean, all: Object) => {
        let switchState = value;
        if (all.brightness === 0) {
          switchState = false;
        }
        return (
          <IosSwitch
            handleChange={(state: boolean) => {
              this.handleBulbSwitchToggle(all.id, state);
            }}
            sequence={all.id}
            checked={switchState}
            small={true}
          />
        );
      },
    },
    {
      field: 'brightness',
      label: 'Brightness',
      sortable: false,
      render: (value: number, all: Object) => {
        // Make brightness 0 if bulb is switched off
        let brightness = value;
        if (!all.active) {
          brightness = 0;
        }
        return <span>{`${brightness}%`}</span>;
      },
    },
  ];

  componentDidMount() {
    // fetch bulb data as component is mounted
    this.props.fetchCompleteData();
  }
  requestBulbData = () => {
    console.log('fetching ....');
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

    let slider = null;
    if (showPopover) {
      slider = (
        <RadialSlider
          value={targetDeviceData.brightness}
          handleChange={newValue => {
            this.brightnessChange(targetDeviceData.id, newValue);
          }}
        >
          <div style={{ color: '#FFF', textAlign: 'center' }}>
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: '#DEB440' }}>
                <FaSunO />
              </span>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <span style={{ fontWeight: 700, fontSize: '20px' }}>{`${
                targetDeviceData.brightness
              }`}</span>%
            </div>
            <div style={{ fontSize: '14px' }}>Brightness</div>
          </div>
        </RadialSlider>
      );
    }

    let dashboardContent = null;
    if (fetchState == Constants.IN_PROGRESS) {
      dashboardContent = (
        <div className={styles.loadingContainer}>
          <ClipLoader color={'#444'} className={styles.loadingSpinner} />
          <div className={styles.loadingText}>Loading data ...</div>
        </div>
      );
    } else if (fetchState === Constants.FAILED) {
      dashboardContent = (
        <div className={styles.retryContainer}>
          <div className={styles.failedText}>Error: Unable to fetch data</div>
          <Button m={2} emphasized tertiary onClick={this.requestBulbData}>
            <span style={{ marginRight: '5px' }}>Retry</span> <FaRefresh />
          </Button>
        </div>
      );
    } else if (fetchState == Constants.SUCCESS) {
      dashboardContent = (
        <div className={styles.dataContainer}>
          <Table
            columns={this.TableColumns}
            data={dataOrder.map((id, index) => dataHash[id])}
            onRowClick={this.handleRowClick}
          />
        </div>
      );
    }
    return (
      <div className={styles.dashboardContainer}>
        <Container>
          <Row>
            <Col sm={6}>
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

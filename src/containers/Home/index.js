// @flow
import React from 'react';
import { RadialSlider, IosSwitch } from '../../components';
import { Dashboard } from '../../containers';
import { getFormatedDate, formatAMPM } from '../../commons/helpers';
import { Navbar, DropDownButton, Img, Link } from 'rendition';
import styles from './index.css';
type Props = {};
type State = {
  changeValue: number,
};

export class Home extends React.Component<Props, State> {
  state = { changeValue: 0 };
  handleChange = changeValue => {
    this.setState({ changeValue });
  };
  render() {
    const now = new Date();
    const navBackgrounColor = '#222222';
    const navBarTextColor = '#aaa';
    const currentDate = <div>{getFormatedDate(now)}</div>;
    const currentTime = (
      <span
        style={{
          position: 'absolute',
          display: 'inlineBlock',
          textAlign: 'center',
          left: '50%',
        }}
      >
        {formatAMPM(now)}
      </span>
    );
    return (
      <div className={styles.someClass}>
        <Navbar
          color="white"
          brand={currentDate}
          bg={navBackgrounColor}
          p="10px"
          style={{ height: '50px' }}
          fontSize="12px"
          color={navBarTextColor}
        >
          {currentTime}
          <Link />
          <Link />
        </Navbar>
        <Dashboard />
      </div>
    );
  }
}

export default Home;

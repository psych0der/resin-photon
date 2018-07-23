import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.css';

export class Home extends React.Component {
  render() {
    return <div className={styles.someClass}>Home</div>;
  }
}

Home.propTypes = {};

export default Home;

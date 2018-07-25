// @flow
import React from 'react';
import styles from './index.css';

import FaRefresh from 'react-icons/lib/fa/refresh';
import { Button } from 'rendition';
type Props = {
  handleRetry: () => *,
};

const Retry = (props: Props) => {
  return (
    <div className={styles.retryContainer}>
      <div className={styles.failedText}>Error: Unable to fetch data</div>
      <Button m={2} emphasized tertiary onClick={props.handleRetry}>
        <span style={{ marginRight: '5px' }}>Retry</span> <FaRefresh />
      </Button>
    </div>
  );
};

export default Retry;

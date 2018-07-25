import React from 'react';
import FaSunO from 'react-icons/lib/fa/sun-o';
type Props = {
  brightness: number,
};

const BrightnessSwatch = (props: Props) => {
  return (
    <div style={{ color: '#FFF', textAlign: 'center' }}>
      <div style={{ marginBottom: '5px' }}>
        <span style={{ color: '#DEB440' }}>
          <FaSunO />
        </span>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <span style={{ fontWeight: 700, fontSize: '20px' }}>{`${
          props.brightness
        }`}</span>%
      </div>
      <div style={{ fontSize: '14px' }}>Brightness</div>
    </div>
  );
};

export default BrightnessSwatch;

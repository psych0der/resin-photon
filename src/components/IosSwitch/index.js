// @flow
import React from 'react';
import style from './index.css';

type Props = {
  sequence?: string | number,
  handleChange?: () => *,
  defaultChecked?: boolean,
  handleChange?: () => *,
};

type State = {
  checked: boolean,
};

class IosSwitch extends React.Component<Props, State> {
  static defaultProps = {
    sequence: 0,
    defaultChecked: false,
    handleChange: () => {},
  };

  state = { checked: this.props.defaultChecked };

  onChange = () => {
    const newValue = !this.state.checked;
    // setState is not synchronous. So we need to preserve the value
    this.setState({ checked: newValue });
    this.props.handleChange(newValue);
  };

  render() {
    return (
      <div className="iosSwitch">
        <input
          className={style.iosSwitch}
          type="checkbox"
          id={`iosSwitch-${this.props.sequence}`}
          onChange={this.onChange}
          defaultChecked={this.props.defaultChecked}
        />
        <label htmlFor={`iosSwitch-${this.props.sequence}`} />
      </div>
    );
  }
}

export default IosSwitch;

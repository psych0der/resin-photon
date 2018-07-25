// @flow
import React from 'react';
import { Table, Input } from 'rendition';
import { IosSwitch } from '../index';
type Props = {
  handleBulbNameChange: () => *,
  handleBulbSwitchToggle: () => *,
  handleRowClick: () => *,
  data: Array,
};
class TableWrapper extends React.Component<Props> {
  // Definition of table columns for rendering Table
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
              this.props.handleBulbNameChange(all.id, e.target.value, false);
            }}
            onChange={(e: Event) => {
              this.props.handleBulbNameChange(all.id, e.target.value, false);
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
              this.props.handleBulbSwitchToggle(all.id, state);
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
  render() {
    return (
      <Table
        columns={this.TableColumns}
        data={this.props.data}
        onRowClick={this.props.handleRowClick}
      />
    );
  }
}

export default TableWrapper;

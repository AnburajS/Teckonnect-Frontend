import React from 'react';
import Select from 'react-select';
import classes from '../components/FormElements/Element.module.scss';
import { useState } from 'react';

const BulkAction = (props) => {
  const {
    config,
    onClickCheckbox,
    onFilterChange,
    checkBoxInfo,
    bulkSubmitHandler,
  } = props;
  const [selectedValue, setSelectedValue] = useState(config.defaultValue);
  const [key, setKey] = useState(0);
  const customStyles = {
    control: (_, { selectProps: { width } }) => ({
      width: width,
      display: 'flex',
      zIndex: 101,
    }),
  };
  const handleGoButtonClick = () => {
    bulkSubmitHandler();
    setSelectedValue(config.defaultValue);
    setKey((prevKey) => prevKey + 1);
  };

  const filteredOptions = checkBoxInfo.bulkState ? config.dropdownOptions : [];

  return (
    <React.Fragment>
      <div
        className="input-group"
        style={{
          width: 'inherit',
          outline: '1px solid #dddddd',
          borderRadius: '7px',
          zIndex: 100,
        }}
      >
        <div
          className="input-group-prepend align-self-center"
          style={{ padding: '0px 0.5rem' }}
        >
          <input
            type="checkbox"
            name="bulkUpdt"
            checked={checkBoxInfo.bulkState}
            onClick={(event) => onClickCheckbox(event)}
          />
        </div>
        <Select
          key={key}
          options={filteredOptions}
          placeholder=""
          classNamePrefix="eep_select_common contact_number"
          className={`form-control p-0 basic-single reloadSelectField  ${classes.formControl}`}
          menuPlacement="bottom"
          onChange={(event) => {
            onFilterChange(event);
            setSelectedValue(event);
          }}
          defaultValue={selectedValue}
          isDisabled={!checkBoxInfo.bulkState}
          width="120px"
          styles={customStyles}
        />
        <div className="input-group-append">
          {/* <span
            className="input-group-text c1"
            style={{
              padding: "0.2rem 0.5rem",
              border: "unset",
              backgroundColor: "#588e21",
              color: "#ffffff",
              userSelect: "none",
            }}
          >
            Go
          </span> */}
          <button
            // className="eep-btn eep-btn-go c1"
            className={`eep-btn eep-btn-go ${
              !checkBoxInfo.bulkState ? 'cursor_default' : ''
            }`}
            disabled={!checkBoxInfo.bulkState}
            onClick={handleGoButtonClick}
          >
            Go
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export default BulkAction;

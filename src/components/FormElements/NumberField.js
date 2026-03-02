import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { FormContext } from '../FormElements/FormContext';
import classes from './Element.module.scss';

const TextField = (props) => {
  const { field, submitted, maxLength } = props;
  const initValue = field.value && field.value !== undefined ? field.value : '';

  const [value, setValue] = useState(initValue);

  //   const initValue = field.value && field.value !== undefined ? field.value : "";

  //   const [value, setValue] = useState(initValue);

  const [fieldTouched, setFieldTouched] = useState(false);

  const valueIsValid =
    (typeof value === 'string' && value.trim() !== '') ||
    (typeof value === 'number' && value !== undefined);
  const inputIsInvalid = !valueIsValid && fieldTouched && field.mandatory;

  const { handleChange } = useContext(FormContext);
  const [countryCodeData, setCountryCodeData] = useState([]);

  const [showSelect, setShowSelect] = useState(false);

  const [countryCodeDefault, setCountryCodeDefault] = useState({
    value: '+91',
    label: '+91',
  });

  const [countryCode, setCountryCode] = useState(countryCodeDefault);
  const [defCountryCode, setDefCountryCode] = useState(null);

  useEffect(() => {
    //setShowSelect(false);
    const subFieldValue = {
      value: field.subField.value,
      label: field.subField.value,
    };
    const initCountryCode = field.subField.value
      ? { value: field.subField.value, label: field.subField.value }
      : countryCodeDefault;
    setCountryCode(initCountryCode);
    // handleChange(field.subField, countryCodeDefault.value);
    setTimeout(() => {
      setShowSelect(true);
    }, 500);
  }, [countryCodeDefault, field.subField.value]);

  const fetchCountryCodeData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/countryCodes.json`)
      .then((response) => response.json())
      .then((data) => {
        setCountryCodeData(data.countryCode.values);
        setCountryCodeDefault(data.countryCode.default);
        // setDefCountryCode(initCountryCode);
      });
  };

  useEffect(() => {
    fetchCountryCodeData();
  }, []);

  useEffect(() => {
    if (submitted) {
      setFieldTouched(true);
    }
  }, [submitted]);

  useEffect(() => {
    const value = initValue ? initValue : '';
    setValue(value);
  }, [initValue]);

  const onChangeHandler = (field, event) => {
    if (!isNaN(+event.target.value)) {
      setValue(event.target.value);
      handleChange(field, event.target.value);
    }
    //setValue(event.target.value);
    //handleChange(field, event);
  };

  const onChangeCountryHandler = (field, event) => {
    //setValue(event.target.value);

    setCountryCode(event);
    handleChange(field.subField, event.value);
  };

  const onBlurHandler = () => {
    setFieldTouched(true);
  };

  const fieldClasses = inputIsInvalid ? `${'invalid'}` : '';

  return (
    <div
      className={`col-md-12 form-group text-left ${fieldClasses} ${
        field.mandatory ? 'required' : ''
      }`}
    >
      <label className="control-label">{field.label}</label>
      <div className="input-group">
        <div
          className="input-group-prepend"
          style={{
            width:
              field.contactNumber && field.subField.type === 'text'
                ? '15%'
                : 'auto',
          }}
        >
          {showSelect &&
            field.contactNumber &&
            field.subField.type === 'select' && (
              <Select
                options={countryCodeData}
                placeholder=""
                classNamePrefix="eep_select_common contact_number"
                className={`form-control a_designation basic-single ${classes.formControl}`}
                style={{ height: 'auto' }}
                menuPlacement="top"
                onChange={(event) => onChangeCountryHandler(field, event)}
                value={countryCode}
                maxMenuHeight={150}
              />
            )}
          {field.contactNumber && field.subField.type === 'text' && (
            <div>
              <input
                type="text"
                className="form-control text-center"
                name={field.subField.name}
                value={field.subField.value}
                disabled={true}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          className="form-control"
          name={field.name}
          placeholder={field.label}
          value={value}
          maxLength={maxLength}
          // onChange={(event) => handleChange(field, event)}
          onChange={(event) => onChangeHandler(field, event)}
          onBlur={onBlurHandler}
          disabled={'disabled' in field ? field['disabled'] : false}
          style={{ height: 'auto' }}
          autoComplete="off"
        />
      </div>
      {inputIsInvalid && (
        <div>
          <span
            className="login_error un_error text-danger ereorMsg"
            style={{ display: 'inline' }}
          >
            {field.label} cannot be empty
          </span>
        </div>
      )}
    </div>
  );
};
export default TextField;

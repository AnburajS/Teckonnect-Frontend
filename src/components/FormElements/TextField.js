import React, { useContext, useEffect, useState } from 'react';
import { FormContext } from '../FormElements/FormContext';

const TextField = (props) => {
  const { field, submitted } = props;
  const initValue = field.value && field.value !== undefined ? field.value : '';

  const [value, setValue] = useState(initValue);
  const [fieldTouched, setFieldTouched] = useState(false);

  const valueIsValid =
    (typeof value === 'string' && value.trim() !== '') ||
    (typeof value === 'number' && value !== undefined);
  const inputIsInvalid = !valueIsValid && fieldTouched && field.mandatory;

  const { handleChange } = useContext(FormContext);

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
    setValue(event.target.value);
    handleChange(field, event.target.value);
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
        <input
          type="text"
          className="form-control "
          name={field.name}
          placeholder={field.label}
          value={value}
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

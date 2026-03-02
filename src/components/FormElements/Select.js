import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { FormContext } from './FormContext';
import classes from './Element.module.scss';
import { httpHandler } from '../../http/http-interceptor';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SelectDropdown = (props) => {
  const { field, submitted } = props;
  const { RESTConfig = {} } = field;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const initValue = field.value && field.value !== undefined ? field.value : '';
  const [value, setValue] = useState(initValue);

  const [defaultValue, setDefaultValue] = useState(null);
  const [options, setOptions] = useState([]);

  const [fieldTouched, setFieldTouched] = useState(false);

  useEffect(() => {
    setValue(initValue);
  }, [field.value]);
  useEffect(() => {
    setOptions(field.options ? field.options : []);
  }, [field.options]);

  const valueIsValid =
    (value && typeof value === 'string' && value.trim() !== '') ||
    (typeof value === 'number' && value) ||
    (typeof value === 'object' && Object.keys(value).length);

  const inputIsInvalid = !valueIsValid && fieldTouched;
  const { handleChange } = useContext(FormContext);

  useEffect(() => {
    if (submitted) {
      setFieldTouched(true);
    }
  }, [submitted]);

  useEffect(() => {
    const value = initValue ? initValue : '';
    if (
      RESTConfig &&
      RESTConfig.value &&
      RESTConfig.value.indexOf('.') !== -1
    ) {
      const entries = RESTConfig.value.split('.');
      entries.shift();

      setValue(value[entries[0]]);
    } else {
      setValue(value);
    }
  }, [initValue, RESTConfig]);

  useEffect(() => {
    const stringValue = value;
    const filterValue = options.filter((res) => res.value == stringValue);
    const defaultValue = filterValue.length ? filterValue[0] : null;
    setDefaultValue(defaultValue);
  }, [options, value]);

  useEffect(() => {
    if (RESTConfig?.url) {
      getDropdownOptions();
    }
  }, []);

  const getValue = (key, data) => {
    const entries = key.value.split('.');
    entries.shift();
    let value = Object.assign({}, data);
    for (const field of entries) {
      if (value[field]) {
        value = value[field];
      } else {
        return null;
      }
    }
    return value;
  };
  // const currentUserData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};

  const getDropdownOptions = () => {
    const obj = {
      url: RESTConfig.url,
      method: RESTConfig.method,
    };
    httpHandler(obj)
      .then(({ data }) => {
        // setUserData(userData.data);
        const dropdownValues = [];
        data.map((res) => {
          let label = '';
          if (!RESTConfig.labelFormattingExists) {
            label = res[RESTConfig.label];
          } else {
            const paramsPattern = /[^{\}]+(?=})/g;
            let extractParams = RESTConfig.label.match(paramsPattern);
            let formattedLabel = (' ' + RESTConfig.label).slice(1);
            extractParams &&
              extractParams.map((string) => {
                formattedLabel = formattedLabel.replace(
                  '{' + string + '}',
                  res[string]
                );

                label = formattedLabel;
              });
          }
          // let labelOptions = RESTConfig?.value === "manager.id" ? (res?.username === currentUserData?.username ? ' ' : res?.fullName) : label
          dropdownValues.push({
            label: label,
            value:
              RESTConfig.value.indexOf('.') === -1
                ? res[RESTConfig.value]
                : getValue(RESTConfig, res),
          });
        });

        setOptions(dropdownValues);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  const onChangeHandler = (field, event) => {
    const value1 = event ? event.value : '';
    setValue(value1);
    if (
      RESTConfig &&
      RESTConfig.value &&
      RESTConfig.value.indexOf('.') !== -1
    ) {
      let obj = null;
      const entries = RESTConfig.value.split('.');
      entries.shift();
      if (value1) {
        obj = {};
        obj[entries[0]] = value1;
      } else {
        obj = null;
      }

      handleChange(field, obj);
    } else {
      handleChange(field, value1);
    }

    setFieldTouched(true);
  };

  const onBlurHandler = () => {
    setFieldTouched(true);
  };

  const fieldClasses = inputIsInvalid ? `${'invalid'}` : '';

  // check option => label conatains empty string
  const validOption = options.filter((option) => option.label.trim() !== '');

  return (
    <div
      className={`col-md-12 form-group text-left selectField-withReload ${fieldClasses} ${
        field.mandatory ? 'required' : ''
      }`}
    >
      <label className="control-label">{field.label}</label>
      <div className="input-group">
        {options && !defaultValue && (
          <Select
            defaultValue={value}
            value={value}
            options={validOption}
            isSearchable={true}
            className={`form-control basic-single ${
              field.reloadData ? 'reloadSelectField' : ''
            } ${classes.formControl}`}
            name={field.name}
            id={field.name}
            onChange={(event) => onChangeHandler(field, event)}
            onBlur={onBlurHandler}
            disabled={'disabled' in field ? field['disabled'] : false}
            classNamePrefix="eep_select_common select"
            isClearable={true}
            style={{ height: 'auto' }}
            maxMenuHeight={150}
            placeholder={'Select'}
          />
        )}
        {options && defaultValue && (
          <Select
            options={validOption}
            isSearchable={true}
            className={`form-control basic-single ${
              field.reloadData ? 'reloadSelectField' : ''
            } ${classes.formControl}`}
            name={field.name}
            id={field.name}
            defaultValue={defaultValue ? defaultValue : null}
            onChange={(event) => onChangeHandler(field, event)}
            onBlur={onBlurHandler}
            disabled={'disabled' in field ? field['disabled'] : false}
            classNamePrefix="eep_select_common select"
            isClearable={true}
            style={{ height: 'auto' }}
            maxMenuHeight={150}
          />
        )}

        {/* {field.reloadData && (
          <div className="input-group-addon">
            <Link
              to="#"
              className="addon_clr"
              dangerouslySetInnerHTML={{
                __html: svgIcons && svgIcons.refresh_icon,
              }}
              onClick={getDropdownOptions}
            ></Link>
          </div>
        )} */}
      </div>

      {inputIsInvalid && field.mandatory && (
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
export default SelectDropdown;

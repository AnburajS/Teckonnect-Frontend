// import { getRoles } from '@crayond_dev/idm-client';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { getRolesInApp } from '../../helpers';
import classes from './Element.module.scss';
import { FormContext } from './FormContext';

const SelectDropdownIdm = (props) => {
  const { field, submitted } = props;

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [value, setValue] = useState({});
  const [fieldTouched, setFieldTouched] = useState(false);

  const [options, setOptions] = useState([]);

  const valueIsValid =
    (value && typeof value === 'string' && value.trim() !== '') ||
    (typeof value === 'number' && value) ||
    (typeof value === 'object' && Object.keys(value).length);
  const inputIsInvalid = !valueIsValid && fieldTouched;
  const { handleChange } = useContext(FormContext);

  useEffect(() => {
    if (field?.value) {
      setValue({
        label: field?.value?.label || field?.value?.roleName,
        value: field?.value?.value || field?.value?.idm_id,
      });
    }
  }, [field?.value]);

  const getRolesFun = async () => {
    const role = await getRolesInApp(1);
    //const roles = await getRoles({ apiKey: "ASC4PK0UVE5OOCO8NK" });

    const data = role?.map((v) => {
      return {
        label: v?.role_name,
        value: v?.id,
      };
    });
    if (data?.length > 0) {
      setOptions(data);
    }
  };

  const onChangeHandler = (field, event) => {
    const value1 = event ? event : '';
    setValue(value1);
    handleChange(field, value1);
    setFieldTouched(true);
  };

  const onBlurHandler = () => {
    setFieldTouched(true);
  };

  useEffect(() => {
    getRolesFun();
  }, []);

  const fieldClasses = inputIsInvalid ? `${'invalid'}` : '';

  return (
    <div
      className={`col-md-12 form-group text-left selectField-withReload ${fieldClasses} ${
        field.mandatory ? 'required' : ''
      }`}
    >
      <label className="control-label">{field.label}</label>
      <div className="input-group">
        {options && (
          <Select
            value={value}
            options={options}
            isSearchable={true}
            placeholder="Select..."
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
              onClick={getRolesFun}
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
export default SelectDropdownIdm;

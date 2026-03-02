import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { FormContext } from './FormContext';

const Password = (props) => {
  const { field, submitted } = props;
  const initValue = field.value && field.value !== undefined ? field.value : '';
  const [togglePWIcon, setTogglePWIcon] = useState(true);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const pwBgImage = togglePWIcon
    ? '/images/pw_hide.svg'
    : '/images/pw_show.svg';

  const [value, setValue] = useState(initValue);
  const [fieldTouched, setFieldTouched] = useState(false);
  const [inputIsInvalid, setInputIsInvalid] = useState(false);

  // const inputIsInvalid = !valueIsValid && fieldTouched;

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const { handleChange } = useContext(FormContext);

  //const [fieldType, setFieldType] = useState(field.type);

  const passwordToggleHandler = () => {
    setTogglePWIcon(!togglePWIcon);
  };

  useEffect(() => {
    const valueIsValid = value.trim() !== '';
    const inputIsInvalidTest = !valueIsValid && fieldTouched;
    setInputIsInvalid(inputIsInvalidTest);
    if (!inputIsInvalidTest) {
      // const passwordValid = new RegExp(
      //   /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/g
      // ).test(value);
      const passwordValid = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8}$/,
      ).test(value);

      setIsPasswordValid(passwordValid);
      // if( !props?.field?.disabled){
      //   setIsPasswordValid(passwordValid);
      // }
      if (passwordValid) {
        handleChange(field, value);
      } else {
        handleChange(field, null);
      }
    } else {
      handleChange(field, null);
    }
  }, [value, fieldTouched]);

  useEffect(() => {
    if (submitted) {
      setFieldTouched(true);
    }
  }, [submitted]);

  const onChangeHandler = (event) => {
    setValue(event.target.value);
  };

  const onBlurHandler = () => {
    setFieldTouched(true);
  };

  const fieldClasses = inputIsInvalid ? `${'invalid'}` : '';

  return (
    <React.Fragment>
      <ReactTooltip
        effect="solid"
        className="toolTipSize"
      />

      <div
        className={`col-md-12 form-group text-left ${fieldClasses} ${
          field.mandatory ? 'required' : ''
        }`}
      >
        <label className="control-label mr-2">{field.label}</label>
        <span
          className=""
          data-tip="The minimum password length is 8 characters and must contain 1 capital letter 1 number and 1 special character."
          dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.info_icon }}
        ></span>
        <div
          className="input-group"
          id="show_hide_password"
        >
          <input
            className="form-control a_upassword"
            type={togglePWIcon ? 'password' : 'text'}
            name={field.name}
            placeholder={field.label}
            value={value}
            onChange={(event) => onChangeHandler(event)}
            onBlur={onBlurHandler}
            // disabled={"disabled" in field ? field["disabled"] : false}
            disabled={field.disabled ? field.disabled : false}
            autoComplete="new-password"
            style={{ maxWidth: 'calc(100% - 44px)' }}
          />
          <div className="input-group-addon bg-white">
            <div
              className="icon-place-holder"
              style={{
                backgroundImage: `url(${
                  process.env.PUBLIC_URL + `${pwBgImage}`
                })`,
              }}
              onClick={passwordToggleHandler}
            ></div>
          </div>
        </div>
        {inputIsInvalid && (
          <div>
            <span
              className="login_error un_error text-danger ereorMsg"
              style={{ display: 'inline' }}
            >
              {/* {field.label} cannot be empty */}
              Password cannot be empty
            </span>
          </div>
        )}

        {!inputIsInvalid && !isPasswordValid && fieldTouched && (
          <div>
            <span
              className="login_error un_error text-danger ereorMsg"
              style={{ display: 'inline' }}
            >
              {/* {field.label} in invalid. */}
              Password must be exactly 8 characters and include 1 uppercase
              letter, 1 lowercase letter, 1 number, and 1 special character.
            </span>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default Password;

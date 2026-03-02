import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "./FormContext";

const TextArea = (props) => {
  const { field } = props;
  const initValue = field.value && field.value !== undefined ? field.value : "";
  const [value, setValue] = useState(initValue);
  useEffect(() => {
    const value = initValue ? initValue : "";
    setValue(value);
  }, [initValue]);

  const { handleChange } = useContext(FormContext);
  const onChangeHandler = (field, event) => {
    setValue(event.target.value);
    //handleChange(field, event);
    handleChange(field, event.target.value);
  };

  return (
    <div
      className={`col-md-12 form-group text-left ${
        field.mandatory ? "required" : ""
      }`}
    >
      <label className="control-label">{field.label}</label>
      <textarea
        className="form-control "
        name={field.name}
        placeholder={field.label}
        value={value}
        onChange={(event) => onChangeHandler(field, event)}
        disabled={"disabled" in field ? field["disabled"] : false}
      />
    </div>
  );
};
export default TextArea;

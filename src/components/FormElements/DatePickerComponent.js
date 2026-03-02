import React, { useState, useContext, useEffect } from "react";
// import moment from "moment";
// import "../../../node_modules/react-datepicker/dist/react-datepicker.min.js";
// import "../../../node_modules/react-datepicker/dist/react-datepicker.min.css";
import DatePicker from "react-datepicker";
import { FormContext } from "./FormContext";
import { addMonths, subMonths, subYears, addYears } from "date-fns";

const DatePickerComponent = (props) => {
  const { field, submitted, dateMin } = props;

  const [startDate, setStartDate] = useState();
  const [fieldTouched, setFieldTouched] = useState(false);
  const valueIsValid = startDate ? true : false;
  const inputIsInvalid = !valueIsValid && fieldTouched;
  const { handleChange } = useContext(FormContext);
  useEffect(() => {
    const initValue = field.value ? new Date(field.value) : null;
    setStartDate(initValue);
  }, [field.value]);

  useEffect(() => {
    if (submitted) {
      setFieldTouched(true);
    }
  }, [submitted]);

  const onBlurHandler = () => {
    setFieldTouched(true);
  };

  const handleDatePickerChange = (date, event) => {
    debugger;
    setStartDate(date);

    handleChange(field, date?.toISOString()?.slice(0, 10));
  };

  const handleCalendarClose = () => {};

  const handleCalendarOpen = () => {};

  const fieldClasses = inputIsInvalid ? `${"invalid"}` : "";

  // sperate the date of joing & date of birth  to = years,months,date
  const date = new Date(dateMin?.value);
  const year = date.getFullYear();
  const month = date.getMonth();
  const dates = date.getDate();

  return (
    <div
      className={`col-md-12 form-group text-left ${
        field.mandatory ? "required" : ""
      }`}
    >
      <label className="control-label">{field.label}</label>
      <div className="eepCustomDatepicker">
        <DatePicker
          className="form-control "
          selected={startDate}
          onChange={(date, event) => handleDatePickerChange(date, event)}
          onBlur={onBlurHandler}
          onCalendarClose={handleCalendarClose}
          onCalendarOpen={handleCalendarOpen}
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          dropdownMode="select"
          peekNextMonth
          onKeyDown={(e) => e.preventDefault()}
          dateFormat="yyyy/MM/dd"
          disabled={"disabled" in field ? field["disabled"] : false}
          placeholderText="Select a date"
          minDate={
            field.min.subYear
              ? addYears(new Date(year, month, dates), field.min.val)
              : field.min.addMonth
              ? addYears(new Date(), field.min.val)
              : null
          }
          maxDate={
            field.max.subYear
              ? subYears(new Date(), field.max.val)
              : field.max.addMonth
              ? addMonths(new Date(), field.max.val)
              : null
          }
        />
      </div>
      {inputIsInvalid && (
        <div>
          <span
            className="login_error un_error text-danger ereorMsg"
            style={{ display: "inline" }}
          >
            {field.label} cannot be empty
          </span>
        </div>
      )}
    </div>
  );
};
export default DatePickerComponent;

import React from "react";
import DatePickerComponent from "./DatePickerComponent";
import Email from "./Email";
import FileField from "./FileField";
import NumberField from "./NumberField";
import Password from "./Password";
import SelectDropdown from "./Select";
import SignatureField from "./SignatureField";
import TextArea from "./TextArea";
import TextField from "./TextField";
import SelectDropdownIdm from "./idmSelect";

const Elements = ({ field, dateMin, submitted, onUpload, response, maxLength }) => {

  switch (field.type) {
    case "text":
      return field.display && <TextField field={field} submitted={submitted} />;
    case "textArea":
      return field.display && <TextArea field={field} submitted={submitted} />;
    case "select":
      return (
        field.display && <SelectDropdown field={field} submitted={submitted} />
      ); case "selectidm":
      return (
        field.display && <SelectDropdownIdm field={field} submitted={submitted} />
      );
    case "email":
      return field.display && <Email field={field} submitted={submitted} />;
    case "datePicker":
      return (
        field.display && (
          <React.Fragment>
            <div className="eepCustomDatepicker">
              <DatePickerComponent dateMin={dateMin} field={field} submitted={submitted} />
            </div>
          </React.Fragment>
        )
      );
    case "password":
      return field.display && <Password field={field} submitted={submitted} />;
    case "number":
      return (
        field.display && <NumberField maxLength={maxLength} field={field} submitted={submitted} />
      );
    case "file":
      return (
        field.display && (
          <FileField field={field} submitted={submitted} onUpload={onUpload} response={response} />
        )
      );
    case "signature":
      return (
        field.display && (<SignatureField field={field} submitted={submitted} />)
      );
    default:
      return <h1>Elements</h1>;
  }
};
export default Elements;

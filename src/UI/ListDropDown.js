import Select from 'react-select';
import classes from '../components/FormElements/Element.module.scss';

const ListDropDown = (props) => {
  const { config, onFilterChange } = props;

  const formatOptionLabel = ({ label, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <i
        className={`${icon}`}
        style={{ marginRight: 8 }}
      ></i>
      <span>{label}</span>
    </div>
  );

  return (
    <div
      className="d-inline-block eep_select_div"
      style={{ zIndex: 100 }}
    >
      <Select
        options={config.dropdownOptions}
        placeholder=""
        classNamePrefix="eep_select_common contact_number"
        className={`form-control py-0 a_designation basic-single ${classes.formControl}`}
        style={{ height: 'auto', zIndex: 101 }}
        menuPlacement="bottom"
        onChange={onFilterChange}
        defaultValue={config.defaultValue}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
};

export default ListDropDown;

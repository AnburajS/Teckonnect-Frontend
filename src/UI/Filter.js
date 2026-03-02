import Select from 'react-select';
import classes from '../components/FormElements/Element.module.scss';

const Filter = (props) => {
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
      style={{ zIndex: 100, border: 'none' }}
    >
      <Select
        options={config.dropdownOptions}
        placeholder=""
        classNamePrefix="eep-select"
        className={`form-control py-0 a_designation basic-single ${classes.formControl}`}
        styles={{
          control: (base, state) => ({
            ...base,
            border: `1px solid #ced4da`, // blue when focused, black otherwise
            boxShadow: 'none', // blue glow on focus
            '&:hover': {
              borderColor: 'none',
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#f4f4f4' : 'transparent',
            color: '#000',
            cursor: 'pointer',
            ':active': {
              backgroundColor: '#f4f4f4', // darker blue on click (optional)
            },
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menu: (base) => ({ ...base, zIndex: 9999 }), // optional but good
        }}
        menuPlacement="bottom"
        onChange={onFilterChange}
        defaultValue={config.defaultValue}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
};

export default Filter;

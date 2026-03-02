import Select from 'react-select';
import classes from '../components/FormElements/Element.module.scss';

const YearFilter = (props) => {
  const { onFilterChange } = props;

  const extOptions = [
    { value: 'old', label: 'Oldest' },
    { value: 'all', label: 'All' },
  ];
  var yrDt = new Date().getFullYear() + 1;
  let maxYearCount = 3;
  let yrArr = [];
  for (let yr = 0; yr < maxYearCount; yr++) {
    yrArr[yr] = { value: yrDt - 1, label: yrDt - 1 };
    yrDt--;
  }
  const filterOptions = yrArr.concat(extOptions);

  return (
    <div
      className="d-inline-block eep_select_div"
      style={{ zIndex: 100 }}
    >
      <Select
        options={filterOptions}
        placeholder=""
        classNamePrefix="eep_select_common contact_number"
        className={`form-control py-0 c1 basic-single ${classes.formControl}`}
        style={{ height: 'auto' }}
        menuPlacement="bottom"
        onChange={(event) => onFilterChange(event)}
        defaultValue={yrArr[0]}
      />
    </div>
  );
};
export default YearFilter;

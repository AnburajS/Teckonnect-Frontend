import Select from 'react-select';
import classes from '../components/FormElements/Element.module.scss';

const ForumYearFilter = ({ onFilterChange, value }) => {
  const extOptions = [
    { value: 'old', label: 'Oldest' },
    { value: 'all', label: 'All' },
  ];

  let yrDt = new Date().getFullYear() + 1;
  let maxYearCount = 3;
  let yrArr = [];

  for (let yr = 0; yr < maxYearCount; yr++) {
    yrArr[yr] = { value: yrDt - 1, label: yrDt - 1 };
    yrDt--;
  }

  const filterOptions = yrArr.concat(extOptions);

  const selectedOption =
    filterOptions.find((opt) => opt.value === value) || yrArr[0];

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
        menuPlacement="bottom"
        onChange={onFilterChange}
        value={selectedOption}
      />
    </div>
  );
};

export default ForumYearFilter;

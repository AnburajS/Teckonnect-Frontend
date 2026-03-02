import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import classes from '../components/FormElements/Element.module.scss';
import { formatFilterDate, formatDate } from '../shared/SharedService';
import { useTranslation } from 'react-i18next';
import { formatDates } from '../constants/utills';

const ForumTypeBasedFilter = (props) => {
  const { config, getFilterParams } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(formatFilterDate(new Date()));
  const [filterEndDate, setFilterEndDate] = useState(
    formatFilterDate(new Date()),
  );
  const [showFilter, setShowFilter] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    isDate: false,
    isbetweenDates: false,
    isMonth: true,
    isQuarter: false,
    isFourMonth: false,
    isHalfYear: false,
    isYear: true,
  });
  const STORAGE_KEY = 'FORUM_FILTER';

  const initCurrentMonth = new Date().getMonth() + 1;
  const initFullYear = new Date().getFullYear();
  // const [fullYear, setFullYear] = useState(initFullYear);
  // const [currentMonth, setCurrentMonth] = useState(initCurrentMonth);
  const savedFilter = JSON.parse(sessionStorage.getItem(STORAGE_KEY));

  const [fullYear, setFullYear] = useState(savedFilter?.year || initFullYear);
  const [currentMonth, setCurrentMonth] = useState(
    savedFilter?.month || initCurrentMonth,
  );
  const [currentQuarter, setCurrentQuarter] = useState(
    Math.floor((new Date().getMonth() + 3) / 3),
  );
  const [currentFourMonth, setCurrentFourMonth] = useState(
    Math.floor((new Date().getMonth() + 4) / 4),
  );
  const [currentHalfYear, setCurrentHalfYear] = useState(
    Math.floor((new Date().getMonth() + 6) / 6),
  );

  const { t } = useTranslation();

  const monthArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  // const [filterDispValue, setFilterDispValue] = useState(
  //   monthArr[initCurrentMonth - 1] + ', ' + initFullYear,
  // );
  const [filterDispValue, setFilterDispValue] = useState(
    savedFilter?.displayValue ||
      monthArr[initCurrentMonth - 1] + ', ' + initFullYear,
  );
  const quarterArr = [
    {
      //label: `${t(`monthFilter.Quarter`)} 1`,
      label: 'Q1',
      value: 'quarter1',
      quarterNo: 1,
    },
    {
      label: 'Q2',
      value: 'quarter2',
      quarterNo: 2,
    },
    {
      label: 'Q3',
      value: 'quarter3',
      quarterNo: 3,
    },
    {
      label: 'Q4',
      value: 'quarter4',
      quarterNo: 4,
    },
  ];

  const fourMonths = [
    {
      label: 'T1',
      value: 't1',
      fourMonthNo: 1,
    },
    {
      label: 'T2',
      value: 't2',
      fourMonthNo: 2,
    },
    {
      label: 'T3',
      value: 't3',
      fourMonthNo: 3,
    },
  ];

  const halfYear = [
    {
      label: 'H1',
      value: 'h1',
      halfYearNo: 1,
    },
    {
      label: 'H2',
      value: 'h2',
      halfYearNo: 2,
    },
  ];
  const onFilterChange = (arg) => {
    const obj = {
      isDate: false,
      isbetweenDates: false,
      isMonth: false,
      isQuarter: false,
      isFourMonth: false,
      isHalfYear: false,
      isYear: false,
    };

    if (arg.value === 'date') {
      obj.isDate = true;
    } else if (arg.value === 'betweenDates') {
      obj.isbetweenDates = true;
    } else if (arg.value === 'month') {
      obj.isMonth = true;
      obj.isYear = true;
    } else if (arg.value === 'quarter') {
      obj.isQuarter = true;
      obj.isYear = true;
    } else if (arg.value === 'fourMonths') {
      obj.isFourMonth = true;
      obj.isYear = true;
    } else if (arg.value === 'halfYear') {
      obj.isHalfYear = true;
      obj.isYear = true;
    } else if (arg.value === 'year') {
      obj.isYear = true;
    }
    setFilterSettings(obj);
  };

  const yearFilter = (e) => {
    if (e.target.value <= initFullYear) {
      setFullYear(e.target.value);
    }
  };

  const startDateOnChange = (date) => {
    //setFilterDate(formatFilterDate(date));
    setFilterDate(date);
    setStartDate(date);
  };

  const endDateOnChange = (date) => {
    //setFilterDate(formatFilterDate(date));
    setFilterEndDate(date);
    setEndDate(date);
  };

  const yearChange = (flag) => {
    setFullYear((prev) => {
      if (flag) {
        if (+prev !== +initFullYear) {
          return +prev + 1;
        }
        return prev;
      } else {
        return prev - 1;
      }
    });
  };

  const updateFilterDispValue = (arg) => {
    setFilterDispValue(arg);
  };

  const selectMonthHandler = (arg) => {
    setCurrentMonth(arg);
  };

  const selectQuarterHandler = (arg) => {
    setCurrentQuarter(arg.quarterNo);
  };

  const selectFourMonthHandler = (arg) => {
    setCurrentFourMonth(arg.fourMonthNo);
  };

  const selectHalfYearHandler = (arg) => {
    setCurrentHalfYear(arg.halfYearNo);
  };

  const submitFilterHandler = () => {
    const obj = {};
    if (filterSettings.isMonth) {
      obj.month = currentMonth;
      obj.year = fullYear;
      // updateFilterDispValue(monthArr[currentMonth - 1] + ',' + fullYear);
      const display = monthArr[currentMonth - 1] + ', ' + fullYear;
      updateFilterDispValue(display);
      obj.displayValue = display;
    } else if (filterSettings.isQuarter) {
      obj.quarter = quarterArr.filter(
        (res) => res.quarterNo === currentQuarter,
      )[0].value;
      obj.year = fullYear;
      updateFilterDispValue(
        quarterArr.filter((res) => res.quarterNo === currentQuarter)[0].label +
          ',' +
          fullYear,
      );
    } else if (filterSettings.isFourMonth) {
      obj.fourmonths = fourMonths.filter(
        (res) => res.fourMonthNo === currentFourMonth,
      )[0].value;
      obj.year = fullYear;
      updateFilterDispValue(
        fourMonths.filter((res) => res.fourMonthNo === currentFourMonth)[0]
          .label +
          ',' +
          fullYear,
      );
    } else if (filterSettings.isHalfYear) {
      obj.halfyear = halfYear.filter(
        (res) => res.halfYearNo === currentHalfYear,
      )[0].value;
      obj.year = fullYear;
      updateFilterDispValue(
        halfYear.filter((res) => res.halfYearNo === currentHalfYear)[0].label +
          ',' +
          fullYear,
      );
    } else if (filterSettings.isDate) {
      const currentDate = formatFilterDate(new Date());
      const startDate =
        formatFilterDate(filterDate) === null
          ? currentDate
          : formatFilterDate(filterDate);
      obj.date = startDate;
      updateFilterDispValue(formatDates(startDate, false, 'DD/MM/YYYY'));
    } else if (filterSettings.isbetweenDates) {
      const currentDate = formatFilterDate(new Date()); // Get current date
      const startDate =
        formatFilterDate(filterDate) == null
          ? currentDate
          : formatFilterDate(filterDate);
      const endDate =
        formatFilterDate(filterEndDate) === null
          ? currentDate
          : formatFilterDate(filterEndDate);

      // Check if formatFilterDate() returns an invalid date (NaN)

      obj.startdate = startDate;
      obj.enddate = endDate;
      const finalDate =
        formatDates(startDate, false, 'DD/MM/YYYY') +
        ' to ' +
        formatDates(endDate, false, 'DD/MM/YYYY');
      updateFilterDispValue(finalDate);
    } else if (filterSettings.isYear) {
      obj.year = fullYear;
      updateFilterDispValue(fullYear);
    } else {
      for (const prop of Object.getOwnPropertyNames(obj)) {
        delete obj[prop];
      }
    }
    getFilterParams(obj);
    setShowFilter(false);
  };

  const CustomInputStartDate = React.forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="input-group b-dbdbdb border_input">
        <button
          className="form-control bg-transparent border_none text-left"
          onClick={onClick}
          ref={ref}
        >
          {value ? value : 'Select Start Date'}
        </button>
        <span
          className="input-group-addon"
          dangerouslySetInnerHTML={{
            __html: svgIcons && svgIcons.calendar_icon,
          }}
        ></span>
      </div>
    );
  });

  const formatOptionLabel = ({ value, label }) => (
    <div style={{ display: 'flex' }}>
      <div>{t(`monthFilter.${label}`)}</div>
    </div>
  );

  return (
    <div className="eep-options-div ml-auto my-auto">
      <div
        className="d-inline-block pr-4 eep_select_div d_filterby_div"
        id="d_filterby_div"
      >
        <button
          type="button"
          className="btn d_filterby d-inline-flex align-items-center"
          onClick={() => setShowFilter(!showFilter)}
        >
          {/* <span className="d_filterby_txt">{monthArr[currentMonth - 1]}, {fullYear}</span> */}
          <span className="d_filterby_txt">{filterDispValue}</span>
          <span
            className="d-flex"
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.filterArrow,
            }}
          ></span>
        </button>
        <div
          className={`eep-filterOptions ${
            showFilter ? 'd_filterOptionShow' : ''
          }`}
          style={{ zIndex: 99 }}
        >
          <div className="mb-3 field-wbr">
            <Select
              formatOptionLabel={formatOptionLabel}
              options={config.dropdownOptions}
              placeholder=""
              classNamePrefix="eep_select_common contact_number"
              className={`form-control py-0 a_designation basic-single  ${classes.formControl}`}
              style={{ height: 'auto' }}
              menuPlacement="bottom"
              onChange={(event) => onFilterChange(event)}
              defaultValue={config.defaultValue}
            />
          </div>
          {filterSettings.isDate && (
            <div
              className={`filter-list-div filter-list-date filter-list-default`}
            >
              <DatePicker
                selected={startDate}
                className="date-picker"
                calendarClassName="eep-date-picker"
                onChange={(date) => startDateOnChange(date)}
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInputStartDate />}
                placeholderText="Select startdate"
              />
            </div>
          )}
          {filterSettings.isbetweenDates && (
            <React.Fragment>
              <label> {t(`monthFilter.From`)} : </label>
              <div
                className={`filter-list-div filter-list-date filter-list-default mb-2`}
              >
                <DatePicker
                  selected={startDate}
                  className="date-picker"
                  calendarClassName="eep-date-picker"
                  onChange={(date) => startDateOnChange(date)}
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInputStartDate />}
                  placeholderText="Select startdate"
                />
              </div>
              <div
                className={`filter-list-div filter-list-date filter-list-default mb-2`}
              >
                <label> {t(`monthFilter.To`)} : </label>
                <DatePicker
                  selected={endDate}
                  className="date-picker"
                  calendarClassName="eep-date-picker"
                  onChange={(date) => endDateOnChange(date)}
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInputStartDate />}
                  placeholderText="Select enddate"
                />
              </div>
            </React.Fragment>
          )}

          {filterSettings.isMonth && (
            <div
              className={`filter-list-div filter-list-month filter-list-default`}
            >
              <ul className="d_filterOption d_filterMonth">
                {monthArr.map((res, index) => {
                  return (
                    <li
                      className="d_filterVal"
                      key={index + 1}
                    >
                      <button
                        type="button"
                        className={`val ${
                          currentMonth === index + 1 ? 'selected' : ''
                        }`}
                        value={index + 1}
                        onClick={() => selectMonthHandler(index + 1)}
                      >
                        {t(`monthFilter.${res}`)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {filterSettings.isQuarter && (
            <div
              className={`filter-list-div filter-list-quarter filter-list-default`}
            >
              <ul className="d_filterOption d_filterQuarter">
                {quarterArr.map((res) => {
                  return (
                    <li
                      className="d_filterVal"
                      key={res.value}
                    >
                      <button
                        type="button"
                        className={`val ${
                          currentQuarter === res.quarterNo ? 'selected' : ''
                        }`}
                        value={res.value}
                        onClick={() => selectQuarterHandler(res)}
                      >
                        {res.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {filterSettings.isFourMonth && (
            <div
              className={`filter-list-div filter-list-four-months filter-list-default`}
            >
              <ul className="d_filterOption d_filterTerm">
                {fourMonths.map((res) => {
                  return (
                    <li
                      className="d_filterVal"
                      key={res.value}
                    >
                      <button
                        type="button"
                        className={`val ${
                          currentFourMonth === res.fourMonthNo ? 'selected' : ''
                        }`}
                        value={res.value}
                        onClick={() => selectFourMonthHandler(res)}
                      >
                        {res.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {filterSettings.isHalfYear && (
            <div
              className={`filter-list-div filter-list-half filter-list-default`}
            >
              <ul className="d_filterOption d_filterHalf">
                {halfYear.map((res) => {
                  return (
                    <li
                      className="d_filterVal"
                      key={res.value}
                    >
                      <button
                        type="button"
                        className={`val ${
                          currentHalfYear === res.halfYearNo ? 'selected' : ''
                        }`}
                        value={res.value}
                        onClick={() => selectHalfYearHandler(res)}
                      >
                        {res.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {filterSettings.isYear && (
            <div className={`filter-list-year mb-3`}>
              <div
                className="filter-year-prev filter-nav useserSelect"
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.LesserArrow,
                }}
                onClick={() => yearChange(false)}
              ></div>
              <div className="filter-year-input">
                <input
                  type="text"
                  className="year_val font-helvetica-m"
                  name="year_val"
                  value={fullYear}
                  onChange={(e) => yearFilter(e)}
                />
              </div>
              <div
                className="filter-year-next filter-nav useserSelect"
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.GreaterArrow,
                }}
                onClick={() => yearChange(true)}
              ></div>
            </div>
          )}
          <div className="filter-list-action useserSelect">
            <button
              type="button"
              className="eep-btn eep-btn-cancel eep-btn-nofocus eep-btn-xsml d_filterCancel"
              onClick={() => setShowFilter(false)}
            >
              {t(`dashboard.Cancel`)}
            </button>
            <button
              type="button"
              className="eep-btn eep-btn-success eep-btn-nofocus eep-btn-xsml ml-2 d_filterAction"
              onClick={submitFilterHandler}
            >
              {t(`dashboard.Ok`)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTypeBasedFilter;

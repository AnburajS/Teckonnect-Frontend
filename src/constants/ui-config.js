const FILTER_CONFIG = {
  defaultValue: { label: 'Active', value: true },
  dropdownOptions: [
    { label: 'All', value: '' },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ],
};

const HIDE_SHOW_FILTER_CONFIG = {
  defaultValue: { label: 'Visible', value: true },
  dropdownOptions: [
    { label: 'Visible', value: true },
    { label: 'Invisible', value: false },
  ],
};

const FILTER_LIST_CONFIG = {
  defaultValue: { label: 'Pending', value: false },
  dropdownOptions: [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: false },
    { label: 'Approved', value: true },
  ],
};
const FILTER_LIST_NOMINATE_CONFIG = {
  defaultValue: { label: 'Pending', value: false },
  dropdownOptions: [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: false },
    { label: 'Completed', value: true },
  ],
};
const FILTER_LIST_CONFIG_ALL = {
  defaultValue: { label: 'All', value: 'all' },
  dropdownOptions: [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: false },
    { label: 'Approved', value: true },
  ],
};

const BULK_ACTION = {
  defaultValue: { label: 'Select', value: '' },
  dropdownOptions: [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ],
};

const TYPE_BASED_FILTER = {
  defaultValue: { label: 'Month', value: 'month' },
  dropdownOptions: [
    { label: 'Date', value: 'date' },
    { label: 'Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Quadrimester/ Tetra', value: 'fourMonths' },
    { label: 'Half Yearly', value: 'halfYear' },
    { label: 'Yearly', value: 'year' },
  ],
};

const TYPE_BASED_FILTER_WITH_BETWEEN_DATES = {
  defaultValue: { label: 'Month', value: 'month' },
  dropdownOptions: [
    { label: 'Date', value: 'date' },
    { label: 'Between Dates', value: 'betweenDates' },
    { label: 'Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Quadrimester/ Tetra', value: 'fourMonths' },
    { label: 'Half Yearly', value: 'halfYear' },
    { label: 'Yearly', value: 'year' },
  ],
};
const GRID_LIST_CONFIG = {
  defaultValue: { label: 'List', value: 'List', icon: 'fas fa-list' },
  dropdownOptions: [
    { label: 'List', value: 'List', icon: 'fas fa-list' },
    { label: 'Grid', value: 'Grid', icon: 'fas fa-th' },
  ],
};
export {
  FILTER_CONFIG,
  HIDE_SHOW_FILTER_CONFIG,
  BULK_ACTION,
  FILTER_LIST_CONFIG,
  FILTER_LIST_CONFIG_ALL,
  TYPE_BASED_FILTER,
  TYPE_BASED_FILTER_WITH_BETWEEN_DATES,
  FILTER_LIST_NOMINATE_CONFIG,
  GRID_LIST_CONFIG,
};

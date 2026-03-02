import React from 'react';
const PageHeader = (props) => {
  const {
    title,
    navLinksLeft,
    sucuss,
    navLinksRight,
    filter,
    BulkAction,
    toggle,
    hiddenDivider,
    download,
  } = props;
  return (
    <React.Fragment>
      <div className="d-flex p-0 m-0 eep-templates-setting-title">
        <h3 className="font-helvetica-r c-2c2c2c">
          {navLinksLeft && (
            <span
              className="mr-2"
              key={`${title}navLinksLeft`}
            >
              {navLinksLeft}
            </span>
          )}
          {title}
          {navLinksRight && (
            <span
              key={`${title}navLinksLeft`}
              className="ml-6"
            >
              {navLinksRight}
            </span>
          )}
        </h3>
        <div
          className="eep-options-div  eep_select_maindiv "
          style={{ marginTop: '1px', margin: '1px 1px auto' }}
        >
          {download}
          {sucuss}
          {BulkAction}
          {filter}
          {toggle}
        </div>

        {props.children}
      </div>
      {!hiddenDivider && <div className="eep-dropdown-divider"></div>}
    </React.Fragment>
  );
};
export default PageHeader;

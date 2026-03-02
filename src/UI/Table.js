import React, { useState } from "react";
import Select from "react-select";
import classes from "./Table.module.scss";

const Table = (props) => {
  const { isPage, offset = 0, limit = 100, isPrev, isNext, defualtonChange, showTable } = props;
  const [search, setSearch] = useState('');
  const tableClasses = props?.tableProps ? props.tableProps.classes : "";

  const tableId = props?.tableProps ? props.tableProps.tableId : "";

  const [tableHeaders, setTableHeaders] = useState(
    props.headers ? props.headers : []
  );
  const tableData = props.data ? props.data : [];
  const sortFieldName = "";
  let currentSort = "default";
  const sortTypes = {
    up: {
      class: "sort-up",
      fn: (a, b) => a[sortFieldName] - b[sortFieldName],
    },
    down: {
      class: "sort-down",
      fn: (a, b) => b[sortFieldName] - a[sortFieldName],
    },
    default: {
      class: "sort",
      fn: (a, b) => a,
    },
  };

  const onSortChange = (thead) => {
    const tHeaders = [...tableHeaders];
    // tHeaders.map((field) => (field.sortType = null));
    tHeaders.map((field) => {
      if (field.fieldValue === thead.fieldValue) {
        if (!field.sortType) {
          field.sortType = "asc";
        } else if (field.sortType === "asc") {
          field.sortType = "desc";
        } else if (field.sortType === "desc") {
          field.sortType = "asc";
        }
      } else {
        field.sortType = null;
      }
      return field;
    });
    setTableHeaders(tHeaders);
  };

  const loadData = (data, fieldName) => {
    const entries = fieldName.split(".");
    let value = Object.assign({}, data);

    for (const field of entries) {
      if (value[field]) {
        value = value[field];
      } else {
        return null;
      }
    }
    return value;
  };

  const filterData = search ? tableData?.filter(v => v?.name?.toLowerCase()?.includes(search?.toLowerCase())) : tableData;

  const options = [
    {
      label: "15",
      value: 15,
    },
    {
      label: "50",
      value: 50,
    },
    {
      label: "100",
      value: 100,
    }, {
      label: "200",
      value: 200,
    }
  ]
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <div className="dt-buttons btn-group flex-wrap">
            <button
              className="btn btn-secondary buttons-copy buttons-html5"
              aria-controls="user_dataTable"
              type="button"
            >
              <span>Copy</span>
            </button>
            <button
              className="btn btn-secondary buttons-excel buttons-html5"
              aria-controls="user_dataTable"
              type="button"
            >
              <span>Excel</span>
            </button>
            <button
              className="btn btn-secondary buttons-pdf buttons-html5"
              aria-controls="user_dataTable"
              type="button"
            >
              <span>PDF</span>
            </button>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 text-right">
          <div id="user_dataTable_filter" className={"filter_" + classes.dataTables_filter}>
            <label>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search..."
                  aria-controls="user_dataTable"
                  onChange={(e) => {
                    props?.isSearch ? props?.isSearch(e) : setSearch(e.target.value)
                  }}
                />
                <div className="input-group-addon" style={{ right: "10px" }}>
                  <img src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`} alt="Search" />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <table
        className={`${tableClasses} table ${classes.dataTable}`}
        id={tableId}
      >
        <thead>
          <tr role="row">
            {tableHeaders.length &&
              tableHeaders.map((thead, indx) => (
                <th
                  className={
                    thead.fieldValue !== "action" ? `${thead.sortType === "asc" ? "sorting_asc" : thead.sortType === "desc" ? "sorting_desc" : "sorting"}` : "eepAction_th"
                  }
                  //key={thead.fieldValue}
                  key={"thData_" + indx}
                  onClick={() => onSortChange(thead)}
                >
                  {thead.fieldLabel}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filterData?.length > 0 &&
            filterData?.map((data, index) => {
              // filterData?.slice(offset,limit)?.map((data, index) => {
              return (
                <tr
                  className={index % 2 === 0 ? "odd" : "even"}
                  //key={`${index}_row`}
                  key={"row_" + index}
                  style={{ position: 'relative' }}
                  onClick={() => props?.rowClick && props?.getCheckedData(index, data)}
                >
                  {tableHeaders.map((thead, ind) => {

                    // thead.fieldValue && thead.fieldValue === "action" ? (
                    //   props.component === "userManagement" && (
                    //     <td key={`${ind}_column`}>
                    //       <UserManagementActionDropdown id={data.id} />
                    //     </td>
                    //   )
                    // ) :
                    return (
                      <React.Fragment key={`${ind}_column`}>
                        {thead.fieldValue.indexOf(".") !== -1 && (
                          <td>
                            {loadData(data, thead.fieldValue)}
                          </td>
                        )}
                        {thead.fieldValue.indexOf(".") === -1 && (
                          <td>
                            {thead.component && (
                              <React.Fragment>
                                {React.cloneElement(thead.component, { data: data })}
                              </React.Fragment>
                            )}
                            {!thead.component && (
                              <React.Fragment>
                                {thead.fieldLabel === "#" && props?.rowClick && <><input type="checkbox" checked={data?.action} /></>}
                                {data[thead.fieldValue]}
                              </React.Fragment>
                            )}
                          </td>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          {tableData?.length <= 0 &&
            <tr className="odd"><td valign="top" colSpan={tableHeaders.length > 0 ? tableHeaders.length : 1} className="dataTables_empty text-center">No data available.</td></tr>
          }
        </tbody>
      </table>


      {isPage &&
        <div className={classes.pagination}>
          <div className={classes.left}>Rows per page :
            <Select classNamePrefix="eep_select_common select" className={`a_designation basic-single`}
              placeholder="" options={options} defaultValue={showTable} onChange={(e) => defualtonChange('showTable', e)} />
          </div>
          <div className={classes.right}>{offset} - {limit} <span>of {props?.totalCount}</span> |
            <svg onClick={() => isPrev()} style={{ width: "26px", cursor: "pointer", fill: "#808080f2" }} aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12zm18 0c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8zM8 12l4-4 1.41 1.41L11.83 11H16v2h-4.17l1.59 1.59L12 16l-4-4z"></path></svg>
            <svg onClick={() => isNext()} style={{ width: "26px", cursor: "pointer", fill: "#808080f2" }} aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8zm12 0-4 4-1.41-1.41L12.17 13H8v-2h4.17l-1.59-1.59L12 8l4 4z"></path></svg>

          </div>
        </div>
      }
    </React.Fragment>
  );
};
export default Table;

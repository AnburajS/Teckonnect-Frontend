import { MaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../helpers';

const TableComponent = ({
  columns = [],
  data = [],
  action,
  searchHidden,
  actionHidden,
  customContainerSx = {},
  enableRowSelection = false,
  enableRowNumbers = false,
  actionFixed = false,
}) => {
  const styles = {
    container: {
      minHeight: '420px',
      maxHeight: '420px',
      fontFamily: 'helveticaneueregular !important',
      '& .MuiTable-root': {
        borderSpacing: '0px 10px',
      },
      '& .MuiTableBody-root': {
        '& .MuiTableRow-root': {
          boxShadow: 'none',
          backgroundColor: '#f9f9f9',
        },
        '& .MuiTableRow-root:hover td': {
          backgroundColor: '#f9f9f9',
        },
        '& .MuiTableCell-root': {
          fontSize: '14px',
          p: '6px 20px',
          overflow: 'inherit',
          zIndex: 'inherit',
          height: '40px',
          border: '0px',
          boxShadow: 'none',
          '&:first-child': {
            borderRadius: '8px 0px 0px 8px',
          },
          '&:last-child': {
            borderRadius: '0px 8px 8px 0px !important',
          },
        },
      },
      '& .MuiTableFooter-root': {
        outline: 'none !important',
        display: 'none !important',
      },

      '& .MuiTableHead-root': {
        opacity: 1,
        '& .Mui-TableHeadCell-Content': {
          height: '12px',
          fontSize: '14px',
          letterSpacing: '1px',
          color: '#053A51',
          fontFamily: 'helveticaneueregular !important',
        },
        '& .MuiTableRow-root': {
          boxShadow: 'none',
        },
        '& .MuiTableCell-root': {
          p: '8px 8px',
        },
      },

      '&::-webkit-scrollbar': {
        width: '12px',
      },

      '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
      '&::-webkit-scrollbar-thumb:horizontal': {
        backgroundColor: '#858796',
      },
      '&::-webkit-scrollbar-track:horizontal': {
        backgroundColor: '#f8f8f8',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'transparent !important',
      },
    },
  };

  return (
    <div style={{ position: 'relative' }}>
      <MaterialReactTable
        // enablePagination={false}
        // showPagination={false}
        // enablePagination={false}
        // localization={{ noRecordsToDisplay: "" }}
        enableColumnActions={false}
        enableColumnFilters={false}
        positionActionsColumn="last"
        columns={columns?.map((data) => {
          return { ...data, header: capitalizeFirstLetter(data?.header) };
        })}
        positionGlobalFilter="left"
        data={data}
        enableRowNumbers={enableRowNumbers}
        enableRowSelection={enableRowSelection}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        // positionPagination='bottom'
        enableSortingRemoval={false}
        enableRowActions={actionHidden ? false : true}
        enableGlobalFilter={searchHidden ? false : true}
        enableStickyHeader
        muiTablePaperProps={{
          sx: {
            '&.MuiPaper-root': {
              boxShadow: 'none',
            },
          },
        }}
        muiTableContainerProps={{ sx: styles.container, ...customContainerSx }}
        enableColumnPinning={true}
        initialState={{
          density: 'comfortable',
          showGlobalFilter: searchHidden ? false : true,
          columnPinning: {
            right: actionFixed ? ['mrt-row-actions'] : [],
          },
        }}
        muiSearchTextFieldProps={{
          size: 'small',
          placeholder: 'Search...',
          variant: 'outlined',
          sx: {
            '& .MuiOutlinedInput-input': {
              padding: '6px 7px',
              fontSize: '14px',
              borderRadius: '4px',
            },
          },
          InputProps: {
            endAdornment: (
              <img
                src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`}
                alt="Search"
                style={{ width: '18px' }}
              />
            ),
          },
        }}
        renderRowActions={({ row, table }) =>
          action ? React.cloneElement(action, { data: data?.[row?.index] }) : ''
        }
        muiTablePaginationProps={{
          labelRowsPerPage: '',
          rowsPerPageOptions: [
            { label: <span className="fs-14">5 Per Page</span>, value: 5 },
            { label: <span className="fs-14">10 Per Page</span>, value: 10 },
            { label: <span className="fs-14">50 Per Page</span>, value: 50 },
            data?.length > 100
              ? {
                  label: <span className="fs-14">{data?.length} Per Page</span>,
                  value: data?.length,
                }
              : {
                  label: <span className="fs-14">100 Per Page</span>,
                  value: 100,
                },
          ],
          nextIconButtonProps: {
            style: {
              padding: 0,
              borderRadius: '5px',
              border: '2px solid',
              marginLeft: '5px',
            },
          },
          backIconButtonProps: {
            style: {
              padding: 0,
              borderRadius: '5px',
              border: '2px solid',
              marginRight: '5px',
            },
          },
          showFirstButton: false,
          showLastButton: false,
        }}
        icons={{
          SearchIcon: (props) => (
            <img
              src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`}
              alt="Search"
              {...props}
            />
          ),
        }}
        muiTableHeadCellProps={{
          sx: {
            border: '0px',
            boxShadow: 'none',
          },
        }}
      />
    </div>
  );
};

export default TableComponent;

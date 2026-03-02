import { MaterialReactTable } from 'material-react-table';
import React, { useState } from 'react';
import { capitalizeFirstLetter } from '../helpers';

const TableComponentServerSide = ({
  columns = [],
  data = [],
  action,
  searchHidden,
  actionHidden,
  customContainerSx = {},
  enableRowSelection = false,
  enableRowNumbers = false,
  actionFixed = false,
  isServerSide = false,
  total = 0,
  onPaginationChange,
  pageIndex,
  pageSize,
}) => {
  const [pageIndexClinet, setPageIndexClient] = useState(0);
  const [pageSizeClient, setPageSizeClient] = useState(10);

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
        display: 'none !important',
      },
      '& .MuiTableHead-root': {
        '& .Mui-TableHeadCell-Content': {
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
      '&::-webkit-scrollbar-thumb': {
        background: 'transparent !important',
      },
      '&::-webkit-scrollbar-track:horizontal': {
        backgroundColor: '#f8f8f8',
      },
    },
  };
  const handleServerPaginationChange = (updater) => {
    const { pageIndex: newPageIndex, pageSize: newPageSize } =
      typeof updater === 'function'
        ? updater({ pageIndex, pageSize })
        : updater;

    onPaginationChange?.({ pageIndex: newPageIndex, pageSize: newPageSize });
  };
  const handlePaginationChange = (updater) => {
    const { pageIndex: newPageIndex, pageSize: newPageSize } =
      typeof updater === 'function'
        ? updater({ pageIndex, pageSize })
        : updater;
    setPageIndexClient(newPageIndex);
    setPageSizeClient(newPageSize);
  };
  return (
    <div style={{ position: 'relative' }}>
      <MaterialReactTable
        enableColumnActions={false}
        enableColumnFilters={false}
        positionActionsColumn="last"
        columns={columns.map((col) => ({
          ...col,
          header: capitalizeFirstLetter(col?.header),
        }))}
        positionGlobalFilter="left"
        data={data}
        enableRowNumbers={enableRowNumbers}
        enableRowSelection={enableRowSelection}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        enableSortingRemoval={false}
        enableRowActions={!actionHidden}
        enableGlobalFilter={!searchHidden}
        enableStickyHeader
        muiTablePaperProps={{
          sx: {
            '&.MuiPaper-root': {
              boxShadow: 'none',
            },
          },
        }}
        muiTableContainerProps={{
          sx: styles.container,
          ...customContainerSx,
        }}
        enableColumnPinning
        initialState={{
          density: 'comfortable',
          showGlobalFilter: !searchHidden,
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
                src={`${process.env.PUBLIC_URL}/images/icons/static/search.svg`}
                alt="Search"
                style={{ width: '18px' }}
              />
            ),
          },
        }}
        renderRowActions={({ row }) =>
          action ? React.cloneElement(action, { data: data?.[row?.index] }) : ''
        }
        muiTablePaginationProps={{
          labelRowsPerPage: '',
          rowsPerPageOptions: [
            { label: <span className="fs-14">5 Per Page</span>, value: 5 },
            { label: <span className="fs-14">10 Per Page</span>, value: 10 },
            { label: <span className="fs-14">50 Per Page</span>, value: 50 },
            (isServerSide ? total > 100 : data?.length > 100)
              ? {
                  label: (
                    <span className="fs-14">
                      {isServerSide ? total : data?.length} Per Page
                    </span>
                  ),
                  value: isServerSide ? total : data?.length,
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
              src={`${process.env.PUBLIC_URL}/images/icons/static/search.svg`}
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
        manualPagination={isServerSide}
        rowCount={isServerSide ? total : undefined}
        onPaginationChange={
          isServerSide ? handleServerPaginationChange : handlePaginationChange
        }
        state={{
          pagination: isServerSide
            ? {
                pageIndex,
                pageSize,
              }
            : { pageIndex: pageIndexClinet, pageSize: pageSizeClient },
        }}
      />
    </div>
  );
};

export default TableComponentServerSide;

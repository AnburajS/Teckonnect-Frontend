import React, { useState } from 'react';
import PageHeader from '../../UI/PageHeader';
import AwardApprovalList from './AwardApprovalList';
import Filter from '../../UI/Filter';
import {
  FILTER_LIST_CONFIG,
  GRID_LIST_CONFIG,
} from '../../constants/ui-config';
import AwardNominationList from './AwardNominationList';
import { useSelector } from 'react-redux';
import AwardRecognitions from './AwardRecognitions';
import ListDropDown from '../../UI/ListDropDown';
import { useLocation } from 'react-router-dom';

function MyAction() {
  const location = useLocation();
  const routerData = location.state?.subTab;

  const [tab, setTab] = useState(routerData ? routerData : 'approval');
  const [list, setlist] = useState('List');

  const [filter, setFilter] = useState();
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const clickHandler = (arg) => {
    setTab(arg);
    // fetchManageAwardData(arg);
  };

  const filterOnChangeHandler = (arg) => {
    setFilter(arg);
  };
  const listOnChangeHandler = (arg) => {
    setlist(arg?.value);
  };
  return (
    <React.Fragment>
      <PageHeader
        title={tab === 'approval' ? 'Awards and Approvals' : 'Nominate Award'}
        filter={
          <>
            {tab === 'approval' ? (
              <Filter
                config={FILTER_LIST_CONFIG}
                onFilterChange={filterOnChangeHandler}
              />
            ) : (
              <>
                <ListDropDown
                  config={GRID_LIST_CONFIG}
                  onFilterChange={listOnChangeHandler}
                />
                <Filter
                  config={FILTER_LIST_CONFIG}
                  onFilterChange={filterOnChangeHandler}
                />
              </>
            )}
          </>
        }
      ></PageHeader>

      <div
        className="py-1"
        style={{ position: 'relative' }}
      >
        <div className="tabSwitch">
          {userRolePermission?.awardNominatorAssignee && (
            <button
              onClick={() => clickHandler('MyNominationsTab')}
              className={
                tab === 'MyNominationsTab' ? 'tabButtonActive' : 'tabButton'
              }
            >
              Nominate
            </button>
          )}
          <button
            onClick={() => clickHandler('approval')}
            className={tab === 'approval' ? 'tabButtonActive' : 'tabButton'}
          >
            Approval
          </button>
        </div>

        <div className="award_manage_div">
          {tab === 'approval' && (
            <div
              className="table-responsive eep_datatable_table_div"
              style={{ visibility: 'visible', overflowX: 'hidden' }}
            >
              <AwardApprovalList filter={filter} />
            </div>
          )}
          {tab === 'MyNominationsTab' && (
            <div>
              {list === 'List' ? (
                <AwardNominationList filter={filter} />
              ) : (
                <div className="mt-4 pt-2">
                  <AwardRecognitions
                    awardType="0"
                    filter={filter}
                  />
                </div>
              )}

              {/* */}
            </div>
          )}
          {/* {activeTab && activeTab.id === 'NominateTab' && (
             
            )} */}
          {/* {tab === 'MyNominationsTab' && !isLoading && (
            <div
              className="table-responsive eep_datatable_table_div"
              style={{ visibility: 'visible', overflowX: 'hidden' }}
            >
              <TableComponent
                data={awardManage ?? []}
                columns={manageSpotTableHeaders}
                action={<ManageAwardActions triggerModal={triggerModal} />}
              />
            </div>
          )} */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default MyAction;

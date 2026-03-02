import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { TabsActions } from '../../store/tabs-slice';
import {
  HIDE_SHOW_FILTER_CONFIG,
  BULK_ACTION,
} from '../../constants/ui-config';
import Filter from '../../UI/Filter';
import BulkAction from '../../UI/BulkAction';
import PageHeader from '../../UI/PageHeader';
import BadgeRecognition from './BadgeRecognition';
import MyBadge from './MyBadges';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';

const Badges = () => {
  const [filterBy, setFilterBy] = useState({ filter: true });
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const [bulkUpdateBy, setBulkUpdateBy] = useState({ updateBy: null });
  const [enableBulkState, setEnableBulkState] = useState({ bulkState: false });
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [badgeData, setBadgeData] = useState({});

  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const location = useLocation();
  const navigate = useNavigate();
  const routerData = location.state || {
    activeTab:
      window.location.hash.substring(1)?.split('?')?.[0] || 'mybadgeTab',
  };

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'RECOGNIZE',
      link: 'app/recognition',
    },
    {
      label: 'BADGES',
      link: 'app/badges',
    },
  ];

  useEffect(() => {
    let tabConfig = [
      {
        title: 'My Badges',
        id: 'mybadgeTab',
      },
    ];
    if (userRolePermission.badgeSend) {
      tabConfig.push(
        // { title: "Nominator View", id: "NominatorTab" },
        { title: 'Badge Vault', id: 'badgeTab' }
      );
    }

    //   if (routerData) {
    //     const activeTabId = routerData.activeTab;
    //     tabConfig.map((res) => {
    //       if (res.id === activeTabId) {
    //         res.active = true;
    //       }
    //       return res;
    //     });
    //     dispatch(
    //       TabsActions.updateTabsconfig({
    //         config: tabConfig,
    //       })
    //     );
    //     navigate(location.pathname, { replace: true, state: {} });
    //   } else {
    //     dispatch(
    //       TabsActions.updateTabsconfig({
    //         config: tabConfig,
    //       })
    //     );
    //   }

    //   return () => {
    //     dispatch(
    //       TabsActions.updateTabsconfig({
    //         config: [],
    //       })
    //     );
    //   };
    // }, [userRolePermission]);

    const activeTabId = routerData.activeTab || 'mybadgeTab';

    tabConfig = tabConfig.map((tab) => ({
      ...tab,
      active: tab.id === activeTabId,
    }));

    dispatch(TabsActions.updateTabsconfig({ config: tabConfig }));
    navigate(location.pathname, { replace: true, state: {} });

    return () => {
      dispatch(TabsActions.updateTabsconfig({ config: [] }));
    };
  }, [userRolePermission]);

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Badges',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  useEffect(() => {
    fetchBadgeData(filterBy.filter);
  }, []);

  const fetchBadgeData = (arg) => {
    const obj = {
      url: URL_CONFIG.ALLBADGES,
      method: 'get',
      params: { active: arg },
    };
    httpHandler(obj)
      .then((bData) => {
        setBadgeData(...[bData.data]);
      })
      .catch((error) => {});
  };

  const filterOnChangeHandler = (arg) => {
    if (arg) {
      setFilterBy({ filter: arg.value });
      fetchBadgeData(arg.value);
      resetCheckBox();
    }
  };

  const onBulkActionChangeHandler = (arg) => {
    if (arg) {
      setBulkUpdateBy({ updateBy: arg.value });
    }
  };

  const enableFilterOptions = (e) => {
    const { checked } = e.target;
    setEnableBulkState({ bulkState: false });
    if (checked) {
      setEnableBulkState({ bulkState: true });
    }
  };

  const getSelectedBadges = (arg) => {
    const selectedArray = arg.map((i) => Number(i));
    setSelectedRecords(selectedArray);
  };

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const bulkSubmitHandler = () => {
    if (selectedRecords.length > 0 && bulkUpdateBy.updateBy !== null) {
      const obj = {
        url: URL_CONFIG.BADGE_BULK_UPDATE,
        // + "?badge=" + selectedRecords + "&active=" + bulkUpdateBy.updateBy,
        method: 'put',
        payload: {
          badges: selectedRecords,
          active: bulkUpdateBy.updateBy,
        },
      };
      httpHandler(obj)
        .then((response) => {
          setShowModal({
            ...showModal,
            type: 'success',
            message: response?.data?.message,
          });
          fetchBadgeData(filterBy.filter);
          resetCheckBox();
          setEnableBulkState({ bulkState: false });
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
        });
    }
  };

  const resetCheckBox = () => {
    const badgeList = document.getElementsByClassName('badge-list');
    setSelectedRecords([]);
    for (let i = 0; i < badgeList.length; i++) {
      if (badgeList[i]) {
        badgeList[i].checked = false;
      }
    }
  };

  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}

      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100">
          <div
            id="mybadgeTab"
            className="tab-pane  h-100"
          >
            {activeTab?.id === 'mybadgeTab' && <MyBadge />}
          </div>
          {activeTab?.id === 'badgeTab' && (
            <div
              id="badgeTab"
              className="tab-pane active h-100"
            >
              {/* {!userRolePermission.badgeCreate && !userRolePermission.badgeModify &&
                <PageHeader
                  title="Badges & Recognition"
                  filter={
                    <Filter config={HIDE_SHOW_FILTER_CONFIG} onFilterChange={filterOnChangeHandler} />
                  }
                ></PageHeader>
              } */}
              {userRolePermission.badgeCreate &&
                !userRolePermission.badgeModify && (
                  <PageHeader
                    title="Badges & Recognition"
                    navLinksRight={
                      <Link
                        className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                        to="/app/createbadge"
                        dangerouslySetInnerHTML={{
                          __html: svgIcons && svgIcons.plus,
                        }}
                      ></Link>
                    }
                    filter={
                      <Filter
                        config={HIDE_SHOW_FILTER_CONFIG}
                        onFilterChange={filterOnChangeHandler}
                      />
                    }
                  ></PageHeader>
                )}
              {!userRolePermission.badgeCreate &&
                userRolePermission.badgeModify && (
                  <PageHeader
                    title="Badges & Recognition"
                    BulkAction={
                      <BulkAction
                        config={BULK_ACTION}
                        onClickCheckbox={enableFilterOptions}
                        onFilterChange={onBulkActionChangeHandler}
                        checkBoxInfo={enableBulkState}
                        bulkSubmitHandler={bulkSubmitHandler}
                      />
                    }
                    filter={
                      <Filter
                        config={HIDE_SHOW_FILTER_CONFIG}
                        onFilterChange={filterOnChangeHandler}
                      />
                    }
                  ></PageHeader>
                )}
              {userRolePermission.badgeCreate &&
                userRolePermission.badgeModify && (
                  <PageHeader
                    title="Badges & Recognition"
                    navLinksRight={
                      <Link
                        className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                        to="/app/createbadge"
                        dangerouslySetInnerHTML={{
                          __html: svgIcons && svgIcons.plus,
                        }}
                      ></Link>
                    }
                    filter={
                      <Filter
                        config={HIDE_SHOW_FILTER_CONFIG}
                        onFilterChange={filterOnChangeHandler}
                      />
                    }
                    BulkAction={
                      <BulkAction
                        config={BULK_ACTION}
                        onClickCheckbox={enableFilterOptions}
                        onFilterChange={onBulkActionChangeHandler}
                        checkBoxInfo={enableBulkState}
                        bulkSubmitHandler={bulkSubmitHandler}
                      />
                    }
                  ></PageHeader>
                )}
              {userRolePermission.badgeSend && (
                <BadgeRecognition
                  filterBy={filterBy}
                  badgeData={badgeData}
                  bulkUpdateBy={bulkUpdateBy}
                  bulkUpdateState={enableBulkState}
                  getSelectedBadges={getSelectedBadges}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Badges;

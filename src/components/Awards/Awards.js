import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BulkAction from "../../UI/BulkAction";
import Filter from "../../UI/Filter";
import PageHeader from "../../UI/PageHeader";
import { URL_CONFIG } from "../../constants/rest-config";
import {
  BULK_ACTION,
  HIDE_SHOW_FILTER_CONFIG,
} from "../../constants/ui-config";
import { httpHandler } from "../../http/http-interceptor";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import AssignAwards from "./AssignAwards";
import AwardApprovalList from "./AwardApprovalList";
import AwardNominationList from "./AwardNominationList";
import AwardRecognition from "./AwardRecognition";
import AwardRecognitions from "./AwardRecognitions";
import ManageAwards from "./ManageAwards";
import MyAwards from "./MyAwards";
import Nominations from "./Nominations";
import MyAction from "./MyAction";

const Awards = () => {
  const [filterBy, setFilterBy] = useState({ filter: true });
  const [bulkUpdateBy, setBulkUpdateBy] = useState({ updateBy: null });
  const [enableBulkState, setEnableBulkState] = useState({ bulkState: false });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [awardData, setAwardData] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [nominateTypeData, setNominateTypeData] = useState({});

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);

  const location = useLocation();
  const history = useNavigate();
  const routerData = location.state || {
    activeTab:
      window.location.hash.substring(1)?.split("?")?.[0] || "MyAwardsTab",
  };

  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "RECOGNIZE",
      link: "app/recognition",
    },
    {
      label: "AWARDS",
      link: "app/awards",
    },
  ];

  const tabConfig = [
    {
      title: "My Awards",
      id: "MyAwardsTab",
    },
    {
      title: "Nomination Hub",
      id: "NominationsTab",
    },
    {
      title: "My Actions",
      id: "MyActionTab",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Awards",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  useEffect(() => {
    if (userRolePermission?.awardNominatorAssignee) {
      tabConfig.push(
        // { title: "Nominator View", id: "NominatorTab" },
        { title: "Spot Award", id: "SpotTab" }
        // { title: 'Nominate', id: 'NominateTab' }
        // { title: 'My Nominations', id: 'MyNominationsTab' }
        // { title: 'Approval', id: 'ApprovalTab' }
      );
    }
    if (userRolePermission?.awardCategorisation) {
      // tabConfig.splice(2, 0, { title: 'Awards', id: 'awardTab' });
      tabConfig.push({ title: "Manage", id: "ManageTab" });
    }

    // if (
    //   !userRolePermission?.awardNominatorAssignee &&
    //   !userRolePermission?.awardCategorisation
    // ) {
    //   tabConfig.splice(tabConfig.length - 1, 0, {
    //     title: 'My Actions',
    //     id: 'MyActionTab',
    //   });
    // }

    if (routerData?.activeTab) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          return (res.active = true);
        }
      });
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
    } else {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
    }

    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
  }, [userRolePermission, location.state?.tabNavigations]);

  useEffect(() => {
    fetchAwardData(filterBy.filter);
  }, []);

  const fetchNominationTypeData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/awardNominationTypes.json`)
      .then((response) => response.json())
      .then((data) => {
        setNominateTypeData(data);
      })
      .catch();
  };

  useEffect(() => {
    fetchNominationTypeData();
  }, []);

  const fetchAwardData = (arg) => {
    const obj = {
      url: URL_CONFIG.ALLAWARDS,
      method: "get",
      params: { active: arg },
    };
    httpHandler(obj)
      .then((awardData) => {
        setAwardData(awardData.data);
      })
      .catch((error) => {});
  };

  const filterOnChangeHandler = (arg) => {
    if (arg) {
      setFilterBy({ filter: arg.value });
      fetchAwardData(arg.value);
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

  const getSelectedAwards = (arg) => {
    const selectedArray = arg.map((i) => Number(i));
    setSelectedRecords(selectedArray);
  };

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const bulkSubmitHandler = () => {
    if (selectedRecords.length > 0 && bulkUpdateBy.updateBy !== null) {
      const obj = {
        url: URL_CONFIG.AWARD_BULK_UPDATE,
        method: "put",
        payload: {
          award: selectedRecords,
          active: bulkUpdateBy.updateBy,
        },
      };
      httpHandler(obj)
        .then((response) => {
          setShowModal({
            ...showModal,
            type: "success",
            message: response?.data?.message,
          });
          fetchAwardData(filterBy.filter);
          resetCheckBox();
          setEnableBulkState({ bulkState: false });
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
        });
    }
  };

  const resetCheckBox = () => {
    const badgeList = document.getElementsByClassName("badge-list");
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
          <div id="MyAwardsTab" className="tab-pane active h-100">
            <MyAwards />
          </div>
          <div id="NominationsTab" className="tab-pane h-100">
            {activeTab && activeTab.id === "NominationsTab" && <Nominations />}
          </div>
          <div id="awardTab" className="tab-pane h-100">
            {!userRolePermission.awardCreate &&
              !userRolePermission.awardModify && (
                <PageHeader
                  title="Awards and Nomination"
                  filter={
                    <Filter
                      config={HIDE_SHOW_FILTER_CONFIG}
                      onFilterChange={filterOnChangeHandler}
                    />
                  }
                ></PageHeader>
              )}
            {userRolePermission.awardCreate &&
              !userRolePermission.awardModify && (
                <PageHeader
                  title="Awards and Nomination"
                  navLinksRight={
                    <Link
                      className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                      to="/app/createaward"
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
            {!userRolePermission.awardCreate &&
              userRolePermission.awardModify && (
                <PageHeader
                  title="Awards and Nomination"
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
            {userRolePermission.awardCreate &&
              userRolePermission.awardModify && (
                <PageHeader
                  title="Awards and Nomination"
                  navLinksRight={
                    <Link
                      className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                      to="/app/createaward"
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
            {activeTab && activeTab.id === "awardTab" && (
              <AssignAwards
                filterBy={filterBy}
                awardData={awardData}
                bulkUpdateBy={bulkUpdateBy}
                bulkUpdateState={enableBulkState}
                getSelectedAwards={getSelectedAwards}
                nominateTypeData={nominateTypeData}
              />
            )}
          </div>
          {/* <div id="NominatorTab" className="tab-pane h-100">
            <PageHeader title="Award Nominator" />
            {activeTab && activeTab.id === 'NominatorTab' && <AwardRecognition />}
          </div> */}
          <div id="SpotTab" className="tab-pane h-100">
            {/* <PageHeader title="Spot Award" /> */}
            {activeTab && activeTab.id === "SpotTab" && (
              <AwardRecognitions awardType="1" header={true} />
            )}
          </div>
          <div id="MyActionTab" className="tab-pane h-100">
            {/* <PageHeader title="Spot Award" /> */}
            {activeTab && activeTab.id === "MyActionTab" && (
              <MyAction awardType="1" />
            )}
          </div>

          <div id="NominateTab" className="tab-pane h-100">
            {activeTab && activeTab.id === "NominateTab" && (
              <AwardRecognitions awardType="0" />
            )}
          </div>
          {/* <div
            id="MyNominationsTab"
            className="tab-pane h-100"
          >
            {activeTab && activeTab.id === 'MyNominationsTab' && (
              <AwardNominationList />
            )}
          </div> */}
          {/* <div
            id="ApprovalTab"
            className="tab-pane h-100"
          >
            {activeTab && activeTab.id === 'ApprovalTab' && (
              <AwardApprovalList />
            )}
          </div> */}
          <div id="ManageTab" className="tab-pane h-100">
            {activeTab && activeTab.id === "ManageTab" && <ManageAwards />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Awards;

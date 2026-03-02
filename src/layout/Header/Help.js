import React, { useEffect, useState } from 'react';

import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import PageHeader from '../../UI/PageHeader';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';

const Help = () => {
  const [permissionData, setPermissionData] = useState(null);
  const [tourData, setTourData] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [tourSelected, setTourSelected] = useState(0);

  const tourDataDefault = {
    myDashboard: false,
    rewardsAndRecognition: false,
    hallOfFame: false,
    ecards: false,
    ecardInbox: false,
    ecardTemplate: false,
    badges: false,
    createBadge: false,
    myBadges: false,
    awards: false,
    createAward: false,
    myAwards: false,
    awardNominatorView: false,
    awardNomination: false,
    awardMyNominations: false,
    awardApproval: false,
    awardManage: false,
    certificate: false,
    myCertificate: false,
    libraryBadges: false,
    libraryAwards: false,
    libraryCertificates: false,
    socialWall: false,
    ideaBox: false,
    createIdeaBox: false,
    myIdeas: false,
    forum: false,
    createforum: false,
    myForums: false,
    createPoll: false,
    activePolls: false,
    pollResults: false,
    closedPolls: false,
    createSurvey: false,
    mySurveys: false,
    surveyResults: false,
    surveyQuestionBank: false,
    rewardPoints: false,
    portalSettings: false,
    departmentMasters: false,
    userManagement: false,
    roleManagement: false,
    hashTag: false,
  };

  const fetchTourData = () => {
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    const obj = {
      url: URL_CONFIG.TOUR,
      method: 'get',
      params: { id: userData.id },
    };
    httpHandler(obj)
      .then((tourData) => {
        if (tourData.data) {
          setTourData({ ...tourData.data });
        }
        if (!tourData.data) {
          setTourData({ ...tourDataDefault });
        }
      })
      .catch((error) => {});
  };

  const toggleSwitchHandler = (tState, tItem) => {
    let tourDataTemp = JSON.parse(JSON.stringify(tourData));
    tourDataTemp[tItem.value] = tState;
    setTourData({ ...tourDataTemp });
    if (!tState) {
      setSelectAll(false);
    }
  };

  const toggleAllHandler = (tState) => {
    let tourDataTemp = JSON.parse(JSON.stringify(tourData));
    Object.keys(tourDataTemp).forEach((item) => {
      tourDataTemp[item] = tState;
    });
    setTourData({ ...tourDataTemp });
    setSelectAll(tState);
  };

  const tourPermissonArr = () => {
    fetch(`${process.env.PUBLIC_URL}/data/tourPermissionData.json`)
      .then((response) => response.json())
      .then((data) => {
        setPermissionData(data);
      });
  };

  useEffect(() => {
    tourPermissonArr();
    fetchTourData();
  }, []);

  useEffect(() => {
    if (tourData) {
      let tourSelectedCount = 0;
      Object.keys(tourData).forEach(function (key) {
        if (tourData[key] === true) {
          tourSelectedCount++;
        }
      });
      setTourSelected(tourSelectedCount);
    }
  }, [tourData]);

  const updateTourSelectedHandler = () => {
    const obj = {
      url: URL_CONFIG.TOUR_UPDATE,
      method: 'put',
      payload: tourData,
    };
    httpHandler(obj)
      .then((response) => {})
      .catch((error) => {});
  };

  return (
    <React.Fragment>
      {/* <PageHeader title="Tour Help" toggle={<BootstrapSwitchButton checked={selectAll} width={150} onstyle="success" onlabel="Select All" offlabel="Deselect All" style="toggle_switch" onChange={(e) => toggleAllHandler(e)} />} /> */}
      {permissionData && permissionData.length > 0 && (
        <div
          className="row eep-content-section eep_scroll_y"
          style={{ background: '#ffff' }}
        >
          <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12 d-flex justify-content-end my-3">
            <button className=" select-btn mr-3">
              {`Selected : ${
                tourData
                  ? tourSelected + '/' + Object.keys(tourData).length
                  : ''
              } `}
            </button>

            <BootstrapSwitchButton
              checked={selectAll}
              width={120}
              onstyle="success"
              onlabel="Select All"
              offlabel="Deselect All"
              style="toggle_switch"
              onChange={(e) => toggleAllHandler(e)}
            />
          </div>
          <div className="col-sm-12 col-xs-12 col-md-4 col-lg-4">
            <div className="bg-f5f5f5 br-15 py-2 px-2 eep_scroll_y eep-content-section-data">
              {permissionData &&
                permissionData.slice(0, 14).map((item, index) => {
                  return (
                    <div
                      className="px-2 py-2"
                      key={'helper_' + index}
                    >
                      <div className=" d-flex justify-content-between align-items-center">
                        <div className="hlp_tour_label">
                          <span>{item.label}</span>
                        </div>
                        <div className="hlp_toggle_switch">
                          <BootstrapSwitchButton
                            checked={tourData ? tourData[item.value] : false}
                            width={75}
                            onstyle="success"
                            onlabel="ON"
                            offlabel="OFF"
                            style="toggle_switch"
                            onChange={(e) => toggleSwitchHandler(e, item)}
                          />
                        </div>
                      </div>
                      {index !== 13 && (
                        <div className="eep-dropdown-divider"></div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 col-md-4 col-lg-4">
            <div className="bg-f5f5f5 br-15 py-2 px-2 eep_scroll_y eep-content-section-data">
              {permissionData &&
                permissionData.slice(14, 28).map((item, index) => {
                  return (
                    <div
                      className="px-2 py-2"
                      key={'helper_' + index}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="hlp_tour_label">
                          <span>{item.label}</span>
                        </div>
                        <div className="hlp_toggle_switch">
                          <BootstrapSwitchButton
                            checked={tourData ? tourData[item.value] : false}
                            width={75}
                            onstyle="success"
                            onlabel="ON"
                            offlabel="OFF"
                            style="toggle_switch"
                            onChange={(e) => toggleSwitchHandler(e, item)}
                          />
                        </div>
                      </div>
                      {index !== 13 && (
                        <div className="eep-dropdown-divider"></div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 col-md-4 col-lg-4">
            <div className="bg-f5f5f5 br-15 py-2 px-2 eep_scroll_y eep-content-section-data">
              {permissionData &&
                permissionData.slice(28, 43).map((item, index) => {
                  return (
                    <div
                      className="px-2 py-2"
                      key={'helper_' + index}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="hlp_tour_label">
                          <span>{item.label}</span>
                        </div>
                        <div className="hlp_toggle_switch">
                          <BootstrapSwitchButton
                            checked={tourData ? tourData[item.value] : false}
                            width={75}
                            onstyle="success"
                            onlabel="ON"
                            offlabel="OFF"
                            style="toggle_switch"
                            onChange={(e) => toggleSwitchHandler(e, item)}
                          />
                        </div>
                      </div>
                      {index !== 14 && (
                        <div className="eep-dropdown-divider"></div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
            <div className="d-flex my-3 justify-content-center position-sticky">
              <button
                className="eep-btn eep-btn-success"
                onClick={updateTourSelectedHandler}
              >{` Done`}</button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Help;

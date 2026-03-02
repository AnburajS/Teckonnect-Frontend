import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import PageHeader from '../../UI/PageHeader';
import ScheduleTime from './ScheduleTime';
import MessageTemplate from './MessageTemplate';
import CardsTemplate from './CardsTemplate';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import YearFilterTab from './YearFilterTab';
import ResponseInfo from '../../UI/ResponseInfo';
import SchedulePoint from './SchedulePoint';
import { TabsActions } from '../../store/tabs-slice';
import SchedulerCards from './SchedulerCards';

const WorkAnniversarySettings = () => {
  const location = useLocation();
  const activeTabs = location?.state?.activeTab;
  const showAll = activeTabs === 'SchedulerTab';
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const [templateType, setTemplateType] = useState({
    category: 'anniversary',
    isSchedule: true,
    yearInfo: [],
  });
  const [isref, setIsref] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [scheduleTimeVal, setScheduleTimeVal] = useState('');
  const [scheduleJob, setScheduleJob] = useState();
  const [schedulePointVal, setSchedulePointVal] = useState('');
  const [scheduleIsPoint, setScheduleIsPoint] = useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

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
      label: 'Template Library',
      link: 'app/template',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Recognition',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  const [allYears, setAllYears] = useState([]);
  const fetchAllYearsData = () => {
    setIsref(false);
    const obj = {
      url: URL_CONFIG.GET_ANNIVERSARY_YEARS,
      method: 'get',
      params: { type: templateType.category },
    };
    httpHandler(obj)
      .then((response) => {
        setAllYears(response.data);
        let templateTypeTemp = JSON.parse(JSON.stringify(templateType));
        templateTypeTemp.yearInfo = response.data[0];
        setTemplateType(templateTypeTemp);
        if (response.data && response.data.length > 0) {
          setIsref(true);
        }
      })
      .catch((error) => {
        setIsref(false);
      });
  };

  useEffect(() => {
    fetchAllYearsData();
  }, []);

  const getCardsTemplate = (arg) => {
    setTemplateList(arg);
  };

  const getMessageTemplate = (arg) => {
    setMessageList(arg);
  };

  const getScheduleTime = (arg) => {
    setScheduleTimeVal(arg);
  };
  const getscheduleJob = (arg) => {
    setScheduleJob(arg);
  };

  const getAnniversaryYearInfo = (arg) => {
    setIsref(false);
    if (arg) {
      let templateTypeTemp = JSON.parse(JSON.stringify(templateType));
      templateTypeTemp.yearInfo = arg;
      setTemplateType(templateTypeTemp);
      setIsref(true);
    }
  };

  const refreshYearInfo = (arg) => {
    if (arg) {
      fetchAllYearsData();
    }
  };

  const handleAnniversaryTemplate = () => {
    let templateListArr = [];
    let messageListArr = [];
    templateList &&
      templateList.length > 0 &&
      templateList.map((item) => {
        if (item.scheduled) {
          templateListArr.push(item.id);
        }
        return templateListArr;
      });

    messageList &&
      messageList.length > 0 &&
      messageList.map((item) => {
        if (item.scheduled) {
          messageListArr.push(item.id);
        }
        return messageListArr;
      });

    const templateObj = {
      scheduleTime: scheduleTimeVal,
      scheduleSetting: {
        id: templateType.yearInfo.id,
      },
      templateList: templateListArr,
      messageList: messageListArr,
      scheduleJob: scheduleJob,
      points: Number(schedulePointVal) ? Number(schedulePointVal) : 0,
      is_points: scheduleIsPoint,
    };
    const obj = {
      url: URL_CONFIG.SCHEDULE_ANNIVERSARY,
      method: 'put',
      payload: templateObj,
    };
    httpHandler(obj)
      .then((response) => {
        setIsref(false);
        setTimeout(() => {
          setIsref(true);
        }, 0);
        setShowModal({
          ...showModal,
          type: 'success',
          message: response?.data?.message,
        });
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };
  const getSchedulePoints = (arg) => {
    setSchedulePointVal(arg);
  };
  const getScheduleIsPoint = (arg) => {
    setScheduleIsPoint(arg);
  };
  const tabConfig = [
    {
      title: 'Scheduler',
      id: 'scheduler',
      active: true,
    },
    {
      title: 'Status',
      id: 'status',
      active: false,
    },
  ];

  useEffect(() => {
    if (showAll) {
      if (userRolePermission.ecardTemplates) {
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
    }
  }, [userRolePermission]);
  return (
    <React.Fragment>
      {userRolePermission.ecardTemplates && (
        <>
          {activeTab && activeTab.id !== `status` && (
            <React.Fragment>
              <PageHeader
                title="Work Anniversary"
                navLinksLeft={
                  <Link
                    className="text-right c-c1c1c1 mr-2 my-auto eep_nav_icon_div eep_action_svg"
                    to={{
                      pathname: '/app/ecardIndex',
                    }}
                    state={{
                      activeTab:
                        activeTabs === 'SchedulerTab'
                          ? activeTabs
                          : 'TemplatesTab',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.lessthan_circle,
                    }}
                  ></Link>
                }
              ></PageHeader>
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
                <div className="col-md-12">
                  <YearFilterTab
                    allYears={allYears}
                    getAnniversaryYearInfo={getAnniversaryYearInfo}
                    refreshYearInfo={refreshYearInfo}
                  />
                </div>
                <div className="col-md-12">
                  {isref && (
                    <React.Fragment>
                      <CardsTemplate
                        showAll={showAll}
                        templateType={templateType}
                        getCardsTemplate={getCardsTemplate}
                      />
                      <div className="eep-dropdown-divider-sett"></div>
                      <MessageTemplate
                        showAll={showAll}
                        templateType={templateType}
                        getMessageTemplate={getMessageTemplate}
                      />
                      {showAll && (
                        <div className="eep-dropdown-divider-sett"></div>
                      )}
                      {showAll && (
                        <div className="d-flex">
                          {' '}
                          <ScheduleTime
                            templateType={templateType}
                            getScheduleTime={getScheduleTime}
                            getscheduleJob={getscheduleJob}
                          />
                          <SchedulePoint
                            templateType={templateType}
                            getSchedulePoints={getSchedulePoints}
                            getScheduleIsPoint={getScheduleIsPoint}
                          />
                        </div>
                      )}
                      <div className="d-flex justify-content-center w-100 mb-2">
                        {showAll && (
                          <button
                            type="button"
                            className="eep-btn eep-btn-success"
                            onClick={handleAnniversaryTemplate}
                          >
                            Save & Continue
                          </button>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
          {activeTab && activeTab.id === `status` && (
            <SchedulerCards
              activeTabs={activeTabs}
              templateType={templateType?.category}
            />
          )}
        </>
      )}
      {!userRolePermission.ecardTemplates && (
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illegal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default WorkAnniversarySettings;

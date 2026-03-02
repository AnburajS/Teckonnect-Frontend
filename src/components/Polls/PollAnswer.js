import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import PageHeader from '../../UI/PageHeader';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import {
  formatFilterDate,
  eepFormatDateTime,
} from '../../shared/SharedService';
import { formatDates, formatValue } from '../../constants/utills';

const PollAnswer = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [toggleClass, setToggleClass] = useState(true);
  const [votingState, setVotingState] = useState(false);
  const [isResponsibleState, setIsResponsibleState] = useState(false);
  const [isAnsweredState, setIsAnsweredState] = useState(false);
  const [isAnsweredAt, setIsAnsweredAt] = useState(null);
  const [submitResponseID, setSubmitResponseID] = useState(null);
  const currentUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const location = useLocation();
  const dispatch = useDispatch();
  const pDataValue = location.state ? location.state?.pollData : null;
  const viewTypeValue = location.state ? location.state?.viewType : null;
  const notification = location.state?.notification || null;
  console.log('location', location?.state);
  const [pollData, setPollData] = useState(null);
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
      label: 'Engage',
      link: 'app/engage',
    },
    {
      label: 'POLL',
      link: 'app/closedpolls',
    },
    {
      label: 'poll answer',
      link: '#',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Active Polls',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const fetchPollDetail = (pData) => {
    if (pData) {
      const id = pData.on_focus ? pData.on_focus : pData.id;
      const obj = {
        url: URL_CONFIG.POLL_GET_BY_ID,
        method: 'get',
        params: { id: id },
      };
      httpHandler(obj)
        .then((response) => {
          setPollData(response?.data);
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : 'Something went wrong contact administarator';
          setShowModal({
            ...showModal,
            type: 'danger',
            message: errMsg,
          });
        });
    }
  };

  useEffect(() => {
    if (pDataValue || notification) {
      if (viewTypeValue === 'fromPoll') {
        setSubmitResponseID(pDataValue.id);
        fetchPollDetail(pDataValue.polls);
      } else if (notification) {
        const notificationdata = JSON.parse(notification?.on_focus);
        setSubmitResponseID(notificationdata?.pollResponseId);
        fetchPollDetail(notificationdata);
      } else {
        fetchPollDetail(pDataValue);
        if (pDataValue.pollResponse) {
          let pAnswerIndex = pDataValue.pollResponse.findIndex(
            (x) => x.userId.userId === currentUserData.id
          );
          if (pAnswerIndex !== -1) {
            setSubmitResponseID(pDataValue.pollResponse[pAnswerIndex].id);
          }
        }
      }
    } else {
      setPollData(null);
    }

    return () => {
      setPollData(null);
      setSubmitResponseID(null);
    };
  }, [pDataValue, notification]);

  const submitAnswerHandler = (responseID, pData, ans) => {
    if (!pData.answeredState) {
      if (responseID && ans?.option) {
        const obj = {
          url: URL_CONFIG.POLL_SUBMIT,
          method: 'post',
          payload: {
            id: responseID,
            value: ans.option,
          },
        };
        httpHandler(obj)
          .then(() => {
            fetchPollDetail(pData);
            setVotingState(true);
          })
          .catch((error) => {
            const errMsg =
              error.response?.data?.message !== undefined
                ? error.response?.data?.message
                : 'Something went wrong contact administarator';
            setShowModal({
              ...showModal,
              type: 'danger',
              message: errMsg,
            });
          });
      } else {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: 'Data missing! Please contact administrator',
        });
      }
    }
  };

  const isResponsible = (pData) => {
    setIsAnsweredState(false);
    setIsAnsweredAt(null);
    if (pData && pData.pollResponse) {
      let isResponsibleIndex = pData.pollResponse.findIndex(
        (x) => x.userId?.userId === currentUserData.id
      );
      if (isResponsibleIndex === -1) {
        return false;
      } else {
        if (pData.pollResponse[isResponsibleIndex].state === 'submitted') {
          setIsAnsweredState(true);
          setIsAnsweredAt(
            pData?.pollResponse[isResponsibleIndex]?.choice[0]?.createdAt
              ? eepFormatDateTime(
                  pData?.pollResponse[isResponsibleIndex]?.choice[0]
                    ?.createdAt ?? null
                )
              : null
          );
          return false;
        } else if (pData.pollResponse[isResponsibleIndex].state === 'created') {
          return true;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (pollData) {
      if (isResponsible(pollData)) {
        setIsResponsibleState(true);
        setVotingState(pollData.answeredState);
      } else {
        setIsResponsibleState(false);
        setVotingState(true);
      }
    }

    return () => {
      setIsResponsibleState(false);
      setVotingState(false);
    };
  }, [pollData]);

  const getProgressClassName = (score) => {
    if (score) {
      if (score <= 30) {
        return 'eep_progress_min';
      }
      if (score >= 31 && score <= 70) {
        return 'eep_progress_avg';
      }
      if (score >= 71) {
        return 'eep_progress_max';
      }
    }
  };

  const getSubmittedCount = (submittedData) => {
    var res = submittedData.reduce(function (obj, v) {
      obj[v.state] = (obj[v.state] || 0) + 1;
      return obj;
    }, {});
    if (res.submitted) {
      return res.submitted;
    } else {
      return 0;
    }
  };
  return (
    <React.Fragment>
      <PageHeader title="Poll Results" />
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
      <div
        className={`row eep-create-survey-div eep_with_sidebar ${
          toggleClass ? 'side_open' : ''
        } vertical-scroll-snap`}
      >
        <div className="eep_with_content p-0">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-8">
                <label
                  className="my-3"
                  style={{ fontSize: '24px' }}
                >
                  {pollData ? pollData?.name : ''}
                </label>
                <div className="poll-area col-md-6">
                  {pollData &&
                    JSON.parse(pollData?.options)?.length > 0 &&
                    JSON.parse(pollData?.options)?.map((item, index) => {
                      return (
                        <React.Fragment key={'pollanswer_' + index}>
                          <input
                            id={'opt-' + index}
                            type="checkbox"
                            name="polls"
                          />
                          <label
                            htmlFor={'opt-' + index}
                            // className={`${answeredResponse && answeredResponse.choice[0].value === item.option ? "selected" : ""}`}
                            className={`${
                              pollData?.answeredValue === item?.option
                                ? 'selected'
                                : ''
                            } ${!isResponsibleState ? 'selectall' : ''}`}
                            onClick={() =>
                              submitAnswerHandler(
                                submitResponseID,
                                pollData,
                                item
                              )
                            }
                          >
                            <div className="row no-gutters">
                              <div className="column">
                                <span className="circle"></span>
                                <span className="text">{item?.option}</span>
                              </div>
                            </div>
                            {votingState && (
                              <div className="eep_progress_div">
                                <div
                                  className={`progress ${
                                    pollData?.map
                                      ? getProgressClassName(
                                          pollData?.map[item.option]
                                        )
                                      : ''
                                  }`}
                                  style={{
                                    '--w': `${
                                      pollData?.map
                                        ? pollData?.map[item.option]
                                        : '0'
                                    }`,
                                  }}
                                ></div>
                                <span className="percent">
                                  {pollData?.map
                                    ? formatValue(
                                        pollData?.map[item.option],
                                        2
                                      ) + '%'
                                    : ''}
                                </span>
                              </div>
                            )}
                          </label>
                        </React.Fragment>
                      );
                    })}
                </div>
                {isAnsweredState && (
                  <div
                    className="poll_ans_response col-md-6"
                    id="poll_ans_response"
                  >
                    <div
                      className="alert alert-success"
                      role="alert"
                    >
                      <div className="mb-2">Thank you for voting!.</div>
                      {isAnsweredAt && (
                        <div className="text-right d-flex justify-content-end">
                          <span
                            className="d-flex align-self-center mr-2"
                            dangerouslySetInnerHTML={{
                              __html: svgIcons && svgIcons.clock_icon,
                            }}
                          ></span>
                          <span>{isAnsweredAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* // }  */}
              {pollData &&
                pollData?.createdBy?.user_id === currentUserData?.id && (
                  <div className="col-md-4 col-lg-3 col-xs-12 col-sm-12 align-self-start">
                    <div className="col-md-12 bg-f5f5f5 br-10 p-3 mb-3">
                      <label className="mb-0">
                        Poll Type : <span>{pollData.type}</span>
                      </label>
                      <div className="eep-dropdown-divider"></div>
                      <label className="mb-0">
                        Poll Closing Date :{' '}
                        <span>{formatDates(pollData.endDate)}</span>
                      </label>
                    </div>
                    <div className="col-md-12 b-dbdbdb br-10 p-3">
                      <div className="d-flex justify-content-between">
                        <label className="mb-0">Voter Details : </label>
                        <label className="mb-0">
                          <span>
                            {getSubmittedCount(pollData.pollResponse)}/
                            {pollData.pollResponse.length}
                          </span>
                        </label>
                      </div>
                      <div className="eep-dropdown-divider"></div>
                      <div
                        className="eep_scroll_y"
                        style={{ maxHeight: '245px' }}
                      >
                        {pollData?.pollResponse &&
                          pollData?.pollResponse?.length > 0 &&
                          pollData?.pollResponse
                            ?.sort((a, b) =>
                              a.userId.id > b.userId.id ? 1 : -1
                            )
                            .map((item, index) => {
                              return (
                                <div
                                  className={`d-flex ${
                                    pollData.pollResponse.length - 1 === index
                                      ? ''
                                      : 'mb-2'
                                  }`}
                                  key={'responseUser_' + index}
                                >
                                  <img
                                    src={
                                      item.state === 'submitted'
                                        ? process.env.PUBLIC_URL +
                                          '/images/icons/static/res-green.svg'
                                        : process.env.PUBLIC_URL +
                                          '/images/icons/static/res-red.svg'
                                    }
                                    alt={item.state}
                                    title={item.state}
                                    style={{ width: '15px' }}
                                  />
                                  <label className="mb-0 ml-2">
                                    {item?.userId?.firstname +
                                      ' ' +
                                      item?.userId?.lastname}
                                  </label>
                                </div>
                              );
                            })}
                      </div>
                    </div>
                  </div>
                )}
              {/* {!pDataValue &&
								<div className="col-md-8">
									<div className="alert alert-danger" role="alert">Not able to fetch property data. Please try again from beginning.</div>
								</div>
							} */}
            </div>
          </div>
        </div>
        <ToggleSidebar
          toggleSidebarType="polls"
          sideBarClass={sideBarClass}
          data={pollData}
        />
      </div>
    </React.Fragment>
  );
};

export default PollAnswer;

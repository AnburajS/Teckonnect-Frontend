import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import ResponseInfo from '../../UI/ResponseInfo';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import AwardApprovalModal from '../../modals/AwardApprovalModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import {
  clearModalBackdrop,
  eepFormatDateTime,
} from '../../shared/SharedService';

const NominationsApproval = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const locationInfo = useLocation();
  const eepHistory = useNavigate();
  const approvalDatas = locationInfo.state ? locationInfo.state?.awardData : '';
  const isApprovalState = locationInfo.state
    ? locationInfo.state?.isApproval
    : '';
  const notification = locationInfo.state?.notification;

  const [awardDatas, setAwardDatas] = useState(approvalDatas);
  const [isApproval, setIsApproval] = useState(isApprovalState);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersPic, setUsersPic] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showApprovalAwardModal, setShowApprovalAwardModal] = useState(false);
  const [hashData, setHashData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections?.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    eepHistory('/app/awards', { state: { activeTab: 'MyActionTab' } });
  };

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALLUSERS,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.id,
              pic: item?.imageByte?.image,
            });
          }
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const awardData = approvalDatas ? approvalDatas : awardDatas;
    setAwardDatas(awardData);
    setIsApproval(
      awardData?.judgeId?.fullName
        ? false
        : notification?.on_focus
          ? true
          : isApprovalState,
    );
    let selectedUsersTemp = [];
    awardData &&
      awardData.nominations?.length > 0 &&
      awardData.nominations.map((data) => {
        //selectedUsersTemp.push({id:data.id,isSelected:false, isApproved:false});
        selectedUsersTemp.push({
          id: data.userId.id,
          isApproved: false,
          isApprovalReject: false,
        });
      });
    setSelectedUsers(selectedUsersTemp);

    return () => {
      setSelectedUsers([]);
    };
  }, [approvalDatas, isApprovalState, awardDatas]);

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  const selectUserHandler = (sData, isChecked) => {
    let selectedUsersTemp = JSON.parse(JSON.stringify(selectedUsers));
    for (let i = 0; i < selectedUsersTemp?.length; i++) {
      if (selectedUsersTemp[i].id === sData.userId.id) {
        //selectedUsersTemp[i].isSelected = true;
        selectedUsersTemp[i].isApproved = isChecked;
        selectedUsersTemp[i].isApprovalReject = !isChecked;
        if (isChecked) {
          selectedUsersTemp[i].data = sData;
        } else {
          delete selectedUsersTemp[i].data;
        }
        break;
      }
    }
    setSelectedUsers(selectedUsersTemp);

    // var isApprovedData = selectedUsersTemp.filter((obj) => {
    //   return obj.isApproved;
    // });
    // if (isApprovedData?.length > 0) {
    //   isValid(isApprovedData);
    // } else {
    //   setBtnDisabled(true);
    // }

    const hasAnyDecision = selectedUsersTemp.some(
      (u) => u.isApproved || u.isApprovalReject,
    );

    setBtnDisabled(!hasAnyDecision);
  };

  const isValid = (values) => {
    setBtnDisabled(Object.values(values).some((val) => val === true));
  };

  let selectedUserIndex;
  const getIsUserApproved = (uID, reject) => {
    selectedUserIndex = selectedUsers.findIndex((x) => x.id === uID);
    if (reject) {
      return selectedUserIndex !== -1
        ? selectedUsers[selectedUserIndex].isApprovalReject
        : false;
      // return  selectedUsers[selectedUserIndex].isApprovalReject;
    } else {
      return selectedUserIndex !== -1
        ? selectedUsers[selectedUserIndex].isApproved
        : false;
    }
  };

  // const clickApprovalAwardModal = () => {
  //   setShowApprovalAwardModal(true);
  // };
  const clickApprovalAwardModal = () => {
    const approvedUsers = selectedUsers.filter((u) => u.isApproved);

    // SCENARIO 1: ALL REJECTED
    if (approvedUsers.length === 0) {
      submitRejectOnly();
      return;
    }

    // SCENARIO 2 & 3: SOME / ALL APPROVED
    setShowApprovalAwardModal(true);
  };

  const hashOnChangeHandler = (eve, name) => {
    const { value, checked } = eve.target;
    var hashDataTemp = JSON.parse(JSON.stringify(hashData));
    if (checked) {
      hashDataTemp.push({ id: value, hashName: name });
    } else {
      for (let i = 0; i < hashDataTemp?.length; i++) {
        if (value === hashDataTemp[i].id) {
          hashDataTemp.splice(i, 1);
          break;
        }
      }
    }
    setHashData(hashDataTemp);
  };

  const modalSubmitInfo = (arg) => {
    if (arg.status) {
      clearModalBackdrop();
      setShowApprovalAwardModal(false);
      setShowModal({
        ...showModal,
        type: 'success',
        message: arg.message,
      });
    }
    // setTimeout(() => {
    // eepHistory.push('awards', { activeTab: 'MyActionTab' });
    // }, 1000);
  };

  const submitRejectOnly = () => {
    const payload = {
      manageAwards: { id: awardDatas.id },
      wallPost: false,
      shareWallPost: false,
      hashTag: [],
      userId: [], // IMPORTANT → empty means all rejected
    };

    httpHandler({
      url: URL_CONFIG.APPROVE_RECOGNISED_AWARDS,
      method: 'post',
      payload,
    })
      .then((res) => {
        setShowModal({
          type: 'success',
          message: 'Award rejected successfully',
        });
      })
      .catch(() => {
        setShowModal({
          type: 'error',
          message: 'Something went wrong',
        });
      });
  };

  const fetchAwardApprovalData = (id) => {
    const obj = {
      url: URL_CONFIG.GET_AWARDS_APPROVAL_ID,
      method: 'get',
      params: { id: id },
    };
    httpHandler(obj)
      .then((response) => {
        setAwardDatas(response?.data);
        setIsApproval(true);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    if (notification?.on_focus) {
      fetchAwardApprovalData(notification?.on_focus);
    }
  }, [notification]);
  return (
    <React.Fragment>
      <PageHeader
        title="Award and Approvals"
        navLinksLeft={
          <Link
            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
            to={{
              pathname: '/app/awards',
            }}
            state={{ activeTab: 'MyActionTab' }}
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.lessthan_circle,
            }}
          ></Link>
        }
      />

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

      {showApprovalAwardModal && (
        <AwardApprovalModal
          selectedUsers={selectedUsers}
          usersPic={usersPic}
          awardDatas={awardDatas}
          hashData={hashData}
          modalSubmitInfo={modalSubmitInfo}
        />
      )}

      <div className="pt-4">
        <div className="eep-content-start">
          {awardDatas && awardDatas?.nominations?.length > 0 && (
            <React.Fragment>
              <div className="row mx-0">
                {awardDatas?.nominations.map((item, index) => {
                  return (
                    <div
                      className="col-md-4 col-lg-4 col-lg-3 col-sm-12 ap_col_div"
                      key={'awardCard_' + index}
                    >
                      <div className="bg-white br-15 ap_col_div_inner shadow h-100">
                        <div className="p-3">
                          <div className="ap_col_inner text-left">
                            <img
                              src={getUserPicture(item?.userId?.id)}
                              className="r_award_img selected"
                              alt="User Pic"
                              title={item?.userId?.fullName}
                            />
                            <label className="n_award_add_label font-helvetica-m">
                              {item?.userId?.fullName}
                            </label>
                          </div>
                          <div className="ap_award_info_div">
                            <p
                              className="ap_award_info ap_acat"
                              title="Category"
                            >
                              {awardDatas?.award?.name}
                            </p>
                            <p
                              className="ap_award_info ap_udept"
                              title="Department"
                            >
                              {awardDatas?.judgeId?.department?.name}
                            </p>
                            <p
                              className="ap_award_info"
                              title="Enlite Points"
                            >
                              {awardDatas.award.points}
                            </p>
                            <p
                              className="ap_award_info"
                              title="Nominated By"
                            >
                              {awardDatas?.nominatorId?.fullName}
                            </p>
                            <p
                              className="ap_award_info ap_award_msg"
                              title="Message"
                            >
                              {item.message}
                            </p>
                          </div>
                          <div className="ap_approval_div">
                            <div className="ap_approval_p_div">
                              {/* <p className="ap_approval_p mb-2">Approval</p> */}
                            </div>
                            {isApproval && !awardDatas.recognized && (
                              <div className="ap_approval_img_div ap_submition_div">
                                <div
                                  className={
                                    getIsUserApproved(item?.userId?.id, true)
                                      ? 'ap_not_approved'
                                      : 'ap_not_approved_blank'
                                  }
                                  onClick={() => selectUserHandler(item, false)}
                                >
                                  <span
                                    className="radioImg"
                                    dangerouslySetInnerHTML={{
                                      __html: svgIcons && svgIcons.reject_icon,
                                    }}
                                  ></span>
                                </div>
                                <div
                                  className={
                                    getIsUserApproved(item?.userId?.id)
                                      ? 'ap_approved'
                                      : 'ap_approved_blank'
                                  }
                                  onClick={() => selectUserHandler(item, true)}
                                >
                                  <span
                                    className="radioImg"
                                    dangerouslySetInnerHTML={{
                                      __html: svgIcons && svgIcons.accept_icon,
                                    }}
                                  ></span>
                                </div>
                              </div>
                            )}
                            {awardDatas.recognized && (
                              <div className="ap_approval_img_div ap_submition_div">
                                {item.status !== null &&
                                  item.status === 'rejected' && (
                                    <div className="ap_not_approved">
                                      <span
                                        className="radioImg"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            svgIcons && svgIcons.reject_icon,
                                        }}
                                      ></span>
                                    </div>
                                  )}
                                {item.status !== null &&
                                  item.status === 'approved' && (
                                    <div className="ap_approved">
                                      <span
                                        className="radioImg"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            svgIcons && svgIcons.accept_icon,
                                        }}
                                      ></span>
                                    </div>
                                  )}
                              </div>
                            )}
                            {!isApproval && !awardDatas.recognized && (
                              <div className="ap_approval_img_div ap_submition_div">
                                <div className="ap_not_approved_blank">
                                  {/* <p className="ap_approval_p mb-1">Rejected</p> */}

                                  <span
                                    className="radioImg"
                                    dangerouslySetInnerHTML={{
                                      __html: svgIcons && svgIcons.reject_icon,
                                    }}
                                  ></span>
                                </div>
                                <div className="ap_approved_blank">
                                  <span
                                    className="radioImg"
                                    dangerouslySetInnerHTML={{
                                      __html: svgIcons && svgIcons.accept_icon,
                                    }}
                                  ></span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {isApproval && !awardDatas.recognized && (
                <div className="row mt-4 mb-3 mx-0">
                  <div className="col-md-12 text-center ap_award_tags_div">
                    <div className="eep-dropdown-divider"></div>
                    <div
                      className="btn-group eep_tags_group hashTag eep_scroll_y"
                      style={{ maxHeight: '70px' }}
                    >
                      {awardDatas.award.hashTag &&
                        awardDatas.award.hashTag.map((dataHash, i) => (
                          <div
                            className="eep_tags"
                            key={'hash_' + i}
                          >
                            <input
                              type="checkbox"
                              className="btn-check socialHashTag"
                              name="hashtag"
                              id={'check' + i}
                              value={dataHash.id}
                              autoComplete="off"
                              onChange={(e) =>
                                hashOnChangeHandler(e, dataHash.hashtagName)
                              }
                            />
                            <label
                              className="btn btn-outline-primary"
                              htmlFor={'check' + i}
                            >
                              #{dataHash.hashtagName}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="col-md-12 text-center ap_award_next_div">
                    <button
                      className="eep-btn eep-btn-success"
                      disabled={btnDisabled}
                      onClick={clickApprovalAwardModal}
                      data-toggle="modal"
                      data-target="#awardApprovalModal"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {isApproval && awardDatas.recognized && (
                <div className="d-flex justify-content-center my-3">
                  <div
                    className="alert alert-success"
                    role="alert"
                  >
                    Award approved successfully -{' '}
                    {eepFormatDateTime(awardDatas.updatedAt)}
                  </div>
                </div>
              )}
              {!isApproval && awardDatas.recognized && (
                <div className="d-flex justify-content-center my-3">
                  <div
                    className="alert alert-info"
                    role="alert"
                  >
                    Award approved - {eepFormatDateTime(awardDatas.updatedAt)}{' '}
                    by{' '}
                    {awardDatas.judgeId.fullName +
                      ' - ' +
                      awardDatas.judgeId.department.name}
                  </div>
                </div>
              )}
              {!isApproval && !awardDatas.recognized && (
                <div className="d-flex justify-content-center my-3">
                  <div
                    className="alert alert-warning"
                    role="alert"
                  >
                    Award not approved. Check later.
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
          {awardDatas && awardDatas?.nominations.length <= 0 && (
            <ResponseInfo
              title="Waiting for an approval."
              responseImg="noRecord"
              responseClass="response-info"
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default NominationsApproval;

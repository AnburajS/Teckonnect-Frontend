import React, { useState, useEffect } from 'react';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

const AwardApprovalModal = (props) => {
  const { selectedUsers, usersPic, awardDatas, hashData, modalSubmitInfo } =
    props;

  const initSelectedUsers = selectedUsers ? selectedUsers : [];
  const [selectedUsersData, setSelectedUsersData] = useState(initSelectedUsers);
  const [finalisedData, setFinalisedData] = useState({});
  const [hashTagName, setHashTagName] = useState([]);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [wallStatus, setWallStatus] = useState(false);
  const [awardResponseMsg, setAwardResponseMsg] = useState('');
  const [awardResponseClassName, setAwardResponseClassName] = useState('');

  useEffect(() => {
    setAwardResponseMsg('');
    setAwardResponseClassName('');
    setSelectedUsersData(initSelectedUsers);
    let selectedUsersTemp = JSON.parse(JSON.stringify(initSelectedUsers));
    let userIdTemp = [];
    for (let i = 0; i < selectedUsersTemp.length; i++) {
      if (selectedUsersTemp[i].isApproved) {
        userIdTemp.push(selectedUsersTemp[i].id);
      }
    }

    const hashTagNameTemp = [];
    hashData.length > 0 &&
      hashData.map((res) => {
        return hashTagNameTemp.push(res.hashName);
      });
    setHashTagName(hashTagNameTemp.join(', '));
    let hashTagId = [];
    hashData.length > 0 &&
      hashData.map((res) => {
        return hashTagId.push({ id: res.id });
      });

    let finalisedDataTemp = {
      manageAwards: { id: awardDatas.id },
      wallPost: false,
      shareWallPost: false,
      hashTag: hashTagId,
      userId: userIdTemp,
    };
    setFinalisedData(finalisedDataTemp);
  }, [awardDatas, initSelectedUsers, hashData]);

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  const getSelectedUsers = selectedUsersData.filter((obj) => {
    if (obj.isApproved) {
      return true;
    }

    return false;
  }).length;

  const toggleSwitchHandler = () => {
    setToggleSwitch((prev) => !prev);
    let toggleSwitch1 = !toggleSwitch;
    setWallStatus(toggleSwitch1);
  };

  const recogniseAwardHandler = (arg) => {
    let finalisedDataTemp = JSON.parse(JSON.stringify(finalisedData));
    finalisedDataTemp['wallPost'] = arg ? arg.wallData : false;
    finalisedDataTemp['shareWallPost'] = arg ? arg.shareWallData : false;
    const obj = {
      url: URL_CONFIG.APPROVE_RECOGNISED_AWARDS,
      method: 'post',
      payload: finalisedDataTemp,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setAwardResponseMsg('');
        setAwardResponseClassName('');
        modalSubmitInfo({ status: true, message: resMsg });
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setAwardResponseMsg(errMsg);
        setAwardResponseClassName('response-err');
        modalSubmitInfo({ status: false, message: '' });
      });
  };

  return (
    <React.Fragment>
      <div className="eepModalDiv">
        <div
          className="modal fade a_r_modal_div show"
          id="awardApprovalModal"
          aria-modal="true"
          style={{ display: 'block' }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-4 eep_scroll_y">
              <div className="modal-body py-0 px-0 eep_scroll_y">
                <div className="row equal-cols justify-content-md-center no-gutters awardApprovalModal">
                  <div
                    className="col-md-3 col-lg-3 col-xs-12 col-sm-12 text-left"
                    id="modal_lcol"
                  >
                    <div className="bg-f5f5f5 br-10 h-100">
                      <div className="p-3">
                        <div className="r_award_lcol_div">
                          <div className="r_award_lcol_inner text-left">
                            <img
                              src={
                                awardDatas?.imageByte ||
                                awardDatas?.award?.imageByte
                                  ? awardDatas?.imageByte?.image ||
                                    awardDatas?.award?.imageByte?.image
                                  : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                              }
                              className="r_award_img selected"
                              alt="Award Icon"
                              title={awardDatas.award.name}
                            />
                            <label className="n_award_add_label font-helvetica-m n_award_name">
                              {awardDatas.award.name}
                            </label>
                          </div>
                          <div className="n_award_info_div">
                            <div className="n_dtls_info">
                              <label className="n_dtls_lb font-helvetica-m">
                                Tags
                              </label>
                              <p className="n_award_category mb-1 text-right">
                                {hashTagName ? hashTagName : '-'}
                              </p>
                            </div>
                            <div className="n_dtls_info">
                              <label className="n_dtls_lb font-helvetica-m">
                                Points
                              </label>
                              <p className="n_award_points mb-1 text-right">
                                {awardDatas.award.points}
                              </p>
                            </div>
                            <div className="n_dtls_info ">
                              <label className="n_dtls_lb font-helvetica-m">
                                Team
                              </label>
                              <p className="n_award_dept mb-1 text-right">
                                {awardDatas.nominatorId?.department?.name}
                              </p>
                            </div>
                            <div className="n_dtls_info ">
                              <label className="n_dtls_lb font-helvetica-m">
                                Nomination Type
                              </label>
                              <p className="n_award_type mb-1 text-right">
                                {awardDatas.subType}
                              </p>
                            </div>
                            <div className="n_dtls_info ">
                              <label className="n_dtls_lb font-helvetica-m">
                                Nominated By
                              </label>
                              <p className="n_award_nominatedby mb-1 text-right">
                                {awardDatas?.nominatorId?.fullName}
                              </p>
                            </div>
                            <div className="n_dtls_info selection_summary">
                              <div className="selection_summary_div selection_summary_tot">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/icons/eep-nominees.svg`}
                                  className="selection_summary_img"
                                  alt="Total"
                                  title="Total Nominees"
                                />
                                <span className="">
                                  {selectedUsersData.length}
                                </span>
                              </div>
                              <div className="selection_summary_div selection_summary_select">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/icons/selected.svg`}
                                  className="selection_summary_img"
                                  alt="Selected"
                                  title="Selected Users"
                                />
                                <span className="">{getSelectedUsers}</span>
                              </div>
                              <div className="selection_summary_div selection_summary_reject">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/icons/rejected.svg`}
                                  className="selection_summary_img"
                                  alt="Rejected"
                                  title="Rejected Users"
                                />
                                <span className="">
                                  {selectedUsersData.length - getSelectedUsers}
                                </span>
                              </div>
                            </div>
                            <div className="n_dtls_info selection_summary">
                              <div className="text-right eep_recog_enable">
                                <label className="mb-0 mr-1">Wall Post:</label>
                                <BootstrapSwitchButton
                                  checked={toggleSwitch}
                                  width={110}
                                  onstyle="success"
                                  onlabel="Enable"
                                  offlabel="Off"
                                  style="toggle_switch"
                                  onChange={toggleSwitchHandler}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 px-0 text-center r_award_recog_div">
                            {awardResponseMsg && (
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="response-div m-0">
                                  <p
                                    className={`${awardResponseClassName} response-text`}
                                  >
                                    {awardResponseMsg}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="d-flex flex-column justify-content-center align-items-center">
                              {toggleSwitch && (
                                <button
                                  type="button"
                                  className="eep-btn eep-btn-share mb-2"
                                  disabled={
                                    Object.keys(finalisedData).length &&
                                    finalisedData?.userId.length > 0
                                      ? false
                                      : true
                                  }
                                  onClick={() =>
                                    recogniseAwardHandler({
                                      wallData: false,
                                      shareWallData: true,
                                    })
                                  }
                                >
                                  Approve and Share
                                </button>
                              )}
                              <button
                                type="submit"
                                className="eep-btn eep-btn-success"
                                disabled={
                                  Object.keys(finalisedData).length &&
                                  finalisedData?.userId.length > 0
                                    ? false
                                    : true
                                }
                                onClick={() =>
                                  recogniseAwardHandler({
                                    wallData: wallStatus,
                                    shareWallData: false,
                                  })
                                }
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-9 col-lg-9 col-xs-12 col-sm-12"
                    id="modal_rcol"
                  >
                    <div className="bg-white h-100">
                      <div className="p-2">
                        <div className="ap_award_rcol_div">
                          <div className="row mx-0 ap_award_users_list_div">
                            {selectedUsersData &&
                              selectedUsersData.length > 0 &&
                              selectedUsersData.map((item, index) => {
                                if (item.isApproved) {
                                  return (
                                    <div
                                      className="col-md-6 col-lg-4 col-sm-6 col-xs-6 ap_award_users_list_inner"
                                      key={'selectedList_' + index}
                                    >
                                      <div className="ap_award_users_list_bg">
                                        <div className="ap_award_users_list">
                                          <img
                                            src={getUserPicture(
                                              item.data.userId.id
                                            )}
                                            className="ap_award_pimg mb-2"
                                            alt="User Image"
                                            title={item.data.userId.fullName}
                                          />
                                          <div className="ap_award_user_div">
                                            <label className="ap_award_uname my-0 font-helvetica-m">
                                              {item.data.userId.fullName}
                                            </label>
                                            <p className="ap_award_udept">
                                              {
                                                awardDatas.judgeId.department
                                                  .name
                                              }
                                            </p>
                                          </div>
                                        </div>
                                        <div className="ap_award_user_msg_div">
                                          <p className="ap_award_user_msg">
                                            {item.data.message}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-header py-0 border-bottom-0">
              <button
                type="button"
                className="close closed"
                data-dismiss="modal"
                title="Close"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default AwardApprovalModal;

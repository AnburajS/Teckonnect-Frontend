import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

const AwardRecognizeModal = (props) => {
  const {
    aDataVal,
    confirmSelectedDataVal,
    showAwardModal,
    hashVal,
    modalSubmitInfo,
  } = props;

  const [awardResponseMsg, setAwardResponseMsg] = useState('');
  const [awardResponseClassName, setAwardResponseClassName] = useState('');
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [wallStatus, setWallStatus] = useState(false);
  const [finalisedData, setFinalisedData] = useState({
    manageAwards: {},
    paramsList: [],
    hashTag: [],
  });
  const [confirmSelectedDataValue, setConfirmSelectedDataValue] = useState(
    confirmSelectedDataVal
  );
  const [hashValue, setHashValue] = useState(hashVal);

  const getMyHashTag = (arg) => {
    const arr = [];
    arg?.map((res) => {
      return arr.push('#' + res.hashName);
    });
    return arr.join(', ');
  };

  useEffect(() => {
    if (aDataVal && confirmSelectedDataVal) {
      let obj = [];
      confirmSelectedDataVal.map((item) => {
        return obj.push({ id: item.id, message: item.regSetting.message });
      });

      setFinalisedData({
        manageAwards: { id: aDataVal?.id },
        paramsList: obj,
        hashTag: hashVal,
      });
    }
    setConfirmSelectedDataValue([...confirmSelectedDataVal]);
    setHashValue([...hashVal]);
    setToggleSwitch(false);
  }, [aDataVal, confirmSelectedDataVal, hashVal]);

  useEffect(() => {
    if (showAwardModal) {
      setAwardResponseMsg('');
      setAwardResponseClassName('');
    }
  }, [showAwardModal]);

  const deleteHandler = (arg) => {
    if (arg) {
      let myArray = finalisedData;
      myArray.paramsList.map((item, index) => {
        if (item.id === arg) {
          myArray.paramsList.splice(index, 1);
        }
        return setFinalisedData(myArray);
      });
    }
  };

  const undoHandler = (arg) => {
    if (arg) {
      let myArray = finalisedData;
      let index = confirmSelectedDataValue.findIndex((object) => {
        return object.id === arg;
      });
      myArray.paramsList.push({
        id: arg,
        message: confirmSelectedDataValue[index]['regSetting']['message'],
      });
      setFinalisedData(myArray);
    }
  };

  const previewMessageHandler = (arg) => {
    if (arg) {
      let index = confirmSelectedDataValue.findIndex((object) => {
        return object.id === arg;
      });

      let selectedDataValue = JSON.parse(
        JSON.stringify(confirmSelectedDataValue)
      );
      selectedDataValue[index].regSetting.showMessage =
        !selectedDataValue[index].regSetting.showMessage;
      setConfirmSelectedDataValue([...selectedDataValue]);
    }
  };

  const toggleSwitchHandler = () => {
    setToggleSwitch((prev) => !prev);
    let toggleSwitch1 = !toggleSwitch;
    setWallStatus(toggleSwitch1);
  };

  const recogniseAwardHandler = (arg) => {
    let finalisedDataTemp = JSON.parse(JSON.stringify(finalisedData));
    finalisedDataTemp.hashTag.forEach((object) => {
      delete object['hashName'];
    });
    finalisedDataTemp['wallPost'] = arg ? arg.wallData : false;
    finalisedDataTemp['shareWallPost'] = arg ? arg.shareWallData : false;
    const obj = {
      url: URL_CONFIG.RECOGNIZE_SPOT_AWARD,
      method: 'post',
      payload: finalisedDataTemp,
    };
    httpHandler(obj)
      .then((response) => {
        // const resMsg = response?.data?.message;
        // setAwardResponseMsg(resMsg);
        // setAwardResponseClassName("response-succ");
        // history.push('awards', { activeTab: 'NominatorTab' });
        // props?.setIsAwardRecognizeModal && props.setIsAwardRecognizeModal(false)
        const resMsg = response?.data?.message;
        setAwardResponseMsg('');
        setAwardResponseClassName('');
        modalSubmitInfo({
          status: true,
          message: resMsg,
          awardType: aDataVal?.type,
        });
      })
      .catch((error) => {
        // const errMsg = error?.response?.data?.message;
        // setAwardResponseMsg(errMsg);
        // setAwardResponseClassName("response-err");
        const errMsg = error?.response?.data?.message;
        setAwardResponseMsg(errMsg);
        setAwardResponseClassName('response-err');
        //modalSubmitInfo({ status: false, message: "", awardType:aDataVal?.type });
      });
  };

  const nominateAwardHandler = () => {
    delete finalisedData.hashTag;
    const obj = {
      url: URL_CONFIG.NOMINATE_DO_AWARD,
      method: 'post',
      payload: finalisedData,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setAwardResponseMsg('');
        setAwardResponseClassName('');
        modalSubmitInfo({
          status: true,
          message: resMsg,
          awardType: aDataVal?.type,
        });
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setAwardResponseMsg(errMsg);
        setAwardResponseClassName('response-err');
        //modalSubmitInfo({ status: false, message: "", awardType:aDataVal?.type });
      });
  };

  return (
    <React.Fragment>
      <div className="eepModalDiv">
        <div
          className="modal fade"
          id="AwardRecognizeModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header p-1 border-0 flex-column">
                <button
                  className="close closed"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body eep_scroll_y">
                <div className="modalBodyHeight">
                  <div className="row equal-cols justify-content-md-center no-gutters awardRecognizeModal">
                    <div className="col-md-3 col-lg-3 col-xs-12 col-sm-12 text-left">
                      <div className="bg-f5f5f5 br-10 h-100">
                        {aDataVal && aDataVal?.type === 'spot_award' && (
                          <React.Fragment>
                            <div className="r_award_type">
                              <label className="mb-0">Spot</label>
                            </div>
                          </React.Fragment>
                        )}
                        <div className="p-3">
                          {aDataVal && (
                            <div className="r_award_lcol_div">
                              <div className="r_award_lcol_inner text-left">
                                <img
                                  src={
                                    aDataVal?.imageByte?.image
                                      ? aDataVal?.imageByte?.image
                                      : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                                  }
                                  className="r_award_img selected mr-2"
                                  alt="Award Icon"
                                  title="Award Name"
                                />
                                <label className="n_award_add_label font-helvetica-m n_award_name">
                                  {aDataVal?.award.name}
                                </label>
                              </div>
                              <div className="n_award_info_div">
                                {aDataVal &&
                                  aDataVal?.type === 'spot_award' && (
                                    <div className="n_dtls_info">
                                      <label className="n_dtls_lb font-helvetica-m">
                                        Tags
                                      </label>
                                      <p className="n_award_category badge_info_hash mb-1 text-right eep_truncate_auto">
                                        {hashValue.length > 0
                                          ? getMyHashTag(hashValue)
                                          : '-'}
                                      </p>
                                    </div>
                                  )}
                                <div className="n_dtls_info">
                                  <label className="n_dtls_lb font-helvetica-m">
                                    Points
                                  </label>
                                  <p className="n_award_points mb-1 text-right">
                                    {aDataVal?.award?.points}
                                  </p>
                                </div>
                                <div className="n_dtls_info ">
                                  <label className="n_dtls_lb font-helvetica-m">
                                    Team
                                  </label>
                                  <p className="n_award_dept mb-1 text-right">
                                    {aDataVal?.type === 'spot_award'
                                      ? aDataVal?.departmentId?.name
                                      : aDataVal?.type === 'nomi_award'
                                      ? aDataVal?.nominatorId?.department?.name
                                      : ''}
                                  </p>
                                </div>
                                {aDataVal &&
                                  aDataVal?.type === 'nomi_award' && (
                                    <React.Fragment>
                                      <div className="n_dtls_info ">
                                        <label className="n_dtls_lb font-helvetica-m">
                                          Nomination Type
                                        </label>
                                        <p className="n_award_type mb-1 text-right">
                                          {aDataVal?.subType}
                                        </p>
                                      </div>
                                      <div className="n_dtls_info ">
                                        <label className="n_dtls_lb font-helvetica-m">
                                          Judge
                                        </label>
                                        <p className="n_award_judge mb-1 text-right">
                                          {aDataVal?.judgeId.fullName}
                                        </p>
                                      </div>
                                    </React.Fragment>
                                  )}
                                <div className="n_dtls_info selection_summary">
                                  <div className="selection_summary_div selection_summary_tot">
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/icons/eep-nominees.svg`}
                                      className="selection_summary_img"
                                      alt="Slecetion Summary Icon"
                                      title="Nominee Users"
                                    />
                                    <span className="">
                                      {confirmSelectedDataValue.length}
                                    </span>
                                  </div>
                                  <div className="selection_summary_div selection_summary_select">
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/icons/selected.svg`}
                                      className="selection_summary_img"
                                      alt="Slecetion Summary Icon"
                                      title="Selected Users"
                                    />
                                    <span className="">
                                      {finalisedData?.paramsList.length}
                                    </span>
                                  </div>
                                  <div className="selection_summary_div selection_summary_reject">
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/icons/rejected.svg`}
                                      className="selection_summary_img"
                                      alt="Slecetion Summary Icon"
                                      title="Rejected Users"
                                    />
                                    <span className="">
                                      {Number(confirmSelectedDataValue.length) -
                                        Number(
                                          finalisedData?.paramsList.length
                                        )}
                                    </span>
                                  </div>
                                </div>
                                {aDataVal &&
                                  aDataVal?.type === 'spot_award' && (
                                    <div className="n_dtls_info selection_summary">
                                      <div className="text-right eep_recog_enable">
                                        <label className="mb-0 mr-1">
                                          Wall Post:
                                        </label>
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
                                  )}
                              </div>
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
                              {!awardResponseMsg &&
                                aDataVal?.type === 'spot_award' && (
                                  <div className="d-flex flex-column justify-content-center align-items-center">
                                    {toggleSwitch && (
                                      <button
                                        type="button"
                                        className="eep-btn eep-btn-share mb-2"
                                        onClick={() =>
                                          recogniseAwardHandler({
                                            wallData: false,
                                            shareWallData: true,
                                          })
                                        }
                                        disabled={
                                          finalisedData?.paramsList.length > 0
                                            ? false
                                            : true
                                        }
                                      >
                                        Recognise and Share
                                      </button>
                                    )}
                                    <button
                                      type="submit"
                                      className="eep-btn eep-btn-success"
                                      disabled={
                                        finalisedData?.paramsList.length > 0
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
                                      Recognize
                                    </button>
                                  </div>
                                )}
                              {!awardResponseMsg &&
                                aDataVal?.type === 'nomi_award' && (
                                  <div className="d-flex flex-column justify-content-center align-items-center">
                                    <button
                                      type="submit"
                                      className="eep-btn eep-btn-success"
                                      disabled={
                                        finalisedData?.paramsList.length > 0
                                          ? false
                                          : true
                                      }
                                      onClick={nominateAwardHandler}
                                    >
                                      Nominate
                                    </button>
                                  </div>
                                )}
                            </div>
                          )}
                          {!aDataVal && (
                            <React.Fragment>
                              <div
                                className="alert alert-danger"
                                role="alert"
                              >
                                Not able to fetch property data. Please try
                                again from beginning.
                              </div>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-9 col-lg-9 col-xs-12 col-sm-12">
                      <div className="bg-white h-100">
                        <div className="p-2">
                          <div className="r_award_rcol_div">
                            <div className="row mx-0 r_award_users_list_div">
                              {confirmSelectedDataValue &&
                                confirmSelectedDataValue.length > 0 &&
                                confirmSelectedDataValue.map((data, index) => {
                                  return (
                                    <div
                                      className={`${
                                        !finalisedData.paramsList.some(
                                          (uList) => uList.id === data.id
                                        )
                                          ? 'rmvdUser '
                                          : ' '
                                      } col-md-6 col-lg-4 col-sm-6 col-xs-6 r_award_users_list_inner`}
                                      key={'r_award_users_list_inner_' + index}
                                    >
                                      <div className="r_award_users_list_bg">
                                        <div
                                          className="r_award_users_list r_award_users_list_a"
                                          onClick={() =>
                                            previewMessageHandler(data.id)
                                          }
                                        >
                                          <img
                                            src={
                                              data?.imageByte?.image
                                                ? data.imageByte.image
                                                : `${process.env.PUBLIC_URL}/images/user_profile.png`
                                            }
                                            className="r_award_pimg"
                                            alt="Profile Pic"
                                            title={data.fullName}
                                          />
                                          <div className="n_award_user_div">
                                            <label className="n_award_uname font-helvetica-m">
                                              {data.fullName}
                                            </label>
                                            <p className="n_award_udept">
                                              {data.department.name}
                                            </p>
                                          </div>
                                        </div>
                                        {data.regSetting.showMessage && (
                                          <div className="r_award_user_msg_div">
                                            <p className="form-control px-0">
                                              {data.regSetting.message}
                                            </p>
                                          </div>
                                        )}
                                        <div className="eep_custom_dropdown r_award_users_option c-c1c1c1">
                                          <img
                                            src={`${process.env.PUBLIC_URL}/images/icons/static/kebab.svg`}
                                            data-toggle="dropdown"
                                            className=""
                                            alt="Kebab Icon"
                                            title="Click"
                                          />
                                          <div className="dropdown-menu eep_custom_dropdown_bg">
                                            {finalisedData.paramsList.some(
                                              (uList) => uList.id === data.id
                                            ) && (
                                              <Link
                                                className="eep-options-item"
                                                to="#"
                                                onClick={() =>
                                                  deleteHandler(data.id)
                                                }
                                              >
                                                Delete
                                              </Link>
                                            )}
                                            {!finalisedData.paramsList.some(
                                              (uList) => uList.id === data.id
                                            ) && (
                                              <Link
                                                className="eep-options-item"
                                                to="#"
                                                onClick={() =>
                                                  undoHandler(data.id)
                                                }
                                              >
                                                Undo
                                              </Link>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default AwardRecognizeModal;

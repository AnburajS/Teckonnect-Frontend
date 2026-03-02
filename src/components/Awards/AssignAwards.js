import React, { useEffect, useState } from 'react';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import SpotAwardModal from '../../modals/SpotAwardModal';
import NominateAwardModal from '../../modals/NominateAwardModal';
import ResponseInfo from '../../UI/ResponseInfo';
import { clearModalBackdrop } from '../../shared/SharedService';
import EEPSubmitModal from '../../modals/EEPSubmitModal';

const AssignAwards = (props) => {
  const {
    filterBy,
    bulkUpdateState,
    getSelectedAwards,
    awardData,
    nominateTypeData,
  } = props;

  const [showNominateAwardModal, setShowNominateAwardModal] = useState(false);
  const filterByVal = filterBy ? filterBy.filter : true;
  const [deptOptions, setDeptOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [assignAwardData, setAssignAwardData] = useState({});
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [judgeUsers, setJudgeUsers] = useState([]);
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    setShowNominateAwardModal(false);
  };

  const awardModalClickHandler = (arg) => {
    setAssignAwardData(arg);
  };

  const awardModifyHandler = (e) => {
    const { value, checked } = e.target;
    var selectedCheckTemp = [...checkedBoxes];
    if (checked) {
      selectedCheckTemp = [...selectedCheckTemp, value];
    } else {
      selectedCheckTemp.splice(checkedBoxes.indexOf(value), 1);
    }
    getSelectedAwards(selectedCheckTemp);
    setCheckedBoxes(selectedCheckTemp);
  };

  const fetchDepartmentData = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: 'get',
      params: { active: true },
    };
    httpHandler(obj)
      .then((deptData) => {
        let optionsTemp = [];
        {
          deptData.data.map((deptValue) => {
            optionsTemp.push({ value: deptValue.id, label: deptValue.name });
          });
        }
        setDeptOptions(optionsTemp);
      })
      .catch((error) => {});
  };

  // const fetchUserData = () => {
  //   const obj = {
  //     url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
  //     method: 'get',
  //     params: {
  //       active: true,
  //     },
  //   };
  //   httpHandler(obj)
  //     .then((userData) => {
  //       let optionsTemp = [];
  //       let jud = [];
  //       userData.data.map((uValue) => {
  //         if (
  //           uValue?.user_id !==
  //           JSON.parse(sessionStorage.getItem('userData'))?.id
  //         ) {
  //           optionsTemp.push({ value: uValue.id, label: uValue.fullName });
  //         }
  //       });

  //       userData.data.map((uValue) => {
  //         jud.push({ value: uValue.id, label: uValue.fullName });
  //       });
  //       setUserOptions(optionsTemp);
  //       setJudgeUsers(jud);
  //     })
  //     .catch((error) => {});
  // };
const fetchUserData = () => {
  const currentUserId = JSON.parse(sessionStorage.getItem('userData'))?.id;

  const obj = {
    url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
    method: 'get',
    params: { active: true },
  };

  httpHandler(obj)
    .then((userData) => {
      const filteredUsers = userData.data.filter(
        (u) => u.user_id !== currentUserId
      ).map((u) => ({
        value: u.id,
        label: u.fullName,
      }));

      setUserOptions(filteredUsers); 
      setJudgeUsers(filteredUsers); 
    })
    .catch((error) => {
      console.error("User fetch error:", error);
    });
};

  useEffect(() => {
    fetchDepartmentData();
    fetchUserData();
  }, []);

  const getHashTag = (arg) => {
    const arr = [];
    arg?.map((res) => {
      arr.push(`#${res.hashtagName}`);
    });
    return arr.join(', ');
  };

  const clickNominateAwardModal = () => {
    setShowNominateAwardModal(true);
  };

  const modalSubmitInfo = (arg) => {
    if (arg.status) {
      clearModalBackdrop();
      setShowNominateAwardModal(false);
      setShowModal({
        ...showModal,
        type: 'success',
        message: arg.message,
      });
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
      <SpotAwardModal
        deptOptions={deptOptions}
        assignAwardData={assignAwardData}
         allUserData={userOptions} 
      />
      {showNominateAwardModal && (
        <NominateAwardModal
          hideModal={hideModal}
          judgeUsers={judgeUsers}
          nomiDeptOptions={deptOptions}
          allUserData={userOptions}
          assignAwardData={assignAwardData}
          nominateTypeData={nominateTypeData}
          modalSubmitInfo={modalSubmitInfo}
        />
      )}
      <div
        className={`${
          awardData.length <= 0 ? 'h-100 ' : 'mt-4'
        } row eep-content-start eep-mybadge-div`}
        id="content-start"
      >
        {awardData &&
          awardData.length > 0 &&
          awardData.map((data, index) => (
            <div
              className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-left badge_col_div"
              key={'recognition_' + index}
            >
              <div
                className={
                  bulkUpdateState
                    ? (bulkUpdateState.bulkState || !filterByVal
                        ? 'badge_modify_a '
                        : '') + 'badge_modal_a box9'
                    : 'badge_modal_a box9'
                }
              >
                <div className="badge_assign_div">
                  <div className="outter">
                    <img
                      src={
                        data.imageByte?.image
                          ? data.imageByte.image
                          : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                      }
                      className="badge_img"
                      alt={
                        data?.imageByte?.name
                          ? data.imageByte.name
                          : 'Award Icon'
                      }
                      title={
                        data?.imageByte?.name
                          ? data.imageByte.name
                          : 'Award Icon'
                      }
                    />
                    {bulkUpdateState && bulkUpdateState.bulkState && (
                      <div className="b_ctrl_div c1 b_hide_ctrl_div">
                        <div className="form-check">
                          <input
                            className="form-check-input p_check_all badge-list"
                            type="checkbox"
                            value={data.id}
                            id={'badges_' + index}
                            onClick={awardModifyHandler}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="badge_info_div">
                      <p className="badge_info font-helvetica-m">{data.name}</p>
                      <p
                        className="badge_info badge_info_hash eep_truncate"
                        style={{ maxWidth: '100%' }}
                      >
                        {data?.hashTag?.length > 0
                          ? getHashTag(data.hashTag)
                          : '---'}
                      </p>
                      <p className="badge_info font-helvetica-m">
                        {data.points}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="box-content">
                  <div
                    className="spot_nav_div"
                    onClick={() =>
                      awardModalClickHandler({ data: data, isSpot: true })
                    }
                  >
                    <div className="a_nav_icon spot_nav_icon"></div>
                    <div className="spot_nav_button">
                      <button
                        className="a_nav_button font-helvetica-m spot_button"
                        data-toggle="modal"
                        data-target="#SpotAwardModal"
                      >
                        Spot Award
                      </button>
                    </div>
                  </div>
                  <div
                    className="nominate_nav_div"
                    onClick={() =>
                      awardModalClickHandler({ data: data, isSpot: false })
                    }
                  >
                    <div className="a_nav_icon nominate_nav_icon"></div>
                    <div className="nominate_nav_button">
                      <button
                        className="a_nav_button font-helvetica-m nominate_button"
                        onClick={clickNominateAwardModal}
                        data-toggle="modal"
                        data-target="#NominateAwardModal"
                      >
                        Nominate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {awardData && awardData.length <= 0 && (
          <ResponseInfo
            title="Yet to add Awards! "
            responseImg="noRecord"
            responseClass="response-info"
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default AssignAwards;

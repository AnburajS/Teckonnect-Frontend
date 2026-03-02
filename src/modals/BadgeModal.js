import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BadgeModalAssigUsers from '../components/Badges/BadgeModalAssigUsers';
import BadgeModalInputs from '../components/Badges/BadgeModalInputs';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';
import { sharedDataActions } from '../store/shared-data-slice';

const BadgeModal = (props) => {
  const {
    modalData,
    deptOptions,
    showBadgeModal,
    badgeModalSubmitInfo,
    handleClose,
    newModalData,
  } = props;
  const [wallStatus, setWallStatus] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [uids, setUids] = useState([]);
  const [hashIds, setHashIds] = useState([]);
  const [recogMessage, setRecogMessage] = useState(null);
  const [badgeResponseMsg, setBadgeResponseMsg] = useState('');
  const [badgeResponseClassName, setBadgeResponseClassName] = useState('');
  const [enableRecognize, setEnableRecognize] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const badgeSeledtedUsers = useSelector(
    (state) => state.sharedData.badgeSeledtedUsers,
  );
  const dispatch = useDispatch();

  const getWallPostStatus = (arg) => {
    if (arg) {
      setWallStatus(arg.wallPost);
    }
  };

  const getSelectedUser = (args) => {
    if (args) {
      setFilteredUsers([
        ...args?.map((v) => ({
          id: v?.value,
          firstname: v?.label?.split(' ')?.[0],
          lastname: v?.label?.split(' ')?.[1],
        })),
      ]);
      setSelectedUsers([...args]);
      getFilteredUsers(args?.map((v) => ({ id: JSON.stringify(v?.value) })));
    }
  };
  const getSelectedDept = (args) => {
    if (args) {
      const deptArr = [];
      args.map((res) => {
        return deptArr.push(res.value);
      });

      const obj = {
        url: URL_CONFIG.DEPT_USERS,
        method: 'get',
        params: {
          dept: JSON.stringify(deptArr),
          // deptArr.join()
        },
      };

      httpHandler(obj)
        .then((uData) => {
          const currentUserData = sessionStorage.userData
            ? JSON.parse(sessionStorage.userData)
            : {};
          var uDatas = uData.data;
          for (var i = 0; i < uDatas.length; i++) {
            if (uDatas[i].userId === currentUserData.id) {
              uDatas.splice(i, 1);
            }
          }
          setFilteredUsers([...uDatas]);
          const sUsers = [...badgeSeledtedUsers];
          const existsUsersArr = [];
          for (let i = 0; i < sUsers.length; i++) {
            const isExist = uDatas.filter(
              (data) => data.id === Number(sUsers[i]),
            ).length;
            if (isExist) {
              existsUsersArr.push(sUsers[i]);
            }
          }

          dispatch(sharedDataActions.badgeAllUsersUpdate(existsUsersArr));
        })
        .catch((error) => {
          //const errMsg = error.response?.data?.message;
        });
    }
  };

  const getRegonitionMsg = (arg) => {
    setRecogMessage(arg);
  };

  const getHashValues = (arg) => {
    setHashIds([...arg]);
  };

  const getFilteredUsers = (arg) => {
    if (arg) {
      setUids([...arg]);
    }
  };

  // useEffect(() => {
  //   if (recogMessage && uids.length) {
  //     setEnableRecognize(true);
  //   } else {
  //     setEnableRecognize(false);
  //   }
  // }, [recogMessage, uids]);
  useEffect(() => {
    if (recogMessage && badgeSeledtedUsers.length > 0) {
      setEnableRecognize(true);
    } else {
      setEnableRecognize(false);
    }
  }, [recogMessage, badgeSeledtedUsers]);

  useEffect(() => {
    if (Object.keys(modalData).length) {
      setBadgeResponseMsg('');
      setBadgeResponseClassName('');
      setFilteredUsers([]);
      setWallStatus(false);
    }
  }, [modalData]);

  useEffect(() => {
    setBadgeResponseMsg('');
    setBadgeResponseClassName('');
    setFilteredUsers([]);
    setWallStatus(false);
    setEnableRecognize(false);
    setRecogMessage(null);
    handleClose();
  }, [newModalData]);

  const recognizeBadge = (arg) => {
    let userIds = [],
      deptIds = [];
    selectedUsers.map((res) => {
      userIds.push(res.value);
      return res;
    });

    selectedDepts.map((res) => {
      deptIds.push(res.value);
      return res;
    });

    const badgeRecogData = {
      badge: {
        id: modalData.id,
      },
      message: recogMessage,
      userId: uids,
      hashTag: hashIds,
      wallPost: arg ? arg.wallData : false,
      shareWallPost: arg ? arg.shareWallData : false,
    };
    const obj = {
      url: URL_CONFIG.RECOGNIZE_BADGE,
      method: 'post',
      payload: badgeRecogData,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        badgeModalSubmitInfo({
          status: true,
          success: 'Badge issued successfully!',
          message: '',
        });
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setBadgeResponseMsg(errMsg);
        setBadgeResponseClassName('response-err');
        badgeModalSubmitInfo({ status: false, message: '' });
      });
  };
  const getUsers = (e) => {
    setSelectedDepts(e);
  };

  const getDepts = (e) => {
    setSelectedUsers(e);
  };

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="badgeRecogniseModal"
        aria-modal="true"
      >
        <div
          className="modal-dialog"
          role="document"
        >
          <div className="modal-content p-4">
            <div className="modal-header p-1 border-0 flex-column">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body py-0 px-0 eep_scroll_y">
              <div className="row equal-cols justify-content-md-center modalBodyHeight">
                <div className="col-md-6 col-lg-6 col-xs-12 col-sm-12 mb-3">
                  <BadgeModalInputs
                    modalInputData={modalData}
                    deptInputOptions={deptOptions}
                    getWallPostStatus={getWallPostStatus}
                    getSelectedDept={getSelectedDept}
                    getSelectedUser={getSelectedUser}
                    getHashValues={getHashValues}
                    getRegonitionMsg={getRegonitionMsg}
                    showBadgeModal={showBadgeModal}
                    getUsers={getUsers}
                    getDepts={getDepts}
                    newModalDatas={newModalData}
                  />
                </div>
                <div className="col-md-6 col-lg-6 col-xs-12 col-sm-12 mb-3 assign_users_list_whole_div">
                  <BadgeModalAssigUsers
                    filteredUsers={filteredUsers}
                    getFilteredUsers={getFilteredUsers}
                  />
                </div>

                {!badgeResponseMsg && (
                  <div className="w-100 bg-white pt-3 sticky_position_bottom d-flex justify-content-center align-items-center">
                    {wallStatus && (
                      <button
                        type="button"
                        className="eep-btn eep-btn-share mr-3"
                        onClick={() =>
                          recognizeBadge({
                            wallData: false,
                            shareWallData: true,
                          })
                        }
                        disabled={!enableRecognize}
                      >
                        Recognise and Share
                      </button>
                    )}
                    <button
                      type="button"
                      className="eep-btn eep-btn-success"
                      onClick={() =>
                        recognizeBadge({
                          wallData: wallStatus,
                          shareWallData: false,
                        })
                      }
                      disabled={!enableRecognize}
                    >
                      Recognise
                    </button>
                  </div>
                )}
                {badgeResponseMsg && (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="response-div m-0">
                      <p className={`${badgeResponseClassName} response-text`}>
                        {badgeResponseMsg}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BadgeModal;

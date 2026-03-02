import React, { useEffect, useState } from 'react';
import AssignAwardModalInfo from '../components/Awards/AssigAwardModalInfo';
import NominateAwardModalInput from '../components/Awards/NominateAwardModalInput';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';

const NominateAwardModal = (props) => {
  const {
    nomiDeptOptions,
    hideModal,
    allUserData,
    judgeUsers,
    assignAwardData,
    nominateTypeData,
    modalSubmitInfo,
  } = props;

  const [nominateAwardObj, setNominateAwardObj] = useState({});
  const [awardResponseMsg, setAwardResponseMsg] = useState('');
  const [awardResponseClassName, setAwardResponseClassName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const getAssignObject = (arg) => {
    setAwardResponseMsg('');
    let argTemp = arg;
    //argTemp.award = assignAwardData.data.id;
    argTemp.award = { id: assignAwardData.data.id };
    setNominateAwardObj({ ...arg });
  };

  const isValidForm = (arg) => {
    let isValid = false;

    if (Object.keys(arg).length) {
      for (let key in arg) {
        if (
          typeof arg[key] === 'object' &&
          arg[key] !== null &&
          !Array.isArray(arg[key])
        ) {
          const vv = isValidForm(arg[key]);
          if (!vv) {
            isValid = false;
            break;
          }
        } else {
          if (arg[key] !== undefined && arg[key] !== null && arg[key] !== '') {
            isValid = true;
          } else {
            isValid = false;
          }
        }
      }
    } else {
      isValid = false;
      return isValid;
    }
    return isValid;
  };

  // let userIds = [],
  //   deptIds = [];
  // selectedUsers.map((res) => {
  //   userIds.push(res.value);
  //   return res;
  // });

  // selectedDepts.map((res) => {
  //   deptIds.push(res.value);
  //   return res;
  // });

  useEffect(() => {
    setBtnDisabled(isValidForm(nominateAwardObj));
  }, [nominateAwardObj]);

  const assignNominateAwardHandler = () => {
    if (nominateAwardObj) {
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

      let obj = {
        url: URL_CONFIG.NOMINATE_AWARD,
        method: 'post',
        payload: { ...nominateAwardObj, deptIds },
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
    }
  };

  const getSelectedMonth = (arg) => {
    setSelectedMonth(arg);
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
        id="NominateAwardModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog w-75"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-1 border-0 flex-column">
              <button
                onClick={() => hideModal()}
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="row justify-content-md-center">
                  {assignAwardData && Object.keys(assignAwardData).length && (
                    <AssignAwardModalInfo
                      awardInfo={assignAwardData}
                      selectedMonth={selectedMonth}
                    />
                  )}
                  <NominateAwardModalInput
                    getUsers={getUsers}
                    getDepts={getDepts}
                    nomiDeptOptions={nomiDeptOptions}
                    judgeUsersData={judgeUsers}
                    allUsers={allUserData}
                    nominateTypeDatas={nominateTypeData}
                    getAssignObject={getAssignObject}
                    getSelectedMonth={getSelectedMonth}
                  />
                </div>
                <div className="modal-footer border-0 flex-column">
                  <div className="row justify-content-md-center">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 text-center">
                      {
                        <button
                          type="submit"
                          className="eep-btn eep-btn-success"
                          disabled={!btnDisabled}
                          onClick={assignNominateAwardHandler}
                        >
                          Done
                        </button>
                      }
                      {awardResponseMsg && (
                        <div className="response-div m-0">
                          <p
                            className={`${awardResponseClassName} response-text`}
                          >
                            {awardResponseMsg}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NominateAwardModal;

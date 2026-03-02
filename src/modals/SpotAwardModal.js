import React, { useEffect, useState } from 'react';
import AssignAwardModalInfo from '../components/Awards/AssigAwardModalInfo';
import SpotAwardModalInput from '../components/Awards/SpotAwardModalInput';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';

const SpotAwardModal = (props) => {
  const { deptOptions, assignAwardData } = props;
  const [selectedDept, setSelectedDept] = useState([]);
  const [awardResponseMsg, setAwardResponseMsg] = useState('');
  const [awardResponseClassName, setAwardResponseClassName] = useState('');
  const [isclear, setisclear] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [doneDisable, setDoneDisable] = useState(true);
  const getSelectedDeptment = (arg) => {
    const deptArr = [];
    arg.map((res) => {
      return deptArr.push({ id: res.value });
    });
    setSelectedDept(deptArr);
  };
  // useEffect(() => {
  //   setBtnDisabled(isValidForm(nominateAwardObj));
  // }, [nominateAwardObj]);
  const recognizeAwardOnClickHandler = () => {
    let userIds = [],
      deptIds = [];
    selectedUsers.map((res) => {
      userIds.push({ id: res.value });
      return res;
    });

    selectedDepts.map((res) => {
      deptIds.push({ id: res.value });
      return res;
    });

    const regData = {
      award: {
        id: assignAwardData.data.id,
      },
      departmentId: selectedDept?.length > 0 ? selectedDept : deptIds,
      userIds: userIds,
    };
    const obj = {
      url: URL_CONFIG.SPOT_AWARD,
      method: 'post',
      payload: regData,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setAwardResponseMsg(resMsg);
        setAwardResponseClassName('response-succ');
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setAwardResponseMsg(errMsg);
        setAwardResponseClassName('response-err');
      });
  };

  const getUsers = (e) => {
    setSelectedUsers(e);
  };

  const getDepts = (e) => {
    setSelectedDepts(e);
  };

  React.useEffect(() => {
    setAwardResponseClassName('');
    setAwardResponseMsg('');
    setSelectedDept([]);
    setisclear(!isclear);
  }, [assignAwardData]);
  useEffect(() => {
    if (selectedUsers.length !== 0 || selectedDepts.length !== 0) {
      setDoneDisable(false);
    } else {
      setDoneDisable(true);
    }
  }, [selectedUsers, selectedDepts, selectedDept]);
  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="SpotAwardModal"
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
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="row justify-content-md-center mb-4">
                  {assignAwardData && Object.keys(assignAwardData).length && (
                    <AssignAwardModalInfo awardInfo={assignAwardData} />
                  )}
                  <SpotAwardModalInput
                    isclear={isclear}
                    deptOptions={deptOptions}
                    getSelectedDeptment={getSelectedDeptment}
                    getUsers={getUsers}
                    getDepts={getDepts}
                  />
                </div>
                <div className="modal-footer border-0 flex-column">
                  <div className="row justify-content-md-center">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 text-center">
                      {!awardResponseMsg && (
                        <button
                          type="button"
                          className="btn eep-btn eep-btn-success"
                          disabled={doneDisable}
                          onClick={recognizeAwardOnClickHandler}
                        >
                          {' '}
                          Done{' '}
                        </button>
                      )}
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
export default SpotAwardModal;

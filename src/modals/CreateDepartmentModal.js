import React, { useEffect, useState } from 'react';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';

const CreateDepartmentModal = (props) => {
  const [departmentName, setDepartmentName] = useState('');
  const [responseClassName, checkResponseClassName] = useState('');
  const [responseMsg, checkResponseMsg] = useState('');
  const [disableInput, setDisableInput] = useState(true);

  useEffect(() => {
    return () => {
      let collections = document.getElementsByClassName('modal-backdrop');
      for (var i = 0; i < collections.length; i++) {
        collections[i].remove();
      }
    };
  }, []);

  const departmentNameInputChangeHandler = (event) => {
    checkResponseMsg('');
    setDepartmentName(event.target.value);
  };

  let payOptions = {
    name: departmentName,
    active: true,
  };

  const addDepartmenttHandler = () => {
    if (departmentName !== '') {
      const obj = {
        url: URL_CONFIG.ADDDEPARTMENT,
        method: 'post',
        payload: payOptions,
      };
      httpHandler(obj)
        .then((response) => {
          setDepartmentName('');
          const resMsg = response?.data?.message;
          checkResponseClassName('response-text response-succ');
          checkResponseMsg(resMsg);
          props.fetchDeptData();
        })
        .catch((error) => {
          const errMsg = error?.response?.data?.message
            ? error?.response?.data?.message
            : error?.message;
          checkResponseClassName('response-text response-err');
          checkResponseMsg(errMsg);
        });
    } else {
      checkResponseClassName('response-text response-err');
      checkResponseMsg('Department Name should not be an empty!');
    }
  };

  useEffect(() => {
    setDisableInput(true);
    if (departmentName !== '') {
      setDisableInput(false);
    }
  }, [departmentName]);

  const clearForm = () => {
    checkResponseMsg('');
    checkResponseClassName('');
    setDepartmentName('');
    setDisableInput(true);
  };

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="CreateDepartmentModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-confirm modal-addmessage"
          role="document"
          style={{ width: '400px' }}
        >
          <div className="modal-content">
            <div className="modal-header flex-column p-0">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                onClick={clearForm}
              ></button>
            </div>
            <div className="modal-body eep_scroll_y p-0">
              <div className="modalBodyHeight">
                <div className="p-3">
                  <div className="d-flex justify-content-center w-100 modal-icon-box">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/images/icons/adminpanel/DepartmentMaster.svg'
                      }
                      className="modal-icon-image"
                      alt="Department"
                    />
                  </div>
                  <h5
                    className="modal-title w-100 text-center mt-3"
                    id="exampleModalLabel"
                  >
                    Create a department
                  </h5>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control text-center field-wbr"
                    name="departmentName"
                    placeholder="Enter Department Name"
                    autoComplete="off"
                    value={departmentName}
                    onChange={departmentNameInputChangeHandler}
                  />
                </div>
                {responseMsg && (
                  <p className={responseClassName}>{responseMsg}</p>
                )}
                <div className="modal-footer justify-content-center p-0">
                  <button
                    className="eep-btn eep-btn-cancel eep-btn-xsml"
                    type="button"
                    data-dismiss="modal"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="eep-btn eep-btn-success eep-btn-xsml add_newdepartment"
                    disabled={disableInput}
                    onClick={addDepartmenttHandler}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateDepartmentModal;

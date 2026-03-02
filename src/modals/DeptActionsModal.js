import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import { formatDate } from '../shared/SharedService';

const DeptActionsModal = (props) => {
  const { viewDepartment, fetchDeptData } = props;

  //const deptDatas = props.viewDepartment ? props.viewDepartment : {};
  const initDeptDatas = viewDepartment ? viewDepartment : {};
  const options = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];
  const [deptDatas, setDeptDatas] = useState({});
  const [deptMode, setDeptMode] = useState(false);
  const [responseClassName, setResponseClassName] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [deptName, setDeptName] = useState('');
  const [showSelect, setShowSelect] = useState(false);
  const [optionsList, setOptionsList] = useState({});
  const [deptStatusValue, setDeptStatusValue] = useState(false);

  useEffect(() => {
    return () => {
      let collections = document.getElementsByClassName('modal-backdrop');
      for (var i = 0; i < collections.length; i++) {
        collections[i].remove();
      }
    };
  }, []);

  useEffect(() => {
    setShowSelect(false);
    setResponseMsg('');
    setDeptDatas(initDeptDatas);
    setDeptName(initDeptDatas.name);
    setDeptStatusValue(initDeptDatas.active);
    setOptionsList({
      options: options,
      selectedValue: initDeptDatas.active ? options[0] : options[1],
    });
    setDeptMode(initDeptDatas.deptEditMode);
    // setDeptMode(initDeptDatas.active);

    setTimeout(() => {
      setShowSelect(true);
    }, 0);
  }, [initDeptDatas]);

  /*
  useEffect(() => {
    const deptStatusOption = deptDatas.active ? options[0] : options[1];
    setShowSelect(false);
    setResponseMsg("");
    setOptionsList((prev) => {
      return { options: prev.options, selectedValue: deptStatusOption };
    });

    setTimeout(() => {
      setShowSelect(true);
    }, 0);
  }, [deptDatas]);
  */

  const setVal = (event) => {
    setResponseMsg('');
    setDeptName(event.target.value);
  };

  const statusChangeHandler = (event) => {
    setResponseMsg('');
    setDeptStatusValue(event.value);
  };

  let payOptions = {
    id: deptDatas.id,
    name: deptName,
    active: deptStatusValue,
  };
  const updateDepartmentHandler = () => {
    const obj = {
      url: URL_CONFIG.ADDDEPARTMENT,
      method: 'put',
      payload:
        typeof payOptions === 'string' ? JSON.parse(payOptions) : payOptions,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setResponseClassName('response-text response-succ');
        setResponseMsg(resMsg);
        const objFilter = {
          filterValue: { label: 'Active', value: true },
        };
        fetchDeptData(objFilter);
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
        setResponseClassName('response-text response-err');
        setResponseMsg(errMsg);
      });
  };

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="DeptMasterModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="deptMasterModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-confirm modal-addmessage modal-force-width"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header flex-column p-0">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
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
                    {deptMode ? 'Edit Department' : 'View Department'}
                  </h5>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control text-center field-wbr"
                    name="departmentName"
                    placeholder="Enter Department Name"
                    autoComplete="off"
                    disabled={deptMode ? false : true}
                    value={deptName}
                    onChange={setVal}
                  />
                </div>

                {deptMode && (
                  <div className="form-group field-wbr">
                    {showSelect &&
                      optionsList.options &&
                      optionsList.selectedValue && (
                        <Select
                          classNamePrefix="eep_select_common select"
                          className={`a_designation basic-single`}
                          placeholder=""
                          options={optionsList.options}
                          defaultValue={optionsList.selectedValue}
                          onChange={statusChangeHandler}
                        />
                      )}
                  </div>
                )}

                <div
                  className="accordion"
                  id="accordionExample"
                >
                  <div
                    className="card"
                    style={{
                      border: '0',
                      borderRadius: 'unset',
                      borderColor: 'unset',
                    }}
                  >
                    <div
                      className="d-flex align-items-center showMoreDetails justify-content-between mt-2 c1"
                      id="deptMore"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                      style={{ fontSize: '14px' }}
                    >
                      <span className="mb-0">View Insights</span>
                      <img
                        className="moreImg"
                        alt="List Arrow"
                        src={
                          process.env.PUBLIC_URL +
                          `/images/icons/modal/Rightarrow.svg`
                        }
                        width="20"
                        height="20"
                      />
                    </div>
                    <div
                      id="collapseOne"
                      className="collapse"
                      aria-labelledby="deptMore"
                      data-parent="#accordionExample"
                    >
                      <div
                        className="card-body px-0"
                        style={{ fontSize: '14px' }}
                      >
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-column align-items-start">
                            <label>Created By</label>
                            <p className="font-helvetica-m">
                              {(deptDatas?.createdBy?.firstname ?? '-') +
                                ' ' +
                                (deptDatas?.createdBy?.lastname ?? '')}
                            </p>
                          </div>
                          <div className="d-flex flex-column align-items-start">
                            <label>Created On</label>
                            <p className="font-helvetica-m">
                              {formatDate(deptDatas.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-column align-items-start">
                            <label>Revised By</label>
                            <p className="font-helvetica-m">
                              {(deptDatas?.updatedBy?.firstname ?? '-') +
                                ' ' +
                                (deptDatas?.updatedBy?.lastname ?? '')}
                            </p>
                          </div>
                          <div className="d-flex flex-column align-items-start">
                            <label>Revised On</label>
                            <p className="font-helvetica-m">
                              {formatDate(deptDatas.updatedAt)}
                            </p>
                          </div>
                        </div>
                        {!deptMode && (
                          <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column align-items-start">
                              <label>Status</label>
                              <p className="font-helvetica-m">
                                {initDeptDatas?.active ? 'Active' : 'Inactive'}
                              </p>
                            </div>
                            <div className="d-flex flex-column align-items-start">
                              <label>Department Code</label>
                              <p className="font-helvetica-m">{deptDatas.id}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {responseMsg && (
                  <p className={responseClassName}>{responseMsg}</p>
                )}

                <div className="modal-footer justify-content-center p-0 mt-1">
                  <button
                    className="eep-btn eep-btn-cancel eep-btn-xsml"
                    type="button"
                    data-dismiss="modal"
                  >
                    {deptMode ? 'Discard' : 'Ok'}
                  </button>

                  {deptMode && (
                    <button
                      type="submit"
                      className="eep-btn eep-btn-success eep-btn-xsml add_newdepartment"
                      onClick={updateDepartmentHandler}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeptActionsModal;

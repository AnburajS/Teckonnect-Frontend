import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';

const CreateBranchModal = (props) => {
  const { showModal, setShowModal } = props;
  const [state, setState] = useState({
    country: null,
    name: '',
    description: '',
    active: true,
  });
  const [countryData, setCountryData] = useState([]);
  const [responseClassName, checkResponseClassName] = useState('');
  const [responseMsg, checkResponseMsg] = useState('');

  useEffect(() => {
    checkResponseClassName('');
    checkResponseMsg('');
    getCountry();
    return () => {
      let collections = document.getElementsByClassName('modal-backdrop');
      for (var i = 0; i < collections.length; i++) {
        collections[i].remove();
      }
    };
  }, []);

  const getCountry = () => {
    const obj = {
      url: URL_CONFIG.GET_ALL_COUNTRY,
      method: 'get',
    };
    httpHandler(obj).then((response) => {
      setCountryData(
        response?.data?.map((v) => {
          return { label: `${v?.name} - ${v?.currencyCode}`, value: v?.id };
        })
      );
    });
  };

  const onChange = (k, event) => {
    checkResponseMsg('');
    setState({
      ...state,
      [k]: event,
    });
  };

  const addBranchHandler = () => {
    if (
      !state?.country?.label ||
      !state?.name
      //  || !state?.description
    ) {
      let error = [];
      Object.keys(state)?.map((v) => {
        if (!state[v] && v !== 'description') {
          error.push(v);
        }
      });
      checkResponseClassName('response-text response-err');
      checkResponseMsg(error?.join(', ') + ' should not be an empty!');
      return;
    }
    const ex_value = props?.data?.find(
      (v) =>
        v?.country?.countryName === state?.country?.label &&
        v?.name === state?.name
    );
    if (ex_value && !state?.id) {
      checkResponseClassName('response-text response-err');
      checkResponseMsg(
        'We have already added a branch with the same country and branch name.'
      );
      return;
    }
    let payOptions = {
      active: state?.active,
      countryId: state?.country?.value,
      branchName: state?.name,
      description: state?.description ?? '',
    };
    if (props?.editData) {
      payOptions = {
        ...payOptions,
        id: state?.id,
      };
    }
    const obj = {
      url: props?.editData ? URL_CONFIG.UPDATE_BRANCH : URL_CONFIG.ADDBRANCH,
      method: props?.editData ? 'put' : 'post',
      payload: payOptions,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        checkResponseClassName('response-text response-succ');
        checkResponseMsg(resMsg);
        props?.fetchDeptData();
        props?.setisOpen(false);
        setShowModal({
          ...showModal,
          type: 'success',
          message: ' ',
          success: `Branch Master ${
            props?.editData ? 'updated' : 'created'
          } successfully!`,
        });
      })
      .catch((error) => {
        const errMsg = error?.message;
        checkResponseClassName('response-text response-err');
        checkResponseMsg(errMsg);
      });
  };

  useEffect(() => {
    checkResponseClassName('');
    checkResponseMsg('');
    if (props?.editData) {
      setState({
        ...state,
        ...props.editData,
        country: {
          label: props.editData?.country?.countryName,
          value: props.editData?.country?.id,
        },
      });
    } else {
      setState({
        country: null,
        name: '',
        description: '',
        active: true,
      });
    }
  }, [props.editData]);

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="CreateBranchModal"
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
                onClick={() => props?.setisOpen(false)}
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
                    {props?.editData ? 'Update ' : 'Create new '}
                    Branch
                  </h5>
                </div>
                <div className="form-group field-wbr">
                  <Select
                    classNamePrefix="eep_select_common select"
                    className={`a_designation basic-single`}
                    placeholder="status"
                    options={[
                      { label: 'Active', value: true },
                      { label: 'Inactive', value: false },
                    ]}
                    value={{
                      value: state.active,
                      label: state.active ? 'Active' : 'Inactive',
                    }}
                    onChange={(e) => onChange('active', e.value)}
                  />
                </div>
                <div className="form-group field-wbr">
                  <Select
                    classNamePrefix="eep_select_common select"
                    className={`a_designation basic-single`}
                    placeholder="country *"
                    options={countryData}
                    value={state.country}
                    onChange={(e) => onChange('country', e)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control text-center field-wbr"
                    name="name"
                    placeholder="Enter Branch Name *"
                    autoComplete="off"
                    value={state.name}
                    onChange={(e) => onChange('name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    maxLength={80}
                    type="text"
                    className="form-control text-center field-wbr"
                    name="description"
                    placeholder="Add Description"
                    autoComplete="off"
                    value={state.description}
                    onChange={(e) => onChange('description', e.target.value)}
                  />
                </div>
                {responseMsg && (
                  <p
                    style={{ textTransform: 'capitalize' }}
                    className={responseClassName}
                  >
                    {responseMsg}
                  </p>
                )}
                <div className="modal-footer justify-content-center p-0">
                  <button
                    className="eep-btn eep-btn-cancel eep-btn-xsml"
                    type="button"
                    data-dismiss="modal"
                    onClick={() => props?.setisOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="eep-btn eep-btn-success eep-btn-xsml add_newdepartment"
                    onClick={addBranchHandler}
                  >
                    {props?.editData ? 'Update' : 'Create'}
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
export default CreateBranchModal;

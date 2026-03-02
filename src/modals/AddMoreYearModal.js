import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import { base64ToFile } from '../helpers';
import Fileupload from '../fileUpload/Fileupload';
import { validateFileSize } from '../constants/utills';

const AddMoreYearModal = (props) => {
  const { refreshAddedYears } = props;

  const [yearInterval, setYearInterval] = useState('');
  const [yearMessage, setYearMessage] = useState('');
  const [show, setShow] = useState(false);
  const [submitResponseMsg, setSubmitResponseMsg] = useState('');
  const [submitResponseClassName, setSubmitResponseClassName] = useState('');
  const [imgError, setImgError] = useState('');
  const msgMaxLength = 120;
  const [formIsValid, setFormIsValid] = useState(false);
  const addMoreYearobj = {
    yearsInterval: '',
    message: '',
    imageByte: {},
  };
  const [addMoreYearModalData, setAddMoreYearModalData] =
    useState(addMoreYearobj);

  useEffect(() => {
    setYearInterval('');
    setYearMessage('');
    setSubmitResponseMsg('');
    setSubmitResponseClassName('');
  }, []);

  const onChangeInput = (e) => {
    setYearInterval(e.target.value);
    let addMoreYearModalDataTemp = JSON.parse(
      JSON.stringify(addMoreYearModalData),
    );
    addMoreYearModalDataTemp.yearsInterval = e.target.value;
    setAddMoreYearModalData(addMoreYearModalDataTemp);
  };

  const onChangeTextarea = (e) => {
    e.target.value = e.target.value.substring(0, msgMaxLength);
    setYearMessage(e.target.value);
    let addMoreYearModalDataTemp = JSON.parse(
      JSON.stringify(addMoreYearModalData),
    );
    addMoreYearModalDataTemp.message = e.target.value;
    setAddMoreYearModalData(addMoreYearModalDataTemp);
  };

  const ClickHandler = () => {
    document.getElementById('newYearfileLoader').value = '';
    document.getElementById('newYearfileLoader').click();
  };

  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const ChangeHandler = (event) => {
    setImgError('');
    setShow(false);
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const isValid = validateFileSize(file, 1);

      if (isValid === true) {
        var fileType = file['type'];
        if (validImageTypes.includes(fileType)) {
          var tempFileName = file.name;
          tempFileName = tempFileName.replace(/\s/g, '');
          var reader = new FileReader();
          reader.onload = function () {
            document.getElementById('addYearImg').src = reader.result;
            let addMoreYearModalDataTemp = JSON.parse(
              JSON.stringify(addMoreYearModalData),
            );
            addMoreYearModalDataTemp.imageByte.image = reader.result;
            addMoreYearModalDataTemp.imageByte.name = tempFileName;
            setAddMoreYearModalData(addMoreYearModalDataTemp);
          };
          reader.readAsDataURL(file);
          setShow(true);
        } else {
          setShow(false);
          RemoveAddYearImg();
          setImgError('Invalid Image Type');
          setAddMoreYearModalData(addMoreYearobj);
        }
      } else {
        setShow(false);
        RemoveAddYearImg();
        setImgError(isValid);
        setAddMoreYearModalData(addMoreYearobj);
      }
    }
  };

  const RemoveAddYearImg = () => {
    let addMoreYearModalDataTemp = JSON.parse(
      JSON.stringify(addMoreYearModalData),
    );
    addMoreYearModalDataTemp.imageByte = {};
    setAddMoreYearModalData(addMoreYearModalDataTemp);
    document.getElementById('newYearfileLoader').value = '';
    setShow(false);
  };

  const AddMoreYearHandler = () => {
    if (formIsValid) {
      const base64Data = (addMoreYearModalData?.imageByte?.image).replace(
        /^data:image\/\w+;base64,/,
        '',
      );
      const file = base64ToFile(base64Data);

      const formData = new FormData();
      formData.append('image', file);
      const obj_ = {
        url: URL_CONFIG.UPLOAD_FILES,
        method: 'post',
        payload: formData,
      };

      httpHandler(obj_)
        .then((res) => {
          setFormIsValid(false);
          const obj = {
            url: URL_CONFIG.ANNIVERSARY_ECARD,
            method: 'post',
            payload: {
              ...addMoreYearModalData,
              imageByte: res?.data?.data?.[0]?.url ?? '',
            },
          };
          httpHandler(obj)
            .then((response) => {
              const resMsg = response?.data?.message;
              resetForm();
              setSubmitResponseMsg(resMsg);
              setSubmitResponseClassName('response-succ');
              refreshAddedYears(true);
              window.$('#addMoreYearModal').modal('hide');

              // ✅ Reset form AFTER closing
              resetForm();
            })
            .catch((error) => {
              const errMsg = error?.response?.data?.message;
              setSubmitResponseMsg(errMsg);
              setSubmitResponseClassName('response-err');
              refreshAddedYears(false);
            });
        })
        .catch((error) => {
          const errMsg = error?.response?.data?.message;
          setSubmitResponseMsg(errMsg);
          setSubmitResponseClassName('response-err');
          refreshAddedYears(false);
        });
    }
  };

  const resetForm = () => {
    document.getElementById('newYearfileLoader').value = '';
    setShow(false);
    setYearInterval('');
    setYearMessage('');
    enablebtn();
    setSubmitResponseMsg('');
    setSubmitResponseClassName('');
    setAddMoreYearModalData(addMoreYearobj);
  };

  const enablebtn = () => {
    if (yearInterval > 0 && yearInterval !== '' && yearMessage !== '' && show) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  };

  useEffect(() => {
    setSubmitResponseMsg('');
    setSubmitResponseClassName('');
    enablebtn();
  }, [yearInterval, yearMessage, show]);

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="addMoreYearModal"
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
              <div className="row modalBodyHeight">
                <div className="col-md-5 addMoreYearTemplate_div p-3 my-auto">
                  {show && !imgError && (
                    <div
                      id="addMoreYearTemplate"
                      className=""
                    >
                      <div className="row prevTempImage_div">
                        <div className="col-md-12">
                          <img
                            id="addYearImg"
                            className="w-100"
                            src=""
                            alt="Preview Temp Image"
                          />
                        </div>
                      </div>
                      <div className="row img-control_div my-3">
                        <div className="col-md-12 text-center">
                          <Link
                            to="#"
                            className="clearNewImage mx-2"
                            onClick={RemoveAddYearImg}
                          >
                            {' '}
                            Remove{' '}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  {imgError && (
                    <div
                      id="addMoreYearTemplate"
                      style={{ minHeight: '250px' }}
                    >
                      <div className="d-flex allign-content-center">
                        <div
                          className="alert alert-danger"
                          role="alert"
                        >
                          {imgError}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-7 addyearCompose_div p-3">
                  <div className="panel panel-default p-4">
                    <div className="panel-body message">
                      <div className="compose_text">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/icons/tasks/compose.png`}
                          className=""
                        />
                      </div>
                      <h4 className="text-center cc_color my-3 font-helvetica-m font-weight-bold">
                        Add Anniversary year(s)
                      </h4>
                      <form
                        className="form-horizontal"
                        role="form"
                      >
                        <div className="form-group row">
                          <label
                            htmlFor="newYear"
                            className="col-sm-2 col-form-label"
                          >
                            Years:
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="number"
                              className="form-control text-center border-0"
                              id="newYear"
                              name="newYear"
                              autoComplete="off"
                              min="1"
                              value={yearInterval}
                              placeholder="Enter the year"
                              onChange={(e) => onChangeInput(e)}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            htmlFor="newYearMessage"
                            className="col-sm-2 col-form-label"
                          >
                            Message:
                          </label>
                          <div className="col-sm-10">
                            <textarea
                              className="form-control text-center"
                              name="newYearMessage"
                              id="newYearMessage"
                              rows="2"
                              value={yearMessage}
                              maxLength={msgMaxLength}
                              placeholder="Compose your message"
                              onChange={(e) => onChangeTextarea(e)}
                            ></textarea>
                          </div>
                        </div>
                        <div className="form-group row yourmessage_div">
                          <div className="col-sm-2"></div>
                          <div className="col-sm-10">
                            <div className="bg-white px-3 py-3 yourmessage_inner_div text-center">
                              <div className="col-sm-12 pb-2 mb-2">
                                Upload Image
                              </div>
                              <div className="col-sm-12 justify-items">
                                <Fileupload
                                  addIconClickHandler={ClickHandler}
                                  onChangeHandler={ChangeHandler}
                                  height={'180px'}
                                  width={'200px'}
                                  className={'add_newyear_img'}
                                  inputId={'newYearfileLoader'}
                                  accept="image/png, image/jpeg"
                                  suggested={'600x800'}
                                  suggestedText={
                                    'Preferred Upload Size 600x800px '
                                  }
                                />

                                {/* <Link to="#">
                                  <img src={`${process.env.PUBLIC_URL}/images/icons/tasks/add-message.svg`} className="add_newyear_img" alt="Add Template" onClick={ClickHandler} />
                                </Link>
                                <input type="file" className="d-none imgFileLoader" id="newYearfileLoader" modalid="addMoreYearModal" name="files" title="Load File" accept="image/png, image/jpeg" onChange={ChangeHandler} /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className="col-sm-12 p-0 mt-4 addYearComposeButtonDiv">
                        <div className="form-group row">
                          <div className="col-sm-1"></div>
                          <div className="col-sm-11">
                            <button
                              type="button"
                              className="eep-btn eep-btn-cancel"
                              data-dismiss="modal"
                              aria-hidden="true"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="eep-btn eep-btn-success float-right"
                              disabled={formIsValid ? '' : 'disabled'}
                              onClick={AddMoreYearHandler}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        {submitResponseMsg && (
                          <div className="form-group row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-11">
                              <div className="response-div m-0">
                                <p
                                  className={`${submitResponseClassName} response-text`}
                                >
                                  {submitResponseMsg}
                                </p>
                              </div>
                            </div>
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
    </div>
  );
};
export default AddMoreYearModal;

import React, { useEffect, useState } from 'react';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';

const AddSurveyToRecognitionModal = (props) => {
  const { surveyAllData, fetchSurveyData } = props;

  const [surveyResponseMsg, setsurveyResponseMsg] = useState('');
  const [surveyResponseClassName, setsurveyResponseClassName] = useState('');

  useEffect(() => {
    setsurveyResponseMsg('');
    setsurveyResponseClassName('');
  }, [surveyAllData]);

  const addSurveyHandler = () => {
    if (surveyAllData) {
      const obj = {
        url: URL_CONFIG.LIBRARY_ADD_SURVEY,
        method: 'post',
        payload: surveyAllData,
      };

      httpHandler(obj)
        .then((response) => {
          const resMsg = response?.data?.message;
          //setsurveyResponseMsg(resMsg);
          setsurveyResponseMsg('Survey Created Successfully!');
          setsurveyResponseClassName('response-succ');
          fetchSurveyData();
        })
        .catch((error) => {
          const errMsg = error?.response?.data?.message;
          setsurveyResponseMsg(errMsg);
          setsurveyResponseClassName('response-err');
        });
    }
  };

  return (
    <div
      id="SurveyRecognitionModal"
      className="modal fade"
      aria-modal="true"
    >
      <div className="modal-dialog modal-confirm">
        <div className="modal-content">
          <div className="modal-header flex-column">
            <div className="d-flex justify-content-center w-100 modal-icon-box">
              <img
                src={
                  process.env.PUBLIC_URL +
                  '/images/icons/popup/CertificateConfirm.svg'
                }
                className="modal-icon-image"
                alt="Success"
              />
            </div>
          </div>
          <div className="modal-body success_message">
            <h5 className="modal-title mb-2">Are you sure?</h5>
            <p className="modal-desc mb-0">
              Do you really want to add this survey for recognition?
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            {!surveyResponseMsg && (
              <React.Fragment>
                <button
                  type="button"
                  className="eep-btn eep-btn-cancel eep-btn-xsml"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="eep-btn eep-btn-success eep-btn-xsml"
                  onClick={addSurveyHandler}
                >
                  Confirm
                </button>
              </React.Fragment>
            )}

            {surveyResponseMsg && (
              <div className="response-div m-0">
                <p className={`${surveyResponseClassName} response-text`}>
                  {surveyResponseMsg}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};
export default AddSurveyToRecognitionModal;

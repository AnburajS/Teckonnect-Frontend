import $ from 'jquery';
import React, { useEffect } from 'react';
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');
require('formBuilder/dist/form-render.min.js');

const SurveyPreviewQuestionModal = (props) => {
  const { confirmCreateSurveyHandler, jsonData } = props;

  const previewHandler = () => {
    const wrap = $('#previewSurveyQuestions');
    $('#previewSurveyQuestions').html('');
    if (jsonData !== undefined && jsonData.length) {
      wrap.formRender({
        formData: jsonData,
      });
    } else {
      var no_data = `<div className='text-center'><img src=${
        process.env.PUBLIC_URL + '/images/no-data.jpg'
      } className='w-50' /></div>`;
      $('#previewSurveyQuestions').html(no_data);
    }
  };

  useEffect(() => {
    previewHandler();
  }, [jsonData]);

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade show"
        id="SurveyPreviewQuestionModal"
      >
        <div className="modal-dialog w-75">
          <div className="modal-content p-4">
            <div className="modal-header p-0 border-bottom-0">
              <button
                type="button"
                className="close closed"
                data-dismiss="modal"
                title="Close"
              ></button>
            </div>
            <div className="modal-body py-0 px-0 eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="w-100 bg-f5f5f5 br-10 mb-3">
                  <div className="p-4">
                    <div className="row no-gutters">
                      <div className="col-md-12">
                        <div
                          id="previewSurveyQuestions"
                          className="viewEEPSurvey"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row w-100 no-gutters">
                  <div className="col-md-12 text-center">
                    <button
                      type="button"
                      className="eep-btn eep-btn-cancel mr-2"
                      data-dismiss="modal"
                    >
                      Go Back
                    </button>
                    <button
                      type="button"
                      className="eep-btn eep-btn-success"
                      onClick={confirmCreateSurveyHandler}
                    >
                      Confirm Questions
                    </button>
                    {/* <Link to={{ pathname: "createsurvey", state: {surveyData: {isQuestionBank:true, surveyQuestions:jsonData }} }} className="eep-btn eep-btn-success">Confirm Questions </Link> */}
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

export default SurveyPreviewQuestionModal;

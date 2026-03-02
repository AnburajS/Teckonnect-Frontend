import React, { useEffect, useState } from 'react';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');
require('formBuilder/dist/form-render.min.js');

const SurveyPreviewModal = (props) => {
  useEffect(() => {
    appendFormRender(props?.previewData);
  }, [props.previewData]);

  const appendFormRender = (fData) => {
    if (fData) {
      const wrap = $('#surveyAnswer');
      $('#surveyAnswer').html('');
      if (fData !== undefined && fData.length) {
        wrap.formRender({
          dataType: 'json',
          formData: JSON.stringify(fData),
          // });
          render: true,
        });

        // 🔒 PREVIEW MODE — disable all answers
        setTimeout(() => {
          wrap.find('input, textarea, select').prop('disabled', true);
        }, 100);
      } else {
        var no_data = `<div className='text-center'><img src=${process.env.PUBLIC_URL + '/images/no-data.jpg'} className='w-50' /></div>`;
        $('#surveyAnswer').html(no_data);
      }
    }
  };
  return (
    <div className="eepModalDiv">
      <div
        className="modal fade show"
        id="surveyPreviewModal"
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
              <div
                className="row justify-content-md-center"
                style={{ height: '80vh', overflow: 'auto' }}
              >
                <div
                  id="surveyAnswer"
                  className="tc_design eep_survey_view eep_survey_answer fb-render"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SurveyPreviewModal;

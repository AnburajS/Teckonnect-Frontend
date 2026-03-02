import $ from 'jquery';
import React, { createRef, useEffect, useState } from 'react';
window.jQuery = $;
window.$ = $;
require('jquery-ui-sortable');
require('formBuilder');

const FormBuilderComponent = (props) => {
  const { getJsonData, getSurveyTitle, initSurveyData, isLibrary } = props;
  //const [jsonData, setJsonData] = useState({});
  const [surveyTitle, setSurveyTitle] = useState('');

  const fb = createRef();
  var shortAnswerIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="30.114" height="29.76" viewBox="0 0 30.114 29.76"><path id="Survey_Short_Answer" data-name="Survey Short Answer" d="M30.9,13.6A14.862,14.862,0,0,0,14.6.6,15.113,15.113,0,0,0,1.8,10.5c0,.1-.1.3-.1.4s-.1.3-.1.4v.1a14.191,14.191,0,0,0-.5,2.2,14.338,14.338,0,0,0,4,12.3.9.9,0,0,1-.1.5,36.006,36.006,0,0,1-2,3.9H17.4A14.621,14.621,0,0,0,30.9,13.6ZM16.4,20h-5a1.4,1.4,0,0,1,0-2.8h5a1.4,1.4,0,1,1,0,2.8Zm4-6h-9a1.4,1.4,0,0,1,0-2.8h9a1.4,1.4,0,1,1,0,2.8Z" transform="translate(-0.937 -0.54)"/></svg>';
  var checkBoxIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="31.003" height="31" viewBox="0 0 31.003 31"><g id="Survey_Checkboxes" data-name="Survey Checkboxes" transform="translate(-0.5 -0.5)"><path id="Path_2270" data-name="Path 2270" d="M23.5,9.2a1.012,1.012,0,0,1-.7.4l-8.7,8.7-.7.7c-.2,0-.2,0-.2-.2L9.4,15c-.9-.9-1.6-1.1-2.2-.4-.7.7-.4,1.3.2,2.2l4.7,4.7c1.1,1.1,1.6,1.1,2.7,0l10-10a1.012,1.012,0,0,0,.4-.7A1.21,1.21,0,0,0,25,9.2,1.086,1.086,0,0,0,23.5,9.2Z" fill="#010101"/><g id="Group_2619" data-name="Group 2619"><path id="Path_2271" data-name="Path 2271" d="M25.5,31.5H6.5a6.018,6.018,0,0,1-6-6V6.5a6.018,6.018,0,0,1,6-6h19a6.018,6.018,0,0,1,6,6v19A5.834,5.834,0,0,1,25.5,31.5ZM6.6,2.5A3.8,3.8,0,0,0,2.8,6.3v19a3.8,3.8,0,0,0,3.8,3.8h19a3.8,3.8,0,0,0,3.8-3.8V6.3a3.8,3.8,0,0,0-3.8-3.8Z" fill="#010101"/></g></g></svg>';
  var dropDownIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="31.3" height="31.3" viewBox="0 0 31.3 31.3"><g id="Dropdown_2_" data-name="Dropdown (2)" transform="translate(-0.3 -0.4)"><path id="Path_2272" data-name="Path 2272" d="M16,.4a15.65,15.65,0,1,0,0,31.3A15.454,15.454,0,0,0,31.6,16,15.556,15.556,0,0,0,16,.4Zm0,27.2A11.482,11.482,0,0,1,4.4,16,11.4,11.4,0,0,1,16,4.5,11.376,11.376,0,0,1,27.5,16,11.523,11.523,0,0,1,16,27.6Z" fill="#010101"/><path id="Path_2273" data-name="Path 2273" d="M22.2,11.9a1.681,1.681,0,0,0-1.8.5,28.284,28.284,0,0,0-3,3L16,16.8a.2.2,0,0,0-.2-.2l-3.9-3.9a1.789,1.789,0,0,0-1.8-.5,1.98,1.98,0,0,0-1.4,1.4,1.681,1.681,0,0,0,.5,1.8l5.5,5.5a1.787,1.787,0,0,0,2.8,0l2.3-2.3L23,15.4a1.789,1.789,0,0,0,.5-1.8C23.3,12.6,22.9,12.1,22.2,11.9Z" fill="#010101"/></g></svg>';
  var multipleOptionIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31"><g id="Survey_Multi_Option" data-name="Survey Multi Option" transform="translate(-0.4 -0.6)"><path id="Path_2274" data-name="Path 2274" d="M15.9.6A15.578,15.578,0,0,0,.4,16.1,15.387,15.387,0,0,0,15.9,31.6,15.325,15.325,0,0,0,31.4,16.1,15.449,15.449,0,0,0,15.9.6Zm0,26.3A10.75,10.75,0,1,1,26.6,16.1,10.712,10.712,0,0,1,15.9,26.9Z" fill="#010101"/><circle id="Ellipse_445" data-name="Ellipse 445" cx="7.1" cy="7.1" r="7.1" transform="translate(8.8 9)" fill="#010101"/></g></svg>';
  var paragraphIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="30.8" height="30.8" viewBox="0 0 30.8 30.8"><g id="Survey_Paragraph" data-name="Survey Paragraph" transform="translate(-0.6 -0.7)"><path id="Path_2275" data-name="Path 2275" d="M25.4.7H6.6a6.018,6.018,0,0,0-6,6V25.5a6.018,6.018,0,0,0,6,6H25.4a6.018,6.018,0,0,0,6-6V6.6A5.933,5.933,0,0,0,25.4.7Zm3.8,24.5A3.734,3.734,0,0,1,25.4,29H6.6a3.734,3.734,0,0,1-3.8-3.8V6.4A3.734,3.734,0,0,1,6.6,2.6H25.4a3.734,3.734,0,0,1,3.8,3.8V25.2Z" fill="#010101"/><path id="Path_2276" data-name="Path 2276" d="M22.7,6H13.2c-2.5,0-4.5,2.8-4.9,4.6a9.253,9.253,0,0,0-.2,2.9,6.3,6.3,0,0,0,5.3,4.9h1.3a.632.632,0,0,1,.7.7v6.2a.684.684,0,0,0,.7.7h1.3a.684.684,0,0,0,.7-.7V9.1a.632.632,0,0,1,.7-.7c.5,0,.7.2.7.7V25.5a.684.684,0,0,0,.7.7h1.3a.684.684,0,0,0,.7-.7V9.3a.632.632,0,0,1,.7-.7.632.632,0,0,0,.7-.7V6.6A1.149,1.149,0,0,0,22.7,6Zm-6.8,9.1a.76.76,0,0,1-.6.8,3.459,3.459,0,0,1-1.8-.2,4.071,4.071,0,0,1-2.7-4,3.548,3.548,0,0,1,3.3-3.3,2.045,2.045,0,0,1,1.1,0c.4.1.7.2.7.7Z" fill="#010101"/></g></svg>';

  var options = {
    disableFields: [
      'autocomplete',
      'button',
      'file',
      'hidden',
      'starRating',
      'paragraph',
      'number',
      'header',
      'date',
    ],
    controlOrder: [
      'radio-group',
      'checkbox-group',
      'select',
      'text',
      'textarea',
    ],
    editOnAdd: true,
    fieldRemoveWarn: true,
    disabledActionButtons: ['data', 'save'],
    disabledAttrs: [
      'access',
      'toggle',
      'name',
      'inline',
      'subtype',
      'className',
      'other',
      'rows',
      'description',
      'required',
      'placeholder',
      'value',
    ],
    disabledSubtypes: {
      text: ['color'],
    },
    stickyControls: {
      enable: true,
    },
    typeUserAttrs: {
      text: {
        label: {
          label: 'Question',
          value: 'abcd',
        },
      },
    },
    replaceFields: [
      {
        type: 'checkbox-group',
        label: 'Checkbox List',
        icon: checkBoxIcon,
        values: [
          { label: 'Option 1', value: 'Option 1' },
          { label: 'Option 2', value: 'Option 2' },
        ],
        //values: [{ label: "Option 1", value: "Option 1", selected: false },{ label: "Option 2", value: "Option 2", selected: false }],
      },
      {
        type: 'radio-group',
        label: 'Multiple Choice',
        icon: multipleOptionIcon,
        //values: [{ label: "Option 1", value: "Option 1", selected: false },{ label: "Option 2", value: "Option 2", selected: false }],
      },
      {
        type: 'select',
        label: 'Dropdown Menu',
        icon: dropDownIcon,
        className: 'form-control s-eep-select2',
        //values: [{ label: "Option 1", value: "Option 1", selected: false },{ label: "Option 2", value: "Option 2", selected: false }],
      },
      {
        type: 'text',
        label: 'Short Text Response',
        icon: shortAnswerIcon,
        maxlength: 100,
      },
      {
        type: 'textarea',
        label: 'Long Text Response',
        icon: paragraphIcon,
        maxlength: 255,
      },
    ],
    dataType: 'json',
  };

  // useEffect(() => {
  //   if (!initSurveyData?.isQuestionBank) {
  //     setSurveyTitle(initSurveyData?.sData?.name);
  //     getSurveyTitle(initSurveyData?.sData?.name);
  //     let surveyDataTemp = [];
  //     let jsonTemp;
  //     if (initSurveyData && Object.keys(initSurveyData).length) {
  //       if (
  //         initSurveyData?.sData?.surveyQuestions &&
  //         initSurveyData?.sData?.surveyQuestions.length
  //       ) {
  //         initSurveyData?.sData?.surveyQuestions.map((item) => {
  //           jsonTemp = JSON.parse(item.parameters);
  //           surveyDataTemp.push(jsonTemp);
  //           return surveyDataTemp;
  //         });
  //         options['formData'] = surveyDataTemp;
  //         appendFormBuilder(options);
  //       }
  //     }
  //   }

  //   if (initSurveyData?.isQuestionBank) {
  //     options['formData'] = initSurveyData?.surveyQuestions;
  //     appendFormBuilder(options);
  //   } else {
  //     if (!isLibrary) {
  //       getSurveyTitle(null);
  //       delete options.formData;
  //       appendFormBuilder(options);
  //     }
  //   }

  //   return () => {
  //     setSurveyTitle('');
  //   };
  // }, [initSurveyData]);
  useEffect(() => {
    if (initSurveyData && !initSurveyData.isQuestionBank) {
      setSurveyTitle(initSurveyData?.sData?.name);
      getSurveyTitle(initSurveyData?.sData?.name);

      const surveyDataTemp =
        initSurveyData?.sData?.surveyQuestions?.map((item) =>
          JSON.parse(item.parameters),
        ) || [];

      appendFormBuilder({
        ...options,
        formData: surveyDataTemp,
      });

      return;
    }

    if (initSurveyData?.isQuestionBank) {
      appendFormBuilder({
        ...options,
        formData: initSurveyData.surveyQuestions,
      });
      return;
    }

    if (!initSurveyData && !isLibrary) {
      getSurveyTitle(null);
      appendFormBuilder(options);
    }
  }, [initSurveyData]);

  const appendFormBuilder = (opts) => {
    $(fb.current).html('');
    const formBuilder = $(fb.current).formBuilder(opts);

    document
      ?.getElementById?.('surveySubmit')
      ?.addEventListener('click', function () {
        var json_data = JSON.parse(formBuilder.actions.getData('json', true));

        if (Array.isArray(json_data)) {
          const result = json_data.map((item) => {
            if (item.type === 'select') {
              // Remove selected=true from other values
              const cleanedValues = (item.values || []).map((v) => ({
                ...v,
                selected: false,
              }));

              // Prepend placeholder option
              item.values = [
                {
                  label: 'Select an option',
                  value: '',
                  selected: true,
                  disabled: true,
                },
                ...cleanedValues,
              ];
            }
            return item;
          });
          getJsonData(result);
        }
      });

    document
      ?.getElementById?.('surveySubmitPreview')
      ?.addEventListener('click', function () {
        var json_data = JSON.parse(formBuilder.actions.getData('json', true));

        if (Array.isArray(json_data)) {
          const result = json_data.map((item) => {
            if (item.type === 'select') {
              // Remove selected=true from other values
              const cleanedValues = (item.values || []).map((v) => ({
                ...v,
                selected: false,
              }));

              // Prepend placeholder option
              item.values = [
                {
                  label: 'Select an option',
                  value: '',
                  selected: true,
                  disabled: true,
                },
                ...cleanedValues,
              ];
            }
            return item;
          });
          getJsonData(result);
        }
      });

    // document.getElementById('s_preview_div')?.addEventListener('click', function () {
    //   var json_data = formBuilder.actions.getData('json', true);
    //   getJsonData(json_data);
    //   //setJsonData({...json_data});
    // });

    window.jQuery(document).on('keyup', 'input.option-label', function (e) {
      let valuee = window.jQuery(this).val();
      window.jQuery(this).next().val(valuee);
    });
  };

  const titleChangeHandler = (evt) => {
    getSurveyTitle(evt.target.value);
    setSurveyTitle(evt.target.value);
  };

  /*
  useEffect(() => {
    const formBuilder = $(fb.current).formBuilder(options);

    document.getElementById('surveySubmit').addEventListener('click', function() {
      var json_data = formBuilder.actions.getData('json', true);
      getJsonData(json_data);
      setJsonData({...json_data});
    });

    document.getElementById('s_preview_div').addEventListener('click', function() {
      var json_data = formBuilder.actions.getData('json', true);
      getJsonData(json_data);
      setJsonData({...json_data});
    });

    window.jQuery(document).on('keyup', 'input.option-label', function(e) {
      let valuee = window.jQuery(this).val();
      window.jQuery(this).next().val(valuee);
    });

  },[]);
  */

  return (
    <React.Fragment>
      <div className="row survey-title-bar mb-3 no-gutters">
        <div className="col-md-12">
          <div className="login_error_div">
            <span
              className="login_error un_error text-danger ereorMsg ng-binding"
              style={{ display: 'inline' }}
            ></span>
          </div>
          {/* <textarea className="survey-title border_none eep_scroll_y px-0" name="survey-title" rows="1" placeholder="Untitled Title" onChange={(evt) => getSurveyTitle(evt.target.value)}></textarea> */}
          <textarea
            style={{ padding: 6, border: 'none' }}
            className="survey-title border_none eep_scroll_y"
            name="survey-title"
            rows="1"
            placeholder="Enter Survey Title"
            value={surveyTitle}
            onChange={(evt) => titleChangeHandler(evt)}
          ></textarea>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-lg-12">
          <div
            id="create_survey"
            className="tc_design"
          >
            {isLibrary && <div className="hide"></div>}
            <div
              id="fb-editor"
              ref={fb}
            ></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FormBuilderComponent;

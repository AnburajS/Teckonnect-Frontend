import React from 'react';

const SurveyPreviewModal = (props) => {
  const {
    title,
    assignUser,
    selectedDepts,
    selectedUsers,
    isRepublish,
    confirmRepublishSurveyHandler,
  } = props;

  const listOfUsers = [];
  selectedUsers.map((res) => listOfUsers.push(res.label));

  const listOfDepts = [];
  selectedDepts.map((res) => listOfDepts.push(res.label));

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
              <div className="modalBodyHeight">
                <div className="row w-100 no-gutters survey_title_div">
                  <div className="col-md-12">
                    <h2
                      className={`survey-title border_none px-0 ${
                        !title ? 'text-danger' : ''
                      }`}
                    >
                      {title ? title : 'Survey title not filled'}
                    </h2>
                  </div>
                </div>
                <div className="w-100 bg-f5f5f5 br-10 mb-3">
                  <div className="p-4">
                    <div className="row no-gutters">
                      <div className="col-md-12">
                        <div
                          id="prevSurveyModal"
                          className="viewEEPSurvey"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-100 bg-f5f5f5 br-10 mb-3">
                  <div className="p-4">
                    <div className="row justify-content-md-start no-gutters">
                      <div className="col-md-10 prevSurveyAssign_div">
                        <label className="font-helvetica-m c-404040 prevSurveyAssign_lbl">
                          Assign to -
                          <span className="prevSurveyAssign_span">
                            {assignUser && assignUser.value === 'Users'
                              ? selectedUsers.length
                                ? selectedUsers.length + ' Users'
                                : ' No user selected'
                              : selectedDepts.length
                              ? selectedDepts.length + ' Departments'
                              : ' No department selected'}
                          </span>
                        </label>
                        <div id="prevSurveyAssign">
                          {assignUser && assignUser.value === 'Users'
                            ? listOfUsers.join(', ')
                            : listOfDepts.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row w-100 no-gutters">
                  <div className="col-md-12 text-center">
                    <button
                      type="button"
                      className="eep-btn eep-btn-cancel"
                      data-dismiss="modal"
                    >
                      Go Back
                    </button>
                    {isRepublish && (
                      <button
                        type="button"
                        onClick={confirmRepublishSurveyHandler}
                        className="eep-btn eep-btn-success ml-3"
                      >
                        Republish
                      </button>
                    )}
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

export default SurveyPreviewModal;

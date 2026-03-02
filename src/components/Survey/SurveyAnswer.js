import $ from "jquery";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import ToggleSidebar from "../../layout/Sidebar/ToggleSidebar";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { eepFormatDateTime } from "../../shared/SharedService";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
window.jQuery = $;
window.$ = $;
require("jquery-ui-sortable");
require("formBuilder");
require("formBuilder/dist/form-render.min.js");

const SurveyAnswer = () => {
  const [toggleClass, setToggleClass] = useState(true);
  const location = useLocation();
  const sDataValue = location.state
    ? location?.state?.notification
      ? location?.state?.notification
      : location.state?.surveyData
    : "";

  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const [surveyData, setSurveyData] = useState({});
  const eepHistory = useNavigate();

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Engage",
      link: "app/engage",
    },
    {
      label: "Survey",
      link: "app/mysurvey",
    },
    {
      label: "ANSWER",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Survey Results",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const appendFormRender = (fData) => {
    if (fData) {
      const wrap = $("#surveyAnswer");
      $("#surveyAnswer").html("");
      if (fData !== undefined && fData.length) {
        wrap.formRender({
          dataType: "json",
          formData: fData,
        });

              $(".fb-render").on("input change", ":input", function () { 
        $(this).closest(".form-group, .form-group.field-wrapper").find(".unanswered-error").remove(); 
      });
      } else {
        var no_data = `<div className='text-center'><img src=${
          process.env.PUBLIC_URL + "/images/no-data.jpg"
        } className='w-50' /></div>`;
        $("#surveyAnswer").html(no_data);
      }
    }
  };

  const fetchSurveyInfo = (sData) => {
    const id = sData?.on_focus ? sData?.on_focus : sData?.survey?.id;
    if (sData) {
      const obj = {
        url: URL_CONFIG.SHOW_SURVEY,
        method: "get",
        params: { responseId: id },
      };
      httpHandler(obj)
        .then((res) => {
          let surveyDataTemp = [];
          let jsonTemp;
          setSurveyData({ ...res.data });
          if (res.data && Object.keys(res.data).length) {
            if (res.data.state === "created") {
              if (res.data.survey && Object.keys(res.data.survey).length) {
                if (
                  res.data.survey.surveyQuestions &&
                  res.data.survey.surveyQuestions.length
                ) {
                  res.data.survey.surveyQuestions.map((item) => {
                    jsonTemp = JSON.parse(item.parameters);
                    surveyDataTemp.push(jsonTemp);
                    return surveyDataTemp;
                  });
                  appendFormRender(surveyDataTemp);
                }
              }
            }

            if (res.data.state === "submitted") {
              if (
                res.data.surveyResponseItems &&
                res.data.surveyResponseItems.length
              ) {
                res.data.surveyResponseItems.map((item) => {
                  jsonTemp = JSON.parse(item.parameters);
                  surveyDataTemp.push(jsonTemp);
                  return surveyDataTemp;
                });
                appendFormRender(surveyDataTemp);
              }
            }
          }
        })
        .catch((error) => {
          const errMsg =
            error.response?.data?.message !== undefined
              ? error.response?.data?.message
              : "Something went wrong contact administarator";
          setShowModal({
            ...showModal,
            type: "danger",
            message: errMsg,
          });
        });
    }
  };

  useEffect(() => {
    if (sDataValue && Object.keys(sDataValue).length > 0) {
      fetchSurveyInfo(sDataValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sDataValue]);

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  const submitAnswerHandler = () => {
    let formData = new FormData();
    formData.append("surveyId", surveyData.survey.id);
    formData.append("responseId", surveyData.id);

    var o = {};
    var a = $(".fb-render :input").serializeArray();
    $.each(a, function () {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || "");
      } else {
        o[this.name] = this.value || "";
      }
    });

    const totalQuestions = $(".fb-render :input")
      .map(function () {
        return $(this).attr("name");
      })
      .get()
      .filter((v, i, a) => a.indexOf(v) === i);

    const answered = Object.keys(o);
    const unanswered = totalQuestions.filter(
      (q) => !answered.includes(q) || !o[q]
    );

    if (unanswered.length > 0) {
      $(".unanswered-error").remove();

      unanswered.forEach((fieldName) => {
        const field = $(`[name="${fieldName}"]`);

        const container = field.closest(
          ".form-group, .form-group.field-wrapper"
        );

        if (container.find(".unanswered-error").length === 0) {
          container.append(
            '<div class="unanswered-error" style="color: red; font-size: 13px; margin-top: 4px;">Please answer this question.</div>'
          );
        }
      });

      return;
    }

    if (o && Object.keys(o).length > 0) {
      for (const [key, value] of Object.entries(o)) {
        formData.append(key, value);
      }
    }
    const obj = {
      url: URL_CONFIG.SURVEY_SUBMIT,
      method: "post",
      formData: formData,
    };
    httpHandler(obj)
      .then((response) => {
        setShowModal({
          ...showModal,
          type: "success",
          success: "Submission Successful!",
          message: response?.data?.message,
        });
        // setTimeout(() => {
        //   setShowModal({ type: null, message: null });
        //   eepHistory('/app/mysurvey');
        // }, 2000);
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : "Oops! Something went wrong. Please contact administrator.";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
  };

  return (
    <React.Fragment>
      <PageHeader title="Survey Answer" />
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <Link
              to="/app/mysurvey"
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
            >
              Continue
            </Link>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      <div className="eep-container-sidebar h-100 eep_scroll_y">
        <div className="container-sm eep-container-sm">
          <div
            className={`row eep-create-survey-div eep_with_sidebar ${
              toggleClass ? "side_open" : ""
            } vertical-scroll-snap`}
          >
            <div className="eep-content-section-div eep_with_content">
              <div className="eep-content-section eep_scroll_y">
                <div
                  className="eep_survey_results_div eep-content-start"
                  id="content-start"
                >
                  <div className="d-flex p-0 m-0 sticky_position bg-white">
                    <h3 className="survey-title mb-2 c-2c2c2c">
                      {surveyData?.survey?.name}
                    </h3>
                  </div>
                  <div>
                    <div className="col-md-8 px-0">
                      <div
                        id="surveyAnswer"
                        className="tc_design eep_survey_view eep_survey_answer fb-render"
                      ></div>
                    </div>
                    {surveyData && surveyData?.state === "created" && (
                      <div className="col-lg-8 text-center mb-3">
                        <button
                          type="submit"
                          className="eep-btn eep-btn-success"
                          id="answer_survey_submit"
                          onClick={submitAnswerHandler}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    {surveyData && surveyData?.state === "submitted" && (
                      <div className="col-lg-8 text-center">
                        <div className="alert alert-success" role="alert">
                          Survey response submitted -{" "}
                          {eepFormatDateTime(surveyData.updatedAt)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <ToggleSidebar
              toggleSidebarType="survey"
              sideBarClass={sideBarClass}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SurveyAnswer;

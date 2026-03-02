import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { useDispatch } from "react-redux";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import SurveyPreviewModal from "../../modals/SurveyPreviewModal";
import AddSurveyToRecognitionModal from "../../modals/AddSurveyToModal";
import ResponseInfo from "../../UI/ResponseInfo";
import { pageLoaderHandler } from "../../helpers";
import Isloading from "../../UI/CustomComponents/Isloading";

const Survey = () => {
  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Library",
      link: "app/library",
    },
    {
      label: "Survey",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Library",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const [surveyData, setSurveyData] = useState([]);
  const [prevData, setPrevData] = useState({});
  const [previewState, setPreviewState] = useState(false);
  const [addCertificateState, setAddCertificateState] = useState(false);
  const [surveyAllData, setsurveyAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSurveyData = () => {
    setIsLoading(true);
    const obj = {
      url: URL_CONFIG.ALL_SURVEY,
      method: "get",
    };
    httpHandler(obj)
      .then((cData) => {
        setSurveyData(cData?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("fetchSurveyData error", error);
        setIsLoading(false);
      });
  };

  const handleSurveyPreviewModal = (arg) => {
    if (arg) {
      setAddCertificateState(false);
      setPreviewState(true);
      setPrevData(arg?.survey_questions);
    }
  };

  const handleCreateSurvey = (arg) => {
    setPreviewState(false);
    setAddCertificateState(true);
    setsurveyAllData(arg);
  };

  useEffect(() => {
    fetchSurveyData();
    pageLoaderHandler(isLoading ? "show" : "hide");
  }, []);

  return (
    <React.Fragment>
      {previewState && <SurveyPreviewModal previewData={prevData} />}
      {addCertificateState && (
        <AddSurveyToRecognitionModal
          surveyAllData={surveyAllData}
          fetchSurveyData={fetchSurveyData}
        />
      )}

      {isLoading ? (
        <Isloading />
      ) : (
        <div className="eep-content-start">
          {surveyData?.length > 0 && (
            <div className="eep-content-section p-4 bg-ebeaea brtl-15 brtr-15 eep_scroll_y">
              <div className="row lib_row_div ">
                {surveyData?.length > 0 &&
                  surveyData.map((item, index) => {
                    return (
                      <div
                        className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-center cert_col_div"
                        key={"certificateLibrary_" + index}
                      >
                        <div className="mycert_list_div box9">
                          <div className="my_survey_assign_div">
                            <div className="outter library_survey">
                              {item?.name}
                              {/* <img src={`${process.env.PUBLIC_URL}/images/certificates/${item?.libraryImage}`} className="mycert_img" alt="Performer" title="Performer" /> */}
                            </div>
                          </div>
                          <div className="box-content">
                            <h3 className="title">{item?.name}</h3>
                            {item?.isExist && (
                              <p className="desc_p">
                                This Survey exists Already.
                              </p>
                            )}
                            {!item?.isExist && (
                              <p className="desc_p">Add to {item?.name}</p>
                            )}
                            {!item?.isExist && (
                              <ul className="icon mt-1">
                                <li>
                                  <a
                                    to="#"
                                    className="p_cert_modal_a fas fa-plus c1 "
                                    title="Add"
                                    data-toggle="modal"
                                    data-target="#SurveyRecognitionModal"
                                    onClick={() => handleCreateSurvey(item)}
                                  ></a>
                                </li>
                              </ul>
                            )}
                            <ul className="icon prev_icon">
                              <li>
                                <a
                                  to="#"
                                  className="p_cert_modal_a fa fa-eye c1"
                                  title="Preview"
                                  data-toggle="modal"
                                  data-target="#surveyPreviewModal"
                                  onClick={() => handleSurveyPreviewModal(item)}
                                ></a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {surveyData && surveyData.length <= 0 && (
            <div className="eep-content-section-data d-flex w-100">
              <ResponseInfo
                title="No matching results"
                responseImg="noRecord"
                responseClass="response-info"
              />
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};
export default Survey;

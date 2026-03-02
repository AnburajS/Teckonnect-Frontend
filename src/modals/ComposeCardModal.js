import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EcardModalInfo from "../components/E-Cards/EcardModalInfo";
import EcardModalInputs from "../components/E-Cards/EcardModalInputs";
import { URL_CONFIG } from "../constants/rest-config";
import { base64ToFile } from "../helpers";
import { httpHandler } from "../http/http-interceptor";
import { useNavigate, useLocation } from "react-router-dom";

const ComposeCardModal = (props) => {
  const {
    composeCardData,
    composeCardMessages,
    composeCardCategory,
    modalSubmitInfo,
    isDashbaordData,
  } = props;
  console.log("composeCardCategory", composeCardCategory);
  const getLocation = useLocation();
  const eepHistory = useNavigate();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [msg, setMsg] = useState(null);
  const [composeInfoData, setComposeInfoData] = useState({});
  const [composeInputData, setComposeInputData] = useState({});
  const [submitResponseMsg, setSubmitResponseMsg] = useState("");
  const [submitResponseClassName, setSubmitResponseClassName] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setSubmitResponseMsg("");
    setSubmitResponseClassName("");
  }, [composeCardData]);

  const comoseMessageHandler = (e, clkmsg, flag) => {
    setMsg("");
    if (flag) {
      var elems = document.querySelectorAll(".ccmesg");
      [].forEach.call(elems, function (el) {
        el.classList.remove("selected");
      });
      e.target.className += " selected";
    }
    setMsg(clkmsg);
  };

  const getComposeInfoData = (arg) => {
    setComposeInfoData(arg);
  };

  const getComposeInputsData = (arg) => {
    setComposeInputData(arg);
  };

  useEffect(() => {
    setIsDisabled(true);
    if (
      Object.keys(composeInfoData).length > 0 &&
      Object.keys(composeInputData).length > 0
    ) {
      if (composeCardData.isSlider) {
        if (
          composeInfoData.templateId !== null &&
          composeInfoData.templateId !== undefined &&
          composeInputData.to !== null &&
          composeInputData.to !== undefined &&
          composeInputData.message !== "" &&
          composeInputData.message !== undefined
        ) {
          setIsDisabled(false);
        }
      }
      if (!composeCardData.isSlider) {
        if (
          composeInfoData.imagebyte.image &&
          composeInputData.to !== null &&
          composeInputData.to !== undefined &&
          composeInputData.message !== "" &&
          composeInputData.message !== undefined
        ) {
          setIsDisabled(false);
        }
      }
    }
  }, [composeInfoData, composeInputData]);

  const handleECardSubmit = async () => {
    let finalData = {
      ...composeInfoData,
      ...composeInputData,
      type: composeCardCategory?.category,
    };

    if (finalData?.imagebyte?.image) {
      const base64Data = (finalData?.imagebyte?.image).replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      const file = base64ToFile(base64Data);

      const formData = new FormData();
      formData.append("image", file);

      const obj = {
        url: URL_CONFIG.UPLOAD_FILES,
        method: "post",
        payload: formData,
      };
      await httpHandler(obj)
        .then((res) => {
          finalData["imageByte"] = res?.data?.data?.[0]?.url ?? "";
        })
        .catch((c) => {
          setSubmitResponseMsg("Please upload file less than 1 MB");
          setSubmitResponseClassName("response-err");
          modalSubmitInfo({ status: false, message: "" });
          return;
        });
    }

    if (finalData?.templateId || finalData["imageByte"]) {
      //let finalData = Object.assign({}, composeInfoData, composeInputData);
      if (composeCardData.isSlider) {
        delete finalData.contentType;
        delete finalData.imagebyte;
        delete finalData.imageByte;
      }
      if (!composeCardData.isSlider) {
        delete finalData.templateId;
      }
      delete finalData?.imagebyte;

      const obj = {
        url: URL_CONFIG.SEND_ECARD,
        method: "post",
        payload: finalData,
      };
      httpHandler(obj)
        .then((response) => {
          const resMsg = response?.data?.message;
          modalSubmitInfo({ status: true, message: resMsg });
        })
        .catch((error) => {
          const errMsg = error?.response?.data?.message;
          setSubmitResponseMsg(errMsg);
          setSubmitResponseClassName("response-err");
          modalSubmitInfo({ status: false, message: "" });
        });
    }
  };

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade show"
        id="ComposeCardModal"
        // tabIndex="-1"
        // role="dialog"
        // aria-labelledby="exampleModalLabel"
        // aria-hidden="true"
      >
        <div className="modal-dialog w-75" role="document">
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
                <div className="col-md-5 imagecompose_div anniversaryTemplate_div my-auto">
                  <EcardModalInfo
                    composeCardValue={composeCardData}
                    msg={msg}
                    getComposeInfoData={getComposeInfoData}
                  />
                </div>
                <div className="col-md-7 messagecompose_div Compose_div">
                  <div className="panel panel-default px-4 py-2">
                    <div className="panel-body message">
                      <EcardModalInputs
                        isDashbaordData={isDashbaordData}
                        ccMessageValue={composeCardMessages}
                        comoseMessageHandler={comoseMessageHandler}
                        composeCardCategory={composeCardCategory}
                        getComposeInputsData={getComposeInputsData}
                      />
                      <div className="col-sm-12 p-0 formaction_div">
                        <div className="form-group row mb-0">
                          <div className="col-sm-1"></div>
                          <div className="col-sm-11">
                            <button
                              type="button"
                              className="eep-btn eep-btn-cancel"
                              data-dismiss="modal"
                              aria-hidden="true"
                              onClick={() => {
                                eepHistory(getLocation.pathname, {
                                  replace: true,
                                });
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="eep-btn eep-btn-success float-right"
                              disabled={isDisabled ? "disable" : ""}
                              onClick={handleECardSubmit}
                            >
                              <span
                                className={`mr-2 ${
                                  isDisabled ? "" : "btnIsValid"
                                }`}
                                dangerouslySetInnerHTML={{
                                  __html: svgIcons && svgIcons.paper_plane,
                                }}
                              ></span>
                              Send
                            </button>
                          </div>
                        </div>
                        {submitResponseMsg && (
                          <div className="d-flex justify-content-center align-items-center">
                            <div className="response-div m-0">
                              <p
                                className={`${submitResponseClassName} response-text`}
                              >
                                {submitResponseMsg}
                              </p>
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
export default ComposeCardModal;

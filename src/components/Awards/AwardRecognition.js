import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import ResponseInfo from "../../UI/ResponseInfo";

const AwardRecognition = () => {
  const [awardData, setAwardData] = useState([]);

  const awardClick = (arg, boolState) => {
    if (arg) {
      const awardDataTemp = JSON.parse(JSON.stringify(awardData));
      for (let i = 0; i < awardDataTemp.length; i++) {
        if (awardDataTemp[i].id === arg.id) {
          awardDataTemp[i].flipState = boolState;
        } else {
          //awardDataTemp[i].flipState = !boolState;
          awardDataTemp[i].flipState = false;
        }
      }
      setAwardData(...[awardDataTemp]);
    }
  };

  const fetchAwardLists = () => {
    const obj = {
      url: URL_CONFIG.NOMINATOR_AWARDS,
      method: "get",
    };
    httpHandler(obj)
      .then((aData) => {
        setAwardData(...[aData.data]);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchAwardLists();
  }, []);

  const getMyHashTag = (arg) => {
    const arr = [];
    arg?.map((res) => {
      return arr.push(`#${res.hashtagName}`);
    });
    return arr.join(", ");
  };

  return (
    <React.Fragment>
      <div className="row mt-4 eep-content-start">
        {awardData &&
          awardData?.length > 0 &&
          awardData?.map((data, index) => {
            if (data.type === "spot_award") {
              return (
                <div
                  className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-left badge_col_div"
                  key={"AwardRecognition_" + index}
                >
                  <div className="award_nominator_div">
                    <div className="award_src_mini a_spot_mini">
                      <Link
                        className="a_hover_txt_deco_none"
                        to={{
                          pathname: "/app/awardnominations",
                        }}
                        state={{
                          aData: data,
                          isSpot: true,
                        }}
                      >
                        <div className="outter">
                          <img
                            src={
                              data?.imageByte?.image
                                ? data?.imageByte.image
                                : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                            }
                            className="award_img"
                            alt={data.award.name}
                            title={data.award.name}
                          />
                        </div>
                        <div className="p-2">
                          <div className="badge_info_div">
                            <p className="badge_info font-helvetica-m">
                              {data.award.name}
                            </p>
                            <p className="badge_info badge_info_hash empty-content-space eep_truncate_auto">
                              {data?.award?.hashTag?.length > 0
                                ? getMyHashTag(data.award.hashTag)
                                : "---"}
                            </p>
                            <p className="badge_info font-helvetica-m">
                              {data.award.points}
                            </p>
                          </div>
                        </div>
                        <div className="a_awardfrom_src">
                          <label className="mb-0">Spot</label>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }
            if (data.type === "nomi_award") {
              return (
                <div
                  className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-left badge_col_div"
                  key={"AwardRecognition_" + index}
                >
                  <div className="award_nominator_div">
                    {!data.flipState && (
                      <div
                        className="award_src_mini a_nomitr_mini"
                        onClick={() => awardClick(data, true)}
                      >
                        <div className="a_nomiStatus_div">
                          <img
                            //src={ data.nominated ? `${process.env.PUBLIC_URL}/images/icons/approved.svg` : `${process.env.PUBLIC_URL}/images/icons/waiting.svg` }
                            src={
                              data.nominated
                                ? data.nominated && data.recognized
                                  ? `${process.env.PUBLIC_URL}/images/icons/approved.svg`
                                  : `${process.env.PUBLIC_URL}/images/icons/Nominated.svg`
                                : `${process.env.PUBLIC_URL}/images/icons/waiting.svg`
                            }
                            className="a_nomitr_simg"
                            alt={
                              data.nominated
                                ? data.nominated && data.recognized
                                  ? "Approved"
                                  : "Nominated"
                                : "Waiting"
                            }
                            title={
                              data.nominated
                                ? data.nominated && data.recognized
                                  ? "Approved"
                                  : "Nominated"
                                : "Waiting"
                            }
                          />
                        </div>
                        <div className="outter">
                          <img
                            src={
                              data?.imageByte?.image
                                ? data?.imageByte.image
                                : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                            }
                            className="award_img"
                            alt={data.award.name}
                            title={data.award.name}
                          />
                        </div>
                        <div className="p-2">
                          <div className="badge_info_div">
                            <p className="badge_info font-helvetica-m">
                              {data.award.name}
                            </p>
                            <p className="badge_info badge_info_hash empty-content-space eep_truncate_auto">
                              {getMyHashTag(data.award.hashTag)}
                            </p>
                            <p className="badge_info font-helvetica-m">
                              {data.award.points}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {data.flipState && (
                      <div
                        className="a_nomitr_dtls"
                        onClick={() => awardClick(data, false)}
                      >
                        <div className="outter">
                          <img
                            src={
                              data?.imageByte?.image
                                ? data?.imageByte.image
                                : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                            }
                            className="award_img"
                            alt={data.award.name}
                            title={data.award.name}
                          />
                          <label className="a_nomitr_nm mb-0 font-helvetica-m">
                            {data.award.name}
                          </label>
                        </div>
                        <div className="p-2">
                          <div className="an_dtls_info_div">
                            <div className="an_dtls_hd text-center font-helvetica-m">
                              <label className="an_dtls_hd_lb">
                                Award Details
                              </label>
                            </div>
                            <div className="an_dtls_info">
                              <label className="an_dtls_lb">Role</label>
                              <p className="an_dtls_p">Nominator</p>
                            </div>
                            <div className="an_dtls_info">
                              <label className="an_dtls_lb">Dept</label>
                              {/* <p className="an_dtls_p">{data.nominatorId?.department?.name}</p> */}
                              <p className="an_dtls_p">
                                {data?.departmentId?.name}
                              </p>
                            </div>
                            <div className="an_dtls_info">
                              <label className="an_dtls_lb">Judge</label>
                              <p className="an_dtls_p">
                                {data?.judgeId?.fullName}
                              </p>
                            </div>
                            <div className="an_dtls_info">
                              <label className="an_dtls_lb">Award type</label>
                              <p className="an_dtls_p">{data?.subType}</p>
                            </div>
                          </div>
                          <div className="an_dtls_action_div">
                            <div className="row">
                              {!data.nominated && (
                                <Link
                                  state={{
                                    aData: data,
                                    isSpot: false,
                                  }}
                                  to={{
                                    pathname: "/app/awardnominations",
                                  }}
                                  className="eep-btn-sml eep-btn eep-btn-tb a_hover_txt_deco_none m-auto aNomitrBtn"
                                >
                                  Nominate
                                </Link>
                              )}
                              {data.nominated && (
                                <Link
                                  to={{
                                    pathname: "/app/nominationsapproval",
                                  }}
                                  state={{
                                    awardData: data,
                                    isApproval: false,
                                  }}
                                  className="eep-btn-sml eep-btn eep-btn-tb a_hover_txt_deco_none m-auto aNomitrResult"
                                >
                                  View Result
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}
        {awardData && awardData.length <= 0 && (
          <ResponseInfo
            title="No Nominations found!"
            messageInfo="Good recognition is the bridge between appreciation and motivation"
            subMessageInfo="A wise man"
            responseImg="noRecord"
            responseClass="response-info"
          />
        )}
      </div>
    </React.Fragment>
  );
};
export default AwardRecognition;

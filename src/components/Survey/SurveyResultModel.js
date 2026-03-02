import React, { useEffect, useState } from 'react';
import Modal from '../../modals/Model';
import moment from 'moment';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatDates } from '../../constants/utills';

const SurveyResultModel = ({
  data,
  isOpen,
  onClose,
  showModal,
  setShowModal,
}) => {
  const history = useNavigate();
  const [surveyResultList, setSurveyResultList] = useState([]);
  const [selectSurvey, setselectSurvey] = useState([]);

  const fetchSurveyResultDetail = (paramsInfo) => {
    // setIsLoading(true);

    let obj;
    // if (Object.getOwnPropertyNames(paramsInfo)) {
    //   obj = {
    //     url: URL_CONFIG.SURVEY_RESULT,
    //     method: 'get',
    //     params: paramsInfo,
    //   };
    // } else {
    obj = {
      url: URL_CONFIG.SURVEY_RESULT,
      method: 'get',
      params: { library_added_survey_id: data?.library_added_survey_id },
    };
    // }
    httpHandler(obj)
      .then((response) => {
        setSurveyResultList(response.data?.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
        // setIsLoading(false);
      });
  };

  useEffect(() => {
    setselectSurvey([]);
    setSurveyResultList([]);
    fetchSurveyResultDetail();
  }, [data, isOpen]);
  const handleTick = (data) => {
    if (selectSurvey.includes(data?.id)) {
      setselectSurvey(selectSurvey.filter((id) => id !== data?.id));
    } else {
      setselectSurvey([...selectSurvey, data?.id]);
    }
  };
  const handleNavigate = () => {
    // { pathname: '/app/metric', state: { surveyData: data } }
    history('/app/pulsemetric', {
      state: {
        surveyData: [data?.id, ...selectSurvey],
      },
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${data?.name} Comparison ( ${formatDates(data?.createdAt)} )`}
      modalWidth="w-75"
      className="tc_design"
      headerClass={'fs-22 '}
      padding={3}
    >
      <Row
        className="mb-3 p-4"
        style={{
          borderRadius: '10px',
          border: '1px solid #bdbdbd',
        }}
      >
        {surveyResultList?.map((survey) => (
          <>
            {survey?.id === data?.id ? null : (
              <Col
                key={survey.id}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                className="mb-3"
              >
                <Card
                  style={{
                    borderRadius: '10px',
                    border: '1px solid #bdbdbd',
                  }}
                  onClick={() => handleTick(survey)}
                >
                  <Card.Body className="pd-15 c1">
                    <Card.Text className="text fs-16">{survey?.name}</Card.Text>
                    <div className="d-flex  justify-content-between align-items-center mt-2">
                      <div>
                        {selectSurvey.includes(survey?.id) && (
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              '/images/icons/roundTick.svg'
                            }
                            className="image-circle"
                            alt="Type"
                          />
                        )}
                      </div>
                      <Card.Text
                        className="fs-14"
                        style={{ color: '#9D9D9D' }}
                      >
                        {formatDates(survey?.createdAt)}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </>
        ))}
      </Row>
      <div className="d-flex justify-content-end">
        <button
          type="submit"
          className="eep-btn eep-btn-success mr-3 pdx-26"
          disabled={selectSurvey?.length === 0}
          onClick={handleNavigate}
        >
          Compare
        </button>
        <button
          type="submit"
          className="eep-btn  mr-2 pdx-26"
          //   id="surveySubmit"
          //   disabled={true}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default SurveyResultModel;

import React, { useEffect, useState } from 'react';
import ResponseInfo from '../../UI/ResponseInfo';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import DeleteECardTemplateModal from '../../modals/DeleteECardTemplateModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import ImagePreloader from './ImagePreloader';
import { base64ToFile } from '../../helpers';
import Fileupload from '../../fileUpload/Fileupload';
import { validateFileSize } from '../../constants/utills';

const CardsTemplate = (props) => {
  const { templateType, getCardsTemplate, showAll } = props;
  const [templateTypes, setTemplateTypes] = useState(templateType);
  const [imageData, setImageData] = useState([]);
  const [scheduledImageData, setScheduledImageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [deletionState, setDeletionState] = useState(false);
  const [deletionData, setDeletionData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const cardObj = {
    name: null,
    category: null,
    scheduled: false,
    settingsId: 0,
    imageByte: {},
  };
  const [createTemplateData, setCreateTemplateData] = useState(cardObj);

  useEffect(() => {
    setTemplateTypes(templateType);
  }, [templateType]);

  useEffect(() => {
    if (templateTypes.category !== 'anniversary') {
      let createTemplateDataTemp = JSON.parse(
        JSON.stringify(createTemplateData)
      );
      createTemplateDataTemp.category = templateTypes.category;
      setCreateTemplateData(createTemplateDataTemp);
      fetchCardData();
    }
  }, []);

  useEffect(() => {
    if (templateTypes.category === 'anniversary') {
      if (templateTypes.yearInfo?.id) {
        let createTemplateDataTemp = JSON.parse(
          JSON.stringify(createTemplateData)
        );
        createTemplateDataTemp.category = templateTypes.category;
        createTemplateDataTemp.settingsId = templateTypes.yearInfo?.id;
        setCreateTemplateData(createTemplateDataTemp);
        fetchAnniversaryCardData();
      } else {
        setIsLoading(false);
      }
    }
  }, [templateTypes]);

  const fetchCardData = () => {
    const obj = {
      url: URL_CONFIG.GET_TEMPLATE_ECARD,
      method: 'get',
      params: { type: templateTypes.category },
    };
    httpHandler(obj)
      .then((response) => {
        setImageData(response.data);
        getCardsTemplate(response.data);
        let scheduledImageDataTemp = [];
        response.data.length &&
          response.data.map((item) => {
            if (item.scheduled) {
              scheduledImageDataTemp.push(item);
              return scheduledImageDataTemp;
            }
          });
        setScheduledImageData(scheduledImageDataTemp);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const fetchAnniversaryCardData = () => {
    setImageData([]);
    getCardsTemplate([]);
    const obj = {
      url: URL_CONFIG.ANNIVERSARY_ECARD,
      method: 'get',
      params: { int: templateTypes.yearInfo?.id },
    };
    httpHandler(obj)
      .then((response) => {
        setImageData(response.data.template);
        getCardsTemplate(response.data.template);
        let scheduledImageDataTemp = [];
        response.data.template.length &&
          response.data.template.map((item) => {
            if (item.scheduled) {
              scheduledImageDataTemp.push(item);
              return scheduledImageDataTemp;
            }
          });
        setScheduledImageData(scheduledImageDataTemp);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const insertCardData = (arg) => {
    const base64Data = (arg?.imageByte?.image).replace(
      /^data:image\/\w+;base64,/,
      ''
    );
    const file = base64ToFile(base64Data);

    const formData = new FormData();
    formData.append('image', file);
    const obj_ = {
      url: URL_CONFIG.UPLOAD_FILES,
      method: 'post',
      payload: formData,
    };
    httpHandler(obj_)
      .then((response_) => {
        arg.imageByte = response_?.data?.data?.[0]?.url;
        const obj = {
          url: URL_CONFIG.CREATE_TEMPLATE_ECARD,
          method: 'post',
          payload: arg,
        };
        httpHandler(obj)
          .then((response) => {
            if (templateTypes.category === 'anniversary') {
              fetchAnniversaryCardData();
            } else {
              fetchCardData();
            }
          })
          .catch((error) => {
            setShowModal({
              ...showModal,
              type: 'danger',
              message: error?.response?.data?.message,
            });
          });
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };

  const TemplateImageLoader = () => {
    document.getElementById('imgFileLoader').value = '';
    document.getElementById('imgFileLoader').click();
  };

  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const TemplateImageChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const isValid = validateFileSize(file, 1);

      if (isValid === true) {
        var fileType = file['type'];
        if (validImageTypes.includes(fileType)) {
          var tempFileName = file.name;
          tempFileName = tempFileName.replace(/\s/g, '');
          var reader = new FileReader();
          reader.onload = function () {
            let imageByte = { image: reader.result, name: tempFileName };
            let createTemplateDataTemp = JSON.parse(
              JSON.stringify(createTemplateData)
            );
            createTemplateDataTemp.imageByte = imageByte;
            createTemplateDataTemp.name = tempFileName;
            setCreateTemplateData(createTemplateDataTemp);
            insertCardData(createTemplateDataTemp);
          };
          reader.readAsDataURL(file);
        } else {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: 'Invalid Image Type',
          });
        }
      } else {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: isValid,
        });
      }
    }
  };

  const handleScheduleState = (arg) => {
    let imageDataTmp = [...imageData];
    for (let i = 0; i < imageDataTmp.length; i++) {
      if (arg.id === imageDataTmp[i].id) {
        imageDataTmp[i].scheduled = !imageDataTmp[i].scheduled;
        break;
      }
    }
    setImageData(imageDataTmp);
    getCardsTemplate(imageDataTmp);
  };

  const handleCardDeletion = (arg) => {
    setDeletionData(arg);
    setDeletionState(true);
  };

  const confirmState = (arg) => {
    if (arg) {
      const obj = {
        url:
          URL_CONFIG.DELETE_TEMPLATE_CARD +
          '?id=' +
          deletionData.data.id +
          '&act=' +
          false,
        method: 'delete',
      };
      httpHandler(obj)
        .then(() => {
          if (templateTypes.category === 'anniversary') {
            fetchAnniversaryCardData();
          } else {
            fetchCardData();
          }
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
        });
    } else {
      setDeletionData([]);
      setDeletionState(false);
    }
  };
  const renderCard = (item, index) => (
    <div
      className="Portfolio col-md-3 mb-3"
      key={`card_${index}`}
    >
      <div
        className={`card-img_div ${
          item.scheduled && showAll ? 'card-img_div_selected' : ''
        }`}
        onClick={showAll ? () => handleScheduleState(item) : null}
      >
        <img
          className={`card-img ${item.scheduled ? 'c_selected' : ''}`}
          src={item?.imageByte?.image}
          alt={item?.imageByte?.name}
        />
      </div>
      {/* {showAll && ( */}
      <div className="delete_template_div">
        <img
          src={`${process.env.PUBLIC_URL}/images/icons/tasks/delete.svg`}
          className="delete_template"
          title="Remove"
          alt="Delete Icon"
          onClick={() => handleCardDeletion({ type: 'card', data: item })}
          data-toggle="modal"
          data-target="#deleteECardTemplateModal"
        />
      </div>
      {/* )} */}
    </div>
  );
  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
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
      {deletionState && (
        <DeleteECardTemplateModal confirmState={confirmState} />
      )}
      <div className="row eep-templates-setting-card p-0 m-0">
        {templateTypes.isSchedule && (
          <React.Fragment>
            <div className="col-md-12 px-0 mx-0 py-2 my-2">
              <h4 className="c-2c2c2c mb-0">Pick your Card</h4>
            </div>
            <div className="col-md-12 templates_card_div templates_card_whole_div px-0">
              {templateTypes.isSchedule && (
                <div className="d-flex justify-content-end col-md-12">
                  <ul className="nav nav-pills py-2 mb-2 px-0">
                    <li className="nav-item">
                      <button
                        className={`nav-link c1 ${
                          activeTab === 'all' ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab('all')}
                      >
                        All
                      </button>
                    </li>
                    {showAll && (
                      <li className="nav-item">
                        <button
                          className={`nav-link c1 ${
                            activeTab === 'scheduled' ? 'active' : ''
                          }`}
                          onClick={() => setActiveTab('scheduled')}
                        >
                          Scheduled
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <div
                className=" row tab-content px-0"
                id="pills-tabContent"
              >
                {activeTab === 'all' &&
                  (imageData.length ? (
                    imageData.map(renderCard)
                  ) : (
                    <ResponseInfo
                      text="No Cards Added."
                      responseImg="noRecord"
                      responseClass="response-info"
                    />
                  ))}

                {activeTab === 'scheduled' &&
                  (scheduledImageData.length ? (
                    scheduledImageData.map(renderCard)
                  ) : (
                    <ResponseInfo
                      text="No Cards Scheduled."
                      responseImg="noRecord"
                      responseClass="response-info"
                    />
                  ))}
                <div className="Portfolio col-md-3 mb-3 ecar_add_image add_temp_img_div">
                  <Fileupload
                    addIconClickHandler={TemplateImageLoader}
                    onChangeHandler={TemplateImageChange}
                    inputId={'imgFileLoader'}
                    accept="image/png, image/jpg, image/jpeg"
                    suggested={'600x800'}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}

        {!templateTypes.isSchedule && (
          <React.Fragment>
            <div className="col-md-12 px-0 mx-0 py-2 my-2">
              <h4 className="c-2c2c2c mb-0">Add Template(s)</h4>
            </div>
            <div className="eCardSettingWrapper col-md-12 templates_card_div templates_card_whole_div px-0">
              {isLoading && <ImagePreloader />}
              {imageData &&
                imageData.length > 0 &&
                imageData.map((item, index) => {
                  return (
                    <div
                      className="Portfolio col-md-3 mb-3"
                      key={'Temp_' + index}
                    >
                      <div className="card-img_div">
                        <img
                          className="card-img"
                          src={item?.imageByte?.image}
                          alt={item?.imageByte?.name}
                        />
                      </div>
                      <div className="delete_template_div">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/icons/tasks/delete.svg`}
                          className="delete_template"
                          title="Remove"
                          alt="Delete Icon"
                          onClick={() =>
                            handleCardDeletion({ type: 'card', data: item })
                          }
                          data-toggle="modal"
                          data-target="#deleteECardTemplateModal"
                        />
                      </div>
                    </div>
                  );
                })}
              <div className="Portfolio col-md-3 mb-3 ecar_add_image add_temp_img_div">
                <Fileupload
                  addIconClickHandler={TemplateImageLoader}
                  onChangeHandler={TemplateImageChange}
                  inputId={'imgFileLoader'}
                  accept="image/png, image/jpg, image/jpeg"
                  suggested={'600x800'}
                />
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};
export default CardsTemplate;

import React, { useEffect, useState } from 'react';
import CreatMessageModal from '../../modals/CreatMessageModal';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import DeleteECardTemplateModal from '../../modals/DeleteECardTemplateModal';
import ResponseInfo from '../../UI/ResponseInfo';

const MessageTemplate = (props) => {
  const { templateType, getMessageTemplate, showAll } = props;

  const messageObj = {
    message: '',
    category: templateType.category ? templateType.category : null,
    scheduled: false,
    settingsId: 0,
  };

  const [createTemplatMsgeData, setCreateTemplatMsgeData] =
    useState(messageObj);
  const [messageData, setMessageData] = useState([]);
  const [scheduledMessageData, setScheduledMessageData] = useState([]);
  const [modalFlag, setModalFlag] = useState(false);
  const [deletionState, setDeletionState] = useState(false);
  const [deletionData, setDeletionData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [activeTab, setActiveTab] = useState('all'); // NEW

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (let i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const triggerAddMessage = () => {
    setModalFlag(true);
  };

  const fetchMessageData = () => {
    setMessageData([]);
    getMessageTemplate([]);
    const obj = {
      url: URL_CONFIG.GET_TEMPLATE_MESSAGE,
      method: 'get',
      params: { type: templateType.category },
    };
    httpHandler(obj)
      .then((response) => {
        setMessageData(response.data);
        getMessageTemplate(response.data);
        const scheduled = response.data.filter((item) => item.scheduled);
        setScheduledMessageData(scheduled);
      })
      .catch(() => {});
  };

  const fetchAnniversaryMessageData = () => {
    setMessageData([]);
    getMessageTemplate([]);
    const obj = {
      url: URL_CONFIG.ANNIVERSARY_ECARD,
      method: 'get',
      params: { int: templateType.yearInfo?.id },
    };
    httpHandler(obj)
      .then((response) => {
        setMessageData(response.data.message);
        getMessageTemplate(response.data.message);
        const scheduled = response.data.message.filter(
          (item) => item.scheduled
        );
        setScheduledMessageData(scheduled);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const data = { ...createTemplatMsgeData, category: templateType.category };
    setCreateTemplatMsgeData(data);
    fetchMessageData();
  }, []);

  useEffect(() => {
    if (templateType.category === 'anniversary' && templateType.yearInfo) {
      const data = {
        ...createTemplatMsgeData,
        category: templateType.category,
        settingsId: templateType.yearInfo?.id,
      };
      setCreateTemplatMsgeData(data);
      fetchAnniversaryMessageData();
    }
    return () => {
      setCreateTemplatMsgeData(messageObj);
    };
  }, [templateType]);

  const insertMessageData = (arg) => {
    if (arg.message !== '') {
      const obj = {
        url: URL_CONFIG.CREATE_TEMPLATE_MESSAGE,
        method: 'post',
        payload: arg,
      };
      httpHandler(obj)
        .then(() => {
          if (templateType.category === 'anniversary') {
            fetchAnniversaryMessageData();
          } else {
            fetchMessageData();
          }
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
        });
    }
  };

  const getMessageData = (arg) => {
    const data = { ...createTemplatMsgeData, message: arg };
    setCreateTemplatMsgeData(data);
    insertMessageData(data);
    setModalFlag(false);
  };

  const handleScheduleState = (arg) => {
    const updated = messageData.map((msg) =>
      msg.id === arg.id ? { ...msg, scheduled: !msg.scheduled } : msg
    );
    setMessageData(updated);
    getMessageTemplate(updated);
  };

  const handleCardDeletion = (arg) => {
    setDeletionData(arg);
    setDeletionState(true);
  };

  const confirmState = (arg) => {
    if (arg) {
      const obj = {
        url: `${URL_CONFIG.DELETE_TEMPLATE_MESSAGE}?id=${deletionData.data.id}`,
        method: 'delete',
      };
      httpHandler(obj)
        .then(() => {
          if (templateType.category === 'anniversary') {
            fetchAnniversaryMessageData();
          } else {
            fetchMessageData();
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

  const renderMessageCard = (item, index, scheduled = false) => (
    <div
      className="Portfolio col-md-4 mb-3"
      key={`messageTemp_${index}`}
    >
      <div
        className={`div_msgData ${scheduled && showAll ? 'm_scheduled' : ''}`}
        onClick={() => handleScheduleState(item)}
      >
        <p>{item.message}</p>
      </div>
      {/* {showAll && ( */}
      <div className="delete_template_div">
        <img
          src={`${process.env.PUBLIC_URL}/images/icons/tasks/delete.svg`}
          className="delete_template"
          alt="Delete Icon"
          onClick={() => handleCardDeletion({ type: 'message', data: item })}
          data-toggle="modal"
          data-target="#deleteECardTemplateModal"
        />
      </div>
      {/* )} */}
    </div>
  );
  return (
    <>
      {modalFlag && <CreatMessageModal getMessageData={getMessageData} />}
      {deletionState && (
        <DeleteECardTemplateModal confirmState={confirmState} />
      )}
      {showModal.type && showModal.message && (
        <EEPSubmitModal
          data={showModal}
          className="modal-addmessage"
          hideModal={hideModal}
          successFooterData={
            <button
              className="eep-btn eep-btn-xsml eep-btn-success"
              onClick={() => hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              className="eep-btn eep-btn-xsml eep-btn-danger"
              onClick={() => hideModal}
            >
              Close
            </button>
          }
        />
      )}

      <div className="row eep-templates-setting-message p-0 m-0">
        <div className="d-flex mb-3">
          <h4 className="c-2c2c2c mb-0">
            {templateType.isSchedule ? 'Pick your message' : 'Add Message(s)'}
          </h4>
        </div>

        <div className="col-md-12 templates_message_div templates_card_whole_div px-0">
          {templateType.isSchedule && (
            <div className="d-flex justify-content-end">
              <ul
                className="nav nav-pills py-2 mb-2 px-0"
                role="tablist"
              >
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
                {console.log(showAll)}
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

          <div className="row mx-0 px-0">
            <div className="col-md-12">
              {(activeTab === 'all' || !templateType.isSchedule) &&
                messageData.map((item, index) =>
                  renderMessageCard(item, index, item.scheduled)
                )}

              {activeTab === 'scheduled' &&
                (scheduledMessageData.length > 0 ? (
                  scheduledMessageData.map((item, index) =>
                    renderMessageCard(item, index, true)
                  )
                ) : (
                  <ResponseInfo
                    title="No records found!."
                    responseImg="noRecord"
                    responseClass="response-info"
                  />
                ))}

              <div className="Portfolio col-md-2 mb-3 add_msg_template_div sample_div">
                <div className="inner samplev">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/icons/plus-white.svg`}
                    className="add_msg_template sample_img c1"
                    alt="Add Msg Icon"
                    data-toggle="modal"
                    data-target="#addMessageModal"
                    onClick={triggerAddMessage}
                  />
                  {/* <img
                    src={`${process.env.PUBLIC_URL}/images/icons/plus-white.svg`}
                    className="add_msg_template sample_img c1"
                    alt="Add Msg Icon"
                    onClick={() => triggerAddMessage}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageTemplate;

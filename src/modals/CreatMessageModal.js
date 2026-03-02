import React, { useState } from 'react';

const CreatMessageModal = (props) => {
  const { getMessageData } = props;
  const [templateMessage, setTemplateMessage] = useState('');
  const msgMaxLength = 120;

  const generateMessageValue = (e) => {
    e.target.value = e.target.value.substring(0, msgMaxLength);
    setTemplateMessage(e.target.value);
  };

  const addTemplateMessage = () => {
    getMessageData(templateMessage);
  };

  return (
    <div
      className="modal fade"
      id="addMessageModal"
      role="dialog"
    >
      <div
        className="modal-dialog modal-confirm modal-addmessage modal-force-width"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header flex-column">
            <div className="d-flex justify-content-center w-100 modal-icon-box">
              <img
                src={
                  process.env.PUBLIC_URL + '/images/icons/popup/AddMessage.svg'
                }
                className="modal-icon-image"
                alt="AddMessageIcon"
              />
            </div>
            <h5
              className="modal-title w-100 text-center mt-3"
              id="exampleModalLabel"
            >
              Create New Message
            </h5>
            <button
              className="close closed"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <textarea
                className="form-control"
                id="createNewMessage"
                rows="3"
                maxLength={msgMaxLength}
                onChange={(e) => generateMessageValue(e)}
                value={templateMessage}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              className="eep-btn eep-btn-cancel eep-btn-xsml"
              type="button"
              data-dismiss="modal"
            >
              Cancel
            </button>
            {/* <button type="submit" className="eep-btn eep-btn-success eep-btn-xsml" onClick={addTemplateMessage} data-dismiss="modal">Add</button> */}
            <button
              type="submit"
              className="eep-btn eep-btn-success eep-btn-xsml"
              onClick={addTemplateMessage}
              data-dismiss="modal"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatMessageModal;

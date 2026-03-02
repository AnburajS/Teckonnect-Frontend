import React from "react";

const StopAllotedAwardModal = (props) => {

  const { deleteMessage, confirmState } = props;
  const handleOk = () => {
    confirmState(true);
  };

  const handleCancel = () => {
    confirmState(false);
  };

  return (
    <div className="eepModalDiv">
      <div id="stopAllotedAwardModal" className="modal fade" aria-modal="true">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            {/* <div className="modal-header flex-column">

            </div> */}
            <div className="modal-body success_message eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="d-flex justify-content-center w-100 modal-icon-box">
                  <img src={process.env.PUBLIC_URL + "/images/icons/popup/warning.svg"} className="modal-icon-image" alt="Success" />
                </div>
                <h5 className="modal-title my-2">{deleteMessage.msg}</h5>
                <p className="modal-desc mb-0">{deleteMessage.subMsg}</p>
                <div className="modal-footer justify-content-center">
                  <React.Fragment>
                    <button type="button" className="eep-btn eep-btn-cancel eep-btn-xsml" data-dismiss="modal" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="button" className="eep-btn eep-btn-success eep-btn-xsml" data-dismiss="modal" onClick={handleOk} >
                      Ok
                    </button>
                  </React.Fragment>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StopAllotedAwardModal;

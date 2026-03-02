import React, { useEffect, useState } from "react";
import IdeaDetailViewInner from "./IdeaDetailViewInner";

const IdeaViewModal = (props) => {

  const {ideaTempData, usersPics, ideaViewModalState, hideModal} = props;

  const initModalManualTrigger = ideaViewModalState ? true : false;
  const [modalManualTrigger, setModalManualTrigger] = useState(false);

  useEffect(() => {
    if(initModalManualTrigger) {
      setModalManualTrigger("block");
    } else {
      setModalManualTrigger("none");
    }
  }, [ideaTempData, initModalManualTrigger]);

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade show"
        id="IdeaViewModal"
        aria-modal="true"
        // style={{display: modalManualTrigger ? "block" : "none"}}
        style={{display:"block"}}
      >
        <div
          className="modal-dialog w-75"
          role="document"
          style={{ maxHeight: "none" }}
        >
          <div className="modal-content p-4">
            <div className="modal-header p-1 border-0 flex-column">
              <button className="close closed" type="button" data-dismiss="modal" aria-label="Close" onClick={hideModal}></button>
            </div>
            <div className="modal-body py-0 px-0">
              <div className="row equal-cols justify-content-md-center mb-4 ideaaboxContainer eep-content-section-data eep_scroll_y">
                <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                  <div className="ideabox_mesgbutton_wrapper">
                    <IdeaDetailViewInner ideaDetail={ideaTempData} usersPic={usersPics} isDetailView={true} />
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
export default IdeaViewModal;

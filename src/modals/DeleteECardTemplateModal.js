import React from 'react';

const DeleteECardTemplateModal = (props) => {
  const { confirmState } = props;
  const handleOk = () => {
    confirmState(true);
  };

  const handleCancel = () => {
    confirmState(false);
  };

  return (
    <div
      id="deleteECardTemplateModal"
      className="modal fade"
      aria-modal="true"
    >
      <div className="modal-dialog modal-confirm">
        <div className="modal-content">
          <div className="modal-header flex-column">
            <div className="d-flex justify-content-center w-100 modal-icon-box">
              <img
                src={process.env.PUBLIC_URL + '/images/icons/popup/warning.svg'}
                className="modal-icon-image"
                alt="Success"
              />
            </div>
          </div>
          <div className="modal-body success_message">
            <h5 className="modal-title mb-2">Are you sure?</h5>
            <p className="modal-desc mb-0">Confirm delete action?</p>
          </div>
          <div className="modal-footer justify-content-center">
            <React.Fragment>
              <button
                type="button"
                className="eep-btn eep-btn-cancel eep-btn-xsml"
                data-dismiss="modal"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="eep-btn eep-btn-success eep-btn-xsml"
                data-dismiss="modal"
                onClick={handleOk}
              >
                Confirm
              </button>
            </React.Fragment>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};
export default DeleteECardTemplateModal;

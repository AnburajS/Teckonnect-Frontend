import React from 'react';
const PreviewCertificateModal = () => {
  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="certPreviewModal"
      >
        <div className="modal-dialog w-75">
          <div className="modal-content p-4">
            <div className="modal-header p-0 border-bottom-0">
              <button
                type="button"
                className="close closed"
                data-dismiss="modal"
                title="Close"
              ></button>
            </div>
            <div className="modal-body py-0 px-0 eep_scroll_y">
              <div className="row justify-content-md-center">
                <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                  <div
                    className="iframeWrapper"
                    style={{
                      margin: '0px;padding:0px',
                      height: 'calc(100vh - 125px)',
                    }}
                  >
                    <iframe
                      src={`${process.env.PUBLIC_URL}/resources/pdf/certificates/certificate_1_filled.pdf`}
                      frameBorder="0"
                      className="myCertPreviewModal"
                      style={{ width: '100%', display: 'block' }}
                      height="100%"
                      width="100%"
                    ></iframe>
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
export default PreviewCertificateModal;

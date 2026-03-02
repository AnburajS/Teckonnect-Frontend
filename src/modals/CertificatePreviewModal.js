import React, { useEffect, useState } from 'react';
import PDF from 'react-pdf-js';
import Isloading from '../UI/CustomComponents/Isloading';

const CertificatePreviewModal = (props) => {
  const [previewDataUri, setPreviewDataUri] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = props?.previewDataUri;
    setPreviewDataUri(data);
    if (data?.isIframe || data?.dataSrc?.pdfByte?.image) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [props?.previewDataUri]);

  const handlePDFLoad = (e) => {
    console.log(e);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 5s max wait time
  };

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade show"
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
                {Object.keys(previewDataUri)?.length > 0 && (
                  <div className="col-12">
                    <div
                      className="thumbnailWrapper"
                      style={{
                        margin: '0px',
                        padding: '0px',
                        height: 'calc(100vh - 125px)',
                      }}
                    >
                      {isLoading && <Isloading />}

                      {previewDataUri.isIframe && (
                        <div className="iframeWrapper eep-content-section eep_scroll_y">
                          <PDF
                            key={previewDataUri?.dataSrc}
                            file={previewDataUri?.dataSrc}
                            onDocumentComplete={handlePDFLoad}
                          />
                        </div>
                      )}

                      {!previewDataUri.isIframe &&
                        previewDataUri.dataSrc?.pdfByte?.image && (
                          <div className="iframeWrapper eep-content-section eep_scroll_y">
                            <PDF
                              key={previewDataUri.dataSrc.pdfByte.image}
                              file={previewDataUri.dataSrc.pdfByte.image}
                              onDocumentComplete={handlePDFLoad}
                            />
                          </div>
                        )}

                      {!previewDataUri.isIframe &&
                        !previewDataUri?.dataSrc?.pdfByte &&
                        previewDataUri?.dataSrc?.imageByte?.image && (
                          <div className="iframeWrapper eep-content-section eep_scroll_y">
                            <img
                              src={previewDataUri.dataSrc.imageByte.image}
                              className="w-100"
                              alt={previewDataUri?.dataSrc?.name}
                              title={previewDataUri?.dataSrc?.name}
                              loading="lazy"
                            />
                          </div>
                        )}

                      {!previewDataUri.isIframe &&
                        previewDataUri.dataSrc === null && (
                          <div
                            className="alert alert-danger"
                            role="alert"
                          >
                            Certificate not found!
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;

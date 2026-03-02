import React, { useEffect, useState } from 'react';

const EEPSubmitModal = ({
  data,
  className,
  successFooterData,
  errorFooterData,
  hideModal,
}) => {
  const { message, type, celebrations, success } = data;

  const [showCelebration, setShowCelebration] = useState(false);

  const url = process.env.PUBLIC_URL + '/images/gif/sound.mp3';
  const [audio] = useState(new Audio(url));

  useEffect(() => {
    if (celebrations && celebrations?.isCelebration) {
      setShowCelebration(true);
      audio.play();
      setTimeout(() => {
        setShowCelebration(false);
        audio.pause();
      }, 3000);
    }
  }, [celebrations]);
  return (
    <div className="eepModalDiv">
      <div
        id="EEPSubmitModal"
        className="modal fade show"
        aria-modal="true"
        style={{ paddingRight: '17px', display: 'block' }}
      >
        <div
          className={`modal-dialog modal-confirm ${className} modal-force-width`}
        >
          {type && type === 'success' && (
            <div className="modal-content">
              {/* <div className="modal-header flex-column">
                  </div> 
              */}
              <div className="modal-body success_message eep_scroll_y">
                {celebrations &&
                  celebrations.isCelebration &&
                  showCelebration && (
                    <img
                      src={`${process.env.PUBLIC_URL}/images/gif/${celebrations.celebrationItem}`}
                      alt="celebration"
                      style={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        zIndex: '100',
                        width: '100%',
                      }}
                    />
                  )}

                <div className="modalBodyHeight">
                  <div className="d-flex justify-content-center w-100 modal-icon-box">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        '/images/icons/popup/success.svg'
                      }
                      className="modal-icon-image"
                      alt="Success"
                    />
                  </div>
                  <h5
                    className="modal-title my-2"
                    id="exampleModalLabel"
                  >
                    {success ? success : message}
                  </h5>
                  {/* <p className="modal-desc mb-0">{message ? message : ''}</p> */}
                  {successFooterData && (
                    <div className="modal-footer justify-content-center">
                      {successFooterData}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {type && type === 'danger' && (
            <div className="modal-content">
              <div className="modal-header flex-column">
                <button
                  type="button"
                  className="close closed"
                  data-dismiss="modal"
                  title="Close"
                  onClick={hideModal}
                ></button>
              </div>
              <div className="modal-body eep_scroll_y">
                <div className="modalBodyHeight">
                  <div className="d-flex justify-content-center w-100 modal-icon-box">
                    <img
                      src={
                        process.env.PUBLIC_URL + '/images/icons/popup/oops.svg'
                      }
                      className="modal-icon-image"
                      alt="Failure"
                    />
                  </div>
                  <h5
                    className="modal-title my-2"
                    id="exampleModalLabel"
                  >
                    Warning!
                  </h5>
                  <p className="modal-desc">
                    {message
                      ? message
                      : 'Something went wrong. Please contact Administrator.'}
                  </p>
                  {errorFooterData && (
                    <div className="modal-footer justify-content-center">
                      {errorFooterData}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EEPSubmitModal;

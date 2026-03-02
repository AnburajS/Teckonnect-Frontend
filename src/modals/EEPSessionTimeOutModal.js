import React, { useState } from 'react';

const EEPSessionTimeOutModal = ({
  data,
  className,
  SessionTimeOutFooterData,
}) => {
  const { message, type } = data;
  return (
    <div
      id="EEPSessionTimeOutModal"
      className="modal fade show"
      aria-modal="true"
      style={{ paddingRight: '17px', display: 'block' }}
    >
      <div
        className={`modal-dialog modal-confirm ${className} modal-force-width`}
      >
        {type && type === 'SessionTimeOut' && (
          <div className="modal-content">
            <div className="modal-header flex-column">
              <div className="d-flex justify-content-center w-100 modal-icon-box">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    '/images/icons/popup/SessionTimeOutDanger.svg'
                  }
                  className="modal-icon-image"
                  alt="SessionTimeOut"
                />
              </div>
            </div>
            <div className="modal-body success_message">
              <h5
                className="modal-title mb-2"
                id="exampleModalLabel"
              >
                oops ...!
              </h5>
              <p className="modal-desc mb-0">{message ? message : ''}</p>
            </div>
            {SessionTimeOutFooterData && (
              <div className="modal-footer justify-content-center">
                {SessionTimeOutFooterData}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EEPSessionTimeOutModal;

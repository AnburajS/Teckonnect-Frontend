import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  headerClass,
  modalWidth = 'w-75',
  padding = 2,
  header = true,
  width = '480px',
  isModelWidth = false,
  height = 'auto',
  isModelHeight = false,
  isPaddingBody = false,
  paddingBody,
}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="eepModalDiv " id="page-loader-container">
      <div
        className={`modal fade show ${className}`}
        aria-modal="true"
        style={{ display: 'block' }}
      >
        <div
          className={`modal-dialog ${isModelWidth ? '' : modalWidth}`}
          style={isModelWidth ? { width: width } : {}}
        >
          <div className={`modal-content p-${padding} `}>
            <div
              className="modal-body py-0 px-0 "
              style={isModelHeight ? { height: height } : {}}
            >
              {header ? (
                <div className="modal-header flex-column">
                  <button
                    type="button"
                    className={`close closed t--${
                      padding === 3 ? 10 : padding === 4 ? 20 : 0
                    }  r--${padding === 3 ? 10 : padding === 4 ? 20 : 0}`}
                    data-dismiss="modal"
                    title="Close"
                    onClick={onClose}
                  ></button>
                  {title && (
                    <h5 className={`${headerClass} modal-title`}>{title}</h5>
                  )}
                </div>
              ) : (
                <div className="modal-headers">
                  <button
                    type="button"
                    className={`close closed t--${
                      padding === 3 ? 10 : padding === 4 ? 20 : 0
                    }  r--${padding === 3 ? 10 : padding === 4 ? 20 : 0}`}
                    data-dismiss="modal"
                    title="Close"
                    onClick={onClose}
                  ></button>
                </div>
              )}

              <div
                className={`modal-body eep-content-section eep_scroll_y  ${
                  isPaddingBody ? `p-${paddingBody}` : ''
                }`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

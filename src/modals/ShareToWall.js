import React, { useEffect, useState } from 'react';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';

const ShareToWall = (props) => {
  const { ShareID, fetchMyData } = props;

  const [shareResponseMsg, setShareResponseMsg] = useState('');
  const [shareResponseClassName, setShareResponseClassName] = useState('');

  const shareHandlerOnClick = () => {
    const obj = {
      url: URL_CONFIG.SHARE_WALL,
      //  + "?id=" + ShareID,
      payload: { id: ShareID },
      method: 'post',
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setShareResponseMsg(resMsg);
        setShareResponseClassName('response-succ');
        fetchMyData();
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setShareResponseMsg(errMsg);
        setShareResponseClassName('response-err');
      });
  };

  useEffect(() => {
    setShareResponseMsg('');
    setShareResponseClassName('');
  }, [ShareID]);

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade show"
        id="ShareToWall"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-confirm modal-addmessage modal-force-width"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header flex-column p-0">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="d-flex justify-content-center w-100 modal-icon-box">
                  <img
                    src={
                      process.env.PUBLIC_URL + '/images/icons/static/share.svg'
                    }
                    className="modal-icon-image"
                    alt="Share"
                  />
                </div>
                <h5
                  className="modal-title w-100 text-center mt-3"
                  id="exampleModalLabel"
                >
                  EnliteU Wall Share
                </h5>
                <div className="my-2">
                  <p>
                    The selected recognition will be share to EnliteU Wall..!
                  </p>
                </div>
                {/* <div className="modal-footer justify-content-center"> */}
                {!shareResponseMsg && (
                  <React.Fragment>
                    <button
                      className="eep-btn eep-btn-cancel eep-btn-xsml"
                      type="button"
                      data-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="eep-btn eep-btn-success eep-btn-xsml ml-2"
                      onClick={shareHandlerOnClick}
                    >
                      Share
                    </button>
                  </React.Fragment>
                )}
                {shareResponseMsg && (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="response-div m-0">
                      <p className={`${shareResponseClassName} response-text`}>
                        {shareResponseMsg}
                      </p>
                    </div>
                  </div>
                )}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShareToWall;

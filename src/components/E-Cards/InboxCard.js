import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { formatDate } from '../../shared/SharedService';
import ResponseInfo from '../../UI/ResponseInfo';
import ToolTip from '../../modals/ToolTip';

const InboxCard = (props) => {
  const { inboxCardSettings, inboxData, likeECard } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const eCardMaxList = 3;
  const [eCardDataLimited, setECardDataLimited] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections?.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const likeECardHandler = (arg) => {
    likeECard(arg);
  };

  useEffect(() => {
    setECardDataLimited(inboxData);
  }, [inboxData]);

  const readAllECard = () => {
    const obj = {
      url: URL_CONFIG.READ_ALL_ECARD + '?type=' + inboxData?.[0]?.type,
      method: 'put',
    };
    httpHandler(obj)
      .then((response) => {})
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };

  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      <div className="card">
        <div
          className="card-header p-0"
          id={inboxCardSettings?.id}
        >
          <h2 className="mb-0">
            <a
              className="btn btn-link collapsed c1"
              type="button"
              data-toggle="collapse"
              data-target={'#' + inboxCardSettings?.dataTarget}
              aria-expanded={inboxCardSettings?.expand}
              aria-controls={inboxCardSettings?.dataTarget}
            >
              {inboxCardSettings?.title}
            </a>
          </h2>
        </div>
        <div
          id={inboxCardSettings?.dataTarget}
          className={`collapse ${inboxCardSettings?.show}`}
          aria-labelledby={inboxCardSettings?.id}
          data-parent="#accordionInbox"
        >
          <div className="card-body px-0 pt-0">
            <div
              id={inboxCardSettings?.carousel}
              className="carousel slide carousel-inbox"
              data-interval="false"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="row pb-4">
                    {eCardDataLimited &&
                      eCardDataLimited?.length > 0 &&
                      eCardDataLimited.map((item, index) => {
                        if (index < eCardMaxList) {
                          return (
                            <div
                              className="col-md-4"
                              key={'Ecards_' + index}
                            >
                              <div className="item-box-blog">
                                <div className="item-box-blog-image">
                                  {item && !item?.seen && (
                                    <div className="item-box-blog-new">
                                      <img
                                        className=""
                                        src={`${process.env.PUBLIC_URL}/images/icons/static/new.svg`}
                                        alt="New"
                                      />
                                    </div>
                                  )}
                                  <figure>
                                    <img
                                      src={item?.imageByte?.image}
                                      alt="E-Card"
                                      style={{ maxWidth: '100%' }}
                                    />
                                  </figure>
                                </div>
                                <div className="item-box-blog-body">
                                  <div className="row">
                                    <div className="col-md-10">
                                      <div className="item-box-blog-heading">
                                        <h5>
                                          {item?.fromUserId?.firstname +
                                            ' ' +
                                            item?.fromUserId?.lastname}
                                        </h5>
                                      </div>
                                    </div>
                                    <div className="col-md-2 pl-0 my-auto">
                                      <div className="item-box-blog-like text-center">
                                        {!item?.liked && (
                                          <span
                                            className="item_blog_like_a c1"
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                svgIcons && svgIcons.like_icon,
                                            }}
                                            onClick={() =>
                                              likeECardHandler(item)
                                            }
                                          ></span>
                                        )}
                                        {item?.liked && (
                                          <span
                                            className="item_blog_like_a c1"
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                svgIcons && svgIcons.liked_icon,
                                            }}
                                            onClick={() =>
                                              likeECardHandler(item)
                                            }
                                          ></span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-10">
                                      <div className="item-box-blog-text c-2c2c2c">
                                        <ToolTip
                                          title={item?.message}
                                          arrow
                                          placement="top-start"
                                          backgroundColor="#82889B"
                                          color="#FFFFFF"
                                          fontSize="10px"
                                        >
                                          <p>{item?.message}</p>
                                        </ToolTip>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="item-box-blog-date text-right c-2c2c2c">
                                        <p>{formatDate(item?.createdAt)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return;
                      })}
                    {eCardDataLimited?.length <= 0 && (
                      <ResponseInfo
                        title="No cards found!"
                        responseImg="noRecord"
                        responseClass="response-info"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {eCardDataLimited && eCardDataLimited?.length > 0 && (
              <div className="d-flex justify-content-end mt-4 pr-4">
                <Link
                  to={{
                    pathname: '/app/inboxdetailview',
                  }}
                  state={{
                    eCardData: inboxData,
                    inboxCardSettings: inboxCardSettings,
                  }}
                  className="eep-btn eep-btn-cancel eep-btn-xsml"
                  onClick={readAllECard}
                >
                  View All
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InboxCard;

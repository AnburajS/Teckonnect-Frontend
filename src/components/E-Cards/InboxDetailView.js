import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import PageHeader from '../../UI/PageHeader';
import { formatDate } from '../../shared/SharedService';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import ToolTip from '../../modals/ToolTip';

const InboxDetailView = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const getLocation = useLocation();
  const eCardValue = getLocation.state ? getLocation.state?.eCardData : '';
  const inboxCardSettingsValue = getLocation.state
    ? getLocation.state?.inboxCardSettings
    : '';
  const [eCardData, setECardData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  useEffect(() => {
    if (eCardValue && eCardValue.length) {
      setECardData(eCardValue);
    }

    return () => {
      setECardData([]);
    };
  }, [eCardValue]);

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'RECOGNIZE',
      link: 'app/recognition',
    },
    {
      label: 'Inbox',
      link: 'app/Inbox',
    },
    {
      label: 'Inbox Insights',
      link: 'app/DetalView',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Recognition',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  const likeECard = (arg) => {
    const obj = {
      url: URL_CONFIG.ECARD_LIKE + '?id=' + arg.id + '&like=' + !arg.liked,
      method: 'put',
    };
    httpHandler(obj)
      .then(() => {
        let eCardDataTemp = JSON.parse(JSON.stringify(eCardData));
        eCardDataTemp.length &&
          eCardDataTemp.map((item) => {
            if (item.id === arg.id) {
              item.liked = !arg.liked;
            }
          });
        setECardData(eCardDataTemp);
      })
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
      <PageHeader
        title={inboxCardSettingsValue.title}
        navLinksLeft={
          <Link
            className="text-right c-c1c1c1 mr-2 my-auto eep_nav_icon_div eep_action_svg"
            to={{
              pathname: '/app/ecardIndex',
            }}
            state={{ activeTab: 'InboxTab' }}
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.lessthan_circle,
            }}
          ></Link>
        }
      ></PageHeader>
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
      <div className="row eep-content-section-data carousel-inbox">
        {eCardData &&
          eCardData.length > 0 &&
          eCardData.map((item, index) => {
            return (
              <div
                className="col-md-4 mb-3"
                key={'EcardsDetail_' + index}
              >
                <div className="item-box-blog">
                  <div className="item-box-blog-image">
                    <figure>
                      <img
                        src={item?.imageByte?.image}
                        alt="Birthday-1"
                        style={{ maxWidth: '100%' }}
                      />
                    </figure>
                  </div>
                  <div className="item-box-blog-body">
                    <div className="row">
                      <div className="col-md-10">
                        <div className="item-box-blog-heading">
                          <h5>
                            {item.fromUserId.firstname +
                              ' ' +
                              item.fromUserId.lastname}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-2 pl-0 my-auto">
                        <div className="item-box-blog-like text-center">
                          {!item.liked && (
                            <span
                              className="item_blog_like_a c1"
                              dangerouslySetInnerHTML={{
                                __html: svgIcons && svgIcons.like_icon,
                              }}
                              onClick={() => likeECard(item)}
                            ></span>
                          )}
                          {item.liked && (
                            <span
                              className="item_blog_like_a c1"
                              dangerouslySetInnerHTML={{
                                __html: svgIcons && svgIcons.liked_icon,
                              }}
                              onClick={() => likeECard(item)}
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
                            <p>{item.message}</p>
                          </ToolTip>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="item-box-blog-date text-right c-2c2c2c">
                          <p>{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
};

export default InboxDetailView;

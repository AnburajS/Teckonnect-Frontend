import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import PageHeader from '../../UI/PageHeader';
import InboxCard from './InboxCard';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import Isloading from '../../UI/CustomComponents/Isloading';
import { pageLoaderHandler } from '../../helpers';

const Inbox = (props) => {
  const { activeAccordTab } = props;
  const [inboxData, setInboxData] = useState();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const [isLoading, setIsLoading] = useState(true);

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
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Recognition',
      }),
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  const fetchInboxData = () => {
    setIsLoading(true);
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    const obj = {
      url: URL_CONFIG.ECARD_INBOX,
      method: 'get',
      params: { id: userData.id },
    };
    httpHandler(obj)
      .then((response) => {
        const groupByCategory = response?.data?.reduce((group, card) => {
          const { type } = card;
          group[type] = group[type] ?? [];
          group[type].push(card);
          return group;
        }, {});
        setInboxData(groupByCategory);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('fetchInboxData error', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchInboxData();
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const likeECard = (arg) => {
    const obj = {
      url: URL_CONFIG.ECARD_LIKE + '?id=' + arg.id + '&like=' + !arg.liked,
      method: 'put',
    };
    httpHandler(obj)
      // .then(() => {
      //   fetchInboxData();
      // })
      .then(() => {
        setInboxData((prev) => {
          const updated = { ...prev };

          Object.keys(updated).forEach((key) => {
            updated[key] = updated[key].map((item) =>
              item.id === arg.id ? { ...item, liked: !arg.liked } : item,
            );
          });

          return updated;
        });
      })

      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Something went wrong contact administarator';
        setShowModal({
          ...showModal,
          type: 'danger',
          message: errMsg,
        });
      });
  };

  return (
    <React.Fragment>
      <PageHeader title="Inbox"></PageHeader>
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
      {isLoading ? (
        <Isloading />
      ) : (
        <div className="row eep-content-section-data no-gutters eep-inner-inbox-div">
          <div className="col-md-12">
            <div id="inbox-accordion">
              <div
                className="accordion"
                id="accordionInbox"
              >
                <InboxCard
                  inboxCardSettings={{
                    id: 'InboxOne',
                    dataTarget: 'collapseInboxBirthday',
                    title: 'Birthday',
                    show: `${
                      activeAccordTab === 'Birthday'
                        ? 'show'
                        : `${
                            activeAccordTab === 'Appreciation' ||
                            'Anniversary' ||
                            'Seasonal'
                              ? ''
                              : 'show'
                          }`
                    }`,
                    expand: `${
                      activeAccordTab === 'Birthday'
                        ? 'true'
                        : `${
                            activeAccordTab === 'Appreciation' ||
                            'Anniversary' ||
                            'Seasonal'
                              ? 'false'
                              : 'true'
                          }`
                    }`,
                    carousel: 'inboxBirthdayCarousel',
                  }}
                  inboxData={inboxData?.birthday || []}
                  likeECard={likeECard}
                />
                <InboxCard
                  inboxCardSettings={{
                    id: 'InboxTwo',
                    dataTarget: 'collapseInboxWorkAnniversary',
                    title: 'Work Anniversary',
                    show: `${activeAccordTab === 'Anniversary' ? 'show' : ''}`,
                    expand: `${
                      activeAccordTab === 'Anniversary' ? 'true' : 'false'
                    }`,
                    carousel: 'inboxWorkAnniversaryCarousel',
                  }}
                  inboxData={inboxData?.anniversary || []}
                  likeECard={likeECard}
                />
                <InboxCard
                  inboxCardSettings={{
                    id: 'InboxThree',
                    dataTarget: 'collapseInboxAppreciation',
                    title: 'Kudos',
                    show: `${activeAccordTab === 'Appreciation' ? 'show' : ''}`,
                    expand: `${
                      activeAccordTab === 'Appreciation' ? 'true' : 'false'
                    }`,
                    carousel: 'inboxAppreciationCarousel',
                  }}
                  inboxData={inboxData?.appreciation || []}
                  likeECard={likeECard}
                />
                <InboxCard
                  inboxCardSettings={{
                    id: 'InboxFour',
                    dataTarget: 'collapseInboxSeasonal',
                    title: 'Festive Wishes',
                    show: `${activeAccordTab === 'Seasonal' ? 'show' : ''}`,
                    expand: `${
                      activeAccordTab === 'Seasonal' ? 'true' : 'false'
                    }`,
                    carousel: 'inboxSeasonalCarousel',
                  }}
                  inboxData={inboxData?.seasonal || []}
                  likeECard={likeECard}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default Inbox;

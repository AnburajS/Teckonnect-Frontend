import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import PageHeader from '../../UI/PageHeader';
import MessageTemplate from './MessageTemplate';
import CardsTemplate from './CardsTemplate';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import ResponseInfo from '../../UI/ResponseInfo';

const SeasonalTemplateSettings = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const templateType = { category: 'seasonal', isSchedule: false };
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

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
      label: 'Template Library',
      link: 'app/template',
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

  const getCardsTemplate = (arg) => {
    //setTemplateList(arg);
  };

  const getMessageTemplate = (arg) => {
    //setMessageList(arg);
  };

  return (
    <React.Fragment>
      {userRolePermission.ecardTemplates && (
        <React.Fragment>
          <PageHeader
            title="Festive Settings"
            navLinksLeft={
              <Link
                className="text-right c-c1c1c1 mr-2 my-auto eep_nav_icon_div eep_action_svg"
                to={{
                  pathname: '/app/ecardIndex',
                }}
                state={{ activeTab: 'TemplatesTab' }}
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
          <div className="row eep-content-section-data no-gutters">
            <div className="col-md-12">
              <CardsTemplate
                showAll={true}
                templateType={templateType}
                getCardsTemplate={getCardsTemplate}
              />
              <div className="eep-dropdown-divider-sett"></div>
              <MessageTemplate
                showAll={true}
                templateType={templateType}
                getMessageTemplate={getMessageTemplate}
              />
            </div>
          </div>
        </React.Fragment>
      )}
      {!userRolePermission.ecardTemplates && (
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illegal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default SeasonalTemplateSettings;

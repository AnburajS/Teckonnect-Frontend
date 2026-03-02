import React, { useEffect, useState } from 'react';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import AddRecognitionIcon from '../FormElements/AddRecognitionIcon';
import AddRecognitionFields from '../FormElements/AddRecognitionFields';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import ResponseInfo from '../../UI/ResponseInfo';

const CreatBadges = () => {
  const getLocation = useLocation();
  const libDataVal = getLocation.state ? getLocation.state?.libData : null;

  const [regData, setRegData] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [badgeResponseMsg, setBadgeResponseMsg] = useState('');
  const [badgeResponseClassName, setBadgeResponseClassName] = useState('');
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: libDataVal ? 'Library' : 'RECOGNITION',
      link: libDataVal ? 'app/library' : 'app/recognition',
    },
    {
      label: 'Badges',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Create Badges',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  useEffect(() => {
    if (libDataVal && Object.keys(libDataVal).length) {
      const regDataTemp = {
        imageByte: null,
        name: libDataVal.name,
        points: 0,
        hashTag: [],
      };
      setRegData({ ...regDataTemp });
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [libDataVal]);

  useEffect(() => {
    if (regData && Object.keys(regData).length) {
      if (libDataVal && Object.keys(libDataVal).length) {
        if (
          regData.name !== '' &&
          regData.points >= 0 &&
          regData.points !== ''
        ) {
          setDisabled(false);
        } else {
          setDisabled(true);
        }
      } else {
        if (regData.imageByte && Object.keys(regData.imageByte).length) {
          if (
            regData?.imageByte?.image &&
            regData.name !== '' &&
            regData.points >= 0 &&
            regData.points !== ''
          ) {
            setDisabled(false);
          } else {
            setDisabled(true);
          }
        } else {
          setDisabled(true);
        }
      }
    } else {
      setDisabled(true);
    }
  }, [regData]);

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const getImageData = (args) => {
    setBadgeResponseMsg('');
    setBadgeResponseClassName('');
    setRegData({ ...regData, imageByte: args });
  };

  const getFormData = (args) => {
    setBadgeResponseMsg('');
    setBadgeResponseClassName('');
    setRegData({ ...regData, ...args });
  };

  const onSubmitHandler = () => {
    regData['active'] = true;
    regData['libraryBadges'] = libDataVal ? { id: libDataVal.id } : null;

    if (regData?.imageByte?.image) {
      regData['imageByte'] = regData?.imageByte?.image ?? '';
    }
    const obj = {
      url: URL_CONFIG.CREATE_BADGE,
      method: 'post',
      payload: regData,
    };
    httpHandler(obj)
      .then((response) => {
        setBadgeResponseMsg('');
        setBadgeResponseClassName('');
        const resMsg = response?.data?.message;
        setShowModal({
          ...showModal,
          type: 'success',
          success: resMsg,
          message: '',
        });
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setBadgeResponseMsg(errMsg);
        setBadgeResponseClassName('response-err');
      });
  };

  return (
    <React.Fragment>
      {userRolePermission.badgeCreate && (
        <React.Fragment>
          {showModal.type !== null && showModal.message !== null && (
            <EEPSubmitModal
              data={showModal}
              className={`modal-addmessage`}
              hideModal={hideModal}
              successFooterData={
                <Link
                  to={{
                    pathname: '/app/badges',
                  }}
                  state={{ activeTab: 'badgeTab' }}
                  type="button"
                  className="eep-btn eep-btn-xsml eep-btn-success"
                >
                  Ok
                </Link>
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
          <PageHeader
            title="Create New Badge"
            navLinksLeft={
              <Link
                className="text-right c-c1c1c1 mr-2 my-auto eep_nav_icon_div eep_action_svg"
                to={{
                  pathname: libDataVal ? '/app/library' : '/app/badges',
                }}
                state={{ activeTab: libDataVal ? 'Badges' : 'badgeTab' }}
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.lessthan_circle,
                }}
              ></Link>
            }
          ></PageHeader>
          <div
            className="row mx-0 n_badge_row_div mt-4 eep-content-start "
            id="content-start"
          >
            <div className="col-md-4 col-lg-3 col-xs-12 col-sm-12 n_badge_add_col_div">
              <AddRecognitionIcon
                libImageData={libDataVal ? libDataVal.imageByte : ''}
                getImageData={getImageData}
              />
            </div>

            <div className="col-md-8 col-lg-9 col-xs-12 col-sm-12 n_badge_add_dtls_div">
              <div className="n_badge_add_dtls_inner">
                <AddRecognitionFields
                  libNameData={libDataVal ? libDataVal.name : ''}
                  getFormData={getFormData}
                  recogType="badges"
                />
                <div className="col-md-12 text-center n_badge_action_div">
                  {!badgeResponseMsg && (
                    <button
                      type="button"
                      className="eep-btn eep-btn-success"
                      onClick={onSubmitHandler}
                      disabled={disabled}
                    >
                      Create
                    </button>
                  )}
                  {badgeResponseMsg && (
                    <div className="response-div m-0">
                      <p className={`${badgeResponseClassName} response-text`}>
                        {badgeResponseMsg}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
      {!userRolePermission.badgeCreate && (
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
export default CreatBadges;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import PageHeader from '../UI/PageHeader';
import { URL_CONFIG } from '../constants/rest-config';
import { base64ToFile, pageLoaderHandler } from '../helpers';
import { httpHandler } from '../http/http-interceptor';
import EEPSubmitModal from '../modals/EEPSubmitModal';
import SignatureUploadModal from '../modals/SignatureUploadModal';
import UpdateProfileModal from '../modals/UpdateProfileModal';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import FormContainer from './FormElements/FormContainer';
import { FormContext } from './FormElements/FormContext';

const MyProfile = () => {
  const [userMeta, setUserMeta] = useState(null);
  const [currUserDataNew, setCurrUserDataNew] = useState(null);
  const [pictureResponse, setPictureResponse] = useState({});
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState({ type: null, message: null });

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    setShowUpdateProfileModal(false);
  };

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'My Profile',
      link: '',
    },
  ];

  const fetchUserMeta = () => {
    fetch(`${process.env.PUBLIC_URL}/data/user.json`)
      .then((response) => response.json())
      .then((data) => {
        setUserMeta(data);
        fetchCurrentUserData(data);
      })
      .catch((error) => console.log(error));
  };

  const fetchCurrentUserData = (userMeta) => {
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    const obj = {
      url: URL_CONFIG.GETUSER,
      method: 'get',
      params: { id: userData.id },
    };
    httpHandler(obj)
      .then(async (uData) => {
        pageLoaderHandler('hide');
        if (uData?.data?.country?.id) {
          const obj_ = {
            url:
              URL_CONFIG.GET_ALL_BRANCH_NAME +
              '?countryId=' +
              uData?.data?.country?.id,
            method: 'get',
          };
          await httpHandler(obj_)
            .then((user_) => {
              userMeta.column3.fields[4]['options'] = user_?.data?.map((v) => {
                return { label: v?.name, value: v?.id };
              });
              setUserMeta({
                ...userMeta,
              });
            })
            .catch((error) => {
              pageLoaderHandler('hide');
            });
        }
        userDataValueMapping(userMeta, uData.data);
        setCurrUserDataNew(uData.data);
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

  const loadData = (data, fieldName) => {
    let value = Object.assign({}, data);
    const entries = fieldName.split('.');
    if (fieldName?.includes('gender')) {
      return value[entries[0]].label;
    }
    if (fieldName?.includes('branch')) {
      return value[entries[0]].label;
    }
    for (const field of entries) {
      if (value[field]) {
        value = value[field];
      } else {
        return null;
      }
    }
    return value;
  };

  const userDataValueMapping = (userMeta, uData) => {
    for (let fields in userMeta) {
      for (let fld of userMeta[fields].fields) {
        if (fld['type'] === 'password') {
          fld['display'] = false;
        }

        if ('viewMode' in fld) {
          if (fld['type'] === 'number') {
            if (fld['contactNumber']) {
              if (fld['subField']) {
                fld['subField']['type'] = fld['subField']['viewMode']['type'];
                fld['subField']['value'] = loadData(
                  uData,
                  fld['subField']['viewMode']['value']
                );
              }

              fld['type'] = fld['viewMode']['type'];
              if (fld['viewMode']['value'].indexOf('.') !== -1) {
                fld['value'] = loadData(uData, fld['viewMode']['value']);
              } else {
                fld['value'] =
                  fld['name'] !== 'password'
                    ? uData[fld['viewMode']['value']]
                    : '';
              }
            } else {
              fld['type'] = fld['viewMode']['type'];
              if (fld['viewMode']['value'].indexOf('.') !== -1) {
                fld['value'] = loadData(uData, fld['viewMode']['value']);
              } else {
                if (fld['name'] === 'active') {
                  fld['value'] = uData[fld['name']] ? 'Active' : 'Inactive';
                } else {
                  fld['value'] =
                    fld['name'] !== 'password'
                      ? uData[fld['viewMode']['value']]
                      : '';
                }
              }
            }
          } else {
            fld['type'] = fld['viewMode']['type'];
            if (fld['viewMode']['value'].indexOf('.') !== -1) {
              fld['value'] = loadData(uData, fld['viewMode']['value']);
            } else {
              fld['value'] =
                fld['name'] !== 'password'
                  ? uData[fld['viewMode']['value']]
                  : '';
            }
          }
        } else {
          if (fld['name'].indexOf('.') !== -1) {
            fld['value'] = loadData(uData, fld['name']);
          } else {
            fld['value'] = fld['name'] !== 'password' ? uData[fld['name']] : '';
          }
        }

        if (fld['type'] === 'file') {
          fld['viewMode']['actions'] = true;
          fld['disabled'] = false;
        } else {
          fld['disabled'] = true;
        }
      }
    }
    setUserMeta((prevState) => {
      return { prevState, ...userMeta };
    });
  };

  useEffect(() => {
    pageLoaderHandler('show');
    fetchUserMeta();
  }, []);

  const onUpload = (arg) => {
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    // let currUserDataTemp = JSON.parse(JSON.stringify(currUserDataNew));
    // delete currUserDataTemp.createdAt;
    // delete currUserDataTemp.createdBy;
    // delete currUserDataTemp.department.createdBy;
    // delete currUserDataTemp.department.createdBy;
    // delete currUserDataTemp.updatedAt;
    // delete currUserDataTemp.updatedBy;
    // delete currUserDataTemp.department.updatedAt;
    // delete currUserDataTemp.department.updatedBy;
    // currUserDataTemp.imageByte=arg;

    const base64Data = (arg?.image).replace(/^data:image\/\w+;base64,/, '');
    const file = base64ToFile(base64Data);

    const formData = new FormData();
    formData.append('image', file);

    const obj = {
      url: URL_CONFIG.UPLOAD_FILES,
      method: 'post',
      payload: formData,
    };
    httpHandler(obj)
      .then((res) => {
        const obj_ = {
          url: URL_CONFIG.GETUSER_PROFILE,
          method: 'put',
          payload: {
            profilePic: res?.data?.data?.[0]?.url ?? '',
            id: userData?.id,
          },
        };
        httpHandler(obj_)
          .then(() => {
            var data = JSON.parse(sessionStorage.getItem('userData'));
            if (res?.data?.data?.[0]?.url) {
              data['userLogo'] = res?.data?.data?.[0]?.url ?? '';
            }
            sessionStorage.setItem('userData', JSON.stringify(data));

            //const respMsg = response?.data?.message;
            setPictureResponse({
              message: 'Picture updated successfully!',
              type: 'success',
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setPictureResponse({
          message: errMsg,
          type: 'danger',
        });
      });
  };

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'My Profile',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, [breadcrumbArr, dispatch]);

  const handleChange = (field, event) => {
    //field["value"] = event;
  };

  return (
    <React.Fragment>
      {showUpdateProfileModal && <UpdateProfileModal hideModal={hideModal} />}
      <SignatureUploadModal />

      <PageHeader
        title="My Profile"
        navLinksRight={
          <a
            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg c1"
            data-toggle="modal"
            data-target="#UpdateProfileModal"
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.Key_icon,
            }}
            onClick={() => setShowUpdateProfileModal(true)}
          ></a>
        }
      ></PageHeader>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <Link
              to="/app/usermanagement"
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
      <div className="eep-user-management p-0 m-0">
        <FormContext.Provider value={{ handleChange }}>
          {userMeta && (
            <form autoComplete="off">
              <div className="row">
                <Card className="col-md-4 mb-3">
                  <FormContainer
                    userData={userMeta.column1}
                    onUpload={onUpload}
                    response={pictureResponse}
                  ></FormContainer>
                </Card>
                <Card className="col-md-4 mb-3">
                  <FormContainer userData={userMeta.column2}></FormContainer>
                </Card>
                <Card className="col-md-4 mb-3">
                  <FormContainer userData={userMeta.column3}></FormContainer>
                </Card>
              </div>
            </form>
          )}
        </FormContext.Provider>
      </div>
    </React.Fragment>
  );
};
export default MyProfile;

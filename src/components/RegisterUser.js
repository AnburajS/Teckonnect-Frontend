import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';
import PageHeader from '../UI/PageHeader';
import ResponseInfo from '../UI/ResponseInfo';
import { URL_CONFIG } from '../constants/rest-config';
import { base64ToFile } from '../helpers';
import { httpHandler } from '../http/http-interceptor';
// import { idmRoleMappingRoles } from "../idm";
import EEPSubmitModal from '../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import FormContainer from './FormElements/FormContainer';
import { FormContext } from './FormElements/FormContext';

const AddUser = () => {
  const dataObj = {};
  const [userMetaData, setUserMetaData] = useState(null);
  const [uData, setUData] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission,
  );
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8}$/;

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (formIsValid) {
      uData['active'] = true;
      uData['user_id'] = 0;
      uData['branch_id'] = uData?.branch;
      uData['role_id'] = uData?.role?.value;

      // if (uData?.role?.value) {
      //   //const roleData = await idmRoleMappingRoles(uData?.role?.value);
      //   uData.role = {
      //     idm_id: uData?.role?.value,
      //     role_name: uData?.role?.label,
      //     //screen: JSON.stringify(roleData?.data),
      //     screen: "",
      //   };
      // }

      if (JSON.parse(sessionStorage.getItem('userData'))?.orgId) {
        uData['orgId'] = JSON.parse(sessionStorage.getItem('userData'))?.orgId;
      }
      const obj = {
        url: URL_CONFIG.GETUSER,
        method: 'post',
        payload: uData,
      };
      httpHandler(obj)
        .then((response) => {
          setShowModal({
            ...showModal,
            type: 'success',
            message: response?.data?.message,
          });
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
        });
    }
  };

  useEffect(() => {
    const userFields = [];
    for (let fields in userMetaData) {
      if (
        fields === 'column1' ||
        fields === 'column2' ||
        fields === 'column3'
      ) {
        for (let fld of userMetaData[fields].fields) {
          if (fld.mandatory) {
            userFields.push(fld.name);
          }
        }
      }
    }

    Object.keys(uData).forEach((key) => {
      if (
        uData[key] === null ||
        uData[key] === undefined ||
        uData[key] === ''
      ) {
        delete uData[key];
      }
    });

    let isValidForm = true;
    for (var fld of userFields) {
      if (uData[fld] === undefined) {
        isValidForm = false;
      }
      if (fld === 'email') {
        var isphone = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          uData[fld],
        );
        if (!isphone) {
          isValidForm = false;
        }
      }

      if (fld === 'password') {
        if (!passwordRegex.test(uData[fld])) {
          isValidForm = false;
        }
      }
      // if (fld === 'telephoneNumber') {
      //   if (uData[fld]?.length !== 10) {
      //     isValidForm = false;
      //   }
      // }
    }

    if (userFields.length) {
      setFormIsValid(isValidForm);
    }
  }, [uData]);

  const handleChange = async (field, event) => {
    const value = event;

    if (field['name'] === 'imageByte') {
      const file = base64ToFile(
        value.image?.replace(/^data:image\/\w+;base64,/, ''),
      );

      const formData = new FormData();
      formData.append('image', file);
      const obj = {
        url: URL_CONFIG.UPLOAD_FILES,
        method: 'post',
        payload: formData,
      };
      await httpHandler(obj)
        .then((res) => {
          uData['profilePic'] = res?.data?.data?.[0]?.url ?? '';
        })
        .catch((error) => console.log(error));
    } else if (field['name'] === 'country') {
      field['value'] = value;
      dataObj[field['name']] = value;

      const obj_ = {
        url: URL_CONFIG.GET_ALL_BRANCH_NAME + '?countryId=' + value.id,
        method: 'get',
      };
      await httpHandler(obj_)
        .then((user_) => {
          userMetaData.column3.fields[4]['options'] = user_?.data?.map((v) => {
            return { label: v?.name, value: v?.id };
          });
          setUserMetaData({
            ...userMetaData,
          });
        })
        .catch((error) => console.log(error));
    } else {
      field['value'] = value;
      dataObj[field['name']] = value;
      if (field['name'] === 'dateOfBirth') {
        userMetaData.column3.fields[1].disabled = false;
        setUserMetaData({
          ...userMetaData,
        });
      }
    }
    setUData((prevState) => {
      return { ...prevState, ...dataObj };
    });

    setFormSubmitted(false);
  };

  const fetchUserMetaData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/user.json`)
      .then((response) => response.json())
      .then((data) => {
        setUserMetaData({
          ...data,
          column3: {
            ...data.column3,
            fields: [
              ...data.column3.fields.map((ary) =>
                ary.name === 'dateOfJoining' ? { ...ary, disabled: true } : ary,
              ),
            ],
          },
        });
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUserMetaData();
  }, []);

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Admin Panel',
      link: 'app/adminpanel',
    },
    {
      label: 'USER MANAGEMENT',
      link: 'app/usermanagement',
    },
    {
      label: 'New User',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Users',
      }),
    );
  }, [breadcrumbArr, dispatch]);

  return (
    <React.Fragment>
      {userRolePermission.adminPanel && (
        <React.Fragment>
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
          <PageHeader
            title="Create User"
            navLinksLeft={
              <Link
                className="text-right c-c1c1c1 mr-2 my-auto eep_nav_icon_div eep_action_svg"
                to="/app/usermanagement"
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.lessthan_circle,
                }}
              ></Link>
            }
          ></PageHeader>
          <div className="eep-user-management p-0 m-0">
            <FormContext.Provider value={{ handleChange }}>
              {userMetaData && (
                <form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <div className="row">
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.column1}
                        formSubmitted={formSubmitted}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.column2}
                        formSubmitted={formSubmitted}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.column3}
                        formSubmitted={formSubmitted}
                      ></FormContainer>
                    </Card>
                  </div>
                  <div className="row w-100 mb-3">
                    <button
                      type="submit"
                      disabled={!formIsValid}
                      className={`eep-btn eep-btn-success mx-auto ${
                        !formIsValid ? '' : ''
                      }`}
                    >
                      Create User
                    </button>
                  </div>
                </form>
              )}
            </FormContext.Provider>
          </div>
        </React.Fragment>
      )}
      {!userRolePermission.adminPanel && (
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
export default AddUser;

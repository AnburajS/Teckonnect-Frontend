import React, { useEffect, useState } from 'react';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PageHeader from '../UI/PageHeader';
import FormContainer from './FormElements/FormContainer';
import { FormContext } from './FormElements/FormContext';
import Card from '../UI/Card';
import { Link } from 'react-router-dom';
import ResponseInfo from '../UI/ResponseInfo';

const ViewUser = () => {
  const [userMeta, setUserMeta] = useState(null);
  const dispatch = useDispatch();
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  const { id } = useParams();

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
      label: 'View Profile',
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
    const obj = {
      url: URL_CONFIG.GETUSER,
      method: 'get',
      params: { id },
    };
    httpHandler(obj)
      .then((uData) => {
        setTimeout(async () => {
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
                userMeta.column3.fields[4]['options'] = user_?.data?.map(
                  (v) => {
                    return { label: v?.name, value: v?.id };
                  }
                );
                setUserMeta({
                  ...userMeta,
                });
              })
              .catch((error) => console.log(error));
          }
          userDataValueMapping(userMeta, uData.data);
        }, 0);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  const loadData = (data, fieldName) => {
    const entries = fieldName.split('.');
    let value = Object.assign({}, data);
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
                fld['value'] =
                  fld['name'] !== 'password'
                    ? uData[fld['viewMode']['value']]
                    : '';
              }
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
          if (fld['name'].indexOf('.') !== -1) {
            fld['value'] = loadData(uData, fld['name']);
          } else {
            fld['value'] = fld['name'] !== 'password' ? uData[fld['name']] : '';
          }
        }

        if (fld['type'] === 'signature') {
          fld['disabled'] = false;
        } else {
          fld['disabled'] = true;
        }
        if (fld['name'] === 'gender') {
          fld['label'] = uData?.gender?.label ?? '';
        }
        if (fld['name'] === 'branch') {
          fld['label'] = uData?.branch?.label ?? '';
        }
        if (fld['name'] === 'manager') {
          fld['value'] = uData?.manager?.username ?? '';
        }
      }
    }
    setUserMeta((prevState) => {
      return { prevState, ...userMeta };
    });
  };

  useEffect(() => {
    fetchUserMeta();
  }, []);

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Users',
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
    //field["value"] = event.target.value;
    //field["value"] = event;
  };

  return (
    <React.Fragment>
      {userRolePermission.adminPanel && (
        <React.Fragment>
          <PageHeader title="View User"></PageHeader>
          <div className="eep-user-management p-0 m-0">
            <FormContext.Provider value={{ handleChange }}>
              {userMeta && (
                <form autoComplete="off">
                  <div className="row">
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMeta.column1}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMeta.column2}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMeta.column3}
                      ></FormContainer>
                    </Card>
                  </div>
                  <div className="row">
                    <Card className="col-md-4 mb-3">
                      <FormContainer userData={userMeta.status}></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMeta.createdBy}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMeta.updatedBy}
                      ></FormContainer>
                    </Card>
                  </div>
                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/app/usermanagement"
                      className="eep-btn eep-btn-cancel eep-btn-nofocus c-2c2c2c a_hover_txt_deco_none"
                    >
                      Back
                    </Link>
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
export default ViewUser;

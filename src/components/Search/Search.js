import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import ResponseInfo from '../../UI/ResponseInfo';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import searchClass from './search.module.scss';

const Search = () => {
  const location = useLocation();
  const sDataValue = location.state ? location.state?.searchData : null;
  const [searchData, setSearchData] = useState(null);
  const [searchList, setSearchList] = useState(null);
  const [usersPic, setUsersPic] = useState([]);
  const [searchText, setSearchText] = useState('');
  const userSessionData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};

  const searchTextHandler = (e) => {
    setSearchText(e.target.value);
  };

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Search',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Search',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const fetchSearchResults = (arg) => {
    const obj = {
      url: URL_CONFIG?.SEARCH,
      method: 'get',
      params: { search: arg },
    };
    httpHandler(obj)
      .then((response) => {
        setSearchList(
          response?.data?.filter(
            (item) => item?.user_id && item?.user_id !== userSessionData.id
          )
        );
      })
      .catch((error) => {});
  };

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALLUSERS,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.id,
              pic: item?.imageByte?.image,
            });
          }
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {});
  };

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  useEffect(() => {
    if (sDataValue != null) {
      setSearchData(sDataValue);
      setSearchText(sDataValue);
      fetchSearchResults(sDataValue);
    }
    return () => {
      setSearchData(null);
      setSearchText('');
    };
  }, [sDataValue]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <React.Fragment>
      {searchData && (
        <React.Fragment>
          <div className="row">
            {searchList &&
              searchList?.length > 0 &&
              searchList?.map((item, index) => {
                return (
                  <>
                    {userSessionData?.id !== item?.user_id && (
                      <div
                        className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3"
                        key={'searchList' + index}
                      >
                        <Link
                          to={{
                            pathname: '/app/userdashboard',
                          }}
                          state={{ userData: { userID: item } }}
                          className="uNameLink a_hover_txt_deco_none"
                        >
                          <div
                            className={`${searchClass.search_content} bg-f5f5f5 br-15 p-3`}
                          >
                            <img
                              src={getUserPicture(item?.id)}
                              className={`${searchClass.eep_img}`}
                              alt="Profile Image"
                              title={item?.fullName}
                            />
                            <div className={`${searchClass.user_Details}`}>
                              <div className={`${searchClass.user_name}`}>
                                <span>{item?.fullName}</span>
                              </div>
                              <div
                                className={`${searchClass.user_designation}`}
                              >
                                <span>{item?.designation}</span>
                              </div>
                              <div
                                className={`${searchClass.user_designation}`}
                              >
                                <span>{item.department?.name}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </>
                );
              })}
            {searchList && searchList.length <= 0 && (
              <div className="eep-content-section-data d-flex w-100">
                <ResponseInfo
                  title="No matching results found! "
                  responseImg="noRecord"
                  responseClass="response-info"
                />
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      {!searchData && (
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="No matching results found! "
            responseImg="noRecord"
            responseClass="response-info"
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default Search;

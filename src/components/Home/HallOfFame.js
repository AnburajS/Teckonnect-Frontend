import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import ResponseInfo from '../../UI/ResponseInfo';
import TypeBasedFilter from '../../UI/TypeBasedFilter';
import { TYPE_BASED_FILTER_WITH_BETWEEN_DATES } from '../../constants/ui-config';
import RewardInfoModal from './RewardInfoModal';
import { useTranslation } from 'react-i18next';

// import PdfComponent from "../ViwerComponents/pdf";
import PDF from 'react-pdf-js';

const HallOfFame = (props) => {
  const { hallOfFameDetails, getHallOfFameFilterParams, getUserPicture } =
    props;
  const [rewardInfoModalData, setRewardInfoModalData] = useState({
    data: [],
    state: false,
  });
  const maxLikedCount = 3;
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Dashboard',
      link: 'app/dashboard',
    },
    {
      label: 'HALL OF FAME',
      link: '#',
    },
  ];

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(paramsData)) {
      getHallOfFameFilterParams({ ...paramsData });
    } else {
      getHallOfFameFilterParams({});
    }
  };

  const RewardPopupHandler = (arg, state = false) => {
    setRewardInfoModalData({ data: arg, state: state });
  };

  return (
    <React.Fragment>
      {rewardInfoModalData && (
        <RewardInfoModal
          rewardInfoModalData={rewardInfoModalData}
          getUserPicture={getUserPicture}
        />
      )}

      <PageHeader
        title={t(`dashboard.Hall of Fame`)}
        filter={
          <TypeBasedFilter
            config={TYPE_BASED_FILTER_WITH_BETWEEN_DATES}
            getFilterParams={getFilterParams}
          />
        }
      />

      <div
        className="row mx-0"
        id="content-start"
      >
        {/* <!-- Section 1 START --> */}
        {hallOfFameDetails?.dashboardUsersList &&
          hallOfFameDetails?.dashboardUsersList?.length > 0 && (
            <div className="col-md-12 row_col_div mb-3">
              <div className="row custom_table my-3">
                <div className="col col-md-3 text-center div_name"></div>
                <div className="col col-md-4 text-center">
                  <span className="table_heading font-waight-600">
                    {' '}
                    {t(`dashboard.Lead`)}
                  </span>
                </div>
                {/* <div className="col col-md-2 text-center">
                  <span className="table_heading font-waight-600">
                    {' '}
                    {t(`dashboard.Points`)}
                  </span>
                </div> */}
                <div className="col col-md-5 text-right">
                  <span className="table_heading font-waight-600">
                    {t(`dashboard.Achievements`)}
                  </span>
                </div>
              </div>
              {hallOfFameDetails?.dashboardUsersList &&
                hallOfFameDetails?.dashboardUsersList.map((item, index) => {
                  return (
                    <div
                      className="row align-items-center mb-2 bg-f9f9f9 p-1 br-20"
                      key={'HallOfFameRankList_' + index}
                    >
                      <div className="col col-md-3">
                        <img
                          src={
                            item?.imageByte || getUserPicture(item?.userId)
                            // getUserPicture(item?.userId)
                          }
                          className="profile_pic"
                          alt="Profile Image"
                          title={item.name}
                        />
                        {/* <Link to="#" className="a_hover_txt_deco_none opacity-5"> */}
                        <label className="profile_nm font-helvetica-m my-0 eep_truncate eep_truncate_min ">
                          {item.name}
                        </label>
                        {/* </Link> */}
                      </div>
                      <div className="col col-md-4 d_leaderboard_lead">
                        <span>{item.rank}</span>
                      </div>
                      {/* <div className="col col-md-2 d_leaderboard_points">
                        <span>{item.points}</span>
                      </div> */}
                      <div className="col col-md-5 d_leaderboard_achievements_div">
                        {item.rewardList?.length > 0 &&
                          item.rewardList.slice(0, 3).map((item, index) => {
                            return (
                              <div
                                className="d_leaderboard_achievements"
                                key={'HallOfFameRewardList_' + index}
                              >
                                <img
                                  src={item?.imageByte?.image}
                                  className="d_achievements_icon"
                                  alt={item?.imageByte?.name}
                                  title={item?.imageByte?.name}
                                />
                                <p className="mb-0">{item.acheivedCount}</p>
                              </div>
                            );
                          })}
                        {item.rewardList &&
                          item.rewardList?.length > maxLikedCount && (
                            <React.Fragment>
                              <div className="align-self-baseline">
                                <label className="font-14 mb-0 mx-1">
                                  {' '}
                                  ...
                                </label>
                                <a
                                  className="d-inline-flex animation_parent_div c1"
                                  data-toggle="modal"
                                  data-target="#RewardInfoModal"
                                  onClick={() => RewardPopupHandler(item, true)}
                                >
                                  {/* <span className="font-14"> {item.rewardList?.length - maxLikedCount} others </span> */}
                                  <span
                                    className={`c-2c2c2c animated_div div_big ${
                                      item.rewardList?.length < 100
                                        ? 'font-14'
                                        : 'font-12'
                                    }`}
                                  >
                                    {item.rewardList?.length < 100
                                      ? item.rewardList?.length - maxLikedCount
                                      : '99+'}
                                  </span>
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      '/images/icons/static/DetailView.svg'
                                    }
                                    width="30px"
                                    height="30px"
                                    alt="Detailview Icon"
                                    title="Detail view"
                                  />
                                  {/* DV.svg */}
                                </a>
                              </div>
                            </React.Fragment>
                          )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        {hallOfFameDetails?.dashboardUsersList &&
          hallOfFameDetails?.dashboardUsersList?.length <= 0 && (
            <div className="col-md-12 response-allign-middle mb-3">
              <div className="border border-1 p-1 br-15">
                <div className="d-block text-center">
                  <h4> {t(`dashboard.Leaderboard`)}</h4>
                </div>
                <ResponseInfo
                  title={t(`dashboard.No records found`)}
                  responseImg="noRecord"
                  responseClass="response-info"
                />
              </div>
            </div>
          )}
        {/* <!-- Section 1 END --> */}
        {/*<!-- Section 2 START --> */} {/* shadow */}
        {/* {hallOfFameDetails?.dashboardECardList?.length > 0 &&
          <div className="col-md-6 row_col_div mb-3">
            <div className="bg-white br-15 h-100 border border-1">
              <div className="p-3">
                <h4>Appreciations</h4>
                {hallOfFameDetails?.dashboardECardList.map((item, index) => {
                  return (
                    <div className="row d_leaderboard_list no-gutters" key={"HOF_Appreciations_" + index}>
                      <div className="col-md-2">
                        <img src={item?.imageByte} className="profile_pic" alt="Birthday Image" title={item.name} />
                      </div>
                      <div className="col-md-5 d_leaderboard_align">{item.name}</div>
                      <div className="col-md-5 text-right">
                        <div className="eep-cardbox-base">
                          <ul className="d-flex align-items-center justify-content-end px-0">
                            {item?.users?.length > 0 && item.users.slice(0, 3).map((useritem, index) => {
                              return (
                                <li key={"HOF_Appreciations_user_pic" + index}>
                                  <a>
                                    <img src={getUserPicture(useritem?.id)} className="img-fluid rounded-circle" title={useritem.fullName} alt={useritem.fullName} />
                                  </a>
                                </li>
                              )
                            })}

                            {item.users && item?.users?.length > maxLikedCount && (
                              <React.Fragment>
                                <label className="font-14 mb-0 mx-1"> ... </label>
                                <a className="d-inline-flex animation_parent_div" data-toggle="modal" data-target="#RewardInfoModal" onClick={() => RewardPopupHandler(item)} >
                                  <span className={`c-2c2c2c animated_div div_small ${item?.users?.length < 10 ? "font-14" : "font-12"}`}> {item?.users?.length < 10 ? (item?.users?.length - maxLikedCount) : "9+"} </span>
                                  <img src={process.env.PUBLIC_URL + "/images/icons/static/DetailView.svg"} width="22px" height="22px" alt="Detailview Icon" title="Detail view" />
                                </a>
                              </React.Fragment>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        } */}
        {/* {hallOfFameDetails?.dashboardECardList &&
          hallOfFameDetails?.dashboardECardList?.length <= 0 && (
            <div className="col-md-6 response-allign-middle mb-3">
              <div className="border border-1 p-3 br-15 h-100">
                <div className="d-block text-start">
                  <h4> {t(`dashboard.Appreciations`)}</h4>
                </div>
                <ResponseInfo
                  title={t(`dashboard.No records found`)}
                  responseImg="noRecord"
                  responseClass="response-info"
                />
              </div>
            </div>
          )} */}
        {/*<!-- Section 3 END --> */}
        {/*<!-- Section 4 START --> */}
        {hallOfFameDetails?.dashboardBadgeList?.length > 0 && (
          <div className="col-md-6 row_col_div mb-3">
            <div className="bg-white br-15 h-100 border border-1">
              <div className="p-3">
                <h4> {t(`dashboard.Badges`)}</h4>

                {hallOfFameDetails?.dashboardBadgeList.map((item, index) => {
                  return (
                    <div
                      className="row d_leaderboard_list no-gutters"
                      key={'HOF_Badges_' + index}
                    >
                      <div className="col-md-2">
                        <img
                          src={item?.imageByte}
                          className="profile_pic"
                          alt="Badge Image"
                          title={item.name}
                        />
                      </div>
                      <div className="col-md-5 d_leaderboard_align">
                        {item.name}
                      </div>
                      <div className="col-md-5 text-right">
                        <div className="eep-cardbox-base">
                          <ul className="d-flex align-items-center justify-content-end px-0">
                            {item?.users?.length > 0 &&
                              item.users.slice(0, 3).map((useritem, index) => {
                                return (
                                  <li key={'HOF_Badges_user_pic' + index}>
                                    <a className="c1">
                                      <img
                                        src={getUserPicture(useritem.id)}
                                        className="img-fluid rounded-circle"
                                        title={useritem.fullName}
                                        alt={useritem.fullName}
                                      />
                                    </a>
                                  </li>
                                );
                              })}
                            {item.users &&
                              item?.users?.length > maxLikedCount && (
                                <React.Fragment>
                                  <label className="font-14 mb-0 mx-1">
                                    ...{' '}
                                  </label>
                                  <a
                                    className="d-inline-flex animation_parent_div c1"
                                    data-toggle="modal"
                                    data-target="#RewardInfoModal"
                                    onClick={() => RewardPopupHandler(item)}
                                  >
                                    <span
                                      className={`c-2c2c2c animated_div div_small ${
                                        item?.users?.length < 10
                                          ? 'font-14'
                                          : 'font-12'
                                      }`}
                                    >
                                      {' '}
                                      {item?.users?.length < 10
                                        ? item?.users?.length - maxLikedCount
                                        : '9+'}{' '}
                                    </span>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        '/images/icons/static/DetailView.svg'
                                      }
                                      width="22px"
                                      height="22px"
                                      alt="Detailview Icon"
                                      title="Detail view"
                                    />
                                  </a>
                                </React.Fragment>
                              )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {hallOfFameDetails?.dashboardBadgeList &&
          hallOfFameDetails?.dashboardBadgeList?.length <= 0 && (
            <div className="col-md-6 response-allign-middle mb-3">
              <div className="border border-1 p-3 br-15 h-100">
                <div className="d-block text-start">
                  <h4>{t(`dashboard.Badges`)}</h4>
                </div>
                <ResponseInfo
                  title={t(`dashboard.No records found`)}
                  responseImg="noRecord"
                  responseClass="response-info"
                />
              </div>
            </div>
          )}
        {/*<!-- Section 4 END --> */}
        {/*<!-- Section 5 START --> */}
        {hallOfFameDetails?.dashboardAwardList?.length > 0 && (
          <div className="col-md-6 row_col_div mb-3">
            <div className="bg-white br-15 h-100 border border-1">
              <div className="p-3">
                <h4> {t(`dashboard.Awards`)}</h4>
                {hallOfFameDetails?.dashboardAwardList.map((item, index) => {
                  return (
                    <div
                      className="row d_leaderboard_list no-gutters"
                      key={'HOF_Awards_' + index}
                    >
                      <div className="col-md-2">
                        <img
                          src={item?.imageByte}
                          className="profile_pic"
                          alt="Award Image"
                          title={item.name}
                        />
                      </div>
                      <div className="col-md-5 d_leaderboard_align">
                        {item.name}
                      </div>
                      <div className="col-md-5 text-right">
                        <div className="eep-cardbox-base">
                          <ul className="d-flex align-items-center justify-content-end px-0">
                            {item?.users?.length > 0 &&
                              item.users.slice(0, 3).map((useritem, index) => {
                                return (
                                  <li key={'HOF_Awards_user_pic' + index}>
                                    <a className="c1">
                                      <img
                                        src={getUserPicture(useritem.id)}
                                        className="img-fluid rounded-circle"
                                        title={useritem.fullName}
                                        alt={useritem.fullName}
                                      />
                                    </a>
                                  </li>
                                );
                              })}
                            {item.users &&
                              item?.users?.length > maxLikedCount && (
                                <React.Fragment>
                                  <label className="font-14 mb-0 ml-1">
                                    ...{' '}
                                  </label>
                                  <a
                                    className="d-inline-flex animation_parent_div c1"
                                    data-toggle="modal"
                                    data-target="#RewardInfoModal"
                                    onClick={() => RewardPopupHandler(item)}
                                  >
                                    <span
                                      className={`c-2c2c2c animated_div div_small ${
                                        item?.users?.length < 10
                                          ? 'font-14'
                                          : 'font-12'
                                      }`}
                                    >
                                      {' '}
                                      {item?.users?.length < 10
                                        ? item?.users?.length - maxLikedCount
                                        : '9+'}
                                    </span>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        '/images/icons/static/DetailView.svg'
                                      }
                                      width="22px"
                                      height="22px"
                                      alt="Detailview Icon"
                                      title="Detail view"
                                    />
                                  </a>
                                </React.Fragment>
                              )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {hallOfFameDetails?.dashboardAwardList &&
          hallOfFameDetails?.dashboardAwardList?.length <= 0 && (
            <div className="col-md-6 response-allign-middle mb-3">
              <div className="border border-1 p-3 br-15 h-100">
                <div className="d-block text-start">
                  <h4>{t(`dashboard.Awards`)}</h4>
                </div>
                <ResponseInfo
                  title={t(`dashboard.No records found`)}
                  responseImg="noRecord"
                  responseClass="response-info"
                />
              </div>
            </div>
          )}
        {/*<!-- Section 2 END --> */}
        {/*<!-- Section 3 START --> */}
        {hallOfFameDetails?.dashboardCertificateList?.length > 0 && (
          <div className="col-md-6 row_col_div mb-3">
            <div className="bg-white br-15 h-100 border border-1">
              <div className="p-3">
                <h4> {t(`dashboard.Certificates`)}</h4>
                {hallOfFameDetails?.dashboardCertificateList?.map(
                  (item, index) => {
                    return (
                      <div
                        className="row d_leaderboard_list no-gutters"
                        style={{ alignItems: 'center' }}
                        key={'HOF_Certificates_' + index}
                      >
                        {/* <div className="col-md-2">
                        {item?.imageByte?.includes('.pdf') ?
                          <div className="hall_off_cretificate" style={{ margin: "0px", padding: "0px" }}>
                            <PDF file={item?.imageByte} /></div>
                          :
                          <img src={item?.imageByte} className="profile_pic" alt="Certificate Image" title={item.name} />
                        }  </div> */}
                        <div className="col-md-6 d_leaderboard_align">
                          {item?.name}
                        </div>
                        <div className="col-md-6 text-right">
                          <div className="eep-cardbox-base">
                            <ul className="d-flex align-items-center justify-content-end px-0 m-0">
                              {item?.users?.length > 0 &&
                                item?.users
                                  ?.slice(0, 3)
                                  ?.map((useritem, index) => {
                                    return (
                                      <li
                                        key={
                                          'HOF_Certificates_user_pic' + index
                                        }
                                      >
                                        <a className="c1">
                                          <img
                                            src={getUserPicture(useritem?.id)}
                                            className="img-fluid rounded-circle"
                                            title={useritem.fullName}
                                            alt={useritem.fullName}
                                          />
                                        </a>
                                      </li>
                                    );
                                  })}

                              {item.users &&
                                item?.users?.length > maxLikedCount && (
                                  <React.Fragment>
                                    <label className="font-14 mb-0 mx-1">
                                      {' '}
                                      ...{' '}
                                    </label>
                                    <a
                                      className="d-inline-flex animation_parent_div c1"
                                      data-toggle="modal"
                                      data-target="#RewardInfoModal"
                                      onClick={() => RewardPopupHandler(item)}
                                    >
                                      <span
                                        className={`c-2c2c2c animated_div div_small ${
                                          item?.users?.length < 10
                                            ? 'font-14'
                                            : 'font-12'
                                        }`}
                                      >
                                        {' '}
                                        {item?.users?.length < 10
                                          ? item?.users?.length - maxLikedCount
                                          : '9+'}{' '}
                                      </span>
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          '/images/icons/static/DetailView.svg'
                                        }
                                        width="22px"
                                        height="22px"
                                        alt="Detailview Icon"
                                        title="Detail view"
                                      />
                                    </a>
                                  </React.Fragment>
                                )}

                              {/* 
                              <div className="tooltipp ml-2">
                                <span className="image_overflow_count">-1</span>
                                <span className="tooltiptextt eep_scroll_y"></span>
                              </div> 
                            */}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
        {hallOfFameDetails?.dashboardCertificateList &&
          hallOfFameDetails?.dashboardCertificateList?.length <= 0 && (
            <div className="col-md-6 response-allign-middle mb-3">
              <div className="border border-1 p-3 br-15 h-100">
                <div className="d-block text-startr">
                  <h4> {t(`dashboard.Certificates`)}</h4>
                </div>
                <ResponseInfo
                  title={t(`dashboard.No records found`)}
                  responseImg="noRecord"
                  responseClass="response-info"
                />
              </div>
            </div>
          )}
        {/*<!-- Section 5 END --> */}
      </div>
    </React.Fragment>
  );
};

export default HallOfFame;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { REST_CONFIG, URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import { eepFormatDateTime } from '../../shared/SharedService';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import SocialWallLeftContent from './SocialWallLeftContent';
import SocialWallMiddleContent from './SocialWallMiddleContent';
import SocialWallRightContent from './SocialWallRightContent';
import { pageLoaderHandler } from '../../helpers';
import { useTranslation } from 'react-i18next';
import Isloading from '../../UI/CustomComponents/Isloading';

const SocialWall = () => {
  const [usersPic, setUsersPic] = useState([]);
  const [offset, setOffset] = useState(1);
  const [hastagList, setHastagList] = useState([]);
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [socialWallList, setSocialWallList] = useState([]);
  const [stopFetch, setStopFetch] = useState(false);
  const [heartAnimateState, setHeartAnimateState] = useState({});
  const [isloading, setIsloding] = useState(true);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: t(`SocialWall.Home`),
      link: 'app/dashboard',
    },
    {
      label: t(`SocialWall.SOCIALWALL`),
      link: 'app/socialwall',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'EnliteU Wall',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const fetchAllUsers = async () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
    };
    await httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response?.data?.forEach((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.user_id,
              pic: item?.imageByte?.image,
              userName: item?.username,
            });
          }
        });
        setUsersPic(userPicTempArry);
      })
      .catch(() => {});
  };

  const fetchHashTag = async () => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_HASTAG_LIST,
      method: 'get',
    };
    await httpHandler(obj)
      .then((response) => {
        setHastagList(response.data);
      })
      .catch(() => {});
  };

  const fetchSocialWallList = async () => {
    setInfiniteLoader(true);
    const obj = {
      url: URL_CONFIG.SOCIALWALL_LIST,
      method: 'get',
      params: {
        direction: 'desc',
        limit: 10,
        offset: offset,
      },
      isLoader: false,
    };
    await httpHandler(obj)
      .then((response) => {
        const data = response.data;
        data?.forEach((res) => {
          res.createdAt = eepFormatDateTime(res.createdAt);
        });
        setSocialWallList((prevList) => [...prevList, ...data]);
        setOffset((prevOffset) => prevOffset + 1);
        setStopFetch(data.length < 5);
      })
      .catch(() => {});
    setIsloding(false);
    setInfiniteLoader(false);
    pageLoaderHandler('hide');
  };

  const likeStatus = (arg) => {
    let val = arg ?? { statee: false, id: 0 };
    setHeartAnimateState(val);
  };

  const likeSocialWallPostHandle = (arg) => {
    if (arg?.isLike) {
      const obj = {
        url: URL_CONFIG.SOCIALWALL_LIKE,
        payload: { id: arg?.data?.id },
        method: 'post',
        isLoader: false,
      };
      httpHandler(obj)
        .then(() => {
          fetchSocialWallSingleData({ id: arg.data.id, indx: arg.indx });
          likeStatus({ statee: arg.isLike, id: arg.data.id });
        })
        .catch(() => {});
    } else {
      const userData = sessionStorage.userData
        ? JSON.parse(sessionStorage.userData)
        : {};
      let isLiked = arg.data.socialWallLike.findIndex(
        (x) => x.userId.user_id === userData.id
      );
      axios
        .delete(
          `${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${URL_CONFIG.SOCIALWALL_DISLIKE}?id=${arg?.data?.socialWallLike[isLiked]?.id}`
        )
        .then(() => {
          fetchSocialWallSingleData({ id: arg.data.id, indx: arg.indx });
          likeStatus({ statee: arg.isLike, id: arg.data.id });
        })
        .catch(() => {});
    }
  };

  const fetchSocialWallSingleData = (arg) => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_SINGLE,
      method: 'get',
      params: { id: arg.id },
      isLoader: false,
    };
    httpHandler(obj)
      .then((response) => {
        const updatedList = [...socialWallList];
        updatedList[arg.indx] = response.data;
        setSocialWallList(updatedList);
      })
      .catch(() => {});
  };

  const commentSocialWallPostHandle = (arg) => {
    if (!arg) return;

    if (arg.postSettings === 'postComment') {
      const payloadData = {
        message: arg.commentData,
        socialWall: { id: arg.data.id },
      };
      const obj = {
        url: URL_CONFIG.SOCIALWALL_COMMENT,
        method: 'post',
        payload: payloadData,
      };
      httpHandler(obj).then(() => {
        fetchSocialWallCommentDataBySocialID(arg);
      });
    }

    if (arg.postSettings === 'listComments') {
      fetchSocialWallCommentDataBySocialID(arg);
    }

    if (arg.postSettings === 'postReply') {
      const payloadData = {
        message: arg.commentData,
        parent: { id: arg.subData.id },
      };
      const obj = {
        url: URL_CONFIG.SOCIALWALL_REPLY,
        method: 'post',
        payload: payloadData,
      };
      httpHandler(obj).then(() => {
        arg.subData.commentState.typeCommentState = false;
        fetchSocialWallCommentDataBySocialID(arg);
      });
    }
  };

  const fetchSocialWallCommentDataBySocialID = (arg) => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_COMMENT_LIST,
      method: 'get',
      params: { id: arg.data.id },
    };
    httpHandler(obj)
      .then((response) => {
        const updatedList = [...socialWallList];
        updatedList[arg.indx].wallComments = response.data;
        updatedList[arg.indx].commentState.typeCommentState = false;
        updatedList[arg.indx].commentState.listCommentState = true;
        setSocialWallList(updatedList);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAllUsers();
    fetchHashTag();
    fetchSocialWallList();
    pageLoaderHandler('show');
  }, []);

  return (
    <React.Fragment>
      {/* <div
        id="page-loader-container"
        className="d-none"
        style={{ zIndex: '1051' }}
      >
        <div id="loader">
          <img
            src={process.env.PUBLIC_URL + '/images/loader.gif'}
            alt="Loader"
          />
        </div>
      </div> */}

      {isloading ? (
        <Isloading />
      ) : socialWallList && socialWallList.length > 0 ? (
        <div className="row eep-content-section-data">
          <div className="col-sm-12 col-xs-12 col-md-9 col-lg-8 socialWall_div eep-content-section eep_scroll_y">
            <SocialWallMiddleContent
              socialWallList={socialWallList}
              fetchSocialWallList={fetchSocialWallList}
              infiniteLoader={infiniteLoader}
              stopFetch={stopFetch}
              usersPicProps={usersPic}
              likeSocialWallPostHandle={likeSocialWallPostHandle}
              commentSocialWallPostHandle={commentSocialWallPostHandle}
              likeStatus={heartAnimateState}
            />
          </div>
          <div className="col-sm-12 col-xs-12 col-md-3 col-lg-4 socialWall_div eep-content-section eep_scroll_y">
            {hastagList && hastagList.length > 0 && (
              <SocialWallRightContent hastagList={hastagList} />
            )}
          </div>
        </div>
      ) : (
        <div
          className="parent_div"
          style={{ marginTop: '24vh' }}
        >
          <div className="eep_blank_div">
            <img
              src={process.env.PUBLIC_URL + '/images/icons/static/noData.svg'}
              alt="no-data-icon"
            />
            <p className="eep_blank_quote">{t(`dashboard.No records found`)}</p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default SocialWall;

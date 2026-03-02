import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Heart from '../../UI/CustomComponents/Heart';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import LikedInfoModal from '../../modals/LikedInfoModal';
import SocialWallCommentsList from './SocialWallCommentsList';
import { useInView } from 'react-intersection-observer';
import { formatDates } from '../../constants/utills';

const SocialWallMiddleContent = (props) => {
  const {
    socialWallList,
    usersPicProps,
    likeSocialWallPostHandle,
    commentSocialWallPostHandle,
    likeStatus,
    fetchSocialWallList,
    stopFetch,
    infiniteLoader,
  } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};

  const initSocialWallList = socialWallList ? socialWallList : [];
  const [socialWallData, setSocialWallData] = useState(initSocialWallList);
  const [likedModalData, setLikedModalData] = useState([]);
  const [replyValue, setReplyValue] = useState('');
  const maxLikedCount = 3;
  const defaultProfilePic = process.env.PUBLIC_URL + '/images/user_profile.png';
  const [subChildrenParent, setSubChildrenParent] = useState({});
  const { ref, inView } = useInView();
  const { t } = useTranslation();

  useEffect(() => {
    setSocialWallData(socialWallList);
  }, [socialWallList]);

  useEffect(() => {
    if (inView && !stopFetch) {
      fetchSocialWallList();
    }
  }, [inView, stopFetch]);

  let userPicIndex;
  const getUserPicture = (uID, userName) => {
    userPicIndex =
      usersPicProps.findIndex((x) => x.userName === userName) ||
      usersPicProps.findIndex((x) => x.id === uID);
    // userPicIndex = usersPicProps.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPicProps[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  const getRewardType = (arg) => {
    let typeArr = [
      { type: 1, value: 'badge' },
      { type: 3, value: 'award' },
    ];
    if (arg) {
      let myVar = '';
      typeArr.map((item) => {
        if (item.type === arg) {
          myVar = item.value;
        }
      });
      return myVar;
    }
  };

  const getHashTag = (arg) => {
    const arr = [];
    arg?.map((res) => {
      arr.push({ id: res.id, name: `#${res.hashtagName}` });
    });
    return arr;
  };

  const likeSocialWallHandler = (arg, i) => {
    likeSocialWallPostHandle({ isLike: true, data: arg, indx: i });
  };

  const unLikeSocialWallHandler = (arg, i) => {
    likeSocialWallPostHandle({ isLike: false, data: arg, indx: i });
  };

  const commentStateHandler = (indx) => {
    let postCommentID = 'postComment_' + indx;
    const socialWallDataTemp = JSON.parse(JSON.stringify(socialWallData));
    for (let i = 0; i < socialWallDataTemp.length; i++) {
      if (i === indx) {
        socialWallDataTemp[i].commentState.typeCommentState =
          !socialWallDataTemp[i].commentState.typeCommentState;
        setTimeout(() => {
          if (socialWallDataTemp[i].commentState.typeCommentState) {
            document.getElementById(postCommentID).focus();
          }
        }, 10);
        break;
      }
    }
    setSocialWallData([...socialWallDataTemp]);
  };

  const subFn = (res, item) => {
    if (res.id === item.id) {
      const obj = { ...item };
      obj.commentState.typeCommentState = !obj.commentState.typeCommentState;
      res = obj;
      if (obj.commentState.typeCommentState) {
        setTimeout(() => {
          document.getElementById('postReply_' + item.id).focus();
        }, 100);
      }
      return res;
    }
    for (var i = 0; i < res.children.length; i++) {
      if (res.children[i].children.length) {
        subFn(res.children[i], item);
      }
    }
  };

  const getSubChildrenParent = (arg) => {
    setSubChildrenParent(arg);
  };

  const replyStateHandler = (arg) => {
    if (arg.topLevelReply) {
      setSocialWallData((prevState) => {
        const socialWallDataTemp = [...prevState];
        for (
          let i = 0;
          i < socialWallDataTemp[arg.parentIndex].wallComments.length;
          i++
        ) {
          if (
            socialWallDataTemp[arg.parentIndex].wallComments[i].id ===
            arg.subItem.id
          ) {
            socialWallDataTemp[arg.parentIndex].wallComments[
              i
            ].commentState.typeCommentState =
              !socialWallDataTemp[arg.parentIndex].wallComments[i].commentState
                .typeCommentState;
            if (
              socialWallDataTemp[arg.parentIndex].wallComments[i].commentState
                .typeCommentState
            ) {
              setTimeout(() => {
                document.getElementById('postReply_' + arg.subItem.id).focus();
              }, 10);
            }
            break;
          }
        }
        return socialWallDataTemp;
      });
    } else {
      setSocialWallData((prevState) => {
        const socialWallDataTemp = [...prevState];
        for (
          let i = 0;
          i < socialWallDataTemp[arg.parentIndex].wallComments.length;
          i++
        ) {
          if (
            socialWallDataTemp[arg.parentIndex].wallComments[i].subChildren &&
            socialWallDataTemp[arg.parentIndex].wallComments[i].id ===
              subChildrenParent.id
          ) {
            for (
              let j = 0;
              j <
              socialWallDataTemp[arg.parentIndex].wallComments[i].subChildren
                .length;
              j++
            ) {
              if (
                socialWallDataTemp[arg.parentIndex].wallComments[i].subChildren[
                  j
                ].id === arg.subItem.id
              ) {
                socialWallDataTemp[arg.parentIndex].wallComments[i].subChildren[
                  j
                ].commentState.typeCommentState =
                  !socialWallDataTemp[arg.parentIndex].wallComments[i]
                    .subChildren[j].commentState.typeCommentState;
                if (
                  socialWallDataTemp[arg.parentIndex].wallComments[i]
                    .subChildren[j].commentState.typeCommentState
                ) {
                  setTimeout(() => {
                    document
                      .getElementById('postReply_' + arg.subItem.id)
                      .focus();
                  }, 10);
                }
                break;
              }
            }
          }
        }
        return socialWallDataTemp;
      });
    }
  };

  const isEnlited = (arg) => {
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    let isLiked = arg?.findIndex((x) => x?.userId?.user_id === userData?.id);
    if (isLiked === -1) {
      return true;
    } else {
      return false;
    }
  };

  const likedModalHandler = (arg) => {
    setLikedModalData(arg);
  };

  const commentHandler = (indx, e) => {
    const socialWallDataTemp = JSON.parse(JSON.stringify(socialWallData));
    for (let i = 0; i < socialWallDataTemp.length; i++) {
      if (i === indx) {
        socialWallDataTemp[i].commentValue = e.target.value;
      }
    }
    setSocialWallData([...socialWallDataTemp]);
  };

  const replyHandler = (e) => {
    setReplyValue(e.target.value);
  };

  const postCommentHandler = (arg, indx) => {
    if (arg.commentValue !== '') {
      commentSocialWallPostHandle({
        postSettings: 'postComment',
        commentData: arg.commentValue,
        data: arg,
        indx: indx,
      });
      fetchSocialWallCommentDataBySocialID(arg);
      // const socialWallDataTemp = JSON.parse(JSON.stringify(socialWallData));
      // for (let i = 0; i < socialWallDataTemp.length; i++) {
      //   if (i === indx) {
      //     socialWallDataTemp[i].commentsCount = socialWallDataTemp[i].commentsCount + 1;

      //   }
      // }
      // setSocialWallData([...socialWallDataTemp]);
    }
  };

  const postReplyHandler = (arg, subArg, i, info = {}) => {
    if (replyValue !== '') {
      commentSocialWallPostHandle({
        postSettings: 'postReply',
        commentData: replyValue,
        data: arg,
        subData: subArg,
        indx: i,
        info: info,
      });
      setReplyValue('');
    }
  };

  const viewAllComments = (arg, i) => {
    commentSocialWallPostHandle({
      postSettings: 'listComments',
      data: arg,
      indx: i,
    });
  };

  const fetchSocialWallCommentDataBySocialID = (arg) => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_COMMENT_LIST,
      method: 'get',
      params: { id: arg.id },
    };
    httpHandler(obj)
      .then((response) => {
        const socialWallListTemp = JSON.parse(JSON.stringify(socialWallList));
        for (let i = 0; i < socialWallListTemp.length; i++) {
          if (i === arg?.indx) {
            socialWallListTemp[i].wallComments = response.data;
            //socialWallListTemp[i].wallComments[i]['subChildren'] = getSubChildren(socialWallListTemp[i].wallComments[i], []);
            socialWallListTemp[i].commentState.typeCommentState = false;
            socialWallListTemp[i].commentState.listCommentState = true;

            break;
          }
        }
        setSocialWallData([...socialWallListTemp]);
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Something went wrong contact administarator';
      });
  };

  const lessComments = (arg, indx) => {
    const socialWallDataTemp = JSON.parse(JSON.stringify(socialWallData));
    for (let i = 0; i < socialWallDataTemp.length; i++) {
      if (i === indx) {
        socialWallDataTemp[i].commentState.listCommentState = false;
        socialWallDataTemp[i].commentsCount =
          socialWallDataTemp[i].commentsCount;
      }
    }
    setSocialWallData([...socialWallDataTemp]);
  };

  const getReplyCounts = (replyData, rCount) => {
    if (replyData.hasOwnProperty('children')) {
      if (replyData['children'].length > 0) {
        rCount += replyData['children'].length;
        replyData['children'].map((item) => {
          if (item['children'].length > 0) {
            getReplyCounts(item, rCount);
          }
        });
      }
    }
    return rCount;
  };

  // const changeLabel = (createdAt) => {
  //   if (JSON.parse(sessionStorage.getItem('userData'))?.arabic) {
  //     if (createdAt?.includes('minute ago')) {
  //       return createdAt?.replace('minute ago', 'منذ دقيقة');
  //     } else if (createdAt?.includes('minutes ago')) {
  //       return createdAt?.replace('minutes ago', 'منذ دقائق');
  //     } else if (createdAt?.includes('hour ago')) {
  //       return createdAt?.replace('hour ago', 'منذ ساعة');
  //     } else if (createdAt?.includes('hours ago')) {
  //       return createdAt?.replace('hours ago', 'منذ ساعات');
  //     } else if (createdAt?.includes('day ago')) {
  //       return createdAt?.replace('day ago', 'منذ يوم');
  //     } else if (createdAt?.includes('days ago')) {
  //       return createdAt?.replace('days ago', 'منذ أيام');
  //     }
  //   }

  //   return createdAt;
  // };

  const getSubChildren = (arg, ret) => {
    for (var i = 0; i < arg.children.length; i++) {
      arg.children[i]['prentInfo'] = {
        id: arg.id,
        message: arg.message,
        createdBy: arg.createdBy,
      };
      if (arg.children[i].createdAt) {
        arg.children[i].createdAt = arg.children[i].createdAt;
      }

      ret.push(arg.children[i]);
      if (arg.children[i].children.length) {
        getSubChildren(arg.children[i], ret);
      }
    }
    return ret;
  };

  const getCustomizedData = (data) => {
    data.map((res) => {
      res['subChildren'] = getSubChildren(res, []);
    });
    return data;
  };

  const labelPrint = (item) => {
    return item?.rewardId?.userId !== null &&
      item?.rewardId?.userId !== 'undefined'
      ? '@' +
          item?.rewardId?.userId?.firstname +
          ' ' +
          item?.rewardId?.userId?.lastname
      : '';
  };

  return (
    <React.Fragment>
      {likedModalData && (
        <LikedInfoModal
          likedModalData={likedModalData}
          usersPicData={usersPicProps}
        />
      )}
      {infiniteLoader && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            translate: '50%',
            top: '50%',
          }}
        >
          <img
            src={process.env.PUBLIC_URL + '/images/loader.gif'}
            alt="Loader"
            style={{ width: '100px' }}
          />
        </div>
      )}
      {socialWallData &&
        socialWallData?.length &&
        socialWallData
          .sort((a, b) => (a.id < b.id ? 1 : -1))
          .map((item, index) => {
            let rewdType = getRewardType(item?.rewardId?.type);
            let hashArr = getHashTag(item?.rewardId?.hashTag);
            return (
              <div
                style={{ opacity: infiniteLoader ? 0.5 : 1 }}
                className="bg-f7f7f7 br-15 socialWall"
                key={'socialWall_' + index}
              >
                <div className="socialWall_inner if need to remove">
                  <div className="sw_head mb-3 d-flex justify-content-between align-items-center">
                    <div className="sw_from_div d-flex align-items-center">
                      <img
                        src={
                          item?.rewardId?.userId !== null &&
                          item?.rewardId?.userId !== 'undefined'
                            ? getUserPicture(
                                item?.rewardId?.userId?.id,
                                item?.rewardId?.userId?.username
                              )
                            : defaultProfilePic
                        }
                        className="sr_u_pic"
                        alt="Profile Image"
                        title={
                          item?.rewardId?.userId !== null &&
                          item?.rewardId?.userId !== 'undefined'
                            ? item.rewardId.userId?.firstname +
                              item.rewardId.userId?.lastname
                            : ''
                        }
                      />
                      <div className="sw_from">
                        <div className="sw_from_data">
                          <Link
                            to={
                              userData?.username.toString() ===
                              item?.rewardId?.userId?.username.toString()
                                ? {
                                    pathname: '/app/dashboard',
                                  }
                                : { pathname: '/app/userdashboard' }
                            }
                            state={{
                              userData: { userID: item?.rewardId?.userId },
                            }}
                            className="a_hover_txt_deco_none"
                          >
                            <span className="sw_to_val sw_head_nms">
                              {item?.rewardId?.userId !== null &&
                              item?.rewardId?.userId !== 'undefined'
                                ? (item?.rewardId?.userId?.firstname ?? '') +
                                  ' ' +
                                  (item?.rewardId?.userId?.lastname ?? '')
                                : ''}{' '}
                            </span>
                          </Link>
                          <span className="sw_head_con">
                            {' '}
                            {t(`SocialWall.was enlited by`)}{' '}
                          </span>

                          <Link
                            to={
                              userData?.username.toString() ===
                              item?.rewardId?.createdBy?.username?.toString()
                                ? {
                                    pathname: '/app/dashboard',
                                  }
                                : { pathname: '/app/userdashboard' }
                            }
                            state={{
                              userData: { userID: item?.rewardId?.createdBy },
                            }}
                            className="a_hover_txt_deco_none"
                          >
                            <span className="sw_from_val sw_head_nms">
                              {item?.rewardId?.createdBy?.fullName ?? ''}{' '}
                            </span>
                          </Link>
                        </div>
                        <div className="sw_from_time">
                          <span
                            className="sw_from_time_val"
                            dir="ltr"
                          >
                            {console.log(
                              'formatDates(item?.createdAt)',
                              // item,
                               item?.createdAt,
                               item?.updatedAt, )}
                            {formatDates(item?.updatedAt,true)}
                            {/* {changeLabel(formatDates(item?.createdAt))} */}
                            {/* {formatDates(item?.createdAt)} */}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="sw_pts">
                      <span className="sw_pts_val font-helvetica-m">
                        {
                          item?.rewardId[getRewardType(item?.rewardId?.type)]
                            ?.points
                        }
                      </span>
                      <span className="sw_pts_type font-helvetica-m">
                        pt(s)
                      </span>
                    </div> */}
                  </div>
                  <div className="sw_body bg-white br-10">
                    <div className="sw_msg_div d-flex flex-sm-wrap flex-md-nowrap justify-content-between align-items-start mb-3">
                      <div className="sw_msg col-md-8 col-lg-9">
                        <p className="sw_msg_val mb-0">
                          <span className="font-helvetica-m">
                            {labelPrint(item)}
                          </span>
                          <span style={{ lineHeight: '1.1rem' }}>
                            {' '}
                            {item?.rewardId?.description}{' '}
                          </span>
                          <span>
                            {hashArr &&
                              hashArr?.length > 0 &&
                              hashArr.map((item, index) => {
                                return (
                                  <Link
                                    to="#"
                                    key={'hashTag_' + index}
                                  >
                                    {item?.name}{' '}
                                  </Link>
                                );
                              })}
                          </span>
                        </p>
                      </div>
                      <div className="sw_iconic col-md-4 col-lg-3">
                        <div className="d-flex flex-column align-items-center">
                          <img
                            src={
                              item?.rewardId?.imageByte !== null &&
                              item?.rewardId?.imageByte !== ''
                                ? item?.rewardId?.imageByte?.image
                                : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                            }
                            className="d_achievements_img sw_iconic_img mr-0"
                            alt="Reward Icon"
                            title={item?.rewardId[rewdType]?.name}
                          />
                          <p className="sw_iconic_nm mb-0 text-center fs-12">
                            {item?.rewardId[rewdType]?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="sw_comments_div">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {item?.socialWallLike &&
                            item?.socialWallLike.length > 0 && (
                              <div className="sw_enlited_lists d-flex align-items-center mb-3">
                                <div className="sw_enlited_pics mr-3">
                                  <ul className="mb-0 ml-3 pl-0 clear-p">
                                    {item?.socialWallLike &&
                                      item?.socialWallLike?.length > 0 &&
                                      item?.socialWallLike.map(
                                        (item, index) => {
                                          if (index < maxLikedCount) {
                                            return (
                                              <li key={'LikedPic_' + index}>
                                                <img
                                                  src={getUserPicture(
                                                    item?.userId?.id,
                                                    item?.userId?.username
                                                  )}
                                                  className="img-fluid sr_rank_pic"
                                                  alt="User"
                                                  title={
                                                    item?.userId?.firstname +
                                                    ' ' +
                                                    item?.userId?.lastname
                                                  }
                                                />
                                              </li>
                                            );
                                          }
                                        }
                                      )}
                                  </ul>
                                </div>
                                <div className="sw_enlited_nm">
                                  <span className="enlited_lbl">
                                    {' '}
                                    {t(`SocialWall.Reacted by`)}
                                  </span>
                                  {item?.socialWallLike &&
                                    item?.socialWallLike?.length > 0 &&
                                    item?.socialWallLike.map((like, index) => {
                                      if (index < maxLikedCount) {
                                        return (
                                          <Link
                                            to={
                                              userData?.username.toString() ===
                                              like?.userId?.username.toString()
                                                ? {
                                                    pathname: '/app/dashboard',
                                                  }
                                                : {
                                                    pathname:
                                                      '/app/userdashboard',
                                                  }
                                            }
                                            state={{
                                              userData: {
                                                userID: like?.userId,
                                              },
                                            }}
                                            className="enlited_nms a_hover_txt_deco_none"
                                            key={'Likeduse_' + index}
                                          >
                                            <span>
                                              {' '}
                                              {like?.userId?.firstname +
                                                ' ' +
                                                like?.userId?.lastname}
                                              {item?.socialWallLike.length >
                                                1 &&
                                              index < maxLikedCount - 1 &&
                                              item?.socialWallLike?.length -
                                                1 !==
                                                index
                                                ? ', '
                                                : ''}
                                            </span>
                                          </Link>
                                        );
                                      }
                                    })}
                                  {item?.socialWallLike &&
                                    item?.socialWallLike?.length >
                                      maxLikedCount && (
                                      <React.Fragment>
                                        <span> and </span>
                                        <Link
                                          to="#"
                                          data-toggle="modal"
                                          data-target="#LikedInfoModal"
                                          onClick={() =>
                                            likedModalHandler(
                                              item?.socialWallLike
                                            )
                                          }
                                        >
                                          <span>
                                            {' '}
                                            {item?.socialWallLike?.length -
                                              maxLikedCount}{' '}
                                            {t(`SocialWall.others`)}{' '}
                                          </span>
                                        </Link>
                                      </React.Fragment>
                                    )}
                                </div>
                              </div>
                            )}
                        </div>
                        {/* comments */}
                        <div
                          className={`enlite_comments_layer d-flex justify-content-between align-items-center liked_heart ${
                            isEnlited(item?.socialWallLike) ? '' : 'clicked'
                          }`}
                        >
                          {/* liked_heart  ${isEnlited(item?.socialWallLike) ? "clicked" : ""} */}
                          <div className="fs-10 text-align-center">
                            {isEnlited(item?.socialWallLike) && (
                              <div
                                className="enlite_action_icon mr-2 c1 mb-1"
                                onClick={() =>
                                  likeSocialWallHandler(item, index)
                                }
                                title="React Icon (like)"
                              >
                                <span
                                  style={{ padding: '0px' }}
                                  dangerouslySetInnerHTML={{
                                    __html: svgIcons && svgIcons.enlite_icon,
                                  }}
                                ></span>
                              </div>
                            )}
                            {!isEnlited(item?.socialWallLike) && (
                              <div
                                className="enlite_action_icon mr-2 c1 fd_enlided_icon mb-1"
                                onClick={() =>
                                  unLikeSocialWallHandler(item, index)
                                }
                                title="React Icon (like)"
                              >
                                {/* fd_enlided_icon */}
                                {likeStatus?.statee &&
                                  item.id === likeStatus.id && <Heart />}
                                <span
                                  style={{ padding: '0px' }}
                                  dangerouslySetInnerHTML={{
                                    __html: svgIcons && svgIcons.enlited_icon,
                                  }}
                                ></span>
                              </div>
                            )}
                            {isEnlited(item?.socialWallLike) ? 'Like' : 'Liked'}{' '}
                            &nbsp; &nbsp;
                          </div>
                          <div className="fs-10 text-align-center">
                            <div
                              style={{ width: '40px' }}
                              className="enlite_action_icon c1 mb-1"
                              dangerouslySetInnerHTML={{
                                __html: svgIcons && svgIcons.s_message_icon,
                              }}
                              onClick={() => commentStateHandler(index)}
                              title="Comment"
                            ></div>
                            Comment
                          </div>
                        </div>
                      </div>
                      <div className="sw_enlite_actions_div">
                        <div className="sw_enlite_actions d-flex flex-wrap justify-content-between align-items-center">
                          {!item?.commentState?.listCommentState && (
                            <div
                              className="enlite_view_comments enlite_view_less_comments c1"
                              onClick={() => viewAllComments(item, index)}
                            >
                              {item?.commentsCount > 0 && (
                                <span>
                                  {t(`SocialWall.View`)}{' '}
                                  {/* <span>
                                    {item?.wallComments?.length
                                      ? item?.wallComments?.length
                                      : item?.commentsCount}
                                  </span>{' '} */}
                                  {t(`SocialWall.comment(s)`)}
                                </span>
                              )}
                            </div>
                          )}
                          {item?.commentState?.listCommentState && (
                            <React.Fragment>
                              <div
                                className="enlite_view_comments enlite_view_less_comments c1"
                                onClick={() => lessComments(item, index)}
                              >
                                <span> {t(`SocialWall.Less comment(s)`)} </span>
                              </div>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>

                    {item?.commentState?.listCommentState && (
                      <div className="swCommentLists">
                        <SocialWallCommentsList
                          comments={getCustomizedData(item.wallComments)}
                          getUserPicture={getUserPicture}
                          replyStateHandler={replyStateHandler}
                          type={{ section: 'parent', index: index, data: item }}
                          replyHandler={replyHandler}
                          postReplyHandler={postReplyHandler}
                          wallId={item}
                          parentIndex={index}
                          getSubChildrenParent={getSubChildrenParent}
                          userData={userData}
                        />
                      </div>
                    )}
                  </div>
                  {item?.commentState?.typeCommentState && (
                    <div className="sw_post_comment_div mt-3">
                      <div className="d-flex">
                        <img
                          src={getUserPicture(userData.id, userData?.username)}
                          className="sr_rank_pic"
                          alt="Profile Image"
                        />

                        <div className="input-group sw_post_comment">
                          <textarea
                            className="form-control sw_textarea postComment"
                            id={'postComment_' + index}
                            rows="1"
                            maxLength={120}
                            placeholder={t(`SocialWall.Add a comment`)}
                            onChange={(e) => commentHandler(index, e)}
                          ></textarea>
                          <div
                            className="input-group-addon postCommentSubmit c1"
                            onClick={() => postCommentHandler(item, index)}
                          >
                            <span className="addon_clr">
                              {' '}
                              {t(`SocialWall.Post`)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      <div
        style={{ position: 'relative', bottom: '20px' }}
        ref={ref}
      ></div>
    </React.Fragment>
  );
};
export default SocialWallMiddleContent;

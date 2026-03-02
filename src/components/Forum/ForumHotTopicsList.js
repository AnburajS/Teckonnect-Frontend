import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eepFormatDateTime } from '../../shared/SharedService';
import ReactTooltip from 'react-tooltip';
import { useInView } from 'react-intersection-observer';
import ResponseInfo from '../../UI/ResponseInfo';

const ForumHotTopicsList = (props) => {
  const {
    forumList,
    usersPic,
    stopFetchForumHotTopics,
    getForumHotTopicsList,
  } = props;
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  // const initForumList = forumList ? forumList : [];
  // const [hotForumList, setHotForumList] = useState([]);
  // const hotForumMaxCommentList = 5;
  // const hotForumMaxList = 5;
  const loggedUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};

  // useEffect(() => {
  //   if (initForumList && initForumList.length > 0) {
  //     let hotForumList = [];
  //     let ak = 1;
  //     initForumList &&
  //       initForumList.length > 0 &&
  //       initForumList
  //         .sort((a, b) =>
  //           a.forumComments.length < b.forumComments.length ? 1 : -1
  //         )
  //         .map((hotData) => {
  //           if (
  //             hotData.forumComments.length > hotForumMaxCommentList &&
  //             ak <= hotForumMaxList
  //           ) {
  //             hotForumList.push(hotData);
  //             ak++;
  //             return [hotForumList, ak];
  //           }
  //         });
  //     setHotForumList([...hotForumList]);
  //   }
  // }, [initForumList]);

  useEffect(() => {
    if (inView && !stopFetchForumHotTopics) {
      getForumHotTopicsList();
    }
  }, [inView, stopFetchForumHotTopics]);

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  const viewForumDetail = (arg) => {
    navigate('/app/forumdetailview', {
      state: {
        forumData: arg,
        usersPicData: usersPic,
      },
    });
  };

  return (
    <div className="hot_comments">
      {forumList && forumList.length > 0 ? (
        forumList.map((fData, index) => {
          return (
            <>
              {fData && (
                <div
                  className="forum_right_side_container forumj_right_container c1"
                  key={'hotTopics_' + index}
                >
                  <div className="forum_right_side_inner">
                    <div className="forum_profile_image">
                      <Link to="#">
                        <img
                          src={getUserPicture(fData.createdBy.id)}
                          alt="User Pic"
                          title={
                            fData.createdBy?.firstname +
                            ' ' +
                            fData.createdBy?.lastname
                          }
                          className="rounded-circle forum_profile_image_size"
                        />
                      </Link>
                    </div>
                    <div className="forum_profile_content">
                      <p
                        className="forum_content_title forum_content_title_truncate"
                        onClick={() => viewForumDetail(fData)}
                      >
                        {fData.title}
                      </p>
                      <Link
                        to="#"
                        className="a_hover_txt_deco_none"
                      >
                        <p className="forum_user_name">
                          {fData.createdBy?.firstname +
                            ' ' +
                            fData.createdBy?.lastname}
                        </p>
                      </Link>
                      <div
                        className="forum_responce_container_hot"
                        onClick={() => viewForumDetail(fData)}
                      >
                        <div>
                          <div className="forum_responce_commants forum_responce d-md-inline-block mr-3">
                            {fData.forumComments.length > 0 && (
                              <img
                                src={`${process.env.PUBLIC_URL}/images/icons/static/Message.svg`}
                                alt="commant-icon"
                                className="forum-eep-img-size"
                              />
                            )}
                            {fData.forumComments.length <= 0 && (
                              <img
                                src={`${process.env.PUBLIC_URL}/images/icons/static/MessageDefault.svg`}
                                alt="commant-icon"
                                className="forum-eep-img-size"
                              />
                            )}
                            <span className="forum_responce_commants_counts ">
                              {' '}
                              {fData.forumComments.length}{' '}
                              {fData.forumComments.length > 0
                                ? fData.forumComments.length === 1
                                  ? 'comment'
                                  : 'comments'
                                : 'comment'}
                            </span>
                          </div>
                          <div className="forum_responce_likes forum_responce  d-md-inline-block">
                            <ReactTooltip
                              effect="solid"
                              id={`tooltip${index}`}
                            >
                              {fData.forumLikes
                                ?.map((v) =>
                                  v?.userId?.username ===
                                  loggedUserData?.username
                                    ? 'You'
                                    : v?.userId?.firstname
                                )
                                ?.join(', ')
                                ?.replaceAll(loggedUserData?.username, 'You')}
                            </ReactTooltip>
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <div
                                data-tip
                                data-for={`tooltip${index}`}
                              >
                                {fData.forumLikes.length > 0 && (
                                  <>
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`}
                                      style={{ marginRight: '2px' }}
                                      alt="heart_icon"
                                      className="forum-eep-img-size"
                                    />
                                    <span className="forum_responce_likes_counts ">
                                      {' '}
                                      {fData.forumLikes.length}{' '}
                                      {fData.forumLikes.length > 0
                                        ? fData.forumLikes.length === 1
                                          ? 'like'
                                          : 'likes'
                                        : 'like'}
                                    </span>
                                  </>
                                )}
                              </div>
                              {fData.forumLikes.length <= 0 && (
                                <>
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`}
                                    style={{ marginRight: '3px' }}
                                    alt="heart_icon"
                                    className="forum-eep-img-size"
                                  />
                                  <span className="forum_responce_likes_counts ">
                                    {' '}
                                    {fData.forumLikes.length}{' '}
                                    {fData.forumLikes.length > 0
                                      ? fData.forumLikes.length === 1
                                        ? 'like'
                                        : 'likes'
                                      : 'like'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="forum_responce_posted_time">
                          <span className="">
                            {' '}
                            {eepFormatDateTime(fData.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })
      ) : (
        <ResponseInfo
          title="No hot topics yet. Join the conversation!"
          responseImg="noHotTopics"
          responseClass="response-info"
          messageInfo="A good discussion is the bridge to better understanding."
          subMessageInfo=""
        />
      )}
      <div
        style={{ position: 'relative', bottom: '20px' }}
        ref={ref}
      ></div>
    </div>
  );
};

export default ForumHotTopicsList;

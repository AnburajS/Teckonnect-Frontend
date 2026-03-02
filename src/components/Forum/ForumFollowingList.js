import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eepFormatDateTime } from '../../shared/SharedService';
import { useInView } from 'react-intersection-observer';
import ResponseInfo from '../../UI/ResponseInfo';

const ForumFollowingList = (props) => {
  const {
    forumFollowingList,
    getForumFollowingList,
    infiniteLoader,
    usersPic,
    stopFetch,
  } = props;

  const navigate = useNavigate();
  const initforumFollowingList = forumFollowingList ? forumFollowingList : [];
  const [forumFollowingLists, setForumFollowingLists] = useState([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    setForumFollowingLists(initforumFollowingList);
  }, [initforumFollowingList]);

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

  useEffect(() => {
    if (inView && !stopFetch) {
      getForumFollowingList();
    }
  }, [inView, stopFetch]);

  return (
    <React.Fragment>
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
      {forumFollowingLists && forumFollowingLists.length > 0 ? (
        forumFollowingLists
          .sort((a, b) => (a.id < b.id ? 1 : -1))
          .map((fData, index) => {
            return (
              <div
                className="forum_right_side_container forumj_right_container position-relative c1"
                style={{ opacity: infiniteLoader ? 0.5 : 1 }}
                key={'followingTopics_' + index}
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
                          {fData.forumLikes.length > 0 && (
                            <img
                              src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`}
                              alt="heart_icon"
                              className="forum-eep-img-size"
                            />
                          )}
                          {fData.forumLikes.length <= 0 && (
                            <img
                              src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`}
                              alt="heart_icon"
                              className="forum-eep-img-size"
                            />
                          )}
                          <span className="forum_responce_likes_counts ">
                            {' '}
                            {fData.forumLikes.length}{' '}
                            {fData.forumLikes.length > 0
                              ? fData.forumLikes.length === 1
                                ? 'like'
                                : 'likes'
                              : 'like'}
                          </span>
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
                  <div className="forum_following_topics_imgleft_div">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/static/Follow.svg`}
                      alt="following-icon"
                      className="forum-eep-img-size"
                    />
                  </div>
                </div>
              </div>
            );
          })
      ) : (
        <ResponseInfo
          title="No followed topics yet. Find your interests!"
          responseImg="noFollowing"
          responseClass="response-info"
          messageInfo="Connections are the threads that weave collaboration into success."
          subMessageInfo=""
        />
      )}
      <div
        style={{ position: 'relative', bottom: '20px' }}
        ref={ref}
      ></div>
    </React.Fragment>
  );
};

export default ForumFollowingList;

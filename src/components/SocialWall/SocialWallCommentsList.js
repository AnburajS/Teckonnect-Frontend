import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { eepFormatDateTime } from '../../shared/SharedService';
import { useTranslation } from 'react-i18next';

const SocialWallCommentsList = (props) => {
  const { t } = useTranslation();

  const {
    comments,
    getUserPicture,
    replyStateHandler,
    type,
    postReplyHandler,
    replyHandler,
    postReply,
    wallId,
    parentIndex,
    getSubChildrenParent,
    userData,
  } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  return (
    <div className="mt-2">
      {comments &&
        comments.length > 0 &&
        comments.map((subItem, subIndex) => {
          return (
            <div
              className="sw_comment_lists d-flex"
              key={'swCommentList_' + type.section + '_' + subIndex}
            >
              <img
                src={getUserPicture(
                  subItem?.createdBy?.id,
                  subItem?.createdBy?.username
                )}
                className="sr_rank_pic"
                alt="Profile Pic"
                title={
                  subItem.createdBy.firstname + ' ' + subItem.createdBy.lastname
                }
              />
              <div className="d-flex flex-column w-100">
                <div className="sw_comment_list_dtls">
                  <Link
                    to={
                      userData?.username.toString() ===
                      subItem?.createdBy?.username.toString()
                        ? {
                            pathname: '/app/dashboard',
                          }
                        : {
                            pathname: '/app/userdashboard',
                          }
                    }
                    state={{
                      userData: {
                        userID: subItem?.createdBy,
                      },
                    }}
                    className="enlited_nms a_hover_txt_deco_none mr-2"
                  >
                    {subItem.createdBy.firstname +
                      ' ' +
                      subItem.createdBy.lastname}
                  </Link>
                  <span className="sw_comment_dt">
                    {eepFormatDateTime(subItem.createdAt)}
                  </span>
                  {subItem.prentInfo && (
                    <div className="sw_reply_info">
                      <i>
                        @
                        {subItem.prentInfo.createdBy.firstname +
                          ' ' +
                          subItem.prentInfo.createdBy.lastname +
                          ' - ' +
                          subItem.prentInfo.message}{' '}
                      </i>
                    </div>
                  )}
                  <div className="sw_comment_val">
                    <span>{subItem.message} </span>
                  </div>
                </div>

                <div className="reaction-container d-flex">
                  <div className="reply-btn-div">
                    <span
                      className="reply-btn-action c1"
                      onClick={() =>
                        replyStateHandler({
                          parentIndex: parentIndex,
                          wallId: wallId,
                          subItem: subItem,
                          topLevelReply:
                            type && type.section === 'parent' ? true : false,
                        })
                      }
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: svgIcons && svgIcons.reply_icon,
                        }}
                      ></span>
                      <span> {t(`SocialWall.Reply`)} </span>
                    </span>
                  </div>
                  {type &&
                    type.section === 'parent' &&
                    subItem?.subChildren?.length > 0 && (
                      <div
                        className="all_replies_view ml-3 c1"
                        data-toggle="collapse"
                        data-target={'#children_' + subIndex}
                        onClick={() => getSubChildrenParent(subItem)}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: svgIcons && svgIcons.view_reply_icon,
                          }}
                        ></span>
                        <React.Fragment>
                          <span className="all_replies_count">
                            {' ' + subItem?.subChildren?.length + ' '}
                          </span>
                          <span className="all_replies_txt">
                            {subItem?.subChildren?.length > 1
                              ? 'View replies'
                              : 'Reply'}
                          </span>
                        </React.Fragment>
                      </div>
                    )}
                </div>

                {subItem?.commentState?.typeCommentState && (
                  <div className="reply_append">
                    <div className="d-flex">
                      {/* <img src={getUserPicture(userData.id)}
                      className="sr_rank_pic"
                      alt="Profile Image"
                  /> */}
                      <div className="input-group sw_post_comment">
                        <textarea
                          className="form-control sw_textarea postComment"
                          id={'postReply_' + subItem.id}
                          rows="1"
                          placeholder={t(`SocialWall.Add a reply`)}
                          onChange={(e) => replyHandler(e)}
                        ></textarea>
                        <div className="input-group-addon">
                          <div
                            className="addon_clr postReply c1"
                            onClick={() =>
                              postReplyHandler(wallId, subItem, parentIndex, {
                                parentIndex: parentIndex,
                                wallId: wallId,
                                subItem: subItem,
                                topLevelReply:
                                  type && type.section === 'parent'
                                    ? true
                                    : false,
                              })
                            }
                            // onClick = {() => postReply(subItem)}
                          >
                            {t(`SocialWall.Post`)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {subItem.subChildren && subItem?.subChildren?.length > 0 && (
                  <div
                    className="all_replies_lists collapse"
                    id={'children_' + subIndex}
                  >
                    <SocialWallCommentsList
                      comments={subItem.subChildren}
                      type={{ section: 'children', index: subIndex }}
                      getUserPicture={getUserPicture}
                      replyStateHandler={replyStateHandler}
                      postReply={postReply}
                      wallId={wallId}
                      parentIndex={parentIndex}
                      getSubChildrenParent={getSubChildrenParent}
                      replyHandler={replyHandler}
                      postReplyHandler={postReplyHandler}
                      userData={userData}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SocialWallCommentsList;

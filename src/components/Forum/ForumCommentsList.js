import React from 'react';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { eepFormatDateTime } from '../../shared/SharedService';
import CommentReply from './CommentReply';
import ForumDetailView from './ForumDetailView';
const ForumCommentsList = (props) => {
  const {
    forumData,
    comments,
    getUserPicture,
    deleteCommentHandler,
    commentUnLikeHandler,
    commentLikeHandler,
    toggleReply,
    editCommentHandler,
    editCommentReplyHandler,
    toggleReplyList,
    checkIsReplyLiked,
    toggleReplyState,
    closeReply,
    clickCommentReplySubmitHandler,
    updateCommentReplyHandler,
    activeReplyId,
  } = props;

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const currentUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  return (
    <div
      className="col-md-12"
      style={{ paddingTop: '10px' }}
    >
      {comments &&
        comments.length > 0 &&
        comments
          .sort((a, b) => (a.id > b.id ? 1 : -1))
          .map((subItem, subIndex) => {
            return (
              <div
                className="forum_reply_message forum_reply_message_4"
                key={'commend_reply_' + subIndex}
              >
                <div className="forum_reply_content_div">
                  <div className="forum_profile_container">
                    <div className="forum_profile_image">
                      <img
                        src={getUserPicture(subItem?.createdBy?.id)}
                        alt="forum_profile_picture"
                        className="rounded-circle forum_profile_image_size"
                      />
                    </div>
                    <div className="forum_profile_content">
                      <div className="forum_profile_content_inner_div">
                        <label className="forum_user_name mb-0">
                          {(subItem?.createdBy?.firstname ?? '') +
                            ' ' +
                            (subItem?.createdBy?.lastname ?? '')}
                        </label>
                        <div
                          className="eep-splitter"
                          style={{ height: '15px' }}
                        ></div>
                        <label
                          className="forum_nofpostes d-flex align-items-center mb-0"
                          style={{ fontSize: '12px' }}
                        >
                          <div
                            className="d-flex cursor_help mb-0"
                            title={forumData.title}
                          >
                            <i className="eep_truncate eep_truncate_max">
                              Comment to - <span>{forumData.title}</span>
                            </i>
                          </div>
                        </label>
                      </div>
                      {subItem?.createdBy?.id === currentUserData.id && (
                        <div className="forumkebab_div  flex-shrink-1 bd-highlight">
                          <div className="dropdown c-c1c1c1 c1 eep_custom_dropdown">
                            <span
                              className="eep_kebab_btn"
                              data-toggle="dropdown"
                              aria-expanded="false"
                              dangerouslySetInnerHTML={{
                                __html: svgIcons && svgIcons.eep_kebab,
                              }}
                            ></span>
                            <div
                              className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg"
                              x-placement="bottom-start"
                            >
                              <label
                                className="eep-options-item dropdown-item mb-0 c1"
                                onClick={() => editCommentHandler(subItem)}
                              >
                                Edit
                              </label>
                              <label
                                className="eep-options-item dropdown-item mb-0 c1"
                                onClick={() =>
                                  deleteCommentHandler(subItem, forumData)
                                }
                              >
                                Delete
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="forum_content_wrapper">
                    <div
                      className="forum_content eep_scroll_y"
                      style={{ minHeight: '40px', maxHeight: '250px' }}
                    >
                      <div
                        className="forum_message_style mestext"
                        dangerouslySetInnerHTML={{ __html: subItem.message }}
                      ></div>
                    </div>
                    <div className="forum_message_reactions">
                      {subItem?.forumCommentLikes?.length > 0 && (
                        <ReactTooltip
                          effect="solid"
                          id={`tooltip${subIndex}`}
                        >
                          {subItem?.forumCommentLikes
                            ?.map((c) =>
                              c?.userId?.username === currentUserData?.username
                                ? 'You'
                                : c?.userId?.firstname
                            )
                            ?.join(', ')
                            ?.replaceAll(currentUserData?.username, 'You')}
                        </ReactTooltip>
                      )}
                      <div
                        className="mb-1 fd_like c1"
                        id="4"
                        data-tip
                        data-for={`tooltip${subIndex}`}
                      >
                        {subItem.forumReplyIsLiked && (
                          <img
                            src={`${process.env.PUBLIC_URL}/images/icons/static/ThumbsUpActive.svg`}
                            alt="Like"
                            className="forum-eep-img-size"
                            onClick={() =>
                              commentUnLikeHandler(subItem, forumData)
                            }
                          />
                        )}

                        {!subItem.forumReplyIsLiked && (
                          <img
                            src={`${process.env.PUBLIC_URL}/images/icons/static/ThumbsUpDefault.svg`}
                            alt="Like"
                            className="forum-eep-img-size"
                            onClick={() =>
                              commentLikeHandler(subItem, forumData)
                            }
                          />
                        )}
                        <span className="ml-1">
                          {subItem?.forumCommentLikes?.length ?? 0}
                        </span>
                      </div>

                      <div className="forum_rplay_icon_div d-flex align-items-center">
                        {subItem?.subChildren?.length > 0 && (
                          <React.Fragment>
                            <div
                              className="commentReplies c1 d-flex align-items-center mr-3"
                              onClick={() =>
                                toggleReplyList(
                                  subItem,
                                  subItem.toggleReplyState
                                )
                              }
                            >
                              <span onClick={() => toggleReply(subItem, 'new')}>
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/icons/static/Reply-Icon.svg`}
                                  alt="reply"
                                />
                              </span>
                              <span>{subItem?.subChildren?.length}</span>
                              <span>
                                {subItem?.subChildren?.length > 1
                                  ? ' Replies'
                                  : ' Reply'}
                              </span>
                            </div>
                            {/* <div className="eep-splitter"></div> */}
                          </React.Fragment>
                        )}
                        <div
                          className="reply_button_style reply_of_reply_button d-flex align-items-center c1"
                          onClick={() => toggleReply(subItem, 'new')}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: svgIcons && svgIcons.reply_icon,
                            }}
                            className="mr-1"
                          ></span>
                          <span>Reply</span>

                          <div
                            className="eep-splitter"
                            style={{ height: '15px' }}
                          ></div>

                          <span>
                            <img
                              src={`${process.env.PUBLIC_URL}/images/icons/static/Calendar-Icon.svg`}
                              style={{ width: '12px' }}
                              alt="Calendar Icon"
                            />
                          </span>
                          <span className="ml-2">
                            {eepFormatDateTime(subItem.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {subItem.id === activeReplyId && (
                    <CommentReply
                      type="new"
                      parentComment={subItem}
                      toggleReplyState={toggleReplyState}
                      forumData={forumData}
                      closeReply={closeReply}
                      getUserPicture={getUserPicture}
                      clickCommentReplySubmitHandler={
                        clickCommentReplySubmitHandler
                      }
                      updateCommentReplyHandler={updateCommentReplyHandler}
                    />
                  )}

                  {subItem.toggleReplyState &&
                    subItem?.subChildren?.length > 0 && (
                      <div className="forumReplies_div">
                        {subItem?.subChildren?.length > 0 &&
                          subItem?.subChildren?.map((rItem, rIndex) => {
                            return (
                              <div
                                className="forum_reply_content_div"
                                key={'replyIndex_' + rIndex}
                              >
                                <div className="forum_profile_container">
                                  <div className="forum_profile_image">
                                    <img
                                      src={getUserPicture(rItem?.createdBy?.id)}
                                      alt="User Pic"
                                      title={rItem?.createdBy?.fullName}
                                      className="rounded-circle forum_profile_image_size"
                                    />
                                  </div>
                                  <div className="forum_profile_content">
                                    <div className="forum_profile_content_inner_div">
                                      <label className="forum_user_name mb-0">
                                        {(rItem?.createdBy?.firstname ?? '') +
                                          ' ' +
                                          (rItem?.createdBy?.lastname ?? '')}
                                      </label>
                                      <div
                                        className="eep-splitter"
                                        style={{ height: '15px' }}
                                      ></div>
                                      <label
                                        className="forum_nofpostes d-flex align-items-center mb-0"
                                        style={{ fontSize: '12px' }}
                                      >
                                        <div
                                          className="d-flex cursor_help mb-0"
                                          title={rItem.prentInfo.message}
                                        >
                                          {/* <i className="eep_truncate eep_truncate_max">
                                            Replied to -{' '}
                                            <span>
                                              {rItem.prentInfo.message}
                                            </span>
                                          </i> */}

                                          <i className="eep_truncate eep_truncate_max">
                                            Replied to -{' '}
                                            <span>
                                              {rItem.prentInfo.message?.replace(
                                                /<[^>]+>/g,
                                                ''
                                              )}
                                            </span>
                                          </i>
                                        </div>
                                      </label>
                                      {/* </div> */}
                                      {rItem?.createdBy?.id ===
                                        currentUserData.id && (
                                        <div className="forumkebab_div flex-shrink-1 bd-highlight">
                                          <div className="dropdown c-c1c1c1 c1 eep_custom_dropdown">
                                            <span
                                              className="eep_kebab_btn"
                                              data-toggle="dropdown"
                                              aria-expanded="false"
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  svgIcons &&
                                                  svgIcons.eep_kebab,
                                              }}
                                            ></span>
                                            <div
                                              className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg"
                                              x-placement="bottom-start"
                                            >
                                              <label
                                                className="eep-options-item dropdown-item mb-0 c1"
                                                onClick={() =>
                                                  editCommentReplyHandler(rItem)
                                                }
                                              >
                                                Edit
                                              </label>
                                              <label
                                                className="eep-options-item dropdown-item mb-0 c1"
                                                onClick={() =>
                                                  deleteCommentHandler(
                                                    rItem,
                                                    forumData
                                                  )
                                                }
                                              >
                                                Delete
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="forum_content_wrapper">
                                  <div className="forum_content eep_scroll_y">
                                    <div
                                      className="forum_message_style mestext"
                                      dangerouslySetInnerHTML={{
                                        __html: rItem.message,
                                      }}
                                    ></div>
                                  </div>
                                  <div className="forum_message_reactions">
                                    <div
                                      className="mb-1 fd_like c1"
                                      id="4"
                                    >
                                      <ReactTooltip
                                        effect="solid"
                                        id={`tooltip${subIndex}${rItem.id}`}
                                      >
                                        {rItem?.forumCommentLikes
                                          ?.map((c) =>
                                            c?.userId?.username ===
                                            currentUserData?.username
                                              ? 'You'
                                              : c?.userId?.firstname
                                          )
                                          ?.join(', ')
                                          ?.replaceAll(
                                            currentUserData?.username,
                                            'You'
                                          )}
                                      </ReactTooltip>
                                      <div
                                        data-tip
                                        data-for={`tooltip${subIndex}${rItem.id}`}
                                      >
                                        {checkIsReplyLiked(rItem) && (
                                          <img
                                            src={`${process.env.PUBLIC_URL}/images/icons/static/ThumbsUpActive.svg`}
                                            alt="Like"
                                            className="forum-eep-img-size"
                                            onClick={() =>
                                              commentUnLikeHandler(
                                                rItem,
                                                forumData
                                              )
                                            }
                                          />
                                        )}
                                        {/* </div> */}
                                        {!checkIsReplyLiked(rItem) && (
                                          <img
                                            src={`${process.env.PUBLIC_URL}/images/icons/static/ThumbsUpDefault.svg`}
                                            alt="Like"
                                            className="forum-eep-img-size"
                                            onClick={() =>
                                              commentLikeHandler(
                                                rItem,
                                                forumData
                                              )
                                            }
                                          />
                                        )}

                                        <span className="ml-1">
                                          {rItem?.forumCommentLikes?.length ??
                                            0}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="forum_rplay_icon_div d-flex align-items-center">
                                      <div
                                        className="reply_button_style reply_of_reply_button d-flex align-items-center c1"
                                        onClick={() =>
                                          toggleReply(rItem, 'new')
                                        }
                                      >
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              svgIcons && svgIcons.reply_icon,
                                          }}
                                          className="mr-2"
                                        ></span>
                                        <span>Reply</span>

                                        <div
                                          className="eep-splitter"
                                          style={{ height: '15px' }}
                                        ></div>
                                        <span>
                                          <img
                                            src={`${process.env.PUBLIC_URL}/images/icons/static/Calendar-Icon.svg`}
                                            style={{ width: '12px' }}
                                            alt="Calendar Icon"
                                          />
                                        </span>
                                        <span className="ml-2">
                                          {eepFormatDateTime(rItem.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ForumCommentsList;

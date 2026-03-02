import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const CommentReply = (props) => {
  const {
    toggleReplyState,
    forumData,
    closeReply,
    getUserPicture,
    clickCommentReplySubmitHandler,
    updateCommentReplyHandler,
  } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const currentUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const [forumCommentReply, setForumCommentReply] = useState('');
  const maxTextAreaLength = 255;

  useEffect(() => {
    setForumCommentReply('');
    if (toggleReplyState.isToggle) {
      if (toggleReplyState.type === 'edit') {
        setForumCommentReply(toggleReplyState.cmtData.message);
      }
      setTimeout(() => {
        document.getElementById('forumReplyTextArea').focus();
      }, 2);
    }
  }, [toggleReplyState]);

  const onChangeForumCommentReply = (e) => {
    setForumCommentReply(e.target.value);
  };

  return (
    <div className="forum_reply_message forum_append_class_container">
      <div
        className="forum_profile_container d-flex align-items-center"
        style={{ border: '0px' }}
      >
        <div className="forum_profile_image">
          <img
            src={getUserPicture(currentUserData.id)}
            alt="forum_profile_picture"
            className="rounded-circle forum_profile_image_size"
          />
        </div>
        <div className="forum_profile_content d-flex align-items-center ms-2">
          <p className="forum_user_name mb-0">
            {(currentUserData?.firstName ?? '') +
              ' ' +
              (currentUserData?.lastName ?? '')}
          </p>
          <div
            className="eep-splitter "
            style={{
              borderLeft: '1px solid #ccc',
              height: '18px',
              margin: '0 8px',
            }}
          ></div>

          <p
            style={{
              margin: 0,
              padding: 0,
              fontSize: '12px',
              color: '#9b9b9bff',
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Reply to -{' '}
            {toggleReplyState?.cmtData?.message?.replace(/<[^>]+>/g, '')}
          </p>
        </div>
      </div>

      <div className="eep-dropdown-divider pb-7"></div>

      <div className="replyBoxContainer">
        <textarea
          id="forumReplyTextArea"
          rows="2"
          value={forumCommentReply}
          maxLength={maxTextAreaLength}
          onChange={onChangeForumCommentReply}
          placeholder="Enter your text..."
        ></textarea>

        <div
          className="closeReplyBtn"
          onClick={closeReply}
        >
          <i
            className="fa fa-times"
            aria-hidden="true"
          ></i>
        </div>
        <div className="replyFooter">
          <span className="charCount">
            {forumCommentReply.length}/{maxTextAreaLength}
          </span>

          {toggleReplyState.type === 'new' && (
            <div
              className={`sendBtn ${
                forumCommentReply.length > 0 ? 'eep_post_icon c1' : ''
              }`}
              onClick={() =>
                forumCommentReply.length > 0 &&
                clickCommentReplySubmitHandler(
                  forumData,
                  toggleReplyState.cmtData,
                  forumCommentReply
                )
              }
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.send_icon,
                }}
              ></span>
            </div>
          )}

          {toggleReplyState.type === 'edit' && (
            <div
              className={`sendBtn ${
                forumCommentReply.length > 0 ? 'active' : ''
              }`}
              onClick={() =>
                forumCommentReply.length > 0 &&
                updateCommentReplyHandler(
                  forumCommentReply,
                  toggleReplyState.cmtData,
                  forumData
                )
              }
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.send_icon,
                }}
              ></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentReply;

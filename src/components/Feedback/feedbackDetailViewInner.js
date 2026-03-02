/* eslint-disable react-hooks/exhaustive-deps */
import EmojiPicker, { Emoji, SuggestionMode } from 'emoji-picker-react';
import moment from 'moment/moment';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import ResponseInfo from '../../UI/ResponseInfo';
import { eepFormatDateTime } from '../../shared/SharedService';
import FeedbackDetailViewMore from './more';
import { fileTypeAndImgSrcArray } from '../../helpers';
import { emojiOptions, formatDates } from '../../constants/utills';

const FeedbackDetailViewInner = (props) => {
  const {
    IsClear,
    ideaDetail,
    usersPic,
    handleCommand,
    likeAnIdea,
    likeAnIdeaChild,
    likeAnFeed,
  } = props;
  console.log('ideaDetail', ideaDetail);
  const loggedUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const [isDetailListMode, setIsDetailListMode] = useState(false);
  const emojiIdRef = useRef(null);
  const [state, setState] = useState({
    more: null,
    openicon: false,
    childopenicon: null,
  });
  const [isOpen, setOpen] = useState('');

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  const likeAnIdeaHandler = (arg) => {
    likeAnIdea(arg);
  };

  const onClearMore = () => {
    state.more = null;
    setState({ ...state });
  };

  const onClickEmoji = (emojiData, ideaDetail) => {
    setState({ ...state, openicon: false });
    likeAnIdeaHandler({ iData: ideaDetail, emojiData });
  };

  const onClickChildEmoji = (emojiData, ideaDetail) => {
    setState({ ...state, childopenicon: emojiData?.id });
    likeAnIdeaChild({ iData: ideaDetail, emojiData });
  };

  const likeAnFeedHandler = (arg) => {
    likeAnFeed(arg);
  };

  const isIdeaLiked = (uID, ideaLikes) => {
    let iLikedIndex = ideaLikes?.filter((x) => x?.users?.user_id === uID);
    if (iLikedIndex?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const renderChildComponentCildren = (data, a, setOpenState) => {
    var padding = a + 6;
    return (
      data &&
      data?.children?.map((cmtData, index) => {
        return (
          <div
            className="ideaCommentListsChild ideaCommentListsChild-f"
            key={'commentList_' + index}
            style={{ marginLeft: padding }}
          >
            <div>
              <div className="box-content mb-1">
                <div className="reply_user_name">
                  <label className="mb-0">
                    {cmtData?.createdBy?.firstname +
                      ' ' +
                      cmtData?.createdBy?.lastname}
                    &nbsp;
                    <span style={{ fontSize: 11, color: '#717074' }}>
                      {eepFormatDateTime(cmtData?.createdAt, true)}
                    </span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <img
                  src={getUserPicture(cmtData?.createdBy.id)}
                  alt="profile"
                  className="rounded-circle ideabox-profile-img-size ideabox-profile-img-size_"
                />
                <div
                  className="eep_command_posts"
                  id="parentElement"
                  dangerouslySetInnerHTML={{ __html: cmtData?.message }}
                />
              </div>
              {/* {cmtData?.message} */}
              {cmtData?.feedbackCommentAttach &&
                cmtData?.feedbackCommentAttach.length > 0 && (
                  <div className="eep_command_attachements eep_command_attachements_">
                    {cmtData?.feedbackCommentAttach.map(
                      (atthData, atthIndex) => {
                        return (
                          <div
                            className="eep_command_attachements_inner_content"
                            key={'cmdAtthList_' + atthIndex}
                          >
                            <Link
                              to="#"
                              data-target="#collapseBirthday"
                              data-toggle="modal"
                              style={{ color: '#fff' }}
                              onClick={() =>
                                setState({
                                  ...state,
                                  more: cmtData?.feedbackCommentAttach,
                                })
                              }
                            >
                              <img
                                src={
                                  // atthData.docByte?.image
                                  atthData.contentType
                                    ? fileTypeAndImgSrcArray[
                                        atthData.contentType
                                      ]
                                    : fileTypeAndImgSrcArray['default']
                                }
                                className="image-circle c1 replayIconSize"
                                alt="icon"
                                title={atthData?.ideaAttachmentsFileName}
                              />
                            </Link>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              <div
                className="item_blog_like_a_feedback item_blog_like_a_feedback_ text-left mb-2"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <ReactTooltip
                  effect="solid"
                  id={`tooltip_likes${cmtData?.message}`}
                >
                  {cmtData?.feedbackCommentLikes
                    ?.map((c) => c?.users?.username)
                    ?.join(', ')
                    ?.replaceAll(loggedUserData?.username, 'You')}
                </ReactTooltip>

                {!isIdeaLiked(
                  loggedUserData.id,
                  cmtData?.feedbackCommentLikes
                ) && (
                  <div
                    className="heartCount"
                    data-tip
                    data-for={
                      cmtData?.feedbackCommentLikes?.length > 0 &&
                      `tooltip_likes${cmtData?.message}`
                    }
                  >
                    {cmtData?.feedbackCommentLikes?.length > 0
                      ? cmtData?.feedbackCommentLikes?.length
                      : ''}{' '}
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`}
                      alt="like"
                      className="post_heart"
                      onClick={() =>
                        likeAnFeedHandler({ isLike: true, iData: cmtData })
                      }
                    />
                  </div>
                )}

                {isIdeaLiked(
                  loggedUserData.id,
                  cmtData?.feedbackCommentLikes
                ) && (
                  <div
                    className="heartCount"
                    data-tip
                    data-for={
                      cmtData?.feedbackCommentLikes?.length > 0 &&
                      `tooltip_likes${cmtData?.message}`
                    }
                  >
                    {cmtData?.feedbackCommentLikes?.length > 0
                      ? cmtData?.feedbackCommentLikes?.length
                      : ''}{' '}
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`}
                      alt="Dislike"
                      className="post_heart"
                      onClick={() =>
                        likeAnFeedHandler({ isLike: false, iData: cmtData })
                      }
                    />
                  </div>
                )}
              </div>

              {renderChildComponentCildren(cmtData, padding, setOpenState)}
            </div>
          </div>
        );
      })
    );
  };

  const renderChildComponent = (data, a, setOpenState) => {
    var padding = a + 6;
    return (
      data &&
      data?.children?.map((cmtData, index) => {
        return (
          <div
            className="ideaCommentListsChild ideaCommentListsChild-f"
            key={'commentList_' + index}
          >
            <div>
              <div className="box-content mb-1">
                <div className="reply_user_name">
                  <label className="mb-0">
                    {cmtData?.createdBy?.firstname +
                      ' ' +
                      cmtData?.createdBy?.lastname}
                    &nbsp;
                    <span style={{ fontSize: 11, color: '#717074' }}>
                      {eepFormatDateTime(cmtData?.createdAt, true)}
                    </span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <img
                  src={getUserPicture(cmtData?.createdBy.id)}
                  alt="profile"
                  className="rounded-circle ideabox-profile-img-size ideabox-profile-img-size_"
                />
                <div
                  className="eep_command_posts"
                  id="parentElement"
                  dangerouslySetInnerHTML={{ __html: cmtData?.message }}
                />
              </div>
              {cmtData?.feedbackCommentAttach &&
                cmtData?.feedbackCommentAttach.length > 0 && (
                  <div className="eep_command_attachements eep_command_attachements_">
                    {cmtData?.feedbackCommentAttach.map(
                      (atthData, atthIndex) => {
                        return (
                          <div
                            className="eep_command_attachements_inner_content"
                            key={'cmdAtthList_' + atthIndex}
                          >
                            <Link
                              to="#"
                              data-target="#collapseBirthday"
                              data-toggle="modal"
                              style={{ color: '#fff' }}
                              onClick={() =>
                                setState({
                                  ...state,
                                  more: cmtData?.feedbackCommentAttach,
                                })
                              }
                            >
                              {' '}
                              {/* <a href={atthData.docByte?.image} target="_thapa" download={atthData?.ideaAttachmentsFileName}> */}
                              <img
                                src={
                                  // atthData.docByte?.image
                                  atthData.contentType
                                    ? fileTypeAndImgSrcArray[
                                        atthData.contentType
                                      ]
                                    : fileTypeAndImgSrcArray['default']
                                }
                                className="image-circle c1 replayIconSize"
                                alt="icon"
                                title={atthData?.ideaAttachmentsFileName}
                              />
                              {/* </a> */}
                            </Link>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              <div
                className="item_blog_like_a_feedback item_blog_like_a_feedback_ text-left mb-2"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <ReactTooltip
                  effect="solid"
                  id={`tooltip_likes${cmtData?.message}`}
                >
                  {cmtData?.feedbackCommentLikes
                    ?.map((c) => c?.users?.username)
                    ?.join(', ')
                    ?.replaceAll(loggedUserData?.username, 'You')}
                </ReactTooltip>
                {!isIdeaLiked(
                  loggedUserData.id,
                  cmtData?.feedbackCommentLikes
                ) && (
                  <div
                    className="heartCount"
                    data-tip
                    data-for={
                      cmtData?.feedbackCommentLikes?.length > 0 &&
                      `tooltip_likes${cmtData?.message}`
                    }
                  >
                    {cmtData?.feedbackCommentLikes?.length > 0
                      ? cmtData?.feedbackCommentLikes?.length
                      : ''}{' '}
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`}
                      alt="like"
                      className="post_heart"
                      onClick={() =>
                        likeAnFeedHandler({ isLike: true, iData: cmtData })
                      }
                    />
                  </div>
                )}
                {isIdeaLiked(
                  loggedUserData.id,
                  cmtData?.feedbackCommentLikes
                ) && (
                  <div
                    className="heartCount"
                    data-tip
                    data-for={
                      cmtData?.feedbackCommentLikes?.length > 0 &&
                      `tooltip_likes${cmtData?.message}`
                    }
                  >
                    {cmtData?.feedbackCommentLikes?.length > 0
                      ? cmtData?.feedbackCommentLikes?.length
                      : ''}{' '}
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`}
                      alt="Dislike"
                      className="post_heart"
                      onClick={() =>
                        likeAnFeedHandler({ isLike: false, iData: cmtData })
                      }
                    />
                  </div>
                )}
                &nbsp;<span style={{ color: 'lightgray' }}>●</span>&nbsp;
                <span
                  onClick={() => handleCommand(cmtData)}
                  className="text-left mb-0 eep_dt replay"
                >
                  Reply
                </span>
              </div>

              {cmtData?.children?.length > 0 && (
                <div
                  className="view-more-line"
                  onClick={() =>
                    setOpenState(cmtData?.id == isOpen ? '' : cmtData?.id)
                  }
                >
                  <div></div>
                  {cmtData?.children?.length +
                    (cmtData?.children?.length <= 1
                      ? ' Reply'
                      : ' Replies')}{' '}
                </div>
              )}

              {isOpen === cmtData?.id &&
                renderChildComponentCildren(cmtData, padding, setOpenState)}
            </div>
          </div>
        );
      })
    );
  };

  let carouselData = [];
  let carouselPdfData = [];
  const fil = ideaDetail?.feedbackAttachmentFileName?.map((v) => {
    if (!v.docByte?.image?.includes('.pdf')) {
      return carouselData.push(v);
    }
  });

  const fils = ideaDetail?.feedbackAttachmentFileName?.map((v) => {
    if (v.docByte?.image?.includes('.pdf')) {
      return carouselPdfData.push(v);
    }
  });

  const onEmojiClose = () => {
    setTimeout(() => {
      if (state?.openicon === true) {
        setState({ ...state, openicon: false });
      }
    }, 500);
  };
  useEffect(() => {
    if (state?.openicon === true) {
      const handleClickOutside = (event) => {
        if (emojiIdRef.current && !emojiIdRef.current.contains(event.target)) {
          onEmojiClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [onEmojiClose]);
  const toggleEmojiPicker = (e) => {
    // e.stopPropagation();
    if (state?.openicon === false) {
      IsClear();
      setState((prev) => ({ ...prev, openicon: !prev.openicon }));
    }
  };
  return (
    <React.Fragment>
      {state?.more?.length > 0 && (
        <FeedbackDetailViewMore
          data={state?.more}
          onClearMore={onClearMore}
        />
      )}
      {ideaDetail && Object.keys(ideaDetail)?.length > 0 && (
        <React.Fragment>
          <div onClick={() => {}}>
            <div className="sticky-top  bg-efefef right_profile_div_r right_profile_div_r-feed">
              <div className="ideabox-profile-expand-container ideabox-profile-expand-container-header">
                <div className="ideabox-profile-expand-container header-content-wrapperone align-items-center">
                  <div
                    className="rounded-circle"
                    style={{ fontSize: 33, marginRight: '6px' }}
                  >
                    <img src={emojiOptions[ideaDetail?.logo]?.iconActive} />
                  </div>
                  {/* <img src={getUserPicture(ideaDetail.createdBy.id)} alt="profile" className="rounded-circle" /> */}
                  <div className="wrapper-one-content ">
                    <div className="ideabox-font-style pb-1 header-user-name font-helvetica-m">
                      {ideaDetail?.title}
                    </div>
                    <div className="header-user-destination ideabox_contentt_size">
                      {emojiOptions[ideaDetail?.logo]?.title}
                    </div>
                  </div>
                </div>
                <div className="ideabox-profile-expand-inner-container header-content-wrapper-two">
                  <div className="header-user-post-date ideabox_contentt_size ideabox-date">
                    {formatDates(ideaDetail.createdAt, true)}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ display: 'flex' }}
              // onClick={onEmojiClose}
            >
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <span className="image_chat">
                    <img
                      src={
                        ideaDetail?.show_as === 'Anonymous'
                          ? '/images/icons8-account-50.svg'
                          : getUserPicture(ideaDetail?.createdBy?.id)
                      }
                      alt="profile"
                      className="rounded-circle"
                      style={{
                        width: ideaDetail?.show_as !== 'Anonymous' && '100%',
                        margin: ideaDetail?.show_as === 'Anonymous' && 'auto',
                      }}
                    />
                  </span>
                  <div
                    className="ideabox-font-style ideacontent_heading_feedback ideabox_contentt_size font-helvetica-m"
                    style={{ margin: 0, padding: '10px 10px 0px 10px' }}
                  >
                    {ideaDetail?.show_as}
                  </div>
                </div>

                <div
                  className="ideabox_ideacontent msg_content"
                  style={{ width: 'unset' }}
                >
                  <p className="ideacontent_content ideabox_contentt_size">
                    <div
                      id="parentElement"
                      dangerouslySetInnerHTML={{
                        __html: ideaDetail?.description,
                      }}
                    />
                  </p>
                  {carouselData?.length > 0 && (
                    <div
                      className="w-100 bg-f5f5f5 attachment_toggle_feedback eep_scroll_y"
                      style={{ maxHeight: '75px' }}
                    >
                      <div className="attachement-display-flex">
                        {carouselData?.slice(0, 3).map((atthData, index) => {
                          if (!atthData.docByte?.image?.includes('.pdf')) {
                            return (
                              <div
                                className="attachment_parent"
                                key={'attachmentLists_' + index}
                              >
                                <Link
                                  to="#"
                                  data-target="#collapseBirthday"
                                  data-toggle="modal"
                                  style={{ color: '#fff' }}
                                  onClick={() =>
                                    setState({ ...state, more: carouselData })
                                  }
                                >
                                  <img
                                    src={
                                      atthData.docByte?.image
                                        ? atthData.docByte?.image
                                        : fileTypeAndImgSrcArray['default']
                                    }
                                    className="image-circle c1 attachment_image_size"
                                    alt="icon"
                                    title={atthData.ideaAttachmentsFileName}
                                  />
                                </Link>
                              </div>
                            );
                          }
                        })}
                        {carouselData?.slice(3, carouselData?.length)
                          ?.length !== 0 && (
                          <div
                            className="attachment_parent_feedback_more"
                            key={'attachmentLists_'}
                          >
                            <Link
                              to="#"
                              data-target="#collapseBirthday"
                              data-toggle="modal"
                              style={{ color: '#fff' }}
                              onClick={() =>
                                setState({ ...state, more: carouselData })
                              }
                            >
                              {'+' +
                                carouselData?.slice(3, carouselData?.length)
                                  ?.length}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {carouselPdfData?.length > 0 && (
                    <div
                      className="w-100 bg-f5f5f5 attachment_toggle_feedback eep_scroll_y"
                      style={{ maxHeight: '75px' }}
                    >
                      <div className="attachement-display-flex">
                        {carouselPdfData?.slice(0, 3).map((atthData, index) => {
                          if (atthData.docByte?.image?.includes('.pdf')) {
                            return (
                              <div
                                className="attachment_parent"
                                key={'attachmentLists_' + index}
                              >
                                <img
                                  src={
                                    '/images/icons8-downloading-updates-50.svg'
                                  }
                                  alt="profile"
                                  className="feedback-download-profile-img-size rounded-circle"
                                />
                                <a
                                  className="c1"
                                  href={atthData.docByte?.image}
                                  target="_thapa"
                                  download={atthData.ideaAttachmentsFileName}
                                >
                                  <div className="to_show_pdf_list">
                                    <img
                                      src={'/images/pdfIcon.png'}
                                      alt="icon"
                                    />
                                  </div>
                                </a>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                  <div className="item_blog_like_a_feedback text-left mb-2">
                    <div style={{ display: 'flex' }}>
                      {ideaDetail?.feedbackLikes &&
                        Object.keys(ideaDetail?.feedbackLikes)?.map((v, i) => {
                          return (
                            <>
                              <ReactTooltip
                                effect="solid"
                                id={`tooltip${i}${v}`}
                              >
                                {ideaDetail?.feedbackLikes?.[v]
                                  ?.map((c) => c?.username)
                                  ?.join(', ')
                                  ?.replaceAll(loggedUserData?.username, 'You')}
                              </ReactTooltip>
                              <div
                                className="emoji"
                                data-tip
                                data-for={`tooltip${i}${v}`}
                                onClick={(e) => {
                                  onClickEmoji(
                                    ideaDetail?.feedbackLikes?.[v]?.find(
                                      (c) => c.emoji?.unified === v
                                    )?.emoji,
                                    ideaDetail
                                  );
                                }}
                              >
                                <Emoji
                                  unified={v}
                                  size={16}
                                />
                                {
                                  ideaDetail?.feedbackLikes?.[v]?.map(
                                    (v) => v.username
                                  )?.length
                                }
                              </div>
                            </>
                          );
                        })}
                    </div>
                    <div className="eep-dropdown-divider"></div>

                    <div className="parent">
                      <div>
                        {' '}
                        <span
                          className={'c1'}
                          onClick={(e) => toggleEmojiPicker(e)}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/Canvas.svg`}
                            alt="like"
                            className="post_heart"
                          />
                          &nbsp;React
                        </span>
                        <span
                          className={'c1 c2'}
                          onClick={() => handleCommand()}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/icons8-comments-50-2.svg`}
                            alt="command"
                            className="post_heart"
                          />
                          &nbsp;Comment{' '}
                        </span>
                      </div>

                      <div
                        className="replay"
                        onClick={() => {
                          setIsDetailListMode(!isDetailListMode);
                          handleCommand('replay', !isDetailListMode);
                        }}
                      >
                        {ideaDetail?.children?.length === 0
                          ? 'No '
                          : ideaDetail?.children?.length}{' '}
                        {ideaDetail?.children?.length === 1
                          ? ' Comment'
                          : ' Comments'}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ width: '100%', maxWidth: '500px' }}
                    // onClick={() => onEmojiClose()}
                    id="emojiId"
                    ref={emojiIdRef}
                  >
                    {state?.openicon && (
                      <EmojiPicker
                        onEmojiClick={(e) => onClickEmoji(e, ideaDetail)}
                        suggestedEmojisMode={SuggestionMode.FREQUENT}
                      />
                    )}
                  </div>
                  {isDetailListMode && ideaDetail?.children?.length > 0 && (
                    <React.Fragment>
                      {renderChildComponent(ideaDetail, 0, setOpen)}
                      <br />
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      {ideaDetail && Object.keys(ideaDetail).length <= 0 && (
        <ResponseInfo
          title="Fetching property data. Please wait for the response."
          responseImg="noRecord"
          responseClass="response-err eep_blank_message"
        />
      )}
    </React.Fragment>
  );
};

export default FeedbackDetailViewInner;

import React, { useEffect, useState } from 'react';
import { eepFormatDateTime } from '../../shared/SharedService';
import ResponseInfo from '../../UI/ResponseInfo';
import ReactTooltip from 'react-tooltip';
import { fileTypeAndImgSrcArray } from '../../helpers';

const IdeaDetailViewInner = (props) => {
  const { ideaDetail, usersPic, likeAnIdea, isDetailView } = props;

  const initIsDetailView = isDetailView ? isDetailView : false;
  const [toggleAttachements, setToggleAttachements] = useState(false);
  const loggedUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const [isDetailListMode, setIsDetailListMode] = useState(true);

  useEffect(() => {
    if (initIsDetailView) {
      setIsDetailListMode(false);
    } else {
      setIsDetailListMode(true);
    }
  }, [initIsDetailView]);

  const toggleAttachement = () => {
    setToggleAttachements(!toggleAttachements);
  };

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  let iLikedIndex;
  const isIdeaLiked = (uID, ideaLikes) => {
    iLikedIndex = ideaLikes.findIndex((x) => x.userId?.user_id === uID);
    if (iLikedIndex !== -1) {
      return { isLiked: true, likedID: ideaLikes[iLikedIndex].id };
    } else {
      return { isLiked: false, likedID: null };
    }
  };

  const likeAnIdeaHandler = (arg) => {
    likeAnIdea(arg);
  };

  return (
    <React.Fragment>
      {ideaDetail && Object.keys(ideaDetail).length > 0 && (
        <React.Fragment>
          <div className="ideabox-border bg-efefef sticky-top right_profile_div_r">
            <div className="ideabox-profile-expand-container ideabox-profile-expand-container-header">
              <div className="ideabox-profile-expand-container header-content-wrapperone align-items-center">
                <img
                  style={{ marginRight: '6px' }}
                  src={getUserPicture(ideaDetail.createdBy.id)}
                  alt="profile"
                  className="ideabox-profile-img-size rounded-circle"
                />
                <div className="wrapper-one-content ">
                  <div className="ideabox-font-style pb-1 header-user-name font-helvetica-m">
                    {ideaDetail.createdBy?.firstname +
                      ' ' +
                      ideaDetail.createdBy?.lastname}
                  </div>
                  <div className="header-user-destination ideabox_contentt_size">
                    {ideaDetail.createdBy?.designation}
                  </div>
                </div>
              </div>
              <div className="ideabox-profile-expand-inner-container header-content-wrapper-two">
                <div className="header-user-post-date ideabox_contentt_size ideabox-date">
                  {eepFormatDateTime(ideaDetail.createdAt)}
                </div>

                {ideaDetail.ideaAttachmentFileName.length > 0 && (
                  <div className="attachment_icon header_user_attachement">
                    <div
                      className="header_user_attachement_inner"
                      onClick={toggleAttachement}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/images/icons/tables/attachment.svg`}
                        alt="star"
                        className="ideabox-star-img-size"
                      />
                      <span className="ideabox_atthment_txt">
                        {ideaDetail.ideaAttachmentFileName.length}{' '}
                        {ideaDetail.ideaAttachmentFileName?.length === 1
                          ? 'File Attached'
                          : 'Files Attached'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {toggleAttachements &&
              ideaDetail.ideaAttachmentFileName.length > 0 && (
                <div
                  className="w-100 bg-f5f5f5 attachment_toggle eep_scroll_y"
                  style={{ maxHeight: '75px' }}
                >
                  <div className="attachement-display-flex">
                    {ideaDetail.ideaAttachmentFileName.map(
                      (atthData, index) => {
                        return (
                          <div
                            className="attachment_parent"
                            key={'attachmentLists_' + index}
                          >
                            <a
                              className="c1"
                              href={atthData.docByte?.image}
                              target="_thapa"
                              download={atthData.ideaAttachmentsFileName}
                            >
                              <img
                                src={
                                  // atthData.docByte?.image ? atthData.docByte?.image
                                  fileTypeAndImgSrcArray[atthData.contentType]
                                    ? fileTypeAndImgSrcArray[
                                        atthData.contentType
                                      ]
                                    : fileTypeAndImgSrcArray['default']
                                }
                                className="image-circle c1 attachment_image_size"
                                alt="icon"
                                title={atthData.ideaAttachmentsFileName}
                              />
                            </a>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
          </div>

          <div className="ideabox_ideacontent">
            <p
              className="ideabox-font-style ideacontent_heading ideabox_contentt_size font-helvetica-m"
              style={{ fontWeight: '500' }}
            >
              {ideaDetail.title}
            </p>
            <p className="ideacontent_content ideabox_contentt_size">
              {ideaDetail.description}
            </p>
            <ReactTooltip
              effect="solid"
              id={`tooltip${ideaDetail?.id}`}
            >
              {ideaDetail?.ideaLikes
                ?.map((c) =>
                  c?.userId?.username === loggedUserData?.username
                    ? 'You'
                    : c?.userId?.firstname
                )
                ?.join(', ')
                ?.replaceAll(loggedUserData?.username, 'You')}
            </ReactTooltip>
            <div
              className="item_blog_like_a  mb-2"
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <div
                data-tip
                data-for={`tooltip${ideaDetail?.id}`}
              >
                <span className={isDetailListMode ? 'c1' : ''}>
                  {isIdeaLiked(loggedUserData.id, ideaDetail.ideaLikes)
                    .isLiked &&
                    isDetailListMode && (
                      <img
                        src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`}
                        alt="Dislike"
                        title=""
                        className="post_heart"
                        onClick={() =>
                          likeAnIdeaHandler({
                            isLike: false,
                            iData: ideaDetail,
                          })
                        }
                      />
                    )}
                  {isIdeaLiked(loggedUserData.id, ideaDetail.ideaLikes)
                    .isLiked &&
                    !isDetailListMode && (
                      <img
                        src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`}
                        alt="Dislike"
                        title=""
                        className="post_heart"
                      />
                    )}
                </span>
              </div>
              <span className={isDetailListMode ? 'c1' : ''}>
                {!isIdeaLiked(loggedUserData.id, ideaDetail.ideaLikes)
                  .isLiked &&
                  isDetailListMode && (
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`}
                      alt="like"
                      title="Dislike"
                      className="post_heart"
                      onClick={() =>
                        likeAnIdeaHandler({ isLike: true, iData: ideaDetail })
                      }
                    />
                  )}

                {!isIdeaLiked(loggedUserData.id, ideaDetail.ideaLikes)
                  .isLiked &&
                  !isDetailListMode && (
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`}
                      alt="like"
                      title="Dislike"
                      className="post_heart"
                    />
                  )}
              </span>
              {ideaDetail.ideaLikes.length > 0 && (
                <span
                  className="text-right i_like_count ideabox_contentt_size"
                  style={{ marginLeft: '5px' }}
                >
                  {ideaDetail?.ideaLikes?.length}{' '}
                  {ideaDetail?.ideaLikes?.length === 1 ? ' Like' : ' Likes'}
                </span>
              )}
            </div>

            {ideaDetail.ideaComments.length > 0 && (
              <React.Fragment>
                {!isDetailListMode &&
                  ideaDetail.ideaComments
                    .sort((a, b) => (a.id > b.id ? 1 : -1))
                    .map((cmtData, index) => {
                      return (
                        <div
                          className="ideaCommentLists p-2"
                          key={'commentList_' + index}
                        >
                          <div className="box-content mb-1">
                            <img
                              src={getUserPicture(cmtData.createdBy.id)}
                              alt="profile"
                              className="ideabox-profile-img-size rounded-circle"
                            />
                            <div className="reply_user_name">
                              <label className="mb-0">
                                {cmtData.createdBy?.firstname +
                                  ' ' +
                                  cmtData.createdBy?.lastname}
                              </label>
                            </div>
                          </div>
                          <p className="eep_command_posts">
                            {cmtData.comments}
                          </p>
                          {cmtData.ideaCommentAttach &&
                            cmtData.ideaCommentAttach.length > 0 && (
                              <div className="eep_command_attachements">
                                {cmtData.ideaCommentAttach.map(
                                  (atthData, atthIndex) => {
                                    return (
                                      <div
                                        className="eep_command_attachements_inner_content"
                                        key={'cmdAtthList_' + atthIndex}
                                      >
                                        <a
                                          className="c1"
                                          href={atthData.docByte?.image}
                                          target="_thapa"
                                          download={
                                            atthData.ideaAttachmentsFileName
                                          }
                                        >
                                          <img
                                            src={
                                              atthData.contentType
                                                ? // ? atthData.docByte?.image
                                                  // : fileTypeAndImgSrcArray[
                                                  //     atthData.contentType
                                                  //   ]
                                                  fileTypeAndImgSrcArray[
                                                    atthData.contentType
                                                  ]
                                                : fileTypeAndImgSrcArray[
                                                    'default'
                                                  ]
                                            }
                                            className="image-circle c1 attach_img_sm"
                                            alt="icon"
                                            title={
                                              atthData.ideaAttachmentsFileName
                                            }
                                          />
                                        </a>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          <p className="text-right mb-0 eep_dt">
                            {eepFormatDateTime(cmtData.createdAt)}
                          </p>
                        </div>
                      );
                    })}
                {!isDetailView && (
                  <div className="comment_length text-right mt-2">
                    {isDetailListMode && (
                      <div
                        className="v_commants v_post_comments c1 ideabox_contentt_size"
                        onClick={() => setIsDetailListMode(false)}
                      >
                        <label className="idea_viewComments c1">
                          Show all <span>{ideaDetail.ideaComments.length}</span>{' '}
                          <span>
                            {ideaDetail.ideaComments.length === 1
                              ? 'Comment'
                              : 'Comments'}
                          </span>
                        </label>
                      </div>
                    )}
                    {!isDetailListMode && (
                      <div
                        className="v_commants v_post_comments c1 ideabox_contentt_size"
                        onClick={() => setIsDetailListMode(true)}
                      >
                        <label className="idea_viewComments c1">
                          View less
                        </label>{' '}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            )}

            <div className="view_commants_div view_commants_div_iteam">
              <div className="view_commants_div_innercontainer">
                <div className="box ideaBox_comment p-2">
                  <div className="box-content mb-1">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/profile/avatar7.png`}
                      alt="profile"
                      className="ideabox-profile-img-size rounded-circle"
                    />
                    <div className="reply_user_name">
                      <label className="ideabox_user_name_size">
                        Roche Sean
                      </label>
                    </div>
                  </div>
                  <p
                    className="mb-0 ideabox_contentt_size idea_comments"
                    id="idea_comments"
                  ></p>
                  <div className="eep_command_attachements"></div>
                  <p className="text-right mb-0 ideabox_contentt_size">
                    25/06/2021
                  </p>
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

export default IdeaDetailViewInner;

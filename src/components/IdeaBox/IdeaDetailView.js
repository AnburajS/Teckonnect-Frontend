import React, { useEffect, useState } from 'react';
import IdeaComments from './IdeaComments';
import IdeaDetailViewInner from './IdeaDetailViewInner';
import ResponseInfo from '../../UI/ResponseInfo';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';

const IdeaDetailView = (props) => {
  const { ideaData, usersPic, setIdeaDataState } = props;

  const initIdeaDetail = ideaData ? ideaData : null;
  const loggedUserData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const [ideaDetail, setIdeaDetail] = useState(null);
  const [isCommentSubmitted, setIsCommentSubmitted] = useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  let iLikedIndex;
  const isIdeaLiked = (uID, ideaLikes) => {
    iLikedIndex = ideaLikes.findIndex((x) => x.userId.user_id === uID);
    if (iLikedIndex !== -1) {
      return { isLiked: true, likedID: ideaLikes[iLikedIndex].id };
    } else {
      return { isLiked: false, likedID: null };
    }
  };

  const fetchIdeaDetail = () => {
    const obj = {
      url: URL_CONFIG.IDEA_BY_ID + '?id=' + ideaData.id,
      method: 'get',
    };
    httpHandler(obj)
      .then((iData) => {
        setIdeaDetail(iData.data);
        setIdeaDataState(true);
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };

  useEffect(() => {
    if (initIdeaDetail) {
      fetchIdeaDetail();
    }
  }, [initIdeaDetail]);

  const commentSubmitHandler = (cmtData) => {
    setIsCommentSubmitted(false);
    let formData = new FormData();
    if (cmtData.files && cmtData.files.length > 0) {
      cmtData.files.map((item) => {
        formData.append('file', item);
        return item;
      });
    }
    const ideaCommentsRequestObj = {
      comments: cmtData.commentValue,
      idea: {
        id: ideaDetail.id,
      },
    };
    formData.append(
      'ideaCommentsRequest',
      JSON.stringify(ideaCommentsRequestObj)
      //  new Blob([JSON.stringify(ideaCommentsRequestObj)], { type: 'application/json'})
    );

    const obj = {
      url: URL_CONFIG.IDEA_COMMENT,
      method: 'post',
      formData: formData,
    };
    httpHandler(obj)
      .then(() => {
        setIsCommentSubmitted(true);
        fetchIdeaDetail();
      })
      .catch((error) => {
        const errMsg =
          error.response?.data?.message !== undefined
            ? error.response?.data?.message
            : 'Oops! Something went wrong. Please contact administrator.';
        setShowModal({
          ...showModal,
          type: 'danger',
          message: errMsg,
        });
      });
  };

  const likeAnIdea = (likeInfo) => {
    let obj;
    if (likeInfo.isLike) {
      obj = {
        url: URL_CONFIG.IDEA_LIKE_DISLIKE,
        //  + "?id=" + likeInfo.iData.id,
        payload: { id: likeInfo.iData.id },
        method: 'post',
      };
    }
    if (!likeInfo.isLike) {
      let likedInfoData = isIdeaLiked(
        loggedUserData.id,
        likeInfo.iData.ideaLikes
      );
      if (likedInfoData.isLiked) {
        obj = {
          url: URL_CONFIG.IDEA_LIKE_DISLIKE,
          //  + "?id=" + likedInfoData.likedID,
          payload: { id: likedInfoData.likedID },
          method: 'put',
        };
      }
    }

    httpHandler(obj)
      .then(() => {
        if (likeInfo.isLike) {
          fetchIdeaDetail();
        }
        if (!likeInfo.isLike) {
          let ideaDetailTemp = JSON.parse(JSON.stringify(ideaDetail));
          let iLikedIndexx = ideaDetailTemp.ideaLikes.findIndex(
            (x) => x.userId.user_id === loggedUserData.id
          );
          if (iLikedIndexx !== -1) {
            ideaDetailTemp.ideaLikes.splice(iLikedIndexx, 1);
            setIdeaDetail({ ...ideaDetailTemp });
          }
        }
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };
  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      {ideaDetail && Object.keys(ideaDetail).length > 0 && (
        <React.Fragment>
          <div className="ideabox_mesgbutton_wrapper">
            <IdeaDetailViewInner
              ideaDetail={ideaDetail}
              usersPic={usersPic}
              likeAnIdea={likeAnIdea}
              isDetailView={false}
            />
            <IdeaComments
              commentSubmitHandler={commentSubmitHandler}
              isCommentSubmitted={isCommentSubmitted}
            />
          </div>
        </React.Fragment>
      )}
      {ideaDetail && Object.keys(ideaDetail).length <= 0 && (
        <div
          className="ideabox_mesgbutton_wrapper h-100"
          style={{ display: 'flex' }}
        >
          <ResponseInfo
            title="Not able to fetch property data. Please try again from beginning."
            responseImg="noRecord"
            responseClass="response-err eep_blank_message"
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default IdeaDetailView;

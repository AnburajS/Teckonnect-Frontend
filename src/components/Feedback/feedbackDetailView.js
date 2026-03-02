import React, { useEffect, useState } from 'react';
import ResponseInfo from '../../UI/ResponseInfo';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import FeedbackComments from './feedbackComments';
import FeedbackDetailViewInner from './feedbackDetailViewInner';

const FeedbackDetailView = (props) => {
  const { ideaData, usersPic } = props;
  const [state, setState] = useState({
    isComment: false,
    isCommentData: null,
    childData: null,
  });

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

  const fetchIdeaDetail = () => {
    const obj = {
      // url: URL_CONFIG.IDEA_BY_ID + "?id=" + 19,
      url: URL_CONFIG.FEEDBACK_BY_ID + '?id=' + ideaData.id,
      method: 'get',
    };
    httpHandler(obj)
      .then((iData) => {
        setIdeaDetail(iData.data);
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
      setIdeaDetail(null);
      fetchIdeaDetail();
    }
  }, [initIdeaDetail]);

  const commentSubmitHandler = async (cmtData) => {
    setIsCommentSubmitted(false);
    let files = [];
    if (cmtData?.files && cmtData?.files?.length > 0) {
      for (const item of cmtData.files) {
        let formData = new FormData();
        formData.append('image', item);
        const obj = {
          url: URL_CONFIG.UPLOAD_FILES,
          method: 'post',
          payload: formData,
        };
        await httpHandler(obj).then((res) => {
          files.push(res?.data?.data?.[0]?.url);
        });
      }
    }
    const ideaCommentsRequestObj = {
      comments: cmtData.commentValue,
      id: state.isCommentData?.id,
      files,
      parent_id: state.isCommentData?.parent_id,
    };

    const obj = {
      url: URL_CONFIG.FEEDBACK_COMMENT,
      method: 'post',
      payload: { ...ideaCommentsRequestObj },
    };
    httpHandler(obj)
      .then(() => {
        setIsCommentSubmitted(true);
        fetchIdeaDetail();
        setState({ ...state, isComment: false });
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

  const likeAnFeed = (likeInfo) => {
    let obj = {
      url: URL_CONFIG.FEEDBACK_LIKE_DISLIKE_CHILD,
      payload: {
        id: likeInfo?.iData?.id,
        emojiData: likeInfo?.emojiData,
        dlt_id: likeInfo?.iData?.feedbackLikes?.[0]?.id,
      },
      method: 'post',
    };

    httpHandler(obj)
      .then(() => {
        fetchIdeaDetail();
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };

  const likeAnIdea = (likeInfo) => {
    let obj = {
      url: URL_CONFIG.FEEDBACK_LIKE_DISLIKE,
      payload: {
        id: likeInfo?.iData?.id,
        emojiData: likeInfo?.emojiData,
        dlt_id: likeInfo?.iData?.feedbackLikes?.[0]?.id,
      },
      method: 'post',
    };

    httpHandler(obj)
      .then(() => {
        fetchIdeaDetail();
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };

  const likeAnIdeaChild = (likeInfo) => {
    let obj = {
      url: URL_CONFIG.FEEDBACK_LIKE_DISLIKE_CHILD,
      payload: {
        id: likeInfo?.iData?.id,
        emojiData: likeInfo?.emojiData,
        dlt_id: likeInfo?.iData?.feedbackLikes?.[0]?.id,
      },
      method: 'post',
    };

    httpHandler(obj)
      .then(() => {
        fetchIdeaDetail();
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });
  };

  const handleCommand = (childData, bool) => {
    if (childData === 'replay') {
      setState({
        ...state,
        isComment: !bool && false,
        isCommentData: null,
        childData: null,
      });
      return;
    }
    setState({
      ...state,
      isComment: childData?.id ? true : !state?.isComment,
      isCommentData: { id: ideaDetail.id, parent_id: childData?.id },
      childData: childData ?? null,
    });
  };

  const IsClear = () => {
    setState({
      ...state,
      isComment: false,
      isCommentData: null,
      childData: null,
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
            <FeedbackDetailViewInner
              IsClear={IsClear}
              likeAnIdeaChild={likeAnIdeaChild}
              handleCommand={handleCommand}
              ideaDetail={ideaDetail}
              usersPic={usersPic}
              likeAnFeed={likeAnFeed}
              likeAnIdea={likeAnIdea}
              isDetailView={false}
            />

            {state?.isComment && (
              <FeedbackComments
                IsClear={IsClear}
                childReplay={state?.childData}
                commentSubmitHandler={commentSubmitHandler}
                isCommentSubmitted={isCommentSubmitted}
              />
            )}
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

export default FeedbackDetailView;

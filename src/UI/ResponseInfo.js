import React from 'react';

let imgSrc = {
  noRecord: process.env.PUBLIC_URL + '/images/icons/static/noData.svg',
  noIdeaShare: process.env.PUBLIC_URL + '/images/icons/static/noIdeaShare.png',
  noForumShare:
    process.env.PUBLIC_URL + '/images/icons/static/noForumShare.svg',
  accessDenied:
    process.env.PUBLIC_URL + '/images/icons/static/accessDenied.svg',
  noNotifications:
    process.env.PUBLIC_URL + '/images/icons/static/noNotofication.svg',
  noHotTopics: process.env.PUBLIC_URL + '/images/icons/static/noHotTopics.svg',
  noFollowing: process.env.PUBLIC_URL + '/images/icons/static/noFollowing.svg',
};

const ResponseInfo = (props) => {
  const { title, responseImg, responseClass, messageInfo, subMessageInfo } =
    props;

  return (
    <div className="eep_blank_div">
      <img
        src={imgSrc[responseImg]}
        alt="Response Img"
      />
      <p className={responseClass ? responseClass : 'eep_blank_message'}>
        {title}
      </p>
      {messageInfo && <p className="eep_blank_quote">{messageInfo}</p>}
      {subMessageInfo && (
        <p className="eep_blank_quote_by">
          - <em>{subMessageInfo}</em>-{' '}
        </p>
      )}
    </div>
  );
};

export default ResponseInfo;

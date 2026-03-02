import React from 'react';
import { Link } from 'react-router-dom';

const PendingData = (props) => {
  const { pendingDatas, togglePendingComponent, pendingType } = props;
  const maxListCount = pendingDatas?.length >= 5 ? 5 : pendingDatas?.length;

  return (
    <div className="pending-eep-container pending-survey-container">
      {pendingDatas &&
        pendingDatas?.length > 0 &&
        pendingDatas
          ?.sort((a, b) => (a.id < b.id ? 1 : -1))
          .map((pData, index) => {
            if (index < maxListCount) {
              return (
                <React.Fragment key={'pendingIndex_' + index}>
                  <Link
                    to={
                      pendingType === 'survey'
                        ? '/app/surveyanswer'
                        : pendingType === 'polls'
                        ? '/app/pollanswer'
                        : ''
                    }
                    state={
                      pendingType === 'survey'
                        ? { surveyData: pData }
                        : pendingType === 'polls'
                        ? { pollData: pData, viewType: 'fromPoll' }
                        : {}
                    }
                    onClick={togglePendingComponent}
                  >
                    <div className="pending-eep-notify pending-survey-notify">
                      <span className="notification-batch">
                        {' '}
                        {maxListCount - index}{' '}
                      </span>
                      <span className="pending-batch-line"></span>
                      <h2 className="pending-notification-title">
                        {pData[pendingType].name}
                      </h2>
                    </div>
                  </Link>
                </React.Fragment>
              );
            }
          })}
    </div>
  );
};
export default PendingData;

import React from 'react';
import { Link } from 'react-router-dom';

const ApprovalActions = (props) => {
  const { data, isApprovalState, isView } = props;

  return (
    <React.Fragment>
      <div className="ans-type text-center c1">
        {data.nominated && (
          <Link
            to={{
              pathname: '/app/nominationsapproval',
            }}
            state={{ awardData: data, isApproval: isApprovalState }}
          >
            {data.recognized && (
              <img
                src={`${process.env.PUBLIC_URL}/images/icons/static/EEPResult.svg`}
                // ApprovedResult ResultNew
                className="r_award_img selected"
                alt="Icon"
                title="Result"
                style={{ height: '25px' }}
              />
            )}
            {!data.recognized && (
              <img
                src={
                  isView
                    ? `${process.env.PUBLIC_URL}/images/icons/static/EEPView.svg`
                    : `${process.env.PUBLIC_URL}/images/icons/static/EEPProceed.svg`
                }
                className="r_award_img selected"
                alt="Icon"
                title="Proceed"
                style={{ height: '25px' }}
              />
            )}
          </Link>
        )}

        {!data?.nominated && (
          <Link
            to={{
              pathname: '/app/awardnominations',
            }}
            state={{ aData: data, isSpot: false }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/icons/static/EEPProceed.svg`}
              className="r_award_img selected"
              alt="Icon"
              title="Proceed"
              style={{ height: '25px' }}
            />
          </Link>
        )}
      </div>
    </React.Fragment>
  );
};
export default ApprovalActions;

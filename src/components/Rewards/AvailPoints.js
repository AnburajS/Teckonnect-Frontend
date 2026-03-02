import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
const AvailPoints = (props) => {
  const { pointsList } = props;
  let avilablePoint = pointsList?.availablePercentage ?? 0;
  let redeemPoint = pointsList?.redeemPercentage ?? 0;
  let avilablPercentright =
    avilablePoint > 0
      ? avilablePoint <= 50
        ? `rotate(${avilablePoint * 3.6}deg)`
        : `rotate(180deg)`
      : 'rotate(0deg)';
  let avilablPercentleft =
    avilablePoint > 0
      ? avilablePoint > 50
        ? `rotate(${avilablePoint * 1.8}deg)`
        : 'rotate(0deg)'
      : 'rotate(0deg)';
  let redeemPercentright =
    redeemPoint > 0
      ? redeemPoint <= 50
        ? `rotate(${redeemPoint * 3.6}deg)`
        : `rotate(180deg)`
      : '';
  let redeemPercentleft =
    redeemPoint > 0
      ? redeemPoint > 50
        ? `rotate(${redeemPoint * 1.8}deg)`
        : 'rotate(0deg)'
      : 'rotate(0deg)';

  return (
    <React.Fragment>
      <div className="myPointsLeft_inner sticky_position">
        <div className="availablePoints_div mb-3">
          <div className="displayPoints_div">
            <div className="displayPoints_head">
              <label className="displayPoints_label displayPoints_label mb-0">
                Available XP
              </label>
              {/* <div className="displayPoints_img_div">
                <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="displayPoints_img" alt="Points" title="Available Points" />
              </div> */}
            </div>
            <div className="displayPoints_content">
              {/* <div className="eep-progress">
                <span className="eep-progress-left">
                  <span className="eep-progress-bar eep-border-succ" style={{ transform: avilablPercentleft }}></span>
                </span>
                <span className="eep-progress-right">
                  <span className="eep-progress-bar eep-border-succ" style={{ transform: avilablPercentright }}></span>
                </span>
                <div className="eep-progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                  <div className="h6 font-weight-bold mb-0 displayPercentage_value"> {pointsList?.availablePercentage} % </div>
                </div>
              </div> */}
              <b style={{ fontSize: 40, margin: 'auto' }}>
                {pointsList?.availablePoints}
              </b>
              {/* <CircularProgressbar value={avilablePoint}
                text={`${avilablePoint}%`}
                strokeWidth={5}
                styles={buildStyles({
                  strokeLinecap: 'butt',
                  textColor: avilablePoint >= 50 ? ' #588e21 1' : "#e74a3b",
                  pathColor: avilablePoint >= 50 ? ' #588e21 1' : "#e74a3b",
                })}
              />
              <div className="displayPoints_value_div font-helvetica-m">
                <div className="displayPoints_value_inner">
                  <span className="displayPoints_value">{pointsList.availablePoints}</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="redeemedPoints_div mb-3">
          <div className="displayPoints_div">
            <div className="displayPoints_head">
              <label className="displayPoints_label displayPoints_label mb-0">
                Redeemed XP
              </label>
              {/* <div className="displayPoints_img_div">
                <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="displayPoints_img" alt="Points" title="Points redeemed" />
              </div> */}
            </div>
            <div className="displayPoints_content">
              {/* <div className="eep-progress">
                <span className="eep-progress-left">
                  <span className="eep-progress-bar eep-border-warn" style={{ transform: redeemPercentleft }}></span>
                </span>
                <span className="eep-progress-right">
                  <span className="eep-progress-bar eep-border-warn" style={{ transform: redeemPercentright }}></span>
                </span>
                <div className="eep-progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                  <div className="h6 font-weight-bold mb-0 displayPercentage_value"> {pointsList.redeemPercentage} %
                  </div>
                </div>
              </div> */}
              <b style={{ fontSize: 40, margin: 'auto' }}>
                {pointsList?.redeemedPoints}
              </b>
              {/* <CircularProgressbar value={redeemPoint}
                text={`${redeemPoint}%`}
                strokeWidth={5}
                styles={buildStyles({
                  strokeLinecap: 'butt',
                  textColor: redeemPoint >= 50 ? ' #588e21 1' : "#e74a3b",
                  pathColor: redeemPoint >= 50 ? ' #588e21 1' : "#e74a3b",
                })} />
              <div className="displayPoints_value_div font-helvetica-m">
                <div className="displayPoints_value_inner">
                  <span className="displayPoints_value"> {pointsList.redeemedPoints} </span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* <div className="redeemPoints_div">
          <Link to="#" className="eep-btn eep-btn-tb">Redeem Points</Link>
        </div> */}
      </div>
    </React.Fragment>
  );
};
export default AvailPoints;

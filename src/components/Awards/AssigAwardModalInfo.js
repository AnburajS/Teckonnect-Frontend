import React from 'react';

const AssignAwardModalInfo = (props) => {
  const { awardInfo, selectedMonth } = props;

  const getMyHashTag = (arg) => {
    const arr = [];
    arg?.map((res) => {
      arr.push(`#${res.hashtagName}`);
    });
    return arr.join(', ');
  };

  const getScheduleDetails = (arg) => {
    const arr = [];
    arg?.map((res) => {
      arr.push(res.date + '-' + res.month);
    });
    return arr.join(', ');
  };

  return (
    <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12">
      <div className="award_modal_left_col_inner h-100">
        <div className="s_award_add_col_inner bg-f5f5f5">
          <div className="s_award_add_col_inner_fromaward mb-3">
            <img
              src={
                awardInfo?.data?.imageByte?.image
                  ? awardInfo.data.imageByte.image
                  : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
              }
              className="r_award_img selected"
              alt="Award Icon"
              title="Award Name"
            />
          </div>
          <label className="s_award_add_label font-helvetica-m s_award_name">
            {awardInfo.data.name}
          </label>
          {awardInfo.isSpot && (
            <div className="admin_award_type">
              <label className="mb-0">Spot</label>
            </div>
          )}
          <div className="s_award_info_div">
            <div className="s_dtls_info ">
              <label className="s_dtls_lb font-helvetica-m">Hash Tag</label>
              <p className="s_award_category badge_info_hash mb-1 text-right  lh-18 fs-11">
                {getMyHashTag(awardInfo.data.hashTag)}
              </p>
            </div>
            <div
              className={`${
                !awardInfo.isSpot
                  ? 'n_dtls_info n_dtls_info_last'
                  : 's_dtls_info border_none mb-0'
              }`}
            >
              <label className="s_dtls_lb font-helvetica-m">Points</label>
              <p className="s_award_points mb-1 text-right">
                {awardInfo.data.points}
              </p>
            </div>
            {!awardInfo.isSpot && selectedMonth && selectedMonth.length > 0 && (
              <div className="s_awardMonths_div">
                <label className="n_dtls_lb font-helvetica-m">
                  Schedule Month(s)
                </label>
                <p className="s_awardMonths mb-1 text-right">
                  {selectedMonth && selectedMonth.length > 0
                    ? getScheduleDetails(selectedMonth)
                    : '---'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssignAwardModalInfo;

import React from 'react';

const ManageAwardViewInfo = (props) => {
  const { aDataValue } = props;

  const getHashTag = (arg) => {
    if (arg) {
      const arr = [];
      arg.length > 0 &&
        arg?.map((res) => {
          if (res?.hashtagName || res?.hashtag_name) {
            arr.push(`#${res?.hashtagName || res?.hashtag_name}`);
          }
        });
      return arr?.join(', ');
    }
  };

  return (
    <React.Fragment>
      <div className="award_modal_left_col_inner award_modal_left_col_flx h-100">
        <div className="n_award_add_col_inner bg-f5f5f5 h-100">
          {Object.keys(aDataValue).length > 0 && (
            <React.Fragment>
              <div className="n_award_add_col_inner_fromaward">
                <img
                  src={
                    aDataValue?.imageByte?.image ||
                    aDataValue.imageByte ||
                    `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                  }
                  className="r_award_img selected"
                  alt="Award Icon"
                  title={aDataValue?.award?.name}
                />
                <label className="n_award_add_label font-helvetica-m n_award_name">
                  {aDataValue?.award?.name}
                </label>
              </div>
              {aDataValue?.entityType === 'spot_award' && (
                <div className="admin_award_type">
                  <label className="mb-0">Spot</label>
                </div>
              )}
              <div className="n_award_info_div">
                <div className="n_dtls_info ">
                  <label className="n_dtls_lb font-helvetica-m">HashTag</label>
                  <p className="n_award_category  mb-1 text-right">
                    {getHashTag(
                      aDataValue?.award?.hashTag ||
                        aDataValue?.award?.award_hash_tag?.map(
                          (data) => data?.hashtag
                        )
                    )}
                  </p>
                </div>
                <div className="n_dtls_info n_dtls_info_last border_none mb-0">
                  <label className="n_dtls_lb font-helvetica-m">Points</label>
                  <p className="n_award_points mb-1 text-right">
                    {aDataValue?.award?.points}
                  </p>
                </div>
                {aDataValue?.entityType === 'nomi_award' && false && (
                  <div className="s_awardMonths_div">
                    <label className="n_dtls_lb font-helvetica-m">
                      Schedule Month(s)
                    </label>
                    <p className="s_awardMonths mb-1 text-right">--</p>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
          {Object.keys(aDataValue).length <= 0 && (
            <div
              className="alert alert-danger"
              role="alert"
            >
              Not able to fetch property data. Please try again from beginning.
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ManageAwardViewInfo;

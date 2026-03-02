import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NominatedAwardFilteredData = (props) => {
  const { filterData, filterTable, closeShowDetails, setShowDetails } = props;
  const initialData = filterData ? filterData : [];
  const [clickeddAwardData, setclickeddAwardData] = useState(initialData);

  const closeShowAwardDetals = (arg, fetchState) => {
    if (!fetchState) {
      filterTable({ isData: false, aValues: [] });
      setShowDetails(false);
    }
    closeShowDetails(false);
  };

  const getHashTag = (arg) => {
    const arr = [];
    arg?.map((res) => {
      arr.push(`#${res.hashtagName}`);
    });
    return arr.join(', ');
  };

  useEffect(() => {
    setclickeddAwardData(clickeddAwardData);
  }, [clickeddAwardData]);

  return (
    <div className="box-content br-15">
      <div className="c_nm_award_pts_div">
        {clickeddAwardData?.award?.points > 0 && (
          <label className="c_nm_award_pts font-helvetica-m">
            {clickeddAwardData.award.points > 1
              ? clickeddAwardData.award.points + ' pts'
              : ''}
          </label>
        )}
      </div>
      <div className="c_nm_award_div px-3">
        <img
          src={clickeddAwardData?.imageByte?.image}
          className="c_nm_award_img eep_r_icons_bg"
          alt="Award Icon"
          title={clickeddAwardData?.imageByte?.name}
        />
        <label className="c_nm_award_lbl font-helvetica-m">
          {clickeddAwardData?.award?.name}
        </label>
      </div>
      <div className="c_nm_award_cat_div px-x">
        <p className="c_nm_award_cat my-2  lh-18 fs-11">
          {getHashTag(clickeddAwardData?.award?.hashTag)}
        </p>
        <div className="mt-4 ">
          <p className="mb-2 c_nm_award_lbl font-helvetica-m">Department</p>
          <p className="c_nm_award_dept mb-0 fs-11">
            {clickeddAwardData?.nominatorId?.department?.name}
          </p>
        </div>
      </div>
      <ul
        className="icon"
        onClick={() => closeShowAwardDetals('', false)}
      >
        <li>
          <a
            // to="#"
            className="c_nm_back c1"
          >
            <i className="fas fa-chevron-left"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};
export default NominatedAwardFilteredData;

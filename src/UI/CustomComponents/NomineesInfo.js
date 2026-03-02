import React from 'react';
import { getHighlightedText } from '../../constants/utills';

const NomineesInfo = ({ data, globalFilter }) => {
  const name = data.userData?.userId?.fullName || '';
  const image = data.userData?.userId?.pic;

  return (
    <div className="tb_nominees_nm align-items-center text-left row">
      <div className="col-2">
        <img
          src={
            image || `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
          }
          className="tb_nominees_dp eep_r_icons_bg"
          alt="Profile Pic"
          title={name}
        />
      </div>
      <div className="col-10">
        <label>{getHighlightedText(name, globalFilter)}</label>
      </div>
    </div>
  );
};

export default NomineesInfo;

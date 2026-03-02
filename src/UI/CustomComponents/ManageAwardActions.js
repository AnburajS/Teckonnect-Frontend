import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ManageAwardActions = (props) => {
  const { data, triggerModal } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const handleDeletion = (arg) => {
    triggerModal({ data: arg, handleState: true });
  };
  return (
    <div className="actnsDiv manageIcons">
      <Link
        to={
          (data?.entityType || props?.data?.type) === 'nomi_award'
            ? {
                pathname: '/app/managenominateawardview',
                state: { awardManageData: data },
              }
            : (data?.entityType || props?.data?.type) === 'spot_award'
            ? {
                pathname: '/app/managespotawardview',
                state: { awardManageData: data },
              }
            : '#'
        }
        state={
          (data?.entityType || props?.data?.type) === 'nomi_award'
            ? { awardManageData: data }
            : (data?.entityType || props?.data?.type) === 'spot_award'
            ? { awardManageData: data }
            : '#'
        }
        title="View"
        className="manageViewIcon"
      >
        <span
          dangerouslySetInnerHTML={{
            __html: svgIcons && svgIcons.view_icon,
          }}
          className="transformScale"
        ></span>
        {/* <img src={process.env.PUBLIC_URL + "/images/icons/view.svg"} className="transformScale" alt="View Icon" title="View Details" style={{width:"25px"}} /> */}
      </Link>
      <a
        title="Delete"
        className="manageStopIcon ml-2 c1"
        onClick={() => handleDeletion(data)}
        data-toggle="modal"
        data-target="#stopAllotedAwardModal"
      >
        <span
          dangerouslySetInnerHTML={{
            __html: svgIcons && svgIcons.Trash,
          }}
          className="transformScale"
        ></span>
        {/* <img src={process.env.PUBLIC_URL + "/images/icons/stop.svg"} className="transformScale ml-2" alt="Delete Icon" title="Delete Data" style={{width:"18px"}} /> */}
      </a>
    </div>
  );
};
export default ManageAwardActions;

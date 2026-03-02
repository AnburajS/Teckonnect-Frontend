import React from "react";

const RewardInfoModal = (props) => {

  const { rewardInfoModalData, getUserPicture } = props;

  return (
    <div className="eepModalDiv">
      <div className="modal fade" id="RewardInfoModal" aria-modal="true">
        <div className="modal-dialog w-50" role="document">
          <div className="modal-content p-4">
            <div className="modal-header py-0 border-bottom-0">
              <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
            </div>
            {!rewardInfoModalData.state &&
              <div className="modal-body eep_scroll_y py-0 px-0">
                <div className="RewardInfo modalBodyHeight d-flex flex-column gride_view">
                  <div className="m_enlitedList_head d-flex align-items-center">
                    {/* <img src={rewardInfoModalData.data.imageByte} className="profile_pic wh" alt="Image" title={rewardInfoModalData.data.name} /> */}
                    <span>{rewardInfoModalData.data.name}</span>
                  </div>
                  <div className="gride_colum_template eep_scroll_y">
                    {rewardInfoModalData.data.users && rewardInfoModalData.data.users.length > 0 && rewardInfoModalData.data.users.map((item, index) => {
                      return (
                        <div className="gride_container" key={"users_info" + index}>
                          <div className="userPic">
                            <img src={getUserPicture(item.id)} className="sr_rank_pic" alt={item.fullName} title={item.fullName} />
                          </div>
                          <div className="userName eep_truncate_min eep_truncate" title={item.fullName}>
                            {item.fullName}
                          </div>
                          <div className="userDepartment eep_truncate_min eep_truncate" title={item.department.name}>
                            {item.department.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
            {rewardInfoModalData.state &&
              <div className="modal-body eep_scroll_y py-0 px-0">
                <div className="RewardInfo modalBodyHeight d-flex flex-column gride_view">
                  <div className="m_enlitedList_head d-flex justify-content-between align-items-center">
                    <div className="profile">
                      <img src={rewardInfoModalData.data.imageByte ? rewardInfoModalData.data.imageByte : process.env.PUBLIC_URL + "/images/user_profile.png"} className="profile_pic wh" alt={rewardInfoModalData.data.name} title={rewardInfoModalData.data.name} />
                      <span>{rewardInfoModalData.data.name}</span>
                    </div>
                    <div className="profileDetails">
                      <span className="mx-1">Points</span>
                      <span className="hilight_points">{rewardInfoModalData.data.points}</span>
                      <span className="mx-1">Rank</span>
                      <span className="hilight_points">{rewardInfoModalData.data.rank}</span>
                    </div>
                  </div>
                  <div className="gride_colum_template eep_scroll_y">
                    {rewardInfoModalData.data.rewardList && rewardInfoModalData.data.rewardList.length > 0 && rewardInfoModalData.data.rewardList.map((item, index) => {
                      return (
                        <div className="gride_container" key={"users_info_reward" + index}>
                          <div className="userPic">
                            <img src={item?.imageByte?.image} className="sr_rank_pic" alt={item?.imageByte?.name} title={item?.imageByte?.name} />
                          </div>
                          <div className="userName eep_truncate_min eep_truncate" title={item?.imageByte?.name}>
                            {item?.imageByte?.name}
                          </div>
                          <div className="useracheivedCount eep_truncate_min eep_truncate">
                            {item.acheivedCount}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default RewardInfoModal;

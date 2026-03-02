import React from "react";
import { eepFormatDateTime } from "../shared/SharedService";

const LikedInfoModal = (props) => {
  const { likedModalData, usersPicData } = props;

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPicData.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPicData[userPicIndex].pic
      : process.env.PUBLIC_URL + "/images/user_profile.png";
  };

  return (
    <div className="eepModalDiv">
      <div className="modal fade" id="LikedInfoModal" aria-modal="true">
        <div
          className="modal-dialog w-50"
          role="document"
        >
          <div className="modal-content p-4">
            <div className="modal-header py-0 border-bottom-0">
              <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body eep_scroll_y py-0 px-0">
              <div className="modalEnlitedList modalBodyHeight d-flex flex-column">
                <div className="m_enlitedList_head">
                  <span>Enlited Lists</span>
                </div>
                <div className="m_enlitedList_div">
                  {likedModalData &&
                    likedModalData.length > 0 &&
                    likedModalData.map((item, index) => {
                      return (
                        <div
                          className="m_enlitedList mb-2 d-flex flex-wrap justify-content-between align-items-center"
                          key={"enlitedList_" + index}
                        >
                          <div className="m_enlitedList_info">
                            <img
                              src={getUserPicture(item?.userId?.id)}
                              className="sr_rank_pic"
                              alt="Profile Image"
                              title={
                                item?.userId?.firstname +
                                " " +
                                item?.userId?.lastname
                              }
                            />
                            <label htmlFor="" className="sr_rank_nm">
                              {item?.userId?.firstname +
                                " " +
                                item?.userId?.lastname}
                            </label>
                          </div>
                          <div className="m_enlitedList_dt">
                            <span>{eepFormatDateTime(item.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LikedInfoModal;

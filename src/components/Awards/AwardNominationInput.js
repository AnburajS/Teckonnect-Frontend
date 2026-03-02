import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sharedDataActions } from '../../store/shared-data-slice';

const AwardNominationInput = (props) => {
  const msgMaxLength = 120;
  const { aDataVal, isCommonMsg, commonMsgValue, confirmSelectedData } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const filteredUsers = useSelector(
    (state) => state.sharedData.awardNominators.users
  );
  const [searchUser, setSearchUser] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const checkedUsers = filteredUsers.filter(
      (res) => res.regSetting.checkedState
    );
    confirmSelectedData(checkedUsers);
  }, [filteredUsers]);

  const handleOnClick = async (e, position, userData, operation) => {
    let userList = JSON.parse(JSON.stringify(filteredUsers));
    let individualData = JSON.parse(JSON.stringify(userData));
    if (operation === 'change') {
      individualData.regSetting.checkedState =
        !individualData.regSetting.checkedState;
      individualData.regSetting.hideShowState = e.target.checked;
    } else {
      individualData.regSetting.hideShowState =
        !individualData.regSetting.hideShowState;
      individualData.regSetting.checkedState =
        !individualData.regSetting.checkedState;
    }

    if (individualData.regSetting.checkedState && isCommonMsg.isChecked) {
      individualData.regSetting.message = commonMsgValue;
    }
    if (!individualData.regSetting.checkedState) {
      individualData.regSetting.message = '';
    }
    userList[position] = individualData;
    await dispatch(
      sharedDataActions.getUsersListForAwardNominators({ uDatas: userList })
    );
  };

  const recognizeMessageHandler = (e, position, data) => {
    e.target.value = e.target.value.substring(0, msgMaxLength);
    let users = JSON.parse(JSON.stringify(filteredUsers));
    let individualData = JSON.parse(JSON.stringify(data));
    individualData['regSetting']['message'] = e.target.value;
    users[position] = individualData;
    dispatch(
      sharedDataActions.getUsersListForAwardNominators({ uDatas: users })
    );
  };

  return (
    <div className="bg-f5f5f5 br-10 h-100">
      <div className="p-4">
        <div
          className="r_award_rcol_div divHeightTo eep_scroll_y"
          style={{ maxHeight: '632px' }}
        >
          <div className="bg-f5f5f5 sticky_position pb-2">
            <div className="d-flex p-0 mb-2">
              <label className="font-helvetica-m c-404040 mb-1">
                {aDataVal &&
                  (aDataVal.type === 'spot_award'
                    ? 'Recognize Award'
                    : 'Nominees')}
                <span
                  className="ml-1 pl-1 r_award_participants_count"
                  style={{ display: 'none' }}
                >
                  0
                </span>
              </label>
            </div>
            <div className="col-md-12 p-0 mb-1">
              <div className="input-group custom-search-form bg-edebeb br-5 align-items-center">
                <input
                  type="text"
                  className="form-control search_users_b bg-transparent px-3"
                  name="search_users"
                  placeholder="Search User"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-default"
                    type="button"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/searchN.svg`}
                      className="search_users_b_box c1"
                      width="18"
                      alt="Search Participants"
                    />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="row mx-0 r_award_participants_div assign_users_div">
            {filteredUsers &&
              filteredUsers.length > 0 &&
              filteredUsers
                .filter((uData) => {
                  if (!searchUser) {
                    return true;
                  }
                  if (
                    uData.firstname
                      .toLowerCase()
                      .includes(searchUser.toLowerCase()) ||
                    uData.lastname
                      .toLowerCase()
                      .includes(searchUser.toLowerCase())
                  ) {
                    return true;
                  }
                })
                .map((uData, index) => (
                  <div
                    className="col-md-12 form-group text-left my-1 bg-white assign_users_inner"
                    key={'assignUsers_' + index}
                    style={{ borderRadius: '6px' }}
                  >
                    {!uData.regSetting.hideShowState && (
                      <div
                        className="assign_users_inner_one p-2"
                        id={'uParentID_' + index}
                      >
                        <div className="col-sm-11 p-0 form-check d-flex align-items-center ">
                          <input
                            className="mr-3"
                            type="checkbox"
                            // value={uData.fullName}
                            checked={uData?.regSetting?.checkedState ?? false}
                            id={'recognition_' + index}
                            onChange={(e) =>
                              handleOnClick(e, index, uData, 'change')
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={'recognition_' + index}
                          >
                            {uData.fullName}
                          </label>
                        </div>
                        <div
                          className="col-sm-1 text-right px-0 eep_message_icon"
                          dangerouslySetInnerHTML={{
                            __html: svgIcons && svgIcons.message_icon,
                          }}
                          onClick={(e) =>
                            handleOnClick(e, index, uData, 'click')
                          }
                        ></div>
                      </div>
                    )}
                    {uData.regSetting.hideShowState && (
                      <div
                        className={
                          uData.regSetting.checkedState
                            ? 'assign_users_inner_two lbl_checked'
                            : 'assign_users_inner_two'
                        }
                        id={'uChildID_' + index}
                      >
                        <div
                          className="col-md-12 px-0 r_a_assign_lbl_div"
                          style={{ padding: '8px' }}
                          onClick={(e) =>
                            handleOnClick(e, index, uData, 'click')
                          }
                        >
                          <div className="r_a_assign_lbl_inner">
                            <label className="r_a_assign_lbl">
                              {uData.fullName}
                            </label>
                          </div>
                          <div className="m_characterLeft_div">
                            <span className="help-block">
                              <p
                                className="m_characterLeft help-block"
                                id="mCharacterID6"
                              >
                                {uData?.regSetting?.message.length}/
                                {msgMaxLength}
                              </p>
                            </span>
                            <img
                              src={`${process.env.PUBLIC_URL}/images/icons/dropup.svg`}
                              className="dropup_icon"
                              alt="dropup"
                              title="dropup"
                            />
                          </div>
                        </div>
                        <div className="col-md-12 px-0 r_a_assign_msg_div">
                          <textarea
                            className="form-control px-0 r_a_assign_msg eep_scroll_y"
                            rows="2"
                            placeholder="Enter Message Here..."
                            maxLength="120"
                            value={uData?.regSetting?.message}
                            // value={isCommonMsg.isChecked ? commonMsgValue : recognizeMessage[index]}
                            disabled={isCommonMsg.isChecked}
                            onChange={(e) =>
                              recognizeMessageHandler(e, index, uData)
                            }
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AwardNominationInput;

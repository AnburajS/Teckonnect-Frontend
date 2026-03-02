import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ResponseInfo from '../../UI/ResponseInfo';
import { sharedDataActions } from '../../store/shared-data-slice';

const BadgeModalAssigUsers = (props) => {
  const { filteredUsers, getFilteredUsers } = props;
  const selectedUsers = [];
  const [selectedUserId, setSelectedUsersId] = useState([]);
  const [searchUser, setSearchUser] = useState('');

  const badgeSeledtedUsers = useSelector(
    (state) => state.sharedData.badgeSeledtedUsers,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let sUsers = [...selectedUserId];
    for (let i = 0; i < sUsers.length; i++) {
      let exists = filteredUsers.filter((res) => Number(res.id) === sUsers[i]);
      if (!exists.length) {
        sUsers.splice(i, 1);
      }
    }
    setSelectedUsersId(sUsers);
    const selectedUsersOnInit = [];
    {
      sUsers.length > 0 &&
        sUsers.map((uid) => {
          return selectedUsersOnInit.push({ id: uid });
        });
    }
    if (selectedUsersOnInit?.length > 0) {
      getFilteredUsers(selectedUsersOnInit);
    }
  }, [filteredUsers]);

  const checkBoxOnChangeHandler = (e) => {
    const { value, checked } = e.target;
    var selectedUserIdTemp = [...selectedUserId];
    if (checked) {
      selectedUserIdTemp = [...selectedUserIdTemp, value];
      dispatch(sharedDataActions.updateBadgeSelectedUsers({ checked, value }));
    } else {
      selectedUserIdTemp.splice(selectedUserId.indexOf(value), 1);
      dispatch(sharedDataActions.updateBadgeSelectedUsers({ checked, value }));
    }
    setSelectedUsersId(selectedUserIdTemp);
    {
      selectedUserIdTemp.length > 0 &&
        selectedUserIdTemp.map((uid) => {
          return selectedUsers.push({ id: uid });
        });
    }
    getFilteredUsers(selectedUsers);
  };

  const allUsersClickHandher = (e) => {
    const { value, checked } = e.target;
    var selectedUserIdTemp = [];
    if (checked) {
      dispatch(sharedDataActions.badgeAllUsersUpdate([]));
      filteredUsers.map((res) => {
        selectedUserIdTemp.push({ id: res.id });
        dispatch(
          sharedDataActions.updateBadgeSelectedUsers({
            checked,
            value: res.id,
          }),
        );
      });
    } else {
      dispatch(sharedDataActions.badgeAllUsersUpdate([]));
      selectedUserIdTemp = [];
    }
    setSelectedUsersId([...selectedUserIdTemp]);
    getFilteredUsers(selectedUserIdTemp);

    var ele = document.getElementsByName('userIds');
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type === 'checkbox')
        if (checked) {
          ele[i].checked = true;
        } else {
          ele[i].checked = false;
        }
    }
  };
  useEffect(() => {
    if (!filteredUsers || filteredUsers.length === 0) {
      setSearchUser('');
    }
  }, [filteredUsers]);

  return (
    <React.Fragment>
      <div className="bg-f5f5f5 br-10">
        <div className="p-4 h-100">
          {filteredUsers && filteredUsers.length > 0 && (
            <div className="col-md-12 px-0 r_badge_col_div assign_users_list_div eep_scroll_y">
              <div className="bg-f5f5f5 sticky_position pb-2">
                <div className="d-flex p-0 mb-2">
                  <label className="font-helvetica-m c-404040 mb-1">
                    Assign Users
                    {badgeSeledtedUsers.length > 0 && (
                      <span className="ml-1 pl-1 c-9d9d9d assign_users_count">
                        {badgeSeledtedUsers.length}
                      </span>
                    )}
                  </label>
                  <div className="eep-options-div ml-auto my-auto">
                    <div
                      className="form-check"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '32px',
                      }}
                    >
                      <input
                        className="form-check-input p_check_all"
                        type="checkbox"
                        value=""
                        id="flexCheckChecked"
                        onClick={allUsersClickHandher}
                        style={{ marginTop: 1 }}
                      />
                      <div
                        className="form-check-label c-404040"
                        htmlFor="flexCheckChecked"
                      >
                        All
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 p-0 mb-1">
                  <div className="input-group custom-search-form bg-edebeb br-5">
                    <input
                      type="text"
                      className="form-control search_users_b bg-transparent px-3"
                      name="search_users_b"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-default"
                        type="button"
                      >
                        <img
                          src={`${process.env.PUBLIC_URL}/images/icons/search.svg`}
                          className="search_users_b_box img_size_20 c1"
                          width={20}
                          alt="Search Participants"
                        />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row mx-0 add_participants_div assign_users_div">
                {filteredUsers
                  .filter((uData) => {
                    if (!searchUser) {
                      setTimeout(() => {
                        const userCheckBox =
                          document.getElementsByClassName('assign-users-list');
                        for (let i = 0; i < userCheckBox.length; i++) {
                          if (userCheckBox[i]) {
                            userCheckBox[i]['checked'] = false;
                          }
                        }
                        badgeSeledtedUsers.map((res) => {
                          if (
                            document.getElementById('flexCheckDefault_' + res)
                          ) {
                            document.getElementById(
                              'flexCheckDefault_' + res,
                            ).checked = true;
                          }
                        });
                      }, 0);

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
                      const userCheckBox =
                        document.getElementsByClassName('assign-users-list');
                      for (let i = 0; i < userCheckBox.length; i++) {
                        if (userCheckBox[i]) {
                          userCheckBox[i]['checked'] = false;
                        }
                      }
                      badgeSeledtedUsers.map((res) => {
                        if (
                          document.getElementById('flexCheckDefault_' + res)
                        ) {
                          document.getElementById(
                            'flexCheckDefault_' + res,
                          ).checked = true;
                        }
                      });

                      return true;
                    }
                  })
                  .map((uData, key) => {
                    return (
                      <div
                        className="col-md-12 form-group text-left my-1 bg-white"
                        key={'usersList_' + key}
                      >
                        <div
                          className="form-check"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '32px',
                          }}
                        >
                          <input
                            className="form-check-input useridclass invalid-input assign-users-list"
                            type="checkbox"
                            value={uData?.id}
                            id={'flexCheckDefault_' + uData?.id}
                            name="userIds"
                            onClick={checkBoxOnChangeHandler}
                            style={{ marginTop: 1 }}
                          />
                          <label
                            className="form-check-label"
                            // htmlFor={"flexCheckDefault" + key}
                            htmlFor={'flexCheckDefault_' + uData?.id}
                            style={{ marginBottom: 2 }}
                          >
                            {uData?.firstname + ' ' + uData?.lastname}
                          </label>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {filteredUsers && filteredUsers.length <= 0 && (
            <div className="col-md-12 r_badge_col_div eep_scroll_y assign_users_empty_div h-100 px-3">
              <div className="row h-100-minus-32">
                <div className="col-md-12 p-3 my-auto text-center">
                  <ResponseInfo
                    title="Try another selection."
                    responseImg="noRecord"
                    responseClass="response-info"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default BadgeModalAssigUsers;

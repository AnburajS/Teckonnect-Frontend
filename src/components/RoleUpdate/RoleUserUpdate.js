import React, { useState, useEffect } from 'react';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import UserDragSelectSearch from './UserDragSelectSearch';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import RoleFilter from './RoleFilter';
import DraggableUserCard from './DraggableUserCard';
import UserDroppables from './UserDroppables';
import EEPSubmitModal from '../../modals/EEPSubmitModal';

const RoleUserUpdate = () => {
  const [userData, setUserData] = useState([]);

  const [filteredUserData, setFilteredUserData] = useState([]);
  const [currentRoleInUser, SetCurrentRoleInUser] = useState([]);
  const [currentRoleUser, setCurrentRoleUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState();
  const [dragOptions, setDragOptions] = useState();
  const [clearDropDown, setClearDropDown] = useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null });

  const fetchUserData = async () => {
    const obj = {
      url: URL_CONFIG.ALLUSERS,
      method: 'get',
      params: {
        active: true,
      },
    };
    await httpHandler(obj)
      .then((userData) => {
        setUserData(userData?.data);
        // setFilteredUserData(userData?.data);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getRoles = (arg) => {
    setRoles(arg);
  };

  const onDragDeptSelected = (arg) => {
    if (arg) {
      const data = userData.filter(
        (res) => res.department && res.department.name === arg
      );
      getSelectedDept(arg);
    } else {
      setFilteredUserData([]);
    }
  };
  const getSelectedDept = (args) => {
    if (args) {
      const deptArr = [];
      args.map((res) => {
        return deptArr.push(res.value);
      });
      const obj = {
        url: URL_CONFIG.DEPT_USERS,
        method: 'get',
        params: {
          dept: JSON.stringify(deptArr),
        },
      };
      httpHandler(obj)
        .then((uData) => {
          var uDatas = uData.data;
          setFilteredUserData([...uDatas]);
        })
        .catch((error) => {
          //const errMsg = error.response?.data?.message;
        });
    }
  };

  const onDragRoleSelected = (arg) => {
    if (arg) {
      getSelectedRole(arg);
    } else {
      setFilteredUserData([]);
    }
  };

  const getSelectedRole = (args, isSingle) => {
    if (args) {
      const deptArr = [];
      args.map((res) => {
        return deptArr.push(res.value);
      });
      const obj = {
        url: URL_CONFIG.ROLE_USERS,
        method: 'get',
        params: {
          roleId: JSON.stringify(deptArr),
        },
      };
      httpHandler(obj)
        .then((uData) => {
          var uDatas = uData?.data?.data;
          if (isSingle) {
            SetCurrentRoleInUser([...uDatas]);
          } else {
            setFilteredUserData([...uDatas]);
          }
        })
        .catch((error) => {
          //const errMsg = error.response?.data?.message;
        });
    }
  };
  const onSelectRole = (arg) => {
    if (arg) {
      getSelectedRole([arg], true);
      setRoleId(arg);
    } else {
      setRoleId(null);
      SetCurrentRoleInUser([]);
    }
  };
  useEffect(() => {
    if (dragOptions) {
      const isCurrentUser = currentRoleUser?.find(
        (data) => data?.id === dragOptions?.id
      );
      if (!isCurrentUser) {
        const item = filteredUserData?.find(
          (data) => data?.id === dragOptions?.id
        );
        setCurrentRoleUser([...currentRoleUser, item]);
      }
    }
  }, [dragOptions]);

  const onSelectRoles = (item) => {
    setDragOptions(item);
  };
  const handleRemove = (data) => {
    if (data?.id) {
      setCurrentRoleUser((prevState) =>
        prevState.filter((user) => user.id !== data.id)
      );
    }
  };
  const handleUpdateRole = () => {
    const user_id = currentRoleUser?.map((data) => data.id);
    const obj = {
      url: URL_CONFIG.UPDATEUSERROLE,
      method: 'put',
      payload: { role_id: roleId?.value, user_id: user_id },
    };
    setClearDropDown(false);
    httpHandler(obj)
      .then((uData) => {
        setCurrentRoleUser([]);
        setRoleId();
        setFilteredUserData([]);
        SetCurrentRoleInUser([]);
        setClearDropDown(true);
        setShowModal({
          ...showModal,
          type: 'success',
          success: 'User Profile Created Successfully!!',
          message: uData.message,
        });
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
        //const errMsg = error.response?.data?.message;
      });
  };
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  const handleCheck = (e) => {
    if (e.target.checked) {
      let result = filteredUserData.filter(
        (item1) => !currentRoleInUser.some((item2) => item2.id === item1.id)
      );
      setCurrentRoleUser([...result]);
    } else {
      setCurrentRoleUser([]);
    }
  };
  return (
    <DndProvider backend={HTML5Backend}>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      <div className="col-sm-12 col-md-6 col-lg-6 eep-content-section ">
        <div className="urm_drage_wrapper pdx-25 pdy-27">
          <UserDragSelectSearch
            userData={userData}
            getRolesFn={getRoles}
            onDragDeptSelected={onDragDeptSelected}
            onDragRoleSelected={onDragRoleSelected}
            clearDropDown={clearDropDown}
          />
          {/* <div className="form-group mb-1">
            <input
              type="text"
              className="form-control"
              placeholder="Search user..."
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                if (value) {
                  const filtered = userData.filter(
                    (u) =>
                      u?.fullName?.toLowerCase().includes(value) ||
                      u?.email?.toLowerCase().includes(value)
                  );
                  setFilteredUserData(filtered);
                } else {
                  setFilteredUserData([]);
                }
              }}
            />
          </div> */}
          <div
            className="eep_scroll_y urm_drage urm_drag_drop isDragging gride_view py-2 px-3"
            id="drage_container"
          >
            <div>
              <div className="search-inputs-wrapper">
                <input
                  type="text"
                  className="search-inputs"
                  placeholder="Search user..."
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    if (value) {
                      const filtered = userData.filter(
                        (u) =>
                          u?.fullName?.toLowerCase().includes(value) ||
                          u?.email?.toLowerCase().includes(value)
                      );
                      setFilteredUserData(filtered);
                    } else {
                      setFilteredUserData([]);
                    }
                  }}
                />
                <img
                  src={
                    process.env.PUBLIC_URL + `/images/icons/static/search.svg`
                  }
                  alt="Search"
                  className="search-icons"
                />
              </div>
            </div>{' '}
            {filteredUserData?.length > 0 && (
              <>
                <div className=" d-flex justify-content-end m-2">
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
                      onClick={handleCheck}
                      style={{ marginTop: 1 }}
                      // checked={true}
                    />
                    <div
                      className="form-check-label c-404040"
                      htmlFor="flexCheckChecked"
                    >
                      Select All
                    </div>
                  </div>
                </div>
                <div className="gride_container gride_colum_templates">
                  {filteredUserData?.length > 0 &&
                    filteredUserData.map((data, index) => (
                      <DraggableUserCard
                        key={index}
                        data={data}
                        disabled={
                          currentRoleInUser?.find(
                            (item) => item?.id === data?.id
                          )
                            ? true
                            : false
                        }
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6 eep-content-section">
        <div className="urm_drage_wrapper urm_droup_wrapper urm_drag_drop_wrapper  pdx-25 ">
          <RoleFilter
            roles={roles}
            onSelectRole={onSelectRole}
            clearDropDown={clearDropDown}
          />
          <UserDroppables
            onDrop={onSelectRoles}
            currentRoleUser={currentRoleUser}
            currentRoleInUser={currentRoleInUser}
            handleRemove={handleRemove}
          />

          <div className="d-flex justify-content-end mt-3">
            <button
              type="submit"
              className="eep-btn eep-btn-success mr-3 pdx-26 fs-14"
              disabled={currentRoleUser?.length === 0 || !roleId}
              onClick={handleUpdateRole}
            >
              Update
            </button>
            <button
              type="submit"
              className="eep-btn  mr-2 pdx-26 fs-14"
              onClick={() => {
                setCurrentRoleUser([]);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default RoleUserUpdate;

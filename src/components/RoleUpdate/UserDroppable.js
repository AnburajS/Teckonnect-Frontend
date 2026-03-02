import React, { useState, useEffect } from 'react';
import DropAssignedUsers from './DropAssignedUsers';
import { useDrop } from 'react-dnd';
const UserDroppable = (props) => {
  const {
    role,
    userData,
    onRoleBulkUpdate,
    roleUpdated,
    getUserOnDragRemove,
    dropAreaRole,
  } = props;
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [droppedData, setDroppedData] = useState([]);
  const [showFlag, setShowFlag] = useState(true);

  const [{ isOver }, dropRef] = useDrop({
    accept: dropAreaRole !== null ? 'user' : '',
    drop: (item) =>
      setDroppedData((prevState) => {
        return prevState.concat([item.data]);
      }),
    collect: (monitor) => ({
      highlighted: monitor.canDrop(),
      hovered: monitor.isOver(),
    }),
  });

  const getUData = () => {
    const data = userData.filter((res) => res.role && res.role.id === role);
    setFilteredUserData(data);
  };

  const deletedUser = (arg) => {
    getUserOnDragRemove(arg);
    for (let i = 0; i < droppedData.length; i++) {
      if (droppedData[i].id === arg.id) {
        droppedData.splice(i, 1);
        break;
      }
    }

    setDroppedData(droppedData);
    setShowFlag(false);
    setTimeout(() => {
      setShowFlag(true);
    }, 0);
  };

  useEffect(() => {
    getUData();
  }, [role]);

  useEffect(() => {
    if (roleUpdated) {
      getUData();
    }
  }, [roleUpdated]);

  const roleBulkUpdate = () => {
    onRoleBulkUpdate(droppedData);
  };

  return (
    <React.Fragment>
      <div
        className="eep_scroll_y urm_droup gride_view"
        id="drop_container"
        ref={dropRef}
      >
        <div
          className="urm_profile_container_wrapper urm_drag_drop"
          style={{ display: role ? 'grid' : 'none' }}
        >
          {filteredUserData?.length > 0 &&
            filteredUserData.map((res, index) => {
              return (
                <DropAssignedUsers
                  key={'assignedusers_' + index}
                  showcontrol={false}
                  userData={res}
                  deletedUser={deletedUser}
                />
              );
            })}

          {filteredUserData?.length < 0 && <p>No records found!</p>}

          {showFlag &&
            droppedData?.length > 0 &&
            droppedData.map((res, index) => {
              return (
                <DropAssignedUsers
                  key={'assignedusers_droped_' + index}
                  showcontrol={true}
                  userData={res}
                  deletedUser={deletedUser}
                />
              );
            })}
        </div>
      </div>
      <div className="urm_btn_wrapper d-flex justify-content-center">
        <button
          type="button"
          className="eep-btn eep-btn-cancel eep-btn-nofocus eep-btn-xsml mr-2"
          id="urm_cancel_btn"
        >
          Cancel
        </button>
        <div
          className="eep-btn eep-btn-success eep-btn-xsml urm_done_btn c1"
          id="urm_done_btn"
          onClick={roleBulkUpdate}
        >
          Done
        </div>
      </div>
    </React.Fragment>
  );
};
export default UserDroppable;

import React, { useState, useEffect } from 'react';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import UserDraggable from './UserDraggable';
import UserDroppable from './UserDroppable';
import UserDragSelectSearch from './UserDragSelectSearch';
import UserDropSelectSearch from './UserDropSelectSearch';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const RoleUpdate = () => {
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [dragAreaDept, setDragAreaDept] = useState(null);
  const [dragAreaRole, setDragAreaRole] = useState(null);
  const [dropAreaRole, setDropAreaRole] = useState(null);

  const [roleUpdated, setRoleUpdated] = useState(false);
  const [removedUserOnDrop, setRemovedUserOnDrop] = useState(null);

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
        setFilteredUserData(userData?.data);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchUserData();
    // getDepartments();
    // getRoles();
  }, []);

  const getRoles = (arg) => {
    setRoles(arg);
  };

  const onDragDeptSelected = (arg) => {
    if (arg) {
      const data = userData.filter(
        (res) => res.department && res.department.name === arg
      );
      setFilteredUserData(data);
    } else {
      setFilteredUserData(userData);
    }
  };

  const onDragRoleSelected = (arg) => {
    if (arg) {
      const data = userData.filter((res) => res.role && res.role.id === arg);
      setFilteredUserData(data);
    } else {
      setFilteredUserData(userData);
    }
  };

  const onDropRoleSelected = (arg) => {
    setDropAreaRole(arg);
  };

  const roleBulkUpdateHandler = async (arg) => {
    const roleBulkUpdate = {
      role: { id: dropAreaRole },
      users: [],
    };

    arg?.map((res) => {
      roleBulkUpdate.users.push({ id: res.id });
    });

    const obj = {
      url: URL_CONFIG.ROLES_BULK_UPDATE,
      method: 'put',
      payload: roleBulkUpdate,
    };
    await httpHandler(obj)
      .then(async (res) => {
        setRoleUpdated(true);
        await fetchUserData();
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  const getUserOnDragRemove = (arg) => {
    document
      .getElementById('roleid_' + arg.id)
      .classList.remove('urm_default_role', 'dragDisabled');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="col-sm-12 col-md-5 col-lg-5 eep-content-section">
        <div className="urm_drage_wrapper">
          <UserDragSelectSearch
            userData={userData}
            getRolesFn={getRoles}
            onDragDeptSelected={onDragDeptSelected}
            onDragRoleSelected={onDragRoleSelected}
          />
          <div
            className="eep_scroll_y urm_drage urm_drag_drop isDragging"
            id="drage_container"
          >
            {filteredUserData?.length > 0 &&
              filteredUserData.map((data, index) => {
                return (
                  <UserDraggable
                    key={'user_' + index}
                    data={data}
                    dropAreaRole={dropAreaRole}
                  />
                );
              })}
          </div>
        </div>
      </div>

      <div className="col-sm-12 col-md-7 col-lg-7 eep-content-section">
        <div className="urm_droup_wrapper urm_drag_drop_wrapper">
          <UserDropSelectSearch
            roles={roles}
            onDropRoleSelected={onDropRoleSelected}
          />

          <UserDroppable
            role={dropAreaRole}
            userData={userData}
            onRoleBulkUpdate={roleBulkUpdateHandler}
            roleUpdated={roleUpdated}
            getUserOnDragRemove={getUserOnDragRemove}
            dropAreaRole={dropAreaRole}
          />
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    </DndProvider>
  );
};
export default RoleUpdate;

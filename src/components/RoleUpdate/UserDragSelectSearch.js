import React, { useEffect, useState } from 'react';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import Select from 'react-select';
import { useSelector } from 'react-redux';
const UserDragSelectSearch = (props) => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const { getRolesFn, onDragDeptSelected, onDragRoleSelected, clearDropDown } =
    props;
  const [deptValue, setDeptValue] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [roleValue, setRoleValue] = useState(null);
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    if (clearDropDown) {
      setDeptValue(null);
      setRoleValue(null);
    }
  }, [clearDropDown]);
  const getDepartments = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: 'get',
    };
    httpHandler(obj)
      .then((depts) => {
        const deptData = [];
        depts.data.map((res) => {
          deptData.push({
            value: res.id,
            label: res.name,
          });
        });
        setDepartments(deptData);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  const getRoles = () => {
    const obj = {
      url: URL_CONFIG.ALLROLES,
      method: 'get',
    };
    httpHandler(obj)
      .then((roles) => {
        const rolesData = [];
        roles.data.map((res) => {
          rolesData.push({
            value: res.id,
            label: res.role_name,
          });
        });
        getRolesFn(rolesData);
        setRoles(rolesData);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    getDepartments();
    getRoles();
  }, []);

  const onDeptChangeHandler = (eve) => {
    if (eve) {
      onDragDeptSelected(eve);
    }
    setDeptValue(eve);
    setRoleValue(null);
  };

  const onRolesChangeHandler = (eve) => {
    onDragRoleSelected(eve);
    setRoleValue(eve);
    setDeptValue(null);
  };

  return (
    <div className="urm_select_container">
      <div className="urm_search_container ">
        <div className=" fs-24 ">User Profile</div>
      </div>
      <div className="eep-dropdown-divider w-100"></div>
      <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0 d-flex justify-content-between my-3">
        <Select
          options={[{ label: 'Select All', value: 'all' }, ...departments]}
          placeholder="DEPARTMENTS"
          isSearchable={true}
          className={`form-group select_bgwhite pr-1 w-50 m-0`}
          defaultValue=""
          onChange={(event) => {
            event.length && event.find((option) => option?.value === 'all')
              ? onDeptChangeHandler(departments)
              : onDeptChangeHandler(event);
          }}
          disabled=""
          classNamePrefix="eep_select_common select"
          isClearable={true}
          isMulti={true}
          style={{ height: 'auto' }}
          maxMenuHeight={150}
          value={deptValue}
        />

        <Select
          options={[{ label: 'Select All', value: 'all' }, ...roles]}
          placeholder="ROLE"
          isSearchable={true}
          className={`form-group select_bgwhite pl-1 w-50 m-0`}
          defaultValue=""
          onChange={(event) => {
            event.length && event.find((option) => option?.value === 'all')
              ? onRolesChangeHandler(roles)
              : onRolesChangeHandler(event);
          }}
          disabled=""
          classNamePrefix="eep_select_common select"
          isClearable={true}
          isMulti={true}
          style={{ height: 'auto' }}
          maxMenuHeight={150}
          value={roleValue}
        />
      </div>
    </div>
  );
};
export default UserDragSelectSearch;

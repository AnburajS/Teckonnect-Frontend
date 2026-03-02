import React, { useEffect, useState } from 'react';
import Select from 'react-select';
function RoleFilter({ roles, onSelectRole, clearDropDown }) {
  const [roleValue, setRoleValue] = useState(null);
  useEffect(() => {
    if (clearDropDown) {
      setRoleValue(null);
    }
  }, [clearDropDown]);
  const onRolesChangeHandler = (eve) => {
    onSelectRole(eve);
    setRoleValue(eve);
  };
  return (
    <div className="urm_select_container">
      <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0 d-flex justify-content-between my-3">
        <Select
          options={[...roles]}
          placeholder="ROLE"
          isSearchable={true}
          className={`form-group select_bgwhite pl-1 w-50 m-0`}
          defaultValue=""
          onChange={(event) => {
            onRolesChangeHandler(event);
          }}
          disabled=""
          classNamePrefix="eep_select_common select"
          isClearable={true}
          isMulti={false}
          style={{ height: 'auto' }}
          maxMenuHeight={150}
          value={roleValue}
        />
      </div>
    </div>
  );
}

export default RoleFilter;

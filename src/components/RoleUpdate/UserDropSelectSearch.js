import Select from "react-select";
const UserDropSelectSearch = (props) => {
  const { roles, onDropRoleSelected } = props;

  const onRolesChangeHandler = (event) => {
    const val = event ? event.value : null;
    onDropRoleSelected(val);
  };

  return (
    <div className="urm_droup_inner_div sticky-top">
      <div className="urm_search_container">
        <span className="urm_title">Assigned users</span>
        {/* <span className="search_icon c1 pl-2">
          <span>
            <input
              type="text"
              className="assign_search_text"
              placeholder="Search..."
            />
          </span>
        </span> */}
      </div>
      <div className="urm_role_select">
        <Select
          options={roles}
          placeholder="SELECT ROLE"
          classNamePrefix="eep_select_common select"
          isSearchable={true}
          isClearable={true}
          // className={`form-control  basic-single`}
          style={{ height: "auto" }}
          // menuPlacement="top"
          onChange={(event) => onRolesChangeHandler(event)}
          maxMenuHeight={200}
        />

        {/* <select
          className="urm_role select2-hidden-accessible"
          name="role"
          id="role"
          data-select2-id="role"
          tabindex="-1"
          aria-hidden="true"
        >
          <option data-select2-id="6"></option>

          <option value="1">Administrator</option>

          <option value="2">Employee</option>

          <option value="3">HR</option>
        </select>
         */}
      </div>
    </div>
  );
};
export default UserDropSelectSearch;

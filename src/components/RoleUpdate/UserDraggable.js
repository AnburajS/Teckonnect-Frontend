import React from "react";
import { useDrag } from "react-dnd";

const UserDraggable = (prop) => {
  const { data, dropAreaRole } = prop;
  const [{ isDragging, opacity }, dragRef] = useDrag({
    type: "user",
    item: { data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        if (data.role) {
          data.role.id = dropAreaRole;
          setTimeout(() => {
            document
              .getElementById("roleid_" + data.id)
              .classList.add("urm_default_role", "dragDisabled");
          }, 0);
        }
      }
    },
  });

  return (
    <div
      id={"roleid_" + data.id}
      className={`urm_profile_container dragRoleID ui-draggable ui-draggable-handle ${
        isDragging ? "isDragging" : ""
      } ${
        data.role &&
        data.role.id === dropAreaRole ? "urm_default_role dragDisabled"
          : ""
      }`}
      ref={dragRef}
      style={{ opacity }}
    >
      <div className="urm_profile_pic">
        <img
          src={data?.imageByte?.image ? data.imageByte.image : process.env.PUBLIC_URL + "/images/user_profile.png"}
          className="role_image"
          alt="profilePiccture"
        />
      </div>
      <div className="urm_profile_name">
        <span className="name">
          {data.firstname} {data.lastname}
        </span>
      </div>
      <div className="urm_profile_department">
        <span className="department">{data.department.name}</span>
      </div>
      <div
        className="urm_profile_role"
        style={{
          backgroundColor:
            data.role &&
            data.role.colorCode &&
            data.role.colorCode.indexOf("#") !== -1
              ? data.role.colorCode
              : data.role && data.role.colorCode
              ? "#" + data.role.colorCode
              : null,
        }}
      >
        <span className="role">{data.role && data.role.roleName}</span>
      </div>
    </div>
  );
};
export default UserDraggable;

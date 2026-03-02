import React from 'react';
import { useDrop } from 'react-dnd';
import UserCards from './UserCards';

const UserDroppables = ({
  onDrop,
  currentRoleUser,
  handleRemove,
  currentRoleInUser,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'USER', // Accept draggable items of type 'USER'
    drop: (item) => onDrop(item), // Handle the drop event
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Track whether the item is currently being hovered over
    }),
  }));

  return (
    // <div
    //   ref={drop} // Attach the drop ref to the container
    //   style={{
    //     backgroundColor: isOver ? 'lightgreen' : 'white', // Visual feedback when hovering
    //     padding: '20px',
    //     border: '2px dashed #ccc',
    //   }}
    // >
    <div
      ref={drop}
      style={{
        boxShadow: isOver ? '0 0 10px  rgba(0, 0, 0, 0.1607843137)' : 'none',
        transition: 'all 0.3s ease',
      }}
      className="eep_scroll_y urm_drage urm_drag_drop isDragging gride_view py-4 px-3"
      id="drage_container"
    >
      {' '}
      <div className="gride_container gride_colum_templates">
        {currentRoleInUser?.length > 0 &&
          currentRoleInUser.map((data, index) => {
            return (
              <UserCards
                data={data}
                boderColor={data?.role?.colorCode}
                image={data.imageByte?.image}
                userName={data?.username}
                department={data?.department?.name}
                role={data?.role?.roleName}
              />
            );
          })}
        {currentRoleUser?.length > 0 &&
          currentRoleUser.map((data, index) => {
            return (
              <UserCards
                data={data}
                boderColor={data?.role?.colorCode}
                image={data.imageByte?.image}
                userName={data?.username}
                department={data?.department?.name}
                role={data?.role?.roleName}
                isRemove={true}
                handleRemove={handleRemove}
              />
            );
          })}
      </div>
    </div>
    // </div>
  );
};

export default UserDroppables;

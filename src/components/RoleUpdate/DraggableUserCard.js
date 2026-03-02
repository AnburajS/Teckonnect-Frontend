import React from 'react';
import { useDrag } from 'react-dnd';
import UserCards from './UserCards'; // Assuming your UserCards component is imported here.

function DraggableUserCard({ data, disabled }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'USER',
      item: {
        id: data.id,
        username: data.username,
        role: data.role?.roleName,
      },
      canDrag: disabled === false ? true : false,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [disabled, data]
  );

  return (
    <div
      ref={drag} // Attach the drag reference here
      // style={{
      //   opacity: isDragging ? 0.5 : 1, // Make the element semi-transparent while dragging
      //   border: `2px solid ${data?.role?.colorCode}`, // Apply border color dynamically
      // }}
    >
      <UserCards
        data={data}
        boderColor={data?.role?.colorCode}
        image={data.imageByte?.image}
        userName={data?.username}
        department={data?.department?.name}
        role={data?.role?.roleName}
        disabled={disabled}
      />
    </div>
  );
}

export default DraggableUserCard;

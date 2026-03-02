import React from "react";

const UpArrow = (props) => {
    return (
        <svg viewBox="0 0 24 24" className="sidebaricondownup">
            <path fill={props?.color} d="M8.59 7.41 13.17 12 8.59 16.59 10 18l6-6-6-6z"></path>
        </svg>
    );
};
export default UpArrow;

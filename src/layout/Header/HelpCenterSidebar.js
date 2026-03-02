import React from 'react';

function HelpCenterSidebar({ data, activeMenu, setActiveMenu }) {
  return (
    <>
      {data?.infoItems?.map((item, i) => (
        <div
          className={`info-item ${activeMenu === i ? 'active' : ''}  `}
          onClick={() => setActiveMenu(i)}
        >
          <div className="fs-22 fw-700 mb-1">{item?.title}</div>
          <div className="color-a0a0a0 fs-11">{item?.description}</div>
        </div>
      ))}
    </>
  );
}

export default HelpCenterSidebar;

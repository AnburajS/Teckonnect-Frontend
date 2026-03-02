import React from 'react';

const Isloading = () => {
  return (
    <div
      id="page-loader-container"
      className="d-block"
      style={{ zIndex: '1051' }}
    >
      <div id="loader">
        <img
          src={process.env.PUBLIC_URL + '/images/loader.gif'}
          alt="Loader"
        />
      </div>
    </div>
  );
};

export default Isloading;

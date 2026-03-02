import React, { useEffect, useState } from 'react';
import Modal from '../../modals/Model';

const SyncConfirmModle = ({ isOpen, onClose, loading, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="tc_design"
      header={false}
      isModelWidth={true}
      width="350px"
      isModelHeight={true}
      height="210px"
    >
      <div className="text-center mb-4">
        <img
          src={process.env.PUBLIC_URL + '/images/Process.svg'}
          alt="Process"
          height={45}
          title="Sync"
        />
      </div>
      <div className="fs-18 fw-500 my-3 text-center">
        Are you sure to Sync this catalog?
      </div>
      {loading && (
        <div
          className="fs-14 fw-500 my-3 text-center"
          style={{ color: '#4eadb2' }}
        >
          Catalog Branch is Syncing...
        </div>
      )}
      {loading ? (
        <div className=" justify-content-center p-0 d-flex my-4">
          <button
            className="eep-btn eep-btn-success eep-btn-xsml mx-3"
            type="button"
            onClick={onClose}
          >
            ok
          </button>
        </div>
      ) : (
        <div className=" justify-content-center p-0 d-flex my-4">
          <button
            className="eep-btn eep-btn-cancel eep-btn-xsml mx-3"
            type="button"
            onClick={onClose}
          >
            No{' '}
          </button>

          <button
            type="submit"
            className="eep-btn eep-btn-success eep-btn-xsml  mx-3"
            onClick={onSubmit}
          >
            Yes
          </button>
        </div>
      )}
    </Modal>
  );
};

export default SyncConfirmModle;

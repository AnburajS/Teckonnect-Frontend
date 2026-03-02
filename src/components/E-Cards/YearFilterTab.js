import React, { useEffect, useState } from 'react';
import AddMoreYearModal from '../../modals/AddMoreYearModal';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import DeleteECardTemplateModal from '../../modals/DeleteECardTemplateModal';

const YearFilterTab = (props) => {
  const { allYears, getAnniversaryYearInfo, refreshYearInfo } = props;

  const [allYear, setAllYear] = useState([]);
  const [deletionState, setDeletionState] = useState(false);
  const [deletionData, setDeletionData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  useEffect(() => {
    let allYearsTemp = JSON.parse(JSON.stringify(allYears));
    allYearsTemp.map((item, index) => {
      if (index === 0) {
        allYearsTemp[0].active = true;
      } else {
        allYearsTemp[index].active = false;
      }
    });
    setAllYear(allYearsTemp);
  }, [allYears]);

  const handleOnClick = (arg, key) => {
    let allYearTemp = JSON.parse(JSON.stringify(allYear));
    allYearTemp.map((item, index) => {
      allYearTemp[index].active = false;
      if (key === index) {
        allYearTemp[index].active = true;
      }
    });
    setAllYear(allYearTemp);
    getAnniversaryYearInfo(arg);
  };

  const handleDeleteYear = (arg) => {
    setDeletionData(arg);
    setDeletionState(true);
  };

  const confirmState = (arg) => {
    if (arg) {
      const obj = {
        url: URL_CONFIG.DELETE_YEAR + '?id=' + deletionData.id,
        method: 'delete',
      };
      httpHandler(obj)
        .then((response) => {
          refreshYearInfo(true);
        })
        .catch((error) => {
          refreshYearInfo(false);
          setShowModal({
            ...showModal,
            type: 'danger',
            message: error?.response?.data?.message,
          });
        });
    } else {
      setDeletionData([]);
      setDeletionState(false);
    }
  };

  const refreshAddedYears = (arg) => {
    if (arg) {
      refreshYearInfo(true);
    } else {
      refreshYearInfo(false);
    }
  };

  return (
    <React.Fragment>
      <AddMoreYearModal refreshAddedYears={refreshAddedYears} />
      {deletionState && (
        <DeleteECardTemplateModal confirmState={confirmState} />
      )}
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      <div className="d-flex rmv_years_div templates_card_whole_div">
        <ul
          className="nav nav-pills mx-auto py-2 mt-3 mb-0 px-0"
          id="pills-tab"
          role="tablist"
        >
          {/*             
          <li className="nav-item-all noofyears" value="0">
            <a className="nav-link show active" id="year-tab-all">All</a>
          </li> 
          */}

          {allYear &&
            allYear
              .sort((a, b) => (a.yearsInterval > b.yearsInterval ? 1 : -1))
              .map((item, index) => {
                return (
                  <li
                    className="nav-item noofyears position-relative"
                    key={'noofyears_' + index}
                  >
                    <button
                      className={`nav-link ${item.active ? 'show active' : ''}`}
                      onClick={() => handleOnClick(item, index)}
                    >
                      {item.yearsInterval} Year
                    </button>
                    {item.active && (
                      <img
                        src={`${process.env.PUBLIC_URL}/images/icons/tasks/delete.svg`}
                        onClick={() => handleDeleteYear(item)}
                        className="delete_year"
                        title="Delete Year"
                        alt="Delete Icon"
                        data-toggle="modal"
                        data-target="#deleteECardTemplateModal"
                      />
                    )}
                  </li>
                );
              })}
          <li className="nav-item">
            <button
              className="nav-link bg-d6d6d6"
              id="moreyear-tab"
              href="#"
              data-toggle="modal"
              data-target="#addMoreYearModal"
            >
              {allYear && allYear.length ? 'Add More' : 'Add Year'}
            </button>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};
export default YearFilterTab;

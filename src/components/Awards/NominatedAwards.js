import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NominatedAwardFilteredData from './NominatedAwardFilteredData';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import EEPSubmitModal from '../../modals/EEPSubmitModal';

import { ROUTE_URL } from '../../constants/rest-config';

const NominatedAwards = (props) => {
  const { awardList, filterTable } = props;
  const eepHistory = useNavigate();
  const location = useLocation();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const initData = awardList ? awardList : [];
  const [nominatedAwardData, setNominatedAwardData] = useState(initData);
  const [clickedAwardDetails, setClickedAwardDetails] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null });

  const [locations, setLocations] = useState(
    location?.state?.notification?.on_focus
  );
  useEffect(() => {
    setNominatedAwardData(awardList);

    return () => {
      setNominatedAwardData([]);
    };
  }, [awardList]);
  useEffect(() => {
    if (locations && nominatedAwardData) {
      const filterData = nominatedAwardData?.find(
        (data) => data?.id === Number(locations)
      );
      if (filterData) {
        filterByAwardHandler(filterData, true);
      } else {
        setShowModal({
          ...showModal,
          type: 'danger',
          message:
            "Your nomination has been approved! Please check 'My Awards' for details or view updates in your notifications.",
        });
      }

      setLocations(null);
    }
  }, [locations, nominatedAwardData]);
  const filterByAwardHandler = (arg, fetchState) => {
    if (fetchState) {
      setClickedAwardDetails(arg);
      filterTable({ isData: true, aValues: arg });
      setShowDetails(true);
    }
    if (!fetchState) {
      filterTable({ isData: false, aValues: [] });
      setShowDetails(false);
    }
  };

  const closeShowDetails = (arg) => {
    setShowDetails(arg);
  };
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    // setShowNominateAwardModal(false);
    eepHistory(ROUTE_URL['NOTIFICATIONS']);
  };
  const handleMyAwardsRedirections = () => {
    eepHistory(ROUTE_URL['AWARDS'], {
      state: {
        activeTab: 'MyAwardsTab',
        tabNavigations: true,
      },
    });
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  return (
    <div className="bg-f1f1f1 mt-3 br-15 h-100 nm_rcol_inner sticky_position eep_scroll_y">
      <div className={`abox15 h-100 ${showDetails ? 'clkd' : ' '}`}>
        <div className="nm_rcol_inner_one p-4">
          <div className="nm_rcol_lbl_div text-center">
            <label className="nm_rcol_lbl font-helvetica-m">
              Nominated For
              <a
                // to="#"
                className="ml-2 addon_clr c1"
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.refresh_icon,
                }}
                onClick={() => filterByAwardHandler('', false)}
              ></a>
            </label>
          </div>
          <div className="row">
            {nominatedAwardData &&
              nominatedAwardData.map((item, index) => {
                return (
                  <div
                    className="col-md-4 col-lg-4 col-xl-4 col-sm-4 nm_award_div text-center"
                    key={'NominatedAward_' + index}
                    onClick={() => filterByAwardHandler(item, true)}
                  >
                    <img
                      src={item?.imageByte?.image}
                      className="nm_award_img eep_r_icons_bg"
                      alt="Award Icon"
                    />
                    <label className="nm_award_lbl">{item?.award?.name}</label>
                  </div>
                );
              })}
          </div>
        </div>
        {showDetails && nominatedAwardData && (
          <NominatedAwardFilteredData
            filterTable={filterTable}
            setShowDetails={setShowDetails}
            filterData={clickedAwardDetails}
            closeShowDetails={closeShowDetails}
          />
        )}
        {showModal.type !== null && showModal.message !== null && (
          <EEPSubmitModal
            data={showModal}
            className={`modal-addmessage`}
            hideModal={hideModal}
            successFooterData={
              <Link
                to="/app/notifications"
                type="button"
                className="eep-btn eep-btn-xsml eep-btn-success"
              >
                Ok
              </Link>
            }
            errorFooterData={
              <>
                <button
                  type="button"
                  className="eep-btn eep-btn-xsml eep-btn-share"
                  onClick={handleMyAwardsRedirections}
                >
                  My Awards
                </button>

                <button
                  type="button"
                  className="eep-btn eep-btn-xsml eep-btn-success"
                  data-dismiss="modal"
                  onClick={hideModal}
                >
                  Ok
                </button>
              </>
            }
          ></EEPSubmitModal>
        )}
      </div>
    </div>
  );
};

export default NominatedAwards;

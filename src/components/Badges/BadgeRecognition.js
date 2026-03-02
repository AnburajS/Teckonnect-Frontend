import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import BadgeModal from '../../modals/BadgeModal';
import ResponseInfo from '../../UI/ResponseInfo';
import { sharedDataActions } from '../../store/shared-data-slice';
import { useDispatch } from 'react-redux';
import { clearModalBackdrop } from '../../shared/SharedService';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';

const BadgeRecognition = (props) => {
  const dispatch = useDispatch();
  const { filterBy, bulkUpdateState, getSelectedBadges, badgeData } = props;
  const filterByVal = filterBy ? filterBy.filter : true;
  // const [badgeData, setBadgeData] = useState({});
  const [badgeModalData, setBadgeModalData] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newModalData, setNewModelData] = useState(false);
  const [showModal, setShowModal] = useState({
    type: null,
    message: null,
    celebrations: { isCelebration: false, celebrationItem: '' },
  });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({
      type: null,
      message: null,
      celebrations: { isCelebration: false, celebrationItem: '' },
    });
  };

  const fetchDepartmentData = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: 'get',
      params: { active: true },
    };
    httpHandler(obj)
      .then((deptData) => {
        let optionsTemp = [];
        {
          deptData.data.map((deptValue) => {
            return optionsTemp.push({
              value: deptValue.id,
              label: deptValue.name,
            });
          });
        }
        setDeptOptions(optionsTemp);
      })
      .catch((error) => {
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const onClickBadgeModalData = (bModalData) => {
    setBadgeModalData([]);
    setShowBadgeModal(false);
    setTimeout(() => {
      dispatch(sharedDataActions.badgeAllUsersUpdate([]));
    }, 0);
    setShowBadgeModal(true);
    setBadgeModalData(bModalData);
    setNewModelData(true);
  };

  const getHashTag = (arg) => {
    const arr = [];
    arg.map((res) => {
      return arr.push(`#${res.hashtagName}`);
    });
    return arr.join(', ');
  };

  const badgeModifyHandler = (e) => {
    const { value, checked } = e.target;
    var selectedCheckTemp = [...checkedBoxes];
    if (checked) {
      selectedCheckTemp = [...selectedCheckTemp, value];
    } else {
      selectedCheckTemp.splice(checkedBoxes.indexOf(value), 1);
    }
    getSelectedBadges(selectedCheckTemp);
    setCheckedBoxes(selectedCheckTemp);
  };

  const badgeModalSubmitInfo = (arg) => {
    if (arg.status) {
      clearModalBackdrop();
      setShowBadgeModal(false);
      setShowModal({
        ...showModal,
        type: 'success',
        success: arg.success,
        message: arg.message,
        celebrations: {
          isCelebration: true,
          celebrationItem: 'partypapers.gif',
        },
      });
    }
  };

  const handleClose = () => {
    setNewModelData(false);
  };

  return (
    <React.Fragment>
      {showBadgeModal && (
        <BadgeModal
          modalData={badgeModalData}
          deptOptions={deptOptions}
          showBadgeModal={showBadgeModal}
          badgeModalSubmitInfo={badgeModalSubmitInfo}
          handleClose={handleClose}
          newModalData={newModalData}
        />
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
      <div
        className={`${
          badgeData.length <= 0 ? 'h-100 ' : 'mt-4'
        } row eep-content-start eep-mybadge-div`}
        id="content-start"
      >
        {badgeData &&
          badgeData.length > 0 &&
          badgeData.map((data, index) => (
            <div
              className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-left badge_col_div"
              key={'recognition_' + index}
            >
              <div
                className={
                  bulkUpdateState
                    ? (bulkUpdateState.bulkState || !filterByVal
                        ? 'badge_modify_a '
                        : '') + 'badge_modal_a box9'
                    : 'badge_modal_a box9'
                }
              >
                <div className="badge_assign_div">
                  <div className="outter">
                    <img
                      src={
                        data?.imageByte?.image
                          ? data.imageByte.image
                          : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                      }
                      className="badge_img"
                      alt={data.imageByte ? data.imageByte.name : 'Badge Icon'}
                      title={
                        data.imageByte ? data.imageByte.name : 'Badge Icon'
                      }
                    />
                    {bulkUpdateState && bulkUpdateState.bulkState && (
                      <div className="b_ctrl_div c1 b_hide_ctrl_div">
                        <div className="form-check">
                          <input
                            className="form-check-input p_check_all badge-list"
                            type="checkbox"
                            value={data.id}
                            id={'badges_' + index}
                            onClick={badgeModifyHandler}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="badge_info_div">
                      <p className="badge_info font-helvetica-m">{data.name}</p>
                      <p
                        className="badge_info badge_info_hash eep_truncate"
                        style={{ maxWidth: '100%' }}
                      >
                        {data?.hashTag?.length > 0
                          ? getHashTag(data.hashTag)
                          : '---'}
                      </p>
                      <p className="badge_info font-helvetica-m">
                        {data.points}
                      </p>
                    </div>
                  </div>
                </div>
                <a
                  href=""
                  onClick={() => onClickBadgeModalData(data)}
                  data-toggle="modal"
                  data-target="#badgeRecogniseModal"
                >
                  <div className="box-content">
                    <h3 className="title">{data.name}</h3>
                    <p className="desc_p">Peer Recognition</p>
                    <ul className="icon">
                      <li>
                        <a
                          className="badge_modal_a c1"
                          badgename="Explorer"
                          data-toggle="modal"
                          data-target="#badgeRecogniseModal"
                          onClick={() => onClickBadgeModalData(data)}
                        >
                          <FontAwesomeIcon icon={faAward} />
                        </a>
                      </li>
                    </ul>
                  </div>
                </a>
              </div>
            </div>
          ))}
        {badgeData && badgeData.length <= 0 && (
          <ResponseInfo
            title="Yet to add Badges!"
            responseImg="noRecord"
            responseClass="response-info"
          />
        )}
      </div>
    </React.Fragment>
  );
};
export default BadgeRecognition;

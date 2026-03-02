import React, { useEffect, useState } from 'react';
import PageHeader from '../../UI/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import { sharedDataActions } from '../../store/shared-data-slice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AwardNominationInfo from './AwardNominationInfo';
import AwardNominationInput from './AwardNominationInput';
import AwardRecognizeModal from '../../modals/AwardRecognizeModal';
import { clearModalBackdrop } from '../../shared/SharedService';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import ResponseInfo from '../../UI/ResponseInfo';

const AwardNominations = () => {
  const getLocation = useLocation();
  const eepHistory = useNavigate();
  const aDataValue = getLocation.state ? getLocation.state?.aData : '';
  const [aDataVal, setADataVal] = useState(aDataValue);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const dispatch = useDispatch();
  const [isCommonMsg, setIsCommonMsg] = useState({ isChecked: false });
  const [commonMsgValue, setCommonMsgValue] = useState('');
  const [confirmSelectedDataVal, setConfirmSelectedDataVal] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const filteredUsers = useSelector(
    (state) => state.sharedData.awardNominators.users
  );
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [hashData, setHashData] = useState([]);
  const msgMaxLength = 120;
  const [isAwardRecognizeModal, setIsAwardRecognizeModal] = useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  useEffect(() => {
    if (aDataValue) {
      setADataVal(aDataValue);
    }
  }, [aDataValue]);

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'RECOGNIZE',
      link: 'app/recognition',
    },
    {
      label: 'Awards',
      link: 'app/awards',
    },
    ,
    {
      label:
        aDataVal && aDataVal?.type === 'spot_award'
          ? 'Spot Award'
          : 'Nominate Award',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Recognition',
      })
    );

    getUsersList();

    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const getUsersList = () => {
    let deptID = aDataVal
      ? aDataVal?.type === 'spot_award'
        ? aDataVal.departmentId?.id
        : aDataVal?.type === 'nomi_award'
        ? aDataVal?.departmentId?.id || aDataVal?.nominatorId?.department?.id
        : null
      : null;

    const obj = {
      url: URL_CONFIG.DEPT_USERS,
      method: 'get',
      params: { dept: deptID },
    };
    httpHandler(obj)
      .then((uData) => {
        const currentUserData = sessionStorage.userData
          ? JSON.parse(sessionStorage.userData)
          : {};
        let uDatas = [...uData.data];
        for (var i = 0; i < uDatas.length; i++) {
          if (uDatas[i].userId === currentUserData.id) {
            uDatas.splice(i, 1);
          }
        }
        uDatas.map((res) => {
          return (res['regSetting'] = Object.assign(
            {},
            {
              message: '',
              checkedState: false,
              hideShowState: false,
              showMessage: false,
            }
          ));
        });
        dispatch(
          sharedDataActions.getUsersListForAwardNominators({ uDatas: uDatas })
        );
      })
      .catch((error) => {});
  };

  const isCommonMessageChecked = (arg) => {
    const { checked } = arg.target;
    setIsCommonMsg({ isChecked: checked });
    if (checked) {
      const userList = JSON.parse(JSON.stringify(filteredUsers));
      for (let i = 0; i < userList.length; i++) {
        userList[i].regSetting.message = '';
      }
      dispatch(
        sharedDataActions.getUsersListForAwardNominators({ uDatas: userList })
      );
    }
  };

  const getCommonMessageValue = (e) => {
    e.target.value = e.target.value.substring(0, msgMaxLength);
    setCommonMsgValue(e.target.value);
    const userList = JSON.parse(JSON.stringify(filteredUsers));
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].regSetting.checkedState) {
        userList[i].regSetting.message = e.target.value;
      }
    }
    dispatch(
      sharedDataActions.getUsersListForAwardNominators({ uDatas: userList })
    );
  };

  useEffect(() => {
    if (!isCommonMsg.isChecked) {
      setCommonMsgValue('');
    }
  }, [isCommonMsg]);

  const confirmSelectedData = (arg) => {
    if (arg.length) {
      setBtnDisabled(false);
      setConfirmSelectedDataVal([...arg]);
    } else {
      setBtnDisabled(true);
    }
  };

  const onClickAwardModal = () => {
    setShowAwardModal(false);
    setTimeout(() => {
      setShowAwardModal(true);
    });
    setIsAwardRecognizeModal(true);
  };

  const getHashValues = (arg) => {
    setHashData([...arg]);
  };

  const modalSubmitInfo = (arg) => {
    if (arg.status) {
      clearModalBackdrop();
      setIsAwardRecognizeModal(false);
      setShowModal({
        ...showModal,
        type: 'success',
        message: arg.message,
        awardType: arg.awardType,
      });
    }
  };

  const closeModel = () => {
    setIsAwardRecognizeModal(false);
    hideModal();
  };

  return (
    <React.Fragment>
      {userRolePermission.awardNominatorAssignee && (
        <React.Fragment>
          <PageHeader
            title={
              aDataVal && aDataVal?.type === 'spot_award'
                ? 'Recognize Spot Award'
                : 'Nominate Award'
            }
            navLinksLeft={
              <Link
                className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                state={{
                  subTab: 'MyNominationsTab',
                  activeTab:
                    aDataVal && aDataVal?.type === 'spot_award'
                      ? 'SpotTab'
                      : 'MyActionTab',
                }}
                to={{
                  pathname: '/app/awards',
                  // state: ,
                }}
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.lessthan_circle,
                }}
              ></Link>
            }
          />
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
                  onClick={() => {
                    showModal?.awardType === 'spot_award'
                      ? eepHistory('/app/awards', {
                          state: { activeTab: 'SpotTab' },
                        })
                      : eepHistory('/app/awards', {
                          state: { activeTab: 'MyActionTab' },
                        });
                  }}
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
          {isAwardRecognizeModal && (
            <AwardRecognizeModal
              setIsAwardRecognizeModal={closeModel}
              aDataVal={aDataVal}
              confirmSelectedDataVal={confirmSelectedDataVal}
              showAwardModal={showAwardModal}
              hashVal={hashData}
              modalSubmitInfo={modalSubmitInfo}
            />
          )}
          <div className="row r_award_row_div">
            <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-left">
              <div className="bg-f5f5f5 br-10 h-100 position-relative">
                {aDataVal && aDataVal?.type === 'spot_award' && (
                  <React.Fragment>
                    <div className="r_award_type">
                      <label className="mb-0">Spot</label>
                    </div>
                  </React.Fragment>
                )}
                <div className="p-4">
                  <div className="r_award_lcol_div">
                    <AwardNominationInfo
                      aDataVal={aDataVal}
                      isCommonMessageChecked={isCommonMessageChecked}
                      getCommonMessageValue={getCommonMessageValue}
                      getHashValues={getHashValues}
                      isCommonMsg={isCommonMsg}
                      commonMsgValue={commonMsgValue}
                    />
                    <div className="col-md-12 px-0 text-center r_award_next_div">
                      <button
                        type="submit"
                        className="eep-btn eep-btn-success r_award_next"
                        data-toggle="modal"
                        data-target="#AwardRecognizeModal"
                        onClick={() => onClickAwardModal()}
                        disabled={btnDisabled}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-lg-8 col-xs-12 col-sm-12 assign_users_list_whole_div">
              <AwardNominationInput
                aDataVal={aDataVal}
                isCommonMsg={isCommonMsg}
                commonMsgValue={commonMsgValue}
                confirmSelectedData={confirmSelectedData}
              />
            </div>
          </div>
        </React.Fragment>
      )}
      {!userRolePermission?.awardNominatorAssignee && (
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illegal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      )}
    </React.Fragment>
  );
};
export default AwardNominations;

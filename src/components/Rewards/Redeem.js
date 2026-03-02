/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import { REST_CONFIG, URL_CONFIG } from '../../constants/rest-config';
import { fetchUserPermissions, getCurrencyForCounty } from '../../helpers';
import { httpHandler } from '../../http/http-interceptor';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import RedomModalDetails from '../../modals/redeemDetails';
import RedeemModalDetails from '../../modals/RedeemModalDetails';

import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { userProfile } from '../../store/user-profile';
import './style.css';
import axios from 'axios';
import { categoryCampleJsonUAE, productSampleJsonUAE } from './Catalog';

const Redeem = () => {
  const history = useNavigate();
  const userDetails = sessionStorage.getItem('userData');
  //const redeemPointsDetails = useSelector((state) => state.storeState.userProfile);
  const [showGiftCardsAll, setShowGiftCardsAll] = useState(false);
  const [showModal, setShowModal] = useState({
    type: null,
    message: null,
    isCelebration: true,
  });
  const [searchUser, setSearchUser] = useState('');
  const [state, setState] = useState({
    data: [],
    product: [],
    model: false,
    isEdit: {},
    qty: 1,
    points: {},
    isSelect: null,
  });
  const [pointsList, setPointsList] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [pointsData, setPointsData] = useState({});
  const [redeemDetailsData, setRedeemDetailsData] = useState({
    model: false,
    inventoryData: {},
    data: {},
  });

  const [failureStateMessage, setFailureStateMessage] = useState('');

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Catalog',
      link: 'app/redeem',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Redeem',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  const fetchRedeem = () => {
    // axios.get(`${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${URL_CONFIG.GIFT_VOUCHER}`)
    //   .then(response => {
    state['data'] = categoryCampleJsonUAE;
    state['product'] = productSampleJsonUAE;
    setState({ ...state });
    // })
    // .catch(error => {

    // });
    // let obj;
    // obj = {
    //   url: URL_CONFIG.,
    //   method: "get"
    // };
    // httpHandler(obj).then((response) => {
    //   setPointsList(response.data);
    // }).catch((error) => {
    //   //const errMsg = error.response?.data?.message;
    // });

    axios
      .get(`${REST_CONFIG.DIGIURL}/v2/inventory/`, {
        headers: { Authorization: `Basic ${REST_CONFIG.DIGIAUTH}` },
      })
      .then((response) => {
        // setInventoryData(response?.data);
      })
      .catch((error) => {});

    const obj = {
      url: 'v2/vendor/',
      method: 'get',
      payload: { data: { isDigiRewardVal: true } },
      isDigiReward: true,
    };

    // httpHandler(obj)
    //   .then((response) => {

    //   })
    //   .catch((error) => {
    //     const errMsg = error.response?.data?.message;

    //   });
  };
  const fetchPoints = (paramsInfo = {}) => {
    let obj;

    obj = {
      url: URL_CONFIG.GET_POINTS,
      method: 'get',
    };

    httpHandler(obj)
      .then((response) => {
        setPointsList(response.data);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };
  const clickHandler = () => {
    setShowGiftCardsAll((pre) => !pre);
  };

  const getPointsValue = async () => {
    const obj = {
      url: URL_CONFIG.GET_POINTS_VALUE,
      method: 'get',
    };
    const data = await httpHandler(obj);
    state['points'] = data?.data?.data ?? {};
    setState({ ...state });
    setPointsData(data?.data?.data ?? {});
  };

  useEffect(() => {
    fetchRedeem();
    getPointsValue();
    fetchPoints();
  }, []);

  const redeemPonts = async (data, redeemPonint) => {
    state.model = false;
    setState({ ...state });
    await saveRedeemption(data, redeemPonint);
    dispatch(userProfile.updateState(state ?? ''));
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
  };

  const reedPointsModel = (data) => {
    state.model = true;
    state.isEdit = data;
    setState({ ...state });
  };

  const redeemPointsModel = (rData) => {
    let redeemDetailsDataTemp = {};
    redeemDetailsDataTemp.model = true;
    redeemDetailsDataTemp.inventoryData = inventoryData;
    redeemDetailsDataTemp.data = rData;
    setRedeemDetailsData(redeemDetailsDataTemp);
  };

  const saveRedeemption = async (data, redeemPonint) => {
    const obj = {
      url: URL_CONFIG.POST_REDEEM,
      method: 'post',
      payload: {
        points: redeemPonint,
        name: data?.name,
        image: data?.images?.thumbnail,
        coupon: data?.coupon,
        redeem_details: data ?? null,
      },
    };
    await httpHandler(obj)
      .then(() => {
        setShowModal({
          ...showModal,
          type: 'success',
          message: (
            <div>
              Your redeeming coupon is attached and also sent via mail. Please
              copy it, go to your account, and apply it.
              <br />
              <div className="copy-button">
                <input
                  id="copyvalue"
                  type="text"
                  disabled
                  value="AVO0A090292"
                />
                <button onClick={() => copyIt()} className="copybtn">
                  <img
                    width={'18px'}
                    alt="Icon"
                    src="../images/icons8-duplicate.svg"
                  />
                </button>
              </div>
            </div>
          ),
          celebrations: {
            isCelebration: true,
            celebrationItem: 'partypapers.gif',
          },
        });
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: error?.response?.data?.message,
        });
      });

    await fetchUserPermissions(dispatch);
  };

  const copyIt = () => {
    let copyInput = document.querySelector('#copyvalue');
    copyInput.select();
    document.execCommand('copy');
  };

  const handleChange = (value, price) => {
    if (!value) {
      state.qty = '';
      setState({ ...state });
      return;
    }

    const user_points =
      (JSON.parse(userDetails)?.allPoints ?? 0) *
        parseInt(state?.points?.value_peer_points) ?? 0;
    const multi = getCurrencyForCounty(
      JSON.parse(sessionStorage.getItem('userData'))?.countryDetails
        ?.country_name ?? '',
      user_points,
      parseInt(value)
    );

    if (parseInt(price?.max) < multi) {
      return;
    } else {
      state.qty = value;
      setState({ ...state });
    }
  };

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const openModal = () => {
    hideModal();
    history('/app/points');
  };

  const selectCtegorys = (item) => {
    setSearchUser('');
    state.isSelect = item;
    setState({ ...state });
  };

  const filterData = searchUser
    ? state?.product?.filter((item) =>
        item?.name?.toLowerCase()?.includes(searchUser?.toLowerCase())
      )
    : state?.product?.filter((item) => {
        const selectedCategoryId = state?.isSelect?.id;
        // Show all products if isSelect.id is 0, or if isSelect.id is undefined
        return (
          selectedCategoryId === 0 ||
          selectedCategoryId === undefined ||
          item?.categories?.includes(selectedCategoryId)
        );
      });

  const copyGiftCode = (text) => {
    navigator.clipboard.writeText(text);
  };

  const redeemSubmitAction = (redeemResponse) => {
    redeemDetailsData.model = false;
    setRedeemDetailsData({ ...redeemDetailsData });
    setShowModal({
      ...showModal,
      type: 'success',
      message: (
        <div>
          Your redeeming coupon is attached and also sent via mail. Please copy
          it, go to your account, and apply it.
          <br />
          <div className="copy-button">
            <input
              id="copyvalue"
              type="text"
              disabled
              value={redeemResponse?.data?.card_number}
            />
            <button
              onClick={() => copyGiftCode(redeemResponse?.data?.card_number)}
              className="copybtn"
            >
              <img width={'18px'} src="../images/icons8-duplicate.svg" />
            </button>
          </div>
        </div>
      ),
      celebrations: { isCelebration: true, celebrationItem: 'partypapers.gif' },
    });
    fetchUserPermissions(dispatch);
  };

  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <div onClick={openModal}>
              <button className="eep-btn eep-btn-success">Ok</button>
            </div>
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

      {state?.model && (
        <RedomModalDetails
          qty={state?.qty ?? ''}
          userDetails={userDetails}
          data={state?.isEdit}
          value_peer_points={parseInt(state?.points?.value_peer_points)}
          handleChange={handleChange}
          redeemPonts={redeemPonts}
          pointsDatas={pointsData}
          pointsList={pointsList}
        />
      )}

      {redeemDetailsData?.model && (
        <RedeemModalDetails
          userDetails={userDetails}
          redeemDetails={redeemDetailsData}
          pointsDatas={pointsData}
          redeemSubmitFunction={redeemSubmitAction}
          failureState={failureStateMessage}
          pointsList={pointsList}
        />
      )}

      <PageHeader title={`Catalog`} />

      <div className="category">
        {state?.data?.map((item, i) => {
          return (
            <div
              className={`category_button ${
                // i === 0
                (state.isSelect?.id
                  ? state.isSelect?.id === item?.id
                  : i == 0) && 'select'
              }`}
              onClick={() => selectCtegorys(item)}
            >
              {i !== 0 && (
                <img
                  width={'14px'}
                  alt="Logo Small"
                  height={'14px'}
                  src={item?.brand_logo?.small}
                />
              )}
              <span>&nbsp;{item?.name}&nbsp;</span>
            </div>
          );
        })}
      </div>

      <div
        className="search_input input-group custom-search-form"
        // style={{
        //   border: '1px solid #d3d3d34f',
        //   borderRadius: '4px',
        // }}
      >
        <input
          type="text"
          className="form-control search_users_b px-3"
          placeholder="Search..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <span className="input-group-btn">
          <button className="btn btn-default" type="button">
            <img
              src={`${process.env.PUBLIC_URL}/images/icons/search.svg`}
              className="search_users_b_box c1"
              width="20"
              alt="Search Participants"
            />
          </button>
        </span>
      </div>

      <div className="row eep-content-start no-gutters">
        <div className="col-md-12 mb-3">
          {!showGiftCardsAll && (
            <div className="redeemCard_div_min">
              <div className="row" style={{ flexWrap: 'wrap' }}>
                {filterData?.map((item) => {
                  const currentDate = new Date();
                  item?.discounts?.sort((a, b) => b.priority - a.priority);
                  const firstActiveDiscount = item?.discounts.find(
                    (discount) => {
                      const startDate = new Date(discount.startDate);
                      const endDate = new Date(discount.endDate);
                      return startDate <= currentDate && currentDate <= endDate;
                    }
                  );
                  return item?.price?.price <=
                    (JSON.parse(userDetails)?.allPoints ?? 0) *
                      parseInt(state?.points?.value_peer_points) ? (
                    <div
                      className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3"
                      style={{ cursor: 'pointer' }}
                    >
                      <a
                        data-toggle="modal"
                        data-target="#RedomModalDetails"
                        className="list-item"
                        onClick={() =>
                          reedPointsModel({
                            ...item,
                            coupon: firstActiveDiscount?.coupon?.code,
                          })
                        }
                      >
                        <div className="list-content">
                          <div className="redeem_icon_div">
                            <img
                              src={item?.images?.thumbnail}
                              className="redeem_icon"
                              alt={item?.name}
                              title={item?.name}
                              width={'100%'}
                              height={'100%'}
                            />
                            <span className="discount_off">
                              {firstActiveDiscount?.discount?.amount ?? 0}% OFF
                            </span>
                          </div>
                          <div className="content">
                            <label className="redeemIcon_label font-helvetica-m titlesx">
                              {item?.name}
                            </label>
                          </div>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3 list-item">
                      <div
                        className="list-content"
                        style={{
                          opacity: '0.6',
                          background: '#80808052',
                        }}
                      >
                        <div className="redeem_icon_div">
                          <img
                            src={item?.images?.thumbnail}
                            className="redeem_icon"
                            alt={item?.name}
                            title={item?.name}
                            width={'100%'}
                            height={'100%'}
                          />
                          <span className="discount_off">12% OFF</span>
                        </div>
                        <div className="content">
                          <label className="redeemIcon_label font-helvetica-m titlesx">
                            {item?.name}
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filterData?.length === 0 && (
            <div style={{ textAlign: 'center' }}>No Data!.</div>
          )}
        </div>
      </div>

      <div className="row eep-content-start no-gutters">
        <div className="col-md-12 mb-3">
          {!showGiftCardsAll && (
            <div className="redeemCard_div_min">
              <div className="row" style={{ flexWrap: 'wrap' }}>
                {inventoryData &&
                  inventoryData?.vendors &&
                  inventoryData?.vendors.map((item) => {
                    return JSON.parse(userDetails)?.allPoints >= 0 ? (
                      <div
                        className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3"
                        style={{ cursor: 'pointer' }}
                      >
                        <a
                          data-toggle="modal"
                          data-target="#RedeemModalDetails"
                          className="list-item"
                          onClick={() => redeemPointsModel(item)}
                        >
                          <div className="list-content">
                            <div className="redeem_icon_div">
                              <img
                                src={item?.vendorLogo}
                                className="redeem_iconn"
                                alt={item?.name}
                                title={item?.name}
                                width={'100%'}
                                height={'100%'}
                              />
                              {/* <span className="discount_off">0% OFF</span> */}
                            </div>
                            <div className="content">
                              <label className="redeemIcon_label font-helvetica-m titlesx">
                                {item?.name}
                              </label>
                            </div>
                          </div>
                        </a>
                      </div>
                    ) : (
                      <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3 list-item">
                        <div
                          className="list-content"
                          style={{
                            opacity: '0.6',
                            background: '#80808052',
                          }}
                        >
                          <div className="redeem_icon_div">
                            <img
                              src={item?.images?.thumbnail}
                              className="redeem_icon"
                              alt={item?.name}
                              title={item?.name}
                              width={'100%'}
                              height={'100%'}
                            />
                            <span className="discount_off">12% OFF</span>
                          </div>
                          <div className="content">
                            <label className="redeemIcon_label font-helvetica-m titlesx">
                              {item?.name}
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Redeem;

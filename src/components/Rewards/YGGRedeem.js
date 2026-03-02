/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import { REST_CONFIG, URL_CONFIG } from "../../constants/rest-config";
import {
  fetchUserPermissions,
  getCurrencyForCounty,
  pageLoaderHandler,
} from "../../helpers";
import { httpHandler } from "../../http/http-interceptor";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import RedomModalDetails from "../../modals/redeemDetails";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { userProfile } from "../../store/user-profile";
import "./style.css";

import { getYggBrandList } from "../../store/yggRedeemThunk";
import RedeemModelYGG from "../../modals/RedeemModelYGG";
import ResponseInfo from "../../UI/ResponseInfo";
import Isloading from "../../UI/CustomComponents/Isloading";

const YGGRedeem = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const userDetails = sessionStorage.getItem("userData");
  const yggBrands = useSelector(
    (state) => state?.ygg?.getYggBrandList?.data?.data
  );
  const yggBrandsLoading = useSelector((state) => state?.ygg?.getYggBrandList);
  const [filterData, setFilterData] = useState(
    yggBrands?.product ? yggBrands?.product : []
  );
  const [showModal, setShowModal] = useState({
    type: null,
    message: null,
    isCelebration: true,
  });
  const [searchUser, setSearchUser] = useState("");
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
  const [pointsData, setPointsData] = useState({});
  const [redeemDetailsData, setRedeemDetailsData] = useState({
    model: false,
    data: {},
  });

  const [failureStateMessage, setFailureStateMessage] = useState("");

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Catalog",
      link: "app/redeem",
    },
  ];

  useEffect(() => {
    dispatch(
      getYggBrandList({
        currencyCode: "INR",
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Redeem",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  });

  useEffect(() => {
    pageLoaderHandler(yggBrandsLoading?.loading ? "show" : "hide");
  }, []);

  useEffect(() => {
    state["data"] = yggBrands?.productType;
    state["product"] = yggBrands?.product;
    setFilterData(yggBrands?.product);
  }, [yggBrands]);

  // useEffect(() => {
  //   if (yggBrands && yggBrands.length > 0) {
  //     const categories = extractUniqueCategories(yggBrands);
  //     setState((prev) => ({
  //       ...prev,
  //       data: categories,
  //       product: yggBrands,
  //     }));
  //     setFilterData(yggBrands);
  //     // setIsLoading(false);
  //   }
  // }, [yggBrands]);

  const fetchPoints = (paramsInfo = {}) => {
    let obj;

    obj = {
      url: URL_CONFIG.GET_POINTS,
      method: "get",
    };

    httpHandler(obj)
      .then((response) => {
        setPointsList(response.data);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  const getPointsValue = async () => {
    const obj = {
      url: URL_CONFIG.GET_POINTS_VALUE,
      method: "get",
    };
    const data = await httpHandler(obj);
    state["points"] = data?.data?.data ?? {};
    setState({ ...state });
    setPointsData(data?.data?.data ?? {});
  };

  useEffect(() => {
    // fetchRedeem();
    getPointsValue();
    fetchPoints();
  }, []);

  const redeemPonts = async (data, redeemPonint) => {
    state.model = false;
    setState({ ...state });
    await saveRedeemption(data, redeemPonint);
    dispatch(userProfile.updateState(state ?? ""));
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
  };

  const redeemPointsModelYgg = (rData) => {
    let redeemDetailsDataTemp = {};
    redeemDetailsDataTemp.model = true;
    redeemDetailsDataTemp.data = rData;
    setRedeemDetailsData(redeemDetailsDataTemp);
  };

  const saveRedeemption = async (data, redeemPonint) => {
    const obj = {
      url: URL_CONFIG.POST_REDEEM,
      method: "post",
      payload: {
        points: redeemPonint,
        name: data?.name,
        image: data?.product_image,
        coupon: data?.coupon,
        redeem_details: data ?? null,
      },
    };
    await httpHandler(obj)
      .then(() => {
        setShowModal({
          ...showModal,
          type: "success",
          message: (
            <div>
              Your coupon is attached and emailed. Copy it, log in to your
              account, and apply it at checkout.
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
                    width={"18px"}
                    alt="Icon"
                    src="../images/icons8-duplicate.svg"
                  />
                </button>
              </div>
            </div>
          ),
          celebrations: {
            isCelebration: true,
            celebrationItem: "partypapers.gif",
          },
        });
      })
      .catch((error) => {
        setShowModal({
          ...showModal,
          type: "danger",
          message: error?.response?.data?.message,
        });
      });

    await fetchUserPermissions(dispatch);
  };

  const copyIt = () => {
    let copyInput = document.querySelector("#copyvalue");
    copyInput.select();
    document.execCommand("copy");
  };

  const handleChange = (value, price) => {
    if (!value) {
      state.qty = "";
      setState({ ...state });
      return;
    }

    const user_points =
      (JSON.parse(userDetails)?.allPoints ?? 0) *
        parseInt(state?.points?.value_peer_points) ?? 0;
    const multi = getCurrencyForCounty(
      JSON.parse(sessionStorage.getItem("userData"))?.countryDetails
        ?.country_name ?? "",
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
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const openModal = () => {
    hideModal();
    history("/app/points");
  };

  const selectCtegorys = (item) => {
    setSearchUser("");
    state.isSelect = item;
    setState({ ...state });
  };

  useEffect(() => {
    const selectedCategoryId = state?.isSelect?.id;
    const filtered = yggBrands?.product?.filter((item) => {
      if (searchUser) {
        return item?.name?.toLowerCase()?.includes(searchUser.toLowerCase());
      }

      // If category is "All" (id === 0) or no category is selected
      if (selectedCategoryId === 0 || selectedCategoryId === undefined) {
        return item;
      }

      // Otherwise, match specific category
      return item?.categories?.some((cat) => cat.id === selectedCategoryId);
    });

    setFilterData(filtered ?? []);
  }, [searchUser, state?.isSelect]);

  const copyGiftCode = (text) => {
    navigator.clipboard.writeText(text);
  };

  const redeemSubmitActionYGG = (redeemResponse, redeemPointsVal) => {
    redeemDetailsData.model = false;
    setRedeemDetailsData({ ...redeemDetailsData });
    setShowModal({
      ...showModal,
      type: "success",
      message: (
        <div className="text-center">
          <p className="fw-semibold mb-4">
            Your coupon is attached and emailed. Copy it, log in to your
            account, and apply it at checkout.
          </p>

          {["code", "url", "pin"].map((label) => {
            const value = JSON.parse(
              redeemResponse?.data?.response_data
            )?.gift_voucher.find((data) => data?.label === label)?.value;
            if (!value) return null;
            const labelTitle = {
              code: "Promo code",
              url: "Site",
              pin: "Pin",
            }[label];
            const image = {
              code: process.env.PUBLIC_URL + "/images/icons8-duplicate.svg",
              url: process.env.PUBLIC_URL + "/images/link.svg",
              pin: process.env.PUBLIC_URL + "/images/pin.svg",
            }[label];
            const navigator = {
              code: () => copyGiftCode(value),
              url: () => (window.location.href = value),
              pin: () => copyGiftCode(value),
            }[label];
            return (
              <div key={label} className="text-align-justify">
                <label
                  className=" fs-12"
                  style={{ width: "100px", minWidth: "80px", margin: "0" }}
                >
                  {labelTitle}
                </label>
                <div className="copy-button d-flex align-items-center mb-1">
                  <input
                    type="text"
                    disabled
                    className=""
                    value={value}
                    style={{ flexGrow: 1 }}
                  />
                  <button onClick={navigator} className="copybtn" title="Copy">
                    <img width="18px" src={image} alt="Copy" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-align-justify mt-3 fs-12 ">
            XP remaining after order:{" "}
            {JSON.parse(userDetails)?.allPoints - redeemPointsVal}
          </div>
        </div>
      ),
      celebrations: { isCelebration: true, celebrationItem: "partypapers.gif" },
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
          qty={state?.qty ?? ""}
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
        <RedeemModelYGG
          isOpen={redeemDetailsData?.model}
          onClose={() =>
            setRedeemDetailsData({ ...redeemDetailsData, model: false })
          }
          userDetails={userDetails}
          redeemDetails={redeemDetailsData}
          pointsDatas={pointsData}
          redeemSubmitFunction={redeemSubmitActionYGG}
          failureState={failureStateMessage}
          pointsList={pointsList}
        />
      )}

      <PageHeader title={`Catalog`} />

      {yggBrandsLoading?.loading ? (
        <Isloading />
      ) : (
        <>
          {yggBrands?.product?.length > 0 && yggBrands?.productType && (
            <div className="category">
              {yggBrands?.productType?.map((item, i) => {
                const isSelected = state.isSelect?.id
                  ? state.isSelect?.id === item?.id
                  : i === 0;

                return (
                  <div
                    key={item?.id || i}
                    className={`category_button ${isSelected ? "select" : ""}`}
                    onClick={() => selectCtegorys(item)}
                  >
                    <span>&nbsp;{item?.name}&nbsp;</span>
                  </div>
                );
              })}
            </div>
          )}

          {yggBrands?.product?.length > 0 && (
            <div
              className="search_input input-group custom-search-form"
              style={{
                border: "1px solid #d3d3d34f",
                borderRadius: "4px",
              }}
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
          )}

          {filterData?.length > 0 && (
            <div className="redeemCard_div_min">
              <div className="row" style={{ flexWrap: "wrap" }}>
                {filterData?.map((item) => {
                  const firstActiveDiscount = {};
                  return JSON.parse(userDetails)?.allPoints >= 0 ? (
                    <div
                      className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3"
                      style={{ cursor: "pointer" }}
                    >
                      <a
                        data-toggle="modal"
                        data-target="#RedeemModalDetailsYgg"
                        className="list-item"
                        onClick={() => redeemPointsModelYgg(item)}
                      >
                        <div className="list-content">
                          <div className="redeem_icon_div">
                            <img
                              loading="lazy"
                              src={item?.product_image}
                              className="redeem_icon"
                              alt={item?.name}
                              title={item?.name}
                              width={"100%"}
                              height={"100%"}
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
                          opacity: "0.6",
                          background: "#80808052",
                        }}
                      >
                        <div className="redeem_icon_div">
                          <img
                            src={item?.product_image}
                            className="redeem_icon"
                            alt={item?.name}
                            title={item?.name}
                            width={"100%"}
                            height={"100%"}
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
            <ResponseInfo
              title="No record found!."
              responseImg="noRecord"
              responseClass="response-info"
            />
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default YGGRedeem;

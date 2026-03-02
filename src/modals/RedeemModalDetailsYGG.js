import React, { useEffect, useState } from 'react';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';
import ToolTip from './ToolTip';

const RedeemModalDetailsYGG = (props) => {
  const { userDetails, redeemDetails, pointsDatas, redeemSubmitFunction } =
    props;

  const description = redeemDetails?.data?.description
    ? redeemDetails?.data?.description
    : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
  const [priceDetails, setPriceDetails] = useState({});
  const [fixedOptions, setFixedOptions] = useState([]);
  const [minMax, setMinMax] = useState({ MinVal: 0, MaxVal: 0 });
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [failureStatus, setFailureStatus] = useState('');
  const [qtyValue, setQtyValue] = useState(0);
  useEffect(() => {
    // Extract and set price details
    const redeemDetailsTemp = redeemDetails?.data ?? {};
    setPriceDetails(redeemDetailsTemp?.denominations?.INR);
    setRedeemPoints(0);
    setInputValue('');
    setSelectedValue('');

    // Calculate Min and Max values
    if (redeemDetailsTemp) {
      const minMaxValues = calculateMinMax(
        redeemDetailsTemp,
        JSON.parse(userDetails)?.allPoints,
        pointsDatas?.value_peer_points
      );
      setMinMax(minMaxValues);
      //setInputValue(minMax.MinVal || "");
      //setRedeemPoints(minMax.MinVal * parseInt(pointsDatas?.value_peer_points));

      // Set fixed options if applicable
      if (!isPlainObject(redeemDetailsTemp?.denominations?.INR)) {
        const options = redeemDetailsTemp?.denominations?.INR.filter(
          (item) => item.amount <= minMaxValues.MaxVal && item?.is_active
        ) // Filter valid items
          .map((item) => ({ label: item.amount, value: item.amount })); // Map to desired structure

        setFixedOptions(options); // Update state with valid options
      }
    }
  }, [redeemDetails, userDetails, pointsDatas]);

  const calculateMinMax = (data, userPoints, pointsPerRedeem) => {
    let MinVal = 0;
    let MaxVal = 0;
    if (isPlainObject(data?.denominations?.INR)) {
      const { min, max } = data?.denominations?.INR;
      MinVal = min;
      MaxVal = Math.min(Math.floor(userPoints / pointsPerRedeem), max);

      if (userPoints < MinVal * pointsPerRedeem) {
        MinVal = 0;
        MaxVal = 0;
      }
    } else if (!isPlainObject(data?.denominations?.INR)) {
      const validOptions = data?.denominations?.INR.filter(
        (option) => option.amount * pointsPerRedeem <= userPoints
      );
      if (validOptions.length > 0) {
        MinVal = validOptions[0].amount;
        MaxVal = validOptions[validOptions.length - 1].amount;
      }
    }

    return { MinVal, MaxVal };
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setFailureStatus('');
    if (isNaN(value)) {
      setErrorMessage('Please enter a valid number.');
      setInputValue(0);
      setRedeemPoints(0);
      setQtyValue(0);
    } else if (value < minMax.MinVal || value > minMax.MaxVal) {
      setErrorMessage(
        `Value must be between ${minMax.MinVal} and ${minMax.MaxVal}.`
      );
      setInputValue(value);
      setQtyValue(0);
      setRedeemPoints(0);
    } else {
      setErrorMessage('');
      setInputValue(value);
      setQtyValue(value);
      setRedeemPoints(value * parseInt(pointsDatas?.value_peer_points));
    }
  };

  const handleSelectChange = (event) => {
    setRedeemPoints(0);
    setFailureStatus('');
    setSelectedValue(event.target.value);
    setQtyValue(event.target.value);
    setRedeemPoints(
      event.target.value * parseInt(pointsDatas?.value_peer_points)
    );
  };

  const getCurrencyValue = (dataObject) => {
    const vendorCode = dataObject?.data?.vendorCode; // Extract vendorCode from data object
    const inventory = dataObject?.inventoryData?.inventories[vendorCode]; // Get inventory data for the vendorCode

    if (!inventory) {
      return false;
    }

    // Check if fixed is not null and return the currency value
    if (inventory.fixed && inventory.fixed.length > 0) {
      return inventory.fixed[0].currency; // Return currency of the first fixed value
    }

    // Check if range is not null and return the currency value
    if (inventory.range) {
      return inventory.range.currency;
    }

    return false;
  };

  const redeemSubmitActionYGG = (
    redeemDetailsData,
    redeemPointsVal,
    qtyValueVal
  ) => {
    // const currencyValidate = getCurrencyValue(redeemDetailsData);
    if (qtyValueVal) {
      const rData = {
        brand_code: redeemDetailsData?.data?.brand_code,
        currency: redeemDetailsData?.data?.brand_accepted_currency,
        amount: qtyValueVal,
        country: redeemDetailsData?.data?.country?.code,
        receiver_name: `${JSON.parse(userDetails)?.fullName}`,
        receiver_email: JSON.parse(userDetails)?.email,
        receiver_phone: '',
        message: 'Well Done!,\nI thought you would like this gift!',
        extra_fields: {},
        delivery_language: 'en',
        point: redeemPointsVal,
        name: redeemDetailsData?.data?.name,
        image: redeemDetailsData?.data?.product_image,
      };
      const obj = {
        url: URL_CONFIG.YGGORDER,
        method: 'post',
        payload: rData,
      };
      httpHandler(obj)
        .then((response) => {
          setFailureStatus('');

          redeemSubmitFunction(response?.data ?? {});
        })
        .catch((error) => {
          const errmsg =
            error?.response?.data?.message ??
            'Something went wrong! Please contact administrator.';
          setFailureStatus(errmsg);
        });
    }
  };
  function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  return (
    <div className="eepModalDiv reedem">
      <div
        className="modal fade"
        id="RedeemModalDetailsYgg"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-confirm modal-addmessage"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header flex-column p-0">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body eep_scroll_y p-0">
              <div className="modalBodyHeight">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="redeemIcon_label font-helvetica-m details-titlesx">
                    {redeemDetails?.data?.name}
                  </label>
                  <div className="pointsDetails">
                    <span className="mx-1">XP</span>
                    <span className="hilight_points">
                      {JSON.parse(userDetails)?.allPoints}
                    </span>
                    {/* {redeemPoints > 0 && (
                      <>
                        <span className="mx-1">Redeem</span>
                        <span className="hilight_points">
                          {redeemPoints}
                        </span>{' '}
                      </>
                    )} */}
                  </div>
                </div>
                <div className="reedem-details-flex">
                  <img
                    width="100%"
                    src={redeemDetails?.data?.product_image ?? ''}
                    className="details-img"
                  />
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    marginBottom: '10px',
                    color: '#000',
                  }}
                >
                  Description:
                  <ToolTip
                    title={redeemDetails?.data?.redemption_instructions}
                    arrow
                    placement="top-start"
                    backgroundColor="#e5e5e5"
                    color="#2c2c2c"
                    fontSize="10px"
                  >
                    <img
                      style={{ width: '13px' }}
                      src={process.env.PUBLIC_URL + '/images/instruction.svg'}
                    />
                  </ToolTip>
                </div>
                <label
                  className="redeemIcon_label discription"
                  style={{ opacity: 0.7 }}
                >
                  {description}
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div
                      className="mb-2"
                      style={{ fontSize: '13px', color: '#000' }}
                    >
                      Redeem XP:
                    </div>
                    <input
                      placeholder="XP"
                      type="text"
                      className="form-control field-input-outline"
                      value={redeemPoints ? redeemPoints : 0}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <div
                      className="mb-2"
                      style={{ fontSize: '13px', color: '#000' }}
                    >
                      Amount:
                    </div>
                    {isPlainObject(priceDetails) === true && (
                      <>
                        <input
                          placeholder="Amount"
                          type="text"
                          className="form-control field-input-outline"
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                        {errorMessage && (
                          <div
                            className="text-danger"
                            style={{ fontSize: '12px' }}
                          >
                            {errorMessage}
                          </div>
                        )}
                        <div className="min-max">
                          Min: {minMax.MinVal}, Max: {minMax.MaxVal}
                        </div>
                      </>
                    )}
                    {isPlainObject(priceDetails) == false && (
                      <select
                        className="form-control field-input-outline"
                        value={selectedValue} // Controlled component
                        onChange={handleSelectChange} // On change handler
                      >
                        <option
                          value=""
                          disabled
                        >
                          Select Amount
                        </option>
                        {fixedOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div
                  className="text-danger text-center"
                  style={{ fontSize: '12px' }}
                >
                  <span>{failureStatus}</span>
                </div>
                <a
                  style={{
                    width: '100%',
                    color: '#fff',
                    textAlign: 'center',
                    marginTop: '20px',
                    color: redeemPoints > 0 ? '#fff' : '#aaa',
                    pointerEvents: redeemPoints > 0 ? 'auto' : 'none', // Disable click events
                    cursor: redeemPoints > 0 ? 'pointer' : 'not-allowed', // Change cursor style
                  }}
                  className={`eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button c1 ${
                    redeemPoints > 0 ? '' : 'disabled'
                  }`}
                  data-toggle={redeemPoints > 0 ? 'modal' : undefined}
                  data-target={redeemPoints > 0 ? '#RedomModal' : undefined}
                  onClick={
                    redeemPoints > 0
                      ? () =>
                          redeemSubmitActionYGG(
                            redeemDetails,
                            redeemPoints,
                            qtyValue
                          )
                      : undefined
                  }
                >
                  Redeem Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemModalDetailsYGG;

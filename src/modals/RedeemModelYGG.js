import React, { useEffect, useState } from 'react';

import Modal from './Model';
import { Card, Col, Row } from 'react-bootstrap';
import ToolTip from './ToolTip';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';

const RedeemModelYGG = ({
  isOpen,
  onClose,
  userDetails,
  redeemDetails,
  pointsDatas,
  redeemSubmitFunction,
}) => {
  const description = redeemDetails?.data?.description
    ? redeemDetails?.data?.description
    : '';
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

    const YGGCurrentCurrencyCode = redeemDetailsTemp?.brand_accepted_currency;
    setPriceDetails(redeemDetailsTemp?.denominations[YGGCurrentCurrencyCode]);
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
      if (
        !isPlainObject(redeemDetailsTemp?.denominations[YGGCurrentCurrencyCode])
      ) {
        const options = redeemDetailsTemp?.denominations[
          YGGCurrentCurrencyCode
        ]?.filter(
          (item) => item.amount <= minMaxValues.MaxVal && item?.is_active
        ) // Filter valid items
          .map((item) => ({ label: item.amount, value: item.amount })); // Map to desired structure

        setFixedOptions(options); // Update state with valid options
        console.log(
          'options',
          options,
          YGGCurrentCurrencyCode,
          redeemDetailsTemp?.denominations[YGGCurrentCurrencyCode]
        );
      }
    }
  }, [redeemDetails, userDetails, pointsDatas]);

  const calculateMinMax = (data, userPoints, pointsPerRedeem) => {
    let MinVal = 0;
    let MaxVal = 0;
    const YGGCurrentCurrencyCode = data?.brand_accepted_currency;

    if (isPlainObject(data?.denominations[YGGCurrentCurrencyCode])) {
      const { min, max } = data?.denominations[YGGCurrentCurrencyCode];
      MinVal = min;
      MaxVal = Math.min(Math.floor(userPoints / pointsPerRedeem), max);

      if (userPoints < MinVal * pointsPerRedeem) {
        MinVal = 0;
        MaxVal = 0;
      }
    } else if (!isPlainObject(data?.denominations[YGGCurrentCurrencyCode])) {
      const validOptions = data?.denominations[YGGCurrentCurrencyCode]?.filter(
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
      setErrorMessage(`Earn more XP to utilize this catalog`);
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
        message:
          "Cheers to you!,\nWe think you're really going to love this - enjoy!",
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

          redeemSubmitFunction(response?.data ?? {}, redeemPointsVal);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="tc_design"
      header={false}
      isModelWidth={true}
      width="550px"
    >
      <div className="model">
        <div className="reedem-details">
          <img
            alt={redeemDetails?.data?.name}
            title={redeemDetails?.data?.name}
            width="100%"
            src={redeemDetails?.data?.product_image ?? ''}
            className="reedem-details-img"
          />
          <label className="redeemIcon_label font-helvetica-m details-titlesx my-4">
            {redeemDetails?.data?.name}
          </label>
          <div
            style={{
              width: '100%',
              fontSize: '13px',
              marginBottom: '5px',
              color: '#000',
            }}
          >
            Description:
            <ToolTip
              title={redeemDetails?.data?.redemption_instructions}
              arrow
              placement="right-start"
              backgroundColor="#e5e5e5"
              color="#2c2c2c"
              fontSize="10px"
            >
              <img
                alt="Instruction"
                title="Instruction"
                style={{ width: '13px' }}
                src={process.env.PUBLIC_URL + '/images/instruction.svg'}
              />
            </ToolTip>
          </div>
          <label
            className="redeemIcon_label discription text-align-justify"
            style={{ opacity: 0.7 }}
          >
            {description}
          </label>
        </div>
        <Row className="align-items-center mt-4">
          <Col md={6}>
            <div
              className="mb-2"
              style={{ fontSize: '13px', color: '#000' }}
            >
              Amount to be Redeemed
            </div>
            {isPlainObject(priceDetails) === true && (
              <>
                <input
                  placeholder="Amount"
                  type="text"
                  className="form-control field-input-outline "
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
            {isPlainObject(priceDetails) === false && (
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
                {fixedOptions?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </Col>
          <Col
            md={6}
            className="text-end"
          >
            <div className=" fs-12 text-align-end">
              Available XP: {JSON.parse(userDetails)?.allPoints}, Redeem XP:{' '}
              {redeemPoints}
            </div>

            <a
              style={{
                width: '100%',
                color: '#ffffff',
                textAlign: 'center',
                marginTop: '20px',
                color: redeemPoints > 0 ? '#ffffff' : '#aaaaaa',
                opacity: redeemPoints > 0 ? 1 : 0.5,
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
          </Col>
          <Col md={12}>
            {failureStatus && (
              <div
                className="text-danger text-align-end mt-1"
                style={{ fontSize: '12px' }}
              >
                {failureStatus}
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default RedeemModelYGG;

import React, { useEffect, useState } from 'react';

const RedomModalDetails = (props) => {
  console.log("Props", props);
  const [point, setPoint] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const user_points =
    (JSON.parse(props?.userDetails)?.allPoints ?? 0) *
      parseInt(props?.value_peer_points) ?? 0;
  const { name, description, images, product_image, price } = props?.data;
  useEffect(() => {
    setPoint(10);
    setQuantity(1);
  }, [name]);

  return (
    <div className="eepModalDiv reedem">
      <div
        className="modal fade"
        id="RedomModalDetails"
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
                <label className="redeemIcon_label font-helvetica-m details-titlesx">
                  {name}
                </label>
                <div className="reedem-details-flex">
                  <img
                    width="100%"
                    alt={name ?? "Product Image"}
                    title={name ?? "Product Image"}
                    src={product_image ?? ''}
                    className="details-img"
                  />
                  {/* <div className="details">
                                        <div style={{ marginTop: '6px' }}>
                                            <div style={{ fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>Enter Points:</div>
                                            <input placeholder="Points" type="text" className="form-control field-input-outline"
                                                // value={props?.qty ?? ''}
                                                defaultValue={10}

                                            //  onChange={(e) => props?.handleChange(e.target.value, price)} style={{}}
                                            />
                                            <div className="min-max"> Min: {price?.min}, Max: {price?.max}</div><br />
                                            <div style={{ fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>Quantity:</div>
                                            <input placeholder="Quantity" type="text" className="form-control field-input-outline"
                                                //  value={props?.qty ?? ''}
                                                defaultValue={1}
                                            // onChange={(e) => props?.handleChange(e.target.value, price)}
                                            />
                                            <div className="min-max"> Min: 1, Max: {Math.round(parseInt(price?.max) / user_points)}</div>
                                        </div>
                                    </div> */}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    marginBottom: '10px',
                    color: '#000',
                  }}
                >
                  Description:
                </div>
                <label
                  className="redeemIcon_label discription"
                  style={{ opacity: 0.7 }}
                >
                  {description}
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <div style={{ fontSize: '13px', color: '#000' }}>
                      Enter XP:
                    </div>
                    <input
                      placeholder="Points"
                      type="number"
                      className="form-control field-input-outline"
                      onChange={(e) => setPoint(e?.target?.value)}
                      value={point}
                      min={price?.min}
                      max={price?.max}
                    />
                    <div className="min-max">
                      {' '}
                      Min: {price?.min}, Max: {price?.max}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div style={{ fontSize: '13px', color: '#000' }}>
                      Quantity:
                    </div>
                    <input
                      placeholder="Quantity"
                      type="number"
                      className="form-control field-input-outline"
                      value={quantity}
                      onChange={(e) => setQuantity(e?.target?.value)}
                      min={1}
                      max={Math.round(parseInt(price?.max) / user_points)}
                    />
                    <div className="min-max">
                      {' '}
                      Min: 1, Max:{' '}
                      {Math.round(parseInt(price?.max) / user_points)}
                    </div>
                  </div>
                </div>

                {props?.pointsList?.availablePoints < point * quantity ? (
                  <div className="fs-12 error-text-redeem text-danger ">
                    Insufficient point(s) available to redeem
                  </div>
                ) : null}

                <button
                  style={{
                    width: '100%',
                    color: '#fff',
                    textAlign: 'center',
                    marginTop: '20px',
                  }}
                  className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button c1"
                  data-toggle="modal"
                  data-target="#RedomModal"
                  onClick={() =>
                    props?.redeemPonts(props?.data, point * quantity)
                  }
                  disabled={
                    props?.pointsList?.availablePoints < point * quantity
                  }
                >
                  Redeem Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RedomModalDetails;

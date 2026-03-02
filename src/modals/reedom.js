import React from "react";

const RedomModal = (props) => {
    return (
        <div className="eepModalDiv">
            <div className="modal fade" id="RedomModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-confirm modal-addmessage" role="document">
                    <div className="modal-content">
                        <div className="modal-header flex-column p-0">
                            <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body eep_scroll_y p-0">
                            <div className="modalBodyHeight">
                                <h5 className="modal-title w-100 text-center mt-3 bulk_exampleModalLabel"
                                >
                                    <img width="80px" src='../images/icons8-approval.gif' />
                                    <br />
                                    <div className="coupon-container">
                                        <div className="coupon-code">KASINH0001</div>
                                        <div className="expiration-date">Expires on December 31, 2023</div>
                                    </div>
                                </h5>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default RedomModal;
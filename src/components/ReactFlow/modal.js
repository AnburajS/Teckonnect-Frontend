import React from "react";

const UserDetailView = (props) => {

    const { data } = props;
    return (
        <div className="eepModalDiv">
            <div className="modal fade" id="UserDetailView" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-confirm modal-addmessage" role="document" style={{ width: "460px" }}>
                    <div className="modal-content">
                        <div className="modal-header flex-column p-0">
                            <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body eep_scroll_y p-0">
                            <div className="modalBodyHeight">
                                <h5 className="modal-title w-100 text-center mt-3 bulk_exampleModalLabel"
                                >
                                    {'User Info'}
                                </h5>
                                <div className="eep-dropdown-divider"></div>
                                <div className="org_user_info">
                                    <div className="img"><img src={data?.icon || `${process.env.PUBLIC_URL}/images/user_profile.png`} /> </div>
                                    <div className="title">{data?.title ?? '-'}</div>
                                    <div className="dis">{((data?.subline ?? '') + (data?.email ?? '')) ?? '-'}</div>
                                    {(data?.country_name || data?.branch) && <div className="eep-dropdown-divider"></div>}
                                    <div className="footer">
                                        {data?.country_name && <div className="f1">
                                            {'Working Country'}<br /><br />
                                            <span> {data?.country_name && <img src={data?.country_logo ||
                                                `${process.env.PUBLIC_URL}/images/user_profile.png`} />} {data?.country_name || ''}</span>
                                        </div>}
                                        {data?.branch && <div className="f2">
                                            {'Branch'}<br /><br />
                                            <span>{data?.branch || '-'}</span>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default UserDetailView;
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ManageAwardViewInfo from './ManageAwardViewInfo';
import ResponseInfo from '../../UI/ResponseInfo';
import moment from 'moment';
import PageHeader from '../../UI/PageHeader';
import { Link } from 'react-router-dom';
import { formatDates } from '../../constants/utills';

const ManageNominateAwardView = () => {
  const getLocation = useLocation();
  const aDataValue = getLocation.state
    ? getLocation.state?.awardManageData
    : {};
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const monthArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <React.Fragment>
      <PageHeader
        hiddenDivider={true}
        navLinksLeft={
          <Link
            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
            to={{ pathname: '/app/awards' }}
            state={{ activeTab: 'ManageTab' }}
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.lessthan_circle,
            }}
          ></Link>
        }
      />
      {userRolePermission?.awardCategorisation && (
        <div className="pt-4">
          <div
            className="row justify-content-md-center eep-content-start"
            id="content-start"
          >
            <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12">
              <ManageAwardViewInfo aDataValue={aDataValue} />
            </div>
            <div className="col-md-8 col-lg-8 col-xs-12 col-sm-12">
              <div className="bg-f5f5f5 br-15 h-100">
                <div className="p-4">
                  <div className="r_award_col_div">
                    <div className="col-md-12 form-group px-0 eep-recognition-select2-dropdown_div">
                      <div className="d-flex">
                        <label className="font-helvetica-m c-404040">
                          Nomination Type
                        </label>
                      </div>
                      <div className="vInputsDiv">
                        <label className="mb-0">{aDataValue?.type}</label>
                      </div>
                    </div>
                    <div className="row n_award_inputs_row">
                      <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 form-group n_award_inputs_col1">
                        <div className="row no-gutters">
                          <div className="col-md-12 form-group eep-recognition-select2-dropdown_div">
                            <label className="font-helvetica-m c-404040">
                              Department
                            </label>
                            <div className="vInputsDiv">
                              <label className="mb-0">
                                {aDataValue?.judge?.department?.name}
                              </label>
                            </div>
                          </div>
                          <div className="col-md-12 form-group eep-recognition-select2-dropdown_div">
                            <label className="font-helvetica-m c-404040">
                              Nominator
                            </label>
                            <div className="vInputsDiv">
                              <label className="mb-0">
                                {aDataValue?.nominator?.fullName ?? ''}
                              </label>
                            </div>
                          </div>
                          <div className="col-md-12 form-group eep-recognition-select2-dropdown_div">
                            <label className="font-helvetica-m c-404040">
                              Judge
                            </label>
                            <div className="vInputsDiv">
                              <label className="mb-0">
                                {aDataValue?.judge?.fullName ?? ''}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 form-group n_award_inputs_col2">
                        <div className="bg-white br-10 h-100">
                          <div className="p-3 h-100 n_award_inputs_col2_inner">
                            {aDataValue?.type === 'Between_Dates' && (
                              <div className="row between_dt_div no-gutters">
                                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
                                  <label className="font-helvetica-m c-404040">
                                    Start Date
                                  </label>
                                  <div className="vInputsDiv border border-1">
                                    <label className="mb-0">
                                      {formatDates(aDataValue?.date1)}
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
                                  <label className="font-helvetica-m c-404040">
                                    End Date
                                  </label>
                                  <div className="vInputsDiv border border-1">
                                    <label className="mb-0">
                                      {formatDates(aDataValue?.date2)}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}
                            {aDataValue?.type !== 'Between_Dates' && (
                              <div className="row n_schedule_div w-100 no-gutters">
                                <div className="col-md-12 form-group">
                                  <label className="font-helvetica-m c-404040">
                                    Schedule At
                                  </label>
                                  <div className="vInputsDiv border border-1">
                                    {aDataValue?.month !== 0 && (
                                      <label className="mb-0">
                                        {('0' + aDataValue?.day).slice(-2) +
                                          ' - ' +
                                          monthArr[aDataValue?.month - 1]}
                                      </label>
                                    )}
                                    {aDataValue?.month === 0 && (
                                      <label className="mb-0">
                                        {('0' + aDataValue?.day).slice(-2)}
                                      </label>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="row a_schedule_div templates_time_div px-0 n_award_inputs_col3 w-100 no-gutters">
                              <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group n_award_inputs_col3_inner eep-timer-parent">
                                <label className="font-helvetica-m c-404040">
                                  Schedule Time
                                </label>
                                <div className="vInputsDiv border border-1">
                                  <label className="mb-0">
                                    {aDataValue?.time}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!userRolePermission.awardCategorisation && (
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

export default ManageNominateAwardView;

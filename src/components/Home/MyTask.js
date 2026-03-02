import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ResponseInfo from '../../UI/ResponseInfo';
const MyTask = (props) => {
  const { dashboardDetails } = props;

  return (
    <div className="bg-f5f5f5 br-15 mb-3 myTask_section">
      <div className="p-3">
        <Link
          to="#"
          className="c-2c2c2c a_hover_txt_deco_none"
        >
          <h4 className="title_lbl">My Tasks</h4>
        </Link>
        {dashboardDetails &&
          dashboardDetails.myTasks &&
          dashboardDetails.myTasks.map((item, index) => {
            return (
              <div
                className="mytasks_list_div text-left"
                key={'myTask_' + index}
              >
                <div className="d_mytasks_list_div">
                  <Link
                    to="#"
                    className="c-2c2c2c a_hover_txt_deco_none d_mytasks_list"
                    title="Reduce an attrition"
                  >
                    <p className="mb-2 eep_overflow_ellipsis d_mytasks">
                      <span>Reduce an attrition</span>
                    </p>
                  </Link>
                  <p className="text-right d_mytasks_dt mb-0 opacity-3">
                    17 Oct 2022
                  </p>
                </div>
              </div>
            );
          })}
        {dashboardDetails && !dashboardDetails.myTasks?.length && (
          <ResponseInfo
            title="No Tasks for now"
            responseImg="noRecord"
            responseClass="response-info"
          />
        )}
      </div>
    </div>
  );
};

export default MyTask;

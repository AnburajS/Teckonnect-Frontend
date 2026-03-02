// import React from 'react';
// import { Link } from 'react-router-dom';
// import ResponseInfo from '../../UI/ResponseInfo';
// import { eepFormatDateTime } from '../../shared/SharedService';
// import { useTranslation } from 'react-i18next';

// const PendingApproval = (props) => {
//   const { dashboardDetails } = props;
//   const { t } = useTranslation();

//   return (
//     <div className="bg-f5f5f5 br-15 waitingapprovals_section mt-3">
//       <div className="p-3">
//         <h4 className="title_lbl">
//           {' '}
//           {t(`dashboard.Approval Requests pending`)}
//         </h4>
//         {dashboardDetails && dashboardDetails?.awardApprovals && (
//           <div
//             className="waitingapprovals_list_div text-left"
//             style={{
//               height: '189px',
//               overflowY: 'auto',
//             }}
//           >
//             {dashboardDetails.awardApprovals.map((item, index) => {
//               console.log('item', item?.award?.awardFileName);
//               return (
//                 <div
//                   className="col-md-12 px-0 mb-3"
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                   }}
//                   key={'waitingapprovals_' + index}
//                 >
//                   <Link
//                     to={{
//                       pathname: '/app/nominationsapproval',
//                     }}
//                     state={{ awardData: item, isApproval: true }}
//                     className="c-2c2c2c a_hover_txt_deco_none d_waitingapprovals_list"
//                     title={item?.award?.name}
//                   >
//                     <p className="mb-2 eep_overflow_ellipsis d_waitingapprovals">
//                       <img
//                         className="d_list_icon"
//                         src={
//                           item?.award?.awardFileName
//                             ? item?.award?.awardFileName
//                             : process.env.PUBLIC_URL +
//                               '/images/icons/static/award.svg'
//                         }
//                         alt="program-icon"
//                       />
//                       <span className="pl-1">{item?.award?.name}</span>
//                     </p>
//                   </Link>
//                   <p className="text-right mb-1 d_waitingapprovals_dt opacity-3">
//                     {eepFormatDateTime(item?.award?.updatedAt)}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//         {dashboardDetails && !dashboardDetails.awardApprovals?.length && (
//           <div className="pdy-30">
//             <ResponseInfo
//               title={t(`dashboard.No Requests Pending`)}
//               responseImg="noRecord"
//               responseClass="response-info"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PendingApproval;

import React from 'react';
import { Link } from 'react-router-dom';
import ResponseInfo from '../../UI/ResponseInfo';
import { eepFormatDateTime } from '../../shared/SharedService';
import { useTranslation } from 'react-i18next';

const PendingApproval = ({ dashboardDetails }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-f5f5f5 br-15 mt-3 myTask_section">
      <div className="p-3">
        <h4 className="title_lbl cursor-default">
          {t(`dashboard.Approval Requests pending`)} ⏳
        </h4>
        {/* <h4 className="title_lbl cursor-default ">
          {t(`dashboard.Approval Requests pending`)} */}
        {/* <img
            width="25px"
            src="/images/icons/waiting.svg"
            alt="waiting"
          /> */}
        {/* </h4> */}
        <div style={{ height: '189px', overflowY: 'auto' }}>
          {dashboardDetails?.awardApprovals?.length > 0 &&
            dashboardDetails.awardApprovals.map((item, index) => (
              <div
                className="mytasks_list_div"
                key={'waitingapprovals_' + index}
              >
                <Link
                  to={{
                    pathname: '/app/nominationsapproval',
                  }}
                  state={{ awardData: item, isApproval: true }}
                  className="c-2c2c2c a_hover_txt_deco_none d_mytasks_list"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Left side (Title + Date) */}
                  <div>
                    <p className="eep_overflow_ellipsis d_mytasks mb-3">
                      {item?.award?.name || 'Team Infinity'}
                    </p>
                    <label
                      className="d_mytasks_dt mb-1 opacity-3"
                      style={{
                        textAlign: 'start',
                        paddingRight: '20px',
                      }}
                    >
                      {eepFormatDateTime(item?.award?.updatedAt)}
                    </label>
                  </div>

                  {/* Right side (Icon same size as Send button height) */}
                  <img
                    width="40"
                    height="40"
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px',
                    }}
                    src={
                      item?.award?.awardFileName
                        ? item?.award?.awardFileName
                        : process.env.PUBLIC_URL +
                          '/images/icons/static/award.svg'
                    }
                    alt="award-icon"
                  />
                </Link>

                {/* Divider */}
                {index !== dashboardDetails.awardApprovals.length - 1 && (
                  <div
                    style={{ borderTop: '1px solid #e1dede' }}
                    className="dropdown-divider"
                  ></div>
                )}
              </div>
            ))}

          {/* Empty State */}
          {dashboardDetails && !dashboardDetails.awardApprovals?.length && (
            <div className="pdy-30">
              <ResponseInfo
                title={t(`dashboard.No Requests Pending`)}
                responseImg="noRecord"
                responseClass="response-info"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;

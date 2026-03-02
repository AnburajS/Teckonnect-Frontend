// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import PageHeader from '../../UI/PageHeader';
// import { URL_CONFIG } from '../../constants/rest-config';
// import { base64ToFile } from '../../helpers';
// import { httpHandler } from '../../http/http-interceptor';
// import CertificatePreviewModal from '../../modals/CertificatePreviewModal';
// import { BreadCrumbActions } from '../../store/breadcrumb-slice';
// import { TabsActions } from '../../store/tabs-slice';
// import MyCertificate from './MyCertificate';
// import PDF from 'react-pdf-js';
// import { faEye } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { validateFileSize } from '../../constants/utills';
// import EEPSubmitModal from '../../modals/EEPSubmitModal';
// import Fileupload from '../../fileUpload/Fileupload';
// const Certificates = () => {
//   const [certificateRecognitionData, setCertificateRecognitionData] = useState(
//     []
//   );
//   const [currUserData, setCurrUserData] = useState({});
//   const [userData, setUserData] = useState([]);
//   const [eMailData, setEMailData] = useState([]);
//   const userSessionData = sessionStorage.userData
//     ? JSON.parse(sessionStorage.userData)
//     : {};
//   const userRolePermission = useSelector(
//     (state) => state.sharedData.userRolePermission
//   );
//   const svgIcons = useSelector((state) => state.sharedData.svgIcons);
//   const [myCertificateModalShow, setMyCertificateModalShow] = useState(false);
//   const [previewDataUri, setPreviewDataUri] = useState(null);

//   const dispatch = useDispatch();
//   const activeTab = useSelector((state) => state.tabs.activeTab);
//   const location = useLocation();
//   const history = useNavigate();
//   let routerData = location.state || { activeTab: 'certificate' };
//   const [showModal, setShowModal] = useState({ type: null, message: null });
//   const breadcrumbArr = [
//     {
//       label: 'Home',
//       link: 'app/dashboard',
//     },
//     {
//       label: 'RECOGNIZE',
//       link: 'app/recognition',
//     },
//     {
//       label: 'CERTIFICATE',
//       link: 'app/certificate',
//     },
//   ];
//   const hideModal = () => {
//     let collections = document.getElementsByClassName('modal-backdrop');
//     for (var i = 0; i < collections.length; i++) {
//       collections[i].remove();
//     }
//     setShowModal({ type: null, message: null });
//   };
//   useEffect(() => {
//     dispatch(
//       BreadCrumbActions.updateBreadCrumb({
//         breadcrumbArr,
//         title: 'Certificate',
//       })
//     );
//     return () => {
//       BreadCrumbActions.updateBreadCrumb({
//         breadcrumbArr: [],
//         title: '',
//       });
//     };
//   }, []);
//   const tabConfig = [
//     {
//       title: 'My Certificates',
//       id: 'mycertificate',
//     },
//   ];

//   useEffect(() => {
//     if (
//       userRolePermission?.certificateSend ||
//       userRolePermission?.certificateModify
//     ) {
//       tabConfig.push({ title: 'Certificate Vault', id: 'certificate' });
//     }

//     dispatch(
//       TabsActions.updateTabsconfig({
//         config: tabConfig,
//       })
//     );

//     // if (routerData) {
//     //   const activeTabId = routerData.activeTab;
//     //   tabConfig.map((res) => {
//     //     if (res.id === activeTabId) {
//     //       res.active = true
//     //     }
//     //   });

//     //   dispatch(
//     //     TabsActions.updateTabsconfig({
//     //       config: tabConfig,
//     //     })
//     //   );
//     // } else {
//     //   dispatch(
//     //     TabsActions.updateTabsconfig({
//     //       config: tabConfig,
//     //     })
//     //   );
//     // }

//     return () => {
//       dispatch(
//         TabsActions.updateTabsconfig({
//           config: [],
//         })
//       );
//     };
//   }, [userRolePermission]);

//   const fetchCertificateData = () => {
//     const obj = {
//       url: URL_CONFIG.ALL_CERTIFICATE,
//       method: 'get',
//     };
//     httpHandler(obj)
//       .then((cData) => {
//         setCertificateRecognitionData(cData?.data);
//       })
//       .catch((error) => {});
//   };

//   const fetchCurrentUserData = () => {
//     const obj = {
//       url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
//       method: 'get',
//       params: { id: userSessionData.id },
//     };
//     httpHandler(obj)
//       .then((uData) => {
//         setCurrUserData(uData?.data?.[0]);
//       })
//       .catch((error) => {
//         const errMsg = error.response?.data?.message;
//       });
//   };

//   const fetchUserData = () => {
//     const obj = {
//       url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
//       method: 'get',
//       params: {
//         active: true,
//       },
//     };
//     httpHandler(obj)
//       .then((userDatas) => {
//         let uDataTemp = [];
//         let uEmailDataTemp = [];
//         userDatas.data.length > 0 &&
//           userDatas.data.map((item) => {
//             if (item.user_id !== userSessionData.id) {
//               return uDataTemp.push({
//                 value: item.id,
//                 label: item.fullName + ' - ' + item.department.name,
//               });
//             }
//           });
//         userDatas.data.length > 0 &&
//           userDatas.data.map((item) => {
//             return uEmailDataTemp.push({ value: item.id, label: item.email });
//           });
//         setUserData(uDataTemp);
//         setEMailData(uEmailDataTemp);
//       })
//       .catch((error) => {});
//   };

//   useEffect(() => {
//     if (
//       userRolePermission?.certificateSend ||
//       userRolePermission?.certificateModify
//     ) {
//       fetchCertificateData();
//     }
//     fetchCurrentUserData();
//     fetchUserData();
//   }, []);

//   const validImageTypes = [
//     'image/jpeg',
//     'image/jpg',
//     'image/png',
//     'image/svg+xml',
//   ];
//   const addCertificateHandler = (event) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     if (file) {
//       const isValid = validateFileSize(file, 1);
//       if (isValid === true) {
//         var fileType = file['type'];
//         if (validImageTypes.includes(fileType)) {
//           var tempFileName = file.name;
//           tempFileName = tempFileName.replace(/\s/g, '');
//           tempFileName = tempFileName.split('.').slice(0, -1).join('.');
//           var reader = new FileReader();
//           reader.onload = function () {
//             //setRecognitionIcon(reader.result);
//             let obj = {
//               imageByte: { image: reader.result, name: tempFileName },
//               name: tempFileName,
//             };

//             const base64Data = (obj?.imageByte?.image).replace(
//               /^data:image\/\w+;base64,/,
//               ''
//             );
//             const file = base64ToFile(base64Data);

//             const formData = new FormData();
//             formData.append('image', file);
//             const obj_ = {
//               url: URL_CONFIG.UPLOAD_FILES,
//               method: 'post',
//               payload: formData,
//             };
//             httpHandler(obj_).then((res) => {
//               obj.imageByte.image = res?.data?.data?.[0]?.url ?? '';
//               history('/app/composecertificate', {
//                 state: {
//                   isCustomCertificate: true,
//                   certData: obj,
//                   currUserData: currUserData,
//                   userData: userData,
//                   eMailData: eMailData,
//                 },
//               });
//             });
//           };
//           reader.readAsDataURL(file);
//         } else {
//           setShowModal({
//             ...showModal,
//             type: 'danger',
//             message: 'Invalid file! Please choose JPEG, JPG, PNG or SVG',
//           });
//         }
//       } else {
//         setShowModal({
//           ...showModal,
//           type: 'danger',
//           message: isValid,
//         });
//       }
//     }
//   };

//   const certPreviewModalHandler = (arg) => {
//     setMyCertificateModalShow(true);
//     let obj = {
//       isIframe: false,
//       dataSrc: arg,
//     };
//     setPreviewDataUri(obj);
//   };
//   return (
//     <React.Fragment>
//       {showModal.type !== null && showModal.message !== null && (
//         <EEPSubmitModal
//           data={showModal}
//           className={`modal-addmessage`}
//           hideModal={hideModal}
//           successFooterData={
//             <Link
//               to="/app/ecardindex"
//               type="button"
//               className="eep-btn eep-btn-xsml eep-btn-success"
//             >
//               Ok
//             </Link>
//           }
//           errorFooterData={
//             <button
//               type="button"
//               className="eep-btn eep-btn-xsml eep-btn-danger"
//               data-dismiss="modal"
//               onClick={hideModal}
//             >
//               Close
//             </button>
//           }
//         ></EEPSubmitModal>
//       )}
//       {myCertificateModalShow && (
//         <CertificatePreviewModal previewDataUri={previewDataUri} />
//       )}
//       <div className="row eep-content-section-data no-gutters">
//         <div className="tab-content col-md-12 h-100">
//           <div
//             id="mycertificate"
//             className="tab-pane h-100 active"
//           >
//             {activeTab?.id === 'mycertificate' && <MyCertificate />}
//           </div>

//           {userRolePermission?.certificateSend && (
//             <div
//               id="certificate"
//               className="tab-pane h-100"
//             >
//               {activeTab && activeTab.id === 'certificate' && (
//                 <React.Fragment>
//                   <PageHeader title="Certificate Vault"></PageHeader>
//                   <div
//                     className="row certificate_row_div mt-4 "
//                     id="content-start"
//                   >
//                     <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12 n_cert_add_col_div cert_col_div">
//                       <div
//                         className="n_cert_add_col_inner n_cert_add_col_inner_a"
//                         title="Add Certificate"
//                       >
//                         {/* <div className="n_cert_add_col">
//                           <div className="outter">
//                             <img
//                               src={
//                                 process.env.PUBLIC_URL +
//                                 '/images/icons/plus-white.svg'
//                               }
//                               className="plus_white_img"
//                               alt="Plus White"
//                               title="Compose Certificate"
//                               onClick={() => {
//                                 document
//                                   .getElementById('certificatePath')
//                                   .click();
//                               }}
//                             />
//                             <input
//                               type="file"
//                               className="invisible d-none"
//                               onChange={(event) => addCertificateHandler(event)}
//                               id="certificatePath"
//                               accept="image/png, image/jpg, image/jpeg"
//                             />
//                           </div>
//                         </div> */}
//                         <Fileupload
//                           addIconClickHandler={() => {
//                             document.getElementById('certificatePath').click();
//                           }}
//                           onChangeHandler={addCertificateHandler}
//                           height={'172px'}
//                           width={'230px'}
//                           inputId={'certificatePath'}
//                           accept={'image/png, image/jpg, image/jpeg'}
//                           suggested={'1000x750'}
//                           suggestedText={'Preferred upload size : 1000x750px'}
//                         />
//                         <label className="n_cert_add_label">
//                           Upload Certificate
//                         </label>
//                       </div>
//                     </div>
//                     {certificateRecognitionData &&
//                       certificateRecognitionData?.map((data, index) => {
//                         return (
//                           <>
//                             {data?.pdfByte?.image && (
//                               <div
//                                 className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-center cert_col_div"
//                                 key={'certificateRecognition_' + index}
//                               >
//                                 <div className="mycert_list_div mycert_modal_a box9">
//                                   <div className="mycert_assign_div">
//                                     <div className="outter canva">
//                                       {/* <img src={data?.pdfByte?.image} className="mycert_img" alt="Certificate" title={data.pdfByte?.name} /> */}

//                                       {/* {data?.pdfByte?.image ?? (
//                                     <PDF
//                                       width="20px"
//                                       file={data?.pdfByte?.image}
//                                     />
//                                   )} */}

//                                       {data?.pdfByte?.image &&
//                                         data.pdfByte.image.endsWith('.pdf') && (
//                                           <PDF
//                                             width="100%" // You can adjust this as per your needs
//                                             file={data?.pdfByte?.image} // Ensure it's a URL or binary data
//                                           />
//                                         )}
//                                     </div>
//                                   </div>
//                                   <div className="box-content">
//                                     <h3 className="title">{data?.name}</h3>
//                                     <ul className="icon">
//                                       <li title="View">
//                                         <a
//                                           className="mycert_modal_a c1"
//                                           onClick={() =>
//                                             certPreviewModalHandler(data)
//                                           }
//                                           data-toggle="modal"
//                                           data-target="#certPreviewModal"
//                                         >
//                                           <FontAwesomeIcon icon={faEye} />
//                                         </a>
//                                       </li>
//                                       <li title="Edit">
//                                         <Link
//                                           to={{
//                                             pathname: '/app/composecertificate',
//                                           }}
//                                           state={{
//                                             isCustomCertificate: false,
//                                             certData: data,
//                                             currUserData: currUserData,
//                                             userData: userData,
//                                             eMailData: eMailData,
//                                           }}
//                                           className="mycert_modal_a fa fa-eyee"
//                                         >
//                                           <span
//                                             dangerouslySetInnerHTML={{
//                                               __html:
//                                                 svgIcons && svgIcons.pencil,
//                                             }}
//                                           ></span>
//                                         </Link>
//                                       </li>
//                                     </ul>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </>
//                         );
//                       })}
//                   </div>
//                 </React.Fragment>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Certificates;

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import { URL_CONFIG } from '../../constants/rest-config';
import { base64ToFile } from '../../helpers';
import { httpHandler } from '../../http/http-interceptor';
import CertificatePreviewModal from '../../modals/CertificatePreviewModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { TabsActions } from '../../store/tabs-slice';
import MyCertificate from './MyCertificate';
import PDF from 'react-pdf-js';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateFileSize } from '../../constants/utills';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import Fileupload from '../../fileUpload/Fileupload';
const Certificates = () => {
  const [certificateRecognitionData, setCertificateRecognitionData] = useState(
    []
  );
  const [currUserData, setCurrUserData] = useState({});
  const [userData, setUserData] = useState([]);
  const [eMailData, setEMailData] = useState([]);
  const userSessionData = sessionStorage.userData
    ? JSON.parse(sessionStorage.userData)
    : {};
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [myCertificateModalShow, setMyCertificateModalShow] = useState(false);
  const [previewDataUri, setPreviewDataUri] = useState(null);

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);

  let routerData = location.state || { activeTab: 'certificate' };
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'RECOGNIZE',
      link: 'app/recognition',
    },
    {
      label: 'CERTIFICATE',
      link: 'app/certificate',
    },
  ];
  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };
  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Certificate',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);
  const tabConfig = [
    {
      title: 'My Certificates',
      id: 'mycertificate',
    },
  ];

  useEffect(() => {
    if (
      userRolePermission?.certificateSend ||
      userRolePermission?.certificateModify
    ) {
      tabConfig.push({ title: 'Certificate Vault', id: 'certificate' });
    }

    dispatch(
      TabsActions.updateTabsconfig({
        config: tabConfig,
      })
    );

    // if (routerData) {
    //   const activeTabId = routerData.activeTab;
    //   tabConfig.map((res) => {
    //     if (res.id === activeTabId) {
    //       res.active = true
    //     }
    //   });

    //   dispatch(
    //     TabsActions.updateTabsconfig({
    //       config: tabConfig,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     TabsActions.updateTabsconfig({
    //       config: tabConfig,
    //     })
    //   );
    // }

    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
  }, [userRolePermission]);

  // const fetchCertificateData = () => {
  //   const obj = {
  //     url: URL_CONFIG.ALL_CERTIFICATE,
  //     method: 'get',
  //   };
  //   httpHandler(obj)
  //     .then((cData) => {
  //       setCertificateRecognitionData(cData?.data);
  //     })
  //     .catch((error) => {});
  // };
  const fetchCertificateData = () => {
    setLoading(true);
    const obj = {
      url: URL_CONFIG.ALL_CERTIFICATE,
      method: 'get',
    };
    httpHandler(obj)
      .then((cData) => {
        setCertificateRecognitionData(cData?.data || []);
      })
      .catch((error) => {
        console.error('Certificate fetch error:', error);
        setCertificateRecognitionData([]);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (activeTab?.id === 'certificate') {
      fetchCertificateData();
    }
    fetchCurrentUserData();
    fetchUserData();
  }, [activeTab]);

  const fetchCurrentUserData = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
      params: { id: userSessionData.id },
    };
    httpHandler(obj)
      .then((uData) => {
        setCurrUserData(uData?.data?.[0]);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
      });
  };

  const fetchUserData = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
      params: {
        active: true,
      },
    };
    httpHandler(obj)
      .then((userDatas) => {
        let uDataTemp = [];
        let uEmailDataTemp = [];
        userDatas.data.length > 0 &&
          userDatas.data.map((item) => {
            if (item.user_id !== userSessionData.id) {
              return uDataTemp.push({
                value: item.id,
                label: item.fullName + ' - ' + item.department.name,
              });
            }
          });
        userDatas.data.length > 0 &&
          userDatas.data.map((item) => {
            return uEmailDataTemp.push({ value: item.id, label: item.email });
          });
        setUserData(uDataTemp);
        setEMailData(uEmailDataTemp);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (
      userRolePermission?.certificateSend ||
      userRolePermission?.certificateModify
    ) {
      fetchCertificateData();
    }
    fetchCurrentUserData();
    fetchUserData();
  }, []);

  const validImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
  ];
  const addCertificateHandler = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const isValid = validateFileSize(file, 1);
      if (isValid === true) {
        var fileType = file['type'];
        if (validImageTypes.includes(fileType)) {
          var tempFileName = file.name;
          tempFileName = tempFileName.replace(/\s/g, '');
          tempFileName = tempFileName.split('.').slice(0, -1).join('.');
          var reader = new FileReader();
          reader.onload = function () {
            //setRecognitionIcon(reader.result);
            let obj = {
              imageByte: { image: reader.result, name: tempFileName },
              name: tempFileName,
            };

            const base64Data = (obj?.imageByte?.image).replace(
              /^data:image\/\w+;base64,/,
              ''
            );
            const file = base64ToFile(base64Data);

            const formData = new FormData();
            formData.append('image', file);
            const obj_ = {
              url: URL_CONFIG.UPLOAD_FILES,
              method: 'post',
              payload: formData,
            };
            httpHandler(obj_).then((res) => {
              obj.imageByte.image = res?.data?.data?.[0]?.url ?? '';
              history('/app/composecertificate', {
                state: {
                  isCustomCertificate: true,
                  certData: obj,
                  currUserData: currUserData,
                  userData: userData,
                  eMailData: eMailData,
                },
              });
            });
          };
          reader.readAsDataURL(file);
        } else {
          setShowModal({
            ...showModal,
            type: 'danger',
            message: 'Invalid file! Please choose JPEG, JPG, PNG or SVG',
          });
        }
      } else {
        setShowModal({
          ...showModal,
          type: 'danger',
          message: isValid,
        });
      }
    }
  };

  const certPreviewModalHandler = (arg) => {
    setMyCertificateModalShow(true);
    let obj = {
      isIframe: false,
      dataSrc: arg,
    };
    setPreviewDataUri(obj);
  };
  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <Link
              to="/app/ecardindex"
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
            >
              Ok
            </Link>
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
      {myCertificateModalShow && (
        <CertificatePreviewModal previewDataUri={previewDataUri} />
      )}
      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100">
          <div
            id="mycertificate"
            className="tab-pane h-100 active"
          >
            {activeTab?.id === 'mycertificate' && <MyCertificate />}
          </div>

          {userRolePermission?.certificateSend && (
            <div
              id="certificate"
              className="tab-pane h-100"
            >
              {activeTab && activeTab.id === 'certificate' && (
                <React.Fragment>
                  <PageHeader title="Certificate Vault"></PageHeader>
                  <div
                    className="row certificate_row_div mt-4 "
                    id="content-start"
                  >
                    <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12 n_cert_add_col_div cert_col_div">
                      <div
                        className="n_cert_add_col_inner n_cert_add_col_inner_a"
                        title="Add Certificate"
                      >
                        {/* <div className="n_cert_add_col">
                          <div className="outter">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                '/images/icons/plus-white.svg'
                              }
                              className="plus_white_img"
                              alt="Plus White"
                              title="Compose Certificate"
                              onClick={() => {
                                document
                                  .getElementById('certificatePath')
                                  .click();
                              }}
                            />
                            <input
                              type="file"
                              className="invisible d-none"
                              onChange={(event) => addCertificateHandler(event)}
                              id="certificatePath"
                              accept="image/png, image/jpg, image/jpeg"
                            />
                          </div>
                        </div> */}
                        <Fileupload
                          addIconClickHandler={() => {
                            document.getElementById('certificatePath').click();
                          }}
                          onChangeHandler={addCertificateHandler}
                          height={'172px'}
                          width={'230px'}
                          inputId={'certificatePath'}
                          accept={'image/png, image/jpg, image/jpeg'}
                          suggested={'1000x750'}
                          suggestedText={'Preferred upload size : 1000x750px'}
                        />
                        <label className="n_cert_add_label">
                          Upload Certificate
                        </label>
                      </div>
                    </div>
                    {certificateRecognitionData &&
                      certificateRecognitionData?.map((data, index) => {
                        return (
                          <>
                            {data?.pdfByte?.image && (
                              <div
                                className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-center cert_col_div"
                                key={'certificateRecognition_' + index}
                              >
                                <div className="mycert_list_div mycert_modal_a box9">
                                  <div className="mycert_assign_div">
                                    <div className="outter canva">
                                      {/* <img src={data?.pdfByte?.image} className="mycert_img" alt="Certificate" title={data.pdfByte?.name} /> */}

                                      {/* {data?.pdfByte?.image ?? (
                                    <PDF
                                      width="20px"
                                      file={data?.pdfByte?.image}
                                    />
                                  )} */}

                                      {data?.pdfByte?.image &&
                                        data.pdfByte.image.endsWith('.pdf') && (
                                          <PDF
                                            width="100%" // You can adjust this as per your needs
                                            file={data?.pdfByte?.image} // Ensure it's a URL or binary data
                                          />
                                        )}
                                    </div>
                                  </div>
                                  <div className="box-content">
                                    <h3 className="title">{data?.name}</h3>
                                    <ul className="icon">
                                      <li title="View">
                                        <a
                                          className="mycert_modal_a c1"
                                          onClick={() =>
                                            certPreviewModalHandler(data)
                                          }
                                          data-toggle="modal"
                                          data-target="#certPreviewModal"
                                        >
                                          <FontAwesomeIcon icon={faEye} />
                                        </a>
                                      </li>
                                      <li title="Edit">
                                        <Link
                                          to={{
                                            pathname: '/app/composecertificate',
                                          }}
                                          state={{
                                            isCustomCertificate: false,
                                            certData: data,
                                            currUserData: currUserData,
                                            userData: userData,
                                            eMailData: eMailData,
                                          }}
                                          className="mycert_modal_a fa fa-eyee"
                                        >
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                svgIcons && svgIcons.pencil,
                                            }}
                                          ></span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })}
                  </div>
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Certificates;

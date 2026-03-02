import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import ToolTip from './ToolTip';
import { fileTypeAndImgSrcArray } from '../helpers';
// import forumImg from '../styles/images/forum-Add.svg'

const CreateEditCommunicationModal = (props) => {
  const {
    deptOptions,
    hideModal,
    createModalShow,
    createCommunicationPost,
    communicationModalErr,
    communicationType,
    communicationData,
    updateCommunicationPost,
  } = props;

  //const initCreateModalShow = createModalShow ? createModalShow : false;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const initDeptOptions = deptOptions ? deptOptions : {};
  const [deptValue, setDeptValue] = useState([]);
  const [modalDepartment, setModalDepartment] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalAttachements, setModalAttachements] = useState([]);
  const [modalErrorAttachements, setModalErrorAttachements] = useState({
    errCount: [],
    errLengthCount: [],
    generalErrors: [],
  });
  const [isHovered, setIsHovered] = useState(null);
  const [errorAtthState, setErrorAtthState] = useState(false);
  const [errorLengthAtthState, setErrorLengthAtthState] = useState(false);
  const [attachementFiles, setAttachementFiles] = useState([]);
  const [existingAttachementFiles, setExistingAttachementFiles] = useState([]);
  const [existingAttachementIDs, setExistingAttachementIDs] = useState([]);
  const [initCreateModalShow, setInitCreateModalShow] = useState(
    createModalShow ? createModalShow : false
  );
  const initCommunicationModalErr = communicationModalErr
    ? communicationModalErr
    : '';
  const [communicationModalError, setCommunicationModalError] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);
  const [clearExistingAtthState, setClearExistingAtthState] = useState(false);
  const [existPostDept, setExistPostDept] = useState([]);
  var titleMaxLength = 150;
  var descMaxLength = 255;

  const validAttachmentTypes = [
    'application/pdf',
    'application/mspowerpoint',
    'application/powerpoint',
    'application/x-mspowerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-excel',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/svg+xml',
  ];

  useEffect(() => {
    setModalErrorAttachements({ errCount: [], errLengthCount: [] });
    setErrorAtthState(false);
    setErrorLengthAtthState(false);
    setInitCreateModalShow(initCreateModalShow);
    setCommunicationModalError('');
    setAttachementFiles([]);
    setModalAttachements([]);
    setExistingAttachementFiles([]);

    if (
      communicationData &&
      communicationData !== null &&
      Object.keys(communicationData).length > 0
    ) {
      setModalTitle(communicationData.title);
      setModalDescription(communicationData.description);
      let modalArr = [];
      let deptArr = [];

      let postDepartment, postAttachmentFileName;
      if (communicationType === 'idea') {
        postDepartment = 'ideaDepartment';
        postAttachmentFileName = 'ideaAttachmentFileName';
      }
      if (communicationType === 'forum') {
        postDepartment = 'forumDepartment';
        postAttachmentFileName = 'forumAttachmentFileName';
      }
      //communicationData.ideaDepartment.length > 0 && communicationData.ideaDepartment.map((item) => {
      communicationData[postDepartment].length > 0 &&
        communicationData[postDepartment].map((item) => {
          modalArr.push(item?.deptId?.id);
          deptArr.push({ label: item?.deptId?.name, value: item?.deptId?.id });
          return [modalArr, deptArr];
        });
      setModalDepartment(modalArr);
      setExistPostDept(modalArr);
      setDeptValue(deptArr);

      let existAtthArr = [];
      let existAtthIDsArr = [];
      //communicationData.ideaAttachmentFileName.length > 0 && communicationData.ideaAttachmentFileName.map((files) => {
      communicationData[postAttachmentFileName].length > 0 &&
        communicationData[postAttachmentFileName].map((files) => {
          existAtthArr.push({
            imgSrcIcon: fileTypeAndImgSrcArray[files['contentType']]
              ? fileTypeAndImgSrcArray[files['contentType']]
              : fileTypeAndImgSrcArray['default'],
            atthmentDataURI: files.docByte?.image,
            attachmentName: files.ideaAttachmentsFileName,
          });
          existAtthIDsArr.push(files.id);
          return [existAtthArr, existAtthIDsArr];
        });
      setExistingAttachementFiles(existAtthArr);
      setExistingAttachementIDs(existAtthIDsArr);
    } else {
      setModalDepartment([]);
      setDeptValue([]);
      setModalTitle('');
      setModalDescription('');
    }
  }, [createModalShow, initCreateModalShow, communicationData]);

  useEffect(() => {
    setCommunicationModalError(initCommunicationModalErr);
  }, [initCommunicationModalErr]);

  const onDeptChangeHandler = (eve) => {
    let arr = [];
    eve.length &&
      eve.map((item) => {
        return arr.push(item.value);
      });
    setModalDepartment(arr);
    setDeptValue(eve);
  };

  const addIconClickHandler = (arg) => {
    document.getElementById('attachmentFileLoaderNew').value = null;
    document.getElementById('attachmentFileLoaderExist').value = null;
    if (arg === 'new') {
      document.getElementById('attachmentFileLoaderNew').click();
    }
    if (arg === 'exist') {
      document.getElementById('attachmentFileLoaderExist').click();
    }
  };

  useEffect(() => {
    if (deptValue.length > 0 && modalTitle !== '' && modalDescription !== '') {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }, [deptValue, modalTitle, modalDescription]);

  let validFiles = [];
  let errFiles = [];
  let errLengthFiles = [];
  const maxFileSize = 1024000;
  var atthFiles = [];
  let generalErrors = [];
  const fileLimit = 5;

  const onChangeHandler = (event, cType) => {
    const files = event.target.files;

    // Check if the number of selected files exceeds the limit
    const filelength = modalAttachements?.length + files?.length;

    if (filelength > fileLimit) {
      generalErrors.push(`You can only select up to ${fileLimit} files.`);
      setErrorLengthAtthState(true); // If you have state to handle visibility of errors
    } else {
      // Process valid files
      for (let k = 0; k < files.length; k++) {
        const file = files[k];

        // Check file type
        if (validAttachmentTypes.includes(file['type'])) {
          // Check file size
          if (file['size'] <= maxFileSize) {
            let reader = new FileReader();

            // On file read completion, process the file
            reader.onload = function (e) {
              validFiles.push(file); // Push valid file to validFiles array

              atthFiles.push({
                imgSrcIcon: fileTypeAndImgSrcArray[file['type']]
                  ? fileTypeAndImgSrcArray[file['type']]
                  : fileTypeAndImgSrcArray['default'],
                atthmentDataURI: e.target.result,
                attachmentName: file['name'],
              });

              // Update attachment data
              updateAttachementFilesData(atthFiles, cType, validFiles);
            };
            reader.readAsDataURL(file);
          } else {
            // Handle files that are too large
            errLengthFiles.push(file);
            setErrorLengthAtthState(true);
          }
        } else {
          // Handle invalid file types
          errFiles.push(file);
          setErrorAtthState(true);
        }
      }
    }

    // Update modal error state
    setModalErrorAttachements({
      errCount: errFiles,
      errLengthCount: errLengthFiles,
      generalErrors: generalErrors, // Store general error message
    });
  };

  const updateAttachementFilesData = (fData, fType, vFiles) => {
    if (fType === 'new') {
      setAttachementFiles([...fData]);
      setModalAttachements([...vFiles]);
    }
    if (fType === 'exist') {
      const all = [...fData, ...attachementFiles];
      setAttachementFiles(all);
      const allValid = [...vFiles, ...modalAttachements];
      setModalAttachements(allValid);
    }
  };

  const clearAllAtthments = () => {
    setAttachementFiles([]);
    setModalAttachements([]);
    setModalErrorAttachements({ errCount: [], errLengthCount: [] });
  };

  const postCommunicationHandler = () => {
    const modalDatas = {
      dept: modalDepartment,
      title: modalTitle,
      description: modalDescription,
      files: modalAttachements,
    };
    createCommunicationPost(modalDatas);
  };

  const updateCommunicationHandler = () => {
    const modalDatas = {
      postInfo: communicationData,
      dept: modalDepartment,
      title: modalTitle,
      description: modalDescription,
      files: modalAttachements,
      existPostDept: existPostDept,
      existPostAttach: !clearExistingAtthState ? existingAttachementIDs : [],
    };
    updateCommunicationPost(modalDatas);
  };

  const clearExistingAtth = () => {
    setClearExistingAtthState((prev) => !prev);
  };
  return (
    <div className="eepModalDiv">
      <div
        className="modal fade tc_design show"
        id="CreateEditCommunicationModal"
        aria-modal="true"
        style={{ display: 'block' }}
      >
        <div className="modal-dialog w-75">
          <div className="modal-content p-4 eep_scroll_y">
            <div className="modal-body py-0 px-0 eep_scroll_y">
              <div className="row justify-content-md-center mb-1">
                <div className="col-md-12 text-center mb-1">
                  {/* <img src={ 
                     communicationType === 'idea' ? 
                  `${ideaBoxImg}` :
                   (communicationType === 'forum' ?
                   `${forumImg}` :
                    `${nodataImg}`)
                  // communicationType === 'idea' ? 
                  // `${process.env.PUBLIC_URL}/images/icons/static/Ideabox-Add.svg` :
                  //  (communicationType === 'forum' ?
                  //  `${process.env.PUBLIC_URL}/images/icons/static/forum-Add.svg` :
                  //   `${process.env.PUBLIC_URL}/images/icons/static/noData.svg`)
                } 
                    alt="Communication Icon" /> */}
                </div>
                <div className="col-md-12 d-flex justify-content-between eep_popupLabelMargin">
                  <label className="font-helvetica-m  mb-0 c-404040 eep_required_label">
                    Select Category
                  </label>
                  <div className="selectall_department_checkbox mr-2">
                    <label className="mb-0">
                      {deptValue.length + '/' + initDeptOptions.length}
                    </label>
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <Select
                    options={[
                      { label: 'Select All', value: 'all' },
                      ...initDeptOptions,
                    ]}
                    placeholder="Choose a Department"
                    classNamePrefix="eep_select_common select"
                    className="border_none select-with-bg"
                    onChange={(event) => {
                      event.length &&
                      event.find((option) => option.value === 'all')
                        ? onDeptChangeHandler(initDeptOptions)
                        : onDeptChangeHandler(event);
                    }}
                    isMulti={true}
                    maxMenuHeight={233}
                    value={deptValue}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <div className="d-flex justify-content-between">
                    <label className="font-helvetica-m c-404040 eep_popupLabelMargin eep_required_label">
                      Title
                    </label>
                    <label>
                      <span>{modalTitle.length}</span>/
                      <span>{titleMaxLength}</span>
                    </label>
                  </div>
                  <textarea
                    className="communication-title font-helvetica-r border_none eep_scroll_y w-100"
                    name="title"
                    id="title"
                    rows="1"
                    placeholder={
                      communicationType === 'forum'
                        ? 'Enter Forum Title'
                        : 'Enter Idea Title'
                    }
                    value={modalTitle}
                    maxLength={titleMaxLength}
                    onChange={(event) => setModalTitle(event.target.value)}
                  ></textarea>
                </div>
                <div
                  className={`col-md-12 ${
                    existingAttachementFiles.length > 0 ? 'mb-3' : ''
                  }`}
                >
                  <div className="d-flex justify-content-between">
                    <label className="font-helvetica-m c-404040 eep_popupLabelMargin eep_required_label">
                      Description
                    </label>
                    <label>
                      <span>{modalDescription.length}</span>/
                      <span>{descMaxLength}</span>
                    </label>
                  </div>
                  <textarea
                    rows="4"
                    cols="50"
                    placeholder="Write a Description"
                    name="description"
                    id="description"
                    className="communication-modal-textarea eep_scroll_y"
                    maxLength={descMaxLength}
                    value={modalDescription}
                    onChange={(event) =>
                      setModalDescription(event.target.value)
                    }
                  ></textarea>
                </div>
                {existingAttachementFiles.length > 0 && (
                  <div className="col-md-12">
                    <div className="d-flex align-items-center mb-2">
                      <label className="font-helvetica-m c-404040 eep_popupLabelMargin">
                        Existing Attachment(s)
                      </label>
                      <button
                        className="eep-btn eep-cancel-btn ml-2"
                        onClick={clearExistingAtth}
                      >
                        {!clearExistingAtthState ? 'Clear' : 'Revert'}
                      </button>
                    </div>
                    <div
                      className={`w-100 p-2 br-7 ${
                        !clearExistingAtthState ? 'bg-f5f5f5' : 'bg-danger'
                      } `}
                    >
                      <div className="d-flex">
                        {existingAttachementFiles.map((item, index) => {
                          return (
                            <div
                              className="attachments_list"
                              key={'attachments_list_' + index}
                              style={{ width: '50px' }}
                            >
                              <div className="attachments_list_a">
                                <a
                                  href={item.atthmentDataURI}
                                  className="c1"
                                  target="_thapa"
                                  download={item.attachmentName}
                                  title={item.attachmentName}
                                >
                                  <img
                                    src={item.imgSrcIcon}
                                    className="image-circle c1 ideabox_popup_attachement_dflex_image"
                                    alt="icon"
                                  />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {modalErrorAttachements.errCount.length > 0 &&
                  errorAtthState && (
                    <div className="col-md-12">
                      <div
                        className="alert alert-danger my-2"
                        role="alert"
                      >
                        <span>{modalErrorAttachements.errCount.length}</span>
                        <span>
                          {modalErrorAttachements.errCount.length > 1
                            ? ' - Invalid files!'
                            : ' - Invalid file!'}
                        </span>
                        <button
                          type="button"
                          className="close eep-error-close"
                          onClick={() => setErrorAtthState(false)}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                    </div>
                  )}
                {modalErrorAttachements?.generalErrors?.length > 0 &&
                  errorLengthAtthState && (
                    <div className="col-md-12">
                      <div
                        className="alert alert-danger my-2"
                        role="alert"
                      >
                        <button
                          type="button"
                          className="close eep-error-close mb-5"
                          onClick={() => setErrorLengthAtthState(false)}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                        {/* <ul> */}
                        {modalErrorAttachements.generalErrors.map(
                          (msg, index) => (
                            <li key={index}>{msg}</li> // Display general error message (e.g., "File limit exceeded")
                          )
                        )}
                        {/* </ul> */}
                      </div>
                    </div>
                  )}
                {modalErrorAttachements?.errLengthCount?.length > 0 &&
                  errorLengthAtthState && (
                    <div className="col-md-12">
                      <div
                        className="alert alert-danger my-2"
                        role="alert"
                      >
                        <button
                          type="button"
                          className="close eep-error-close mb-5"
                          onClick={() => setErrorLengthAtthState(false)}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                        <span>
                          {modalErrorAttachements.errLengthCount.length} file(s)
                          have errors:
                        </span>
                        <ul>
                          {modalErrorAttachements.errLengthCount.map(
                            (file, index) => (
                              <li key={index}>
                                {file.name} - File size exceeds the allowed
                                limit. File size should be less than 1MB.
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                {attachementFiles.length > 0 && (
                  <div className="col-md-12">
                    <div
                      className="d-flex justify-content-end my-1"
                      onClick={clearAllAtthments}
                    >
                      <span className="c1"> Reset Form</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-md-12 my-2">
                  <div className="attachments_list_whole_div text-right communication_modal_attachement_dflex ">
                    {attachementFiles.length <= 0 && (
                      <ToolTip
                        title="Attach Files (Supported: JPEG, PNG, GIF, JPG, SVG, PDF, PPT, Excel, Word, ZIP | Max 1MB per file, 5 files max)"
                        arrow
                        placement="top-end"
                        backgroundColor="#82889B"
                        color="#FFFFFF"
                        fontSize="12px"
                      >
                        <div
                          className="attachments_adds i_pin_icon eep_attachment_icon c1"
                          dangerouslySetInnerHTML={{
                            __html: svgIcons && svgIcons.attachment_icon_sm,
                          }}
                          title="jpge, png, gif, jpg, svg, pdf, ppt, excel, word, zip"
                          onClick={() => addIconClickHandler('new')}
                        ></div>
                      </ToolTip>
                    )}
                    {attachementFiles.length > 0 && (
                      <React.Fragment>
                        <ToolTip
                          title="Supported formats: jpge, png, gif, jpg, svg, pdf, ppt, excel, word, zip, Maximum Size: 1MB"
                          arrow
                          placement="top-end"
                          backgroundColor="#82889B"
                          color="#FFFFFF"
                          fontSize="12px"
                        >
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              '/images/icons/special/Attachment-small.svg'
                            }
                            className="c1 attachments_adds attachments_add"
                            title="jpge, png, gif, jpg, svg, pdf, ppt, excel, word, zip"
                            alt="attachment-add-icon"
                            onClick={() => addIconClickHandler('exist')}
                          />
                        </ToolTip>
                        {attachementFiles.map((item, index) => {
                          return (
                            // <div
                            //   className="attachments_list"
                            //   key={'attachments_list_' + index}
                            // >

                            //   <div className="attachments_list_a">
                            //     <a
                            //       href={item.atthmentDataURI}
                            //       className="c1"
                            //       target="_thapa"
                            //       download={item.attachmentName}
                            //       title={item.attachmentName}
                            //     >
                            //       <img
                            //         src={item.imgSrcIcon}
                            //         className="image-circle c1 ideabox_popup_attachement_dflex_image"
                            //         alt="icon"
                            //         height={32}
                            //         width={32}
                            //       />
                            //     </a>
                            //   </div>
                            // </div>
                            <div
                              onMouseEnter={() => setIsHovered(index)}
                              onMouseLeave={() => setIsHovered(null)}
                              className="attachments_list mb-0"
                              key={'attachments_list_' + index}
                            >
                              <div className="attachments_list_a">
                                {isHovered === index && (
                                  <div
                                    className="close closed"
                                    onClick={() => {
                                      const updatedAttachments =
                                        attachementFiles.filter(
                                          (_, i) => i !== index // Remove the item at the clicked index
                                        );
                                      const updatedModelAttachments =
                                        modalAttachements.filter(
                                          (_, i) => i !== index // Remove the item at the clicked index
                                        );
                                      setModalAttachements(
                                        updatedModelAttachments
                                      );
                                      setAttachementFiles(updatedAttachments); // Update the state with the new array
                                    }}
                                    style={{
                                      fontSize: '14px',
                                      fontSize: '12px',
                                      /* background: #000; */
                                      borderRadius: '18px',
                                      cursor: 'pointer',
                                      width: '15px',
                                      // top: '0px',
                                      height: '16px',
                                      position: 'absolute',
                                      padding: '0px 4px',
                                      // left: '21px',
                                      color: ' #676767',
                                      opacity: 1,
                                      background: '#c9c9c9',
                                    }}
                                  >
                                    x
                                  </div>
                                )}
                                <a
                                  className="c1"
                                  href={item.atthmentDataURI}
                                  target="_thapa"
                                  download={item.attachmentName}
                                  title={item.attachmentName}
                                >
                                  <img
                                    src={item.imgSrcIcon}
                                    className="image-circle c1 command-attachement-img-size"
                                    alt="icon"
                                  />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    )}
                  </div>
                  <input
                    type="file"
                    className="d-none attachmentFileLoaders text-right"
                    id="attachmentFileLoaderNew"
                    name="file-input"
                    multiple="multiple"
                    title="Load File"
                    onChange={(event) => onChangeHandler(event, 'new')}
                  />
                  <input
                    type="file"
                    className="d-none attachmentFileLoaders text-right"
                    id="attachmentFileLoaderExist"
                    name="file-input"
                    multiple="multiple"
                    title="Load File"
                    onChange={(event) => onChangeHandler(event, 'exist')}
                  />
                </div>
              </div>
              {communicationModalError && (
                <div className="col-md-12">
                  <div
                    className="alert alert-danger my-2"
                    role="alert"
                  >
                    <span>{communicationModalError}</span>
                    <button
                      type="button"
                      className="close eep-error-close"
                      onClick={() => setCommunicationModalError('')}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </div>
              )}
              <div className="communication_add_action_div d-flex justify-content-center">
                <button
                  type="button"
                  className="eep-btn eep-btn-cancel eep-btn-nofocus eep-btn-xsml mr-2"
                  data-dismiss="modal"
                  onClick={hideModal}
                >
                  Discard
                </button>
                {communicationData === null && (
                  <button
                    type="button"
                    className="eep-btn eep-btn-success eep-btn-xsml ml-3"
                    disabled={isFormValid}
                    onClick={postCommunicationHandler}
                  >
                    Submit
                  </button>
                )}
                {communicationData &&
                  communicationData !== null &&
                  Object.keys(communicationData).length > 0 && (
                    <button
                      type="button"
                      className="eep-btn eep-btn-success eep-btn-xsml ml-3"
                      disabled={isFormValid}
                      onClick={updateCommunicationHandler}
                    >
                      Update
                    </button>
                  )}
              </div>
            </div>
          </div>
          {/* <div className="modal-header py-0 border-bottom-0">
						<button type="button" className="close closed" data-dismiss="modal" title="Close" onClick={hideModal}></button>
					</div> */}
        </div>
      </div>
    </div>
  );
};
export default CreateEditCommunicationModal;

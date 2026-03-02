import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ToolTip from '../../modals/ToolTip';
import { fileTypeAndImgSrcArray } from '../../helpers';

const IdeaComments = (props) => {
  const { commentSubmitHandler, isCommentSubmitted } = props;

  const commentMaxLength = 120;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const initIsCommentSubmitted = isCommentSubmitted
    ? isCommentSubmitted
    : false;
  const [ideaComment, setIdeaComment] = useState('');
  const [cmtAttachements, setCmtAttachements] = useState([]);
  const [cmtErrorAttachements, setCmtErrorAttachements] = useState({
    errCount: [],
    errLengthCount: [],
    generalErrors: [],
  });
  const [errorAtthState, setErrorAtthState] = useState(false);
  const [errorLengthAtthState, setErrorLengthAtthState] = useState(false);
  const [attachementFiles, setAttachementFiles] = useState([]);
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    //if(initIsCommentSubmitted) {
    setIdeaComment('');
    setCmtAttachements([]);
    setAttachementFiles([]);
    setCmtErrorAttachements({ errCount: [], errLengthCount: [] });
    setErrorAtthState(false);
    setErrorLengthAtthState(false);
    //}
  }, [initIsCommentSubmitted]);

  const addIconClickHandler = (arg) => {
    document.getElementById('cmt_attachmentFileLoaderNew').value = null;
    document.getElementById('cmt_attachmentFileLoaderExist').value = null;
    if (arg === 'new') {
      document.getElementById('cmt_attachmentFileLoaderNew').click();
    }
    if (arg === 'exist') {
      document.getElementById('cmt_attachmentFileLoaderExist').click();
    }
  };

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

  let validFiles = [];
  let errFiles = [];
  let errLengthFiles = [];
  const maxFileSize = 1024000;
  var atthFiles = [];
  var fileLimit = 5;
  var generalErrors = [];
  const onChangeHandler = (event, cType) => {
    var file = [];
    file = event.target.files;
    const filelength = attachementFiles?.length + file?.length;

    if (filelength > fileLimit) {
      generalErrors.push(`You can only select up to ${fileLimit} files.`);
      setErrorLengthAtthState(true); // If you have state to handle visibility of errors
    } else {
      for (let k = 0; k < file.length; k++) {
        if (validAttachmentTypes.includes(file[k]['type'])) {
          if (file[k]['size'] <= maxFileSize) {
            let reader = new FileReader();
            reader.onload = function (e) {
              validFiles.push(file[k]);
              atthFiles.push({
                imgSrcIcon: fileTypeAndImgSrcArray[file[k]['type']]
                  ? fileTypeAndImgSrcArray[file[k]['type']]
                  : fileTypeAndImgSrcArray['default'],
                atthmentDataURI: e.target.result,
                attachmentName: file[k]['name'],
              });
              updateAttachementFilesData(atthFiles, cType, validFiles);
            };
            reader.readAsDataURL(file[k]);
          } else {
            errLengthFiles.push(file[k]);
            setErrorLengthAtthState(true);
          }
        } else {
          errFiles.push(file[k]);
          setErrorAtthState(true);
        }
      }
    }
    setCmtErrorAttachements({
      errCount: errFiles,
      errLengthCount: errLengthFiles,
      generalErrors: generalErrors, // Store general error message
    });
  };

  const updateAttachementFilesData = (fData, fType, vFiles) => {
    if (fType === 'new') {
      setAttachementFiles([...fData]);
      setCmtAttachements([...vFiles]);
    }
    if (fType === 'exist') {
      const all = [...fData, ...attachementFiles];
      setAttachementFiles(all);
      const allValid = [...vFiles, ...cmtAttachements];
      setCmtAttachements(allValid);
    }
  };

  const clearAllAtthments = () => {
    setAttachementFiles([]);
    setCmtAttachements([]);
    setCmtErrorAttachements({ errCount: [], errLengthCount: [] });
  };

  const commentHandler = () => {
    if (ideaComment.length > 0) {
      const cmtDatas = {
        files: cmtAttachements,
        commentValue: ideaComment,
      };
      commentSubmitHandler(cmtDatas);
    }
  };

  return (
    <div className="ideabox_mesgbutton_container">
      <div className="reply-textarea-inner">
        <div className="reply-textarea-div position-relative">
          <textarea
            className="form-control ideabox-message-textarea ideabox_contentt_size eep_scroll_y"
            name="comment"
            id="ideaCommentTextarea"
            maxLength={commentMaxLength}
            placeholder="Add a comment"
            value={ideaComment}
            onChange={(e) => setIdeaComment(e.target.value)}
          ></textarea>
          <div
            className="text-right"
            style={{ color: '#858796', paddingRight: '5px', fontSize: '10px' }}
          >
            <span>{ideaComment.length}</span>/<span>{commentMaxLength}</span>
          </div>

          {cmtErrorAttachements.errCount.length > 0 && errorAtthState && (
            <div
              className="col-md-12"
              style={{ fontSize: '10px' }}
            >
              <div
                className="alert alert-danger my-1"
                role="alert"
              >
                <span>{cmtErrorAttachements.errCount.length}</span>
                <span>
                  {cmtErrorAttachements.errCount.length > 1
                    ? ' - Invalid files!'
                    : ' - Invalid file!'}
                </span>
                <button
                  type="button"
                  className="close eep-error-close"
                  style={{ fontSize: '18px' }}
                  onClick={() => setErrorAtthState(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </div>
          )}
          {cmtErrorAttachements?.generalErrors?.length > 0 &&
            errorLengthAtthState && (
              <>
                {' '}
                <div
                  className="col-md-12"
                  style={{ fontSize: '10px', padding: 0 }}
                >
                  <div
                    className="alert alert-danger my-1"
                    role="alert"
                    style={{ width: '80%' }}
                  >
                    <button
                      type="button"
                      className="close eep-error-close"
                      style={{ fontSize: '18px' }}
                      onClick={() => setErrorLengthAtthState(false)}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                    {cmtErrorAttachements.generalErrors.map((msg, index) => (
                      <div key={index}>{msg}</div> // Display general error message (e.g., "File limit exceeded")
                    ))}
                  </div>
                </div>
              </>
            )}
          {cmtErrorAttachements?.errLengthCount?.length > 0 &&
            errorLengthAtthState && (
              <div
                className="col-md-12"
                style={{ fontSize: '10px', padding: 0 }}
              >
                <div
                  className="alert alert-danger my-1"
                  role="alert"
                  style={{ width: '80%' }}
                >
                  <button
                    type="button"
                    className="close eep-error-close"
                    style={{ fontSize: '18px' }}
                    onClick={() => setErrorLengthAtthState(false)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <span>
                    {cmtErrorAttachements.errLengthCount.length} file(s) have
                    errors:
                  </span>
                  <ul>
                    {cmtErrorAttachements.errLengthCount.map((file, index) => (
                      <li key={index}>
                        {file.name} - File size exceeds the allowed limit. File
                        size should be less than 1MB.
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          {/* {cmtErrorAttachements.errLengthCount.length > 0 &&
            errorLengthAtthState && (
              <div
                className="col-md-12"
                style={{ fontSize: '10px' }}
              >
                <div
                  className="alert alert-danger my-1"
                  role="alert"
                >
                  <span>{cmtErrorAttachements.errLengthCount.length}</span>
                  <span>
                    {' '}
                    - File Size exceeds, File Size should be less than 1mb.
                  </span>
                  <button
                    type="button"
                    className="close eep-error-close"
                    style={{ fontSize: '18px' }}
                    onClick={() => setErrorLengthAtthState(false)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </div>
            )} */}

          <div className="ideabox_mesgbutton text-right">
            <div className="attahement_on_command d-inline-flex flex-wrap-reverse align-items-center flex-row-reverse">
              <div
                className={`${
                  ideaComment.length > 0 ? 'eep_post_icon c1' : ''
                }`}
                onClick={commentHandler}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: svgIcons && svgIcons.send_icon,
                  }}
                ></span>
              </div>

              {attachementFiles.length > 0 && (
                <div
                  className="idea_attachement_clear_comments c1 d-flex"
                  style={{ order: '1' }}
                  onClick={clearAllAtthments}
                >
                  <span className="idea_atth_clear">Clear</span>
                </div>
              )}
              {attachementFiles.length > 0 && (
                <React.Fragment>
                  <ToolTip
                    title="Supported formats: JPEG, PNG, GIF, JPG, SVG, PDF, PPT, Excel, Word, ZIP (Maximum Size: 1MB per file, Maximum Files: 5)"
                    arrow
                    placement="top-end"
                    backgroundColor="#82889B"
                    color="#FFFFFF"
                    fontSize="12px"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/special/attachment-add.svg`}
                      className="ideabox-attach-img-size_2 image-circle c1 command_attachement right_side_commandadd_icon mr-2"
                      id="command_attachement_plus"
                      alt="attachment-add-icon"
                      onClick={() => addIconClickHandler('exist')}
                    />
                  </ToolTip>
                  {attachementFiles.map((item, index) => {
                    return (
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
                                const updatedAttachments = [
                                  ...attachementFiles,
                                ];
                                updatedAttachments.splice(index, 1);
                                setAttachementFiles(updatedAttachments);
                              }}
                              style={{
                                fontSize: '14px',
                                fontSize: '12px',
                                /* background: #000; */
                                borderRadius: '18px',
                                cursor: 'pointer',
                                width: '15px',
                                top: '0px',
                                height: '16px',
                                position: 'absolute',
                                padding: '0px 4px',
                                left: '21px',
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
              {attachementFiles.length <= 0 && (
                <ToolTip
                  title="Supported formats: JPEG, PNG, GIF, JPG, SVG, PDF, PPT, Excel, Word, ZIP (Maximum Size: 1MB per file, Maximum Files: 5)"
                  arrow
                  placement="top-end"
                  backgroundColor="#82889B"
                  color="#FFFFFF"
                  fontSize="12px"
                >
                  <div
                    id="command_attachement_icon"
                    className="c1 command_attachement eep_attachment_icon mr-2"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.attachment_icon_sm,
                    }}
                    onClick={() => addIconClickHandler('new')}
                  ></div>
                </ToolTip>
              )}
              <input
                type="file"
                className="d-none attachmentFileLoaders text-right"
                id="cmt_attachmentFileLoaderNew"
                name="file-input"
                multiple="multiple"
                title="Load File"
                onChange={(event) => onChangeHandler(event, 'new')}
              />
              <input
                type="file"
                className="d-none attachmentFileLoaders text-right"
                id="cmt_attachmentFileLoaderExist"
                name="file-input"
                multiple="multiple"
                title="Load File"
                onChange={(event) => onChangeHandler(event, 'exist')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaComments;

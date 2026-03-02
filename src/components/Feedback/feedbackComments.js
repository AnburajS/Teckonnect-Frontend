import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import quillEmoji from 'react-quill-emoji';
import 'react-quill-emoji/dist/quill-emoji.css';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import ToolTip from '../../modals/ToolTip';
import { fileTypeAndImgSrcArray } from '../../helpers';

const FeedbackComments = (props) => {
  const quillRef = React.createRef();
  const { commentSubmitHandler, childReplay, IsClear } = props;
  Quill.register(
    {
      'formats/emoji': quillEmoji.EmojiBlot,
      'modules/emoji-toolbar': quillEmoji.ToolbarEmoji,
      'modules/emoji-textarea': quillEmoji.TextAreaEmoji,
      'modules/emoji-shortname': quillEmoji.ShortNameEmoji,
    },
    true
  );

  const commentMaxLength = 120;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [ideaComment, setIdeaComment] = useState('');
  const [cmtAttachements, setCmtAttachements] = useState([]);
  const [cmtErrorAttachements, setCmtErrorAttachements] = useState({
    errCount: [],
    errLengthCount: [],
    generalErrors: [], // Store general error message
  });
  const [errorAtthState, setErrorAtthState] = useState(false);
  const [errorLengthAtthState, setErrorLengthAtthState] = useState(false);
  const [attachementFiles, setAttachementFiles] = useState([]);
  const [isHovered, setIsHovered] = useState(null);

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
    if (ideaComment !== '<p><br></p>') {
      if (ideaComment?.length > 0) {
        const cmtDatas = {
          files: cmtAttachements,
          commentValue: ideaComment,
        };
        commentSubmitHandler(cmtDatas);
      }
    }
  };

  const onchangeText = (v) => {
    setIdeaComment(v);
  };

  React.useEffect(() => {
    if (quillRef?.current) {
      quillRef?.current.focus(); // Set focus to the editor
    }
  }, []);
  return (
    <div className="ideabox_mesgbutton_container_reply">
      <div className="reply-textarea-inner reply-textarea-inner-f">
        <div className="reply-textarea-div position-relative">
          <div
            className="feed-comment-close"
            onClick={() => IsClear()}
          >
            X
          </div>

          {childReplay?.message && (
            <div className="replay-comment">
              Reply To:
              <div
                id="parentElement"
                className="eep_command_posts"
                dangerouslySetInnerHTML={{ __html: childReplay?.message }}
              />
            </div>
          )}

          <div className="editor-container-replay">
            <ReactQuill
              className="editor"
              ref={quillRef}
              modules={{
                toolbar: {
                  container: [['bold', 'italic', 'underline'], ['emoji']],
                },
                'emoji-toolbar': true,
                // "emoji-textarea": true,
                // "emoji-shortname": true
              }}
              theme="snow"
              placeholder="Add a comment"
              value={ideaComment}
              onChange={(e) => setIdeaComment(e)}
            />
          </div>

          {cmtErrorAttachements?.errCount?.length > 0 && errorAtthState && (
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

          <div className=" d-inline-flex open_chat">
            <ToolTip
              title="Supported formats: JPEG, PNG, GIF, JPG, SVG, PDF, PPT, Excel, Word, ZIP (Maximum Size: 1MB per file, Maximum Files: 5)"
              arrow
              placement="top-start"
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
                onClick={() => addIconClickHandler('exist')}
              ></div>
            </ToolTip>
            {/* } */}
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              className="d-none attachmentFileLoaders text-right"
              id="cmt_attachmentFileLoaderNew"
              name="file-input"
              multiple="multiple"
              title="Load File"
              onChange={(event) => onChangeHandler(event, 'exist')}
            />
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              className="d-none attachmentFileLoaders text-right"
              id="cmt_attachmentFileLoaderExist"
              name="file-input"
              multiple="multiple"
              title="Load File"
              onChange={(event) => onChangeHandler(event, 'exist')}
            />

            <div
              className={`${ideaComment.length > 0 ? 'eep_post_icon c1' : ''}`}
              onClick={() => ideaComment && commentHandler()}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: svgIcons && svgIcons.send_icon,
                }}
              ></span>
            </div>
          </div>

          {attachementFiles?.length > 0 && (
            <div className="ideabox_mesgbutton text-right">
              <div className="attahement_on_command d-inline-flex flex-wrap-reverse align-items-center flex-row-reverse">
                {attachementFiles?.length > 0 && (
                  <div
                    className="idea_attachement_clear_comments c1 d-flex"
                    style={{ order: '1' }}
                    onClick={clearAllAtthments}
                  >
                    <span className="idea_atth_clear">Clear</span>
                  </div>
                )}
                {attachementFiles?.length > 0 && (
                  <React.Fragment>
                    {attachementFiles?.map((item, index) => {
                      return (
                        <div
                          className="attachments_list mb-0"
                          onMouseEnter={() => setIsHovered(index)}
                          onMouseLeave={() => setIsHovered(null)}
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
                                style={{ width: '24px' }}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackComments;

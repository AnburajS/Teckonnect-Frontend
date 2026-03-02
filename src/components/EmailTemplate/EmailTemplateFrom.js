import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import {
  createEmailTemplates,
  updateEmailTemplates,
} from '../../store/emailTemplateThunk';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { hideModal } from '../../store/modalSlice';
const EmailTemplateFrom = ({ tilte, data, readOnly = false }) => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const { templates, updateTemplates } = useSelector(
    (state) => state.emailTemplate,
  );
  const showModalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const [templateName, setTemplateName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [errors, setErrors] = useState({});
  const [navigateTrigger, setNavigateTrigger] = useState(false);
  const customizationTokens = data?.is_password
    ? [
        'User Name',
        'First Name',
        'Last Name',
        'password',
        'Email',
        'Phone',
        'Department',
        'Designation',
        'User Type',
        'Branch',
        'Country',
      ]
    : [
        'User Name',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Department',
        'Designation',
        'User Type',
        'Branch',
        'Country',
      ];

  const insertVariable = (variable) => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const range = editor.getSelection(true);
    const position = range ? range.index : editor.getLength();
    editor.insertText(position, variable);
    editor.setSelection(position + variable.length);
  };

  const handleSubmit = (update, save) => {
    const newErrors = {};
    if (!templateName.trim())
      newErrors.templateName = 'Template Name is required.';
    if (!subjectName.trim())
      newErrors.subjectName = 'Subject Name is required.';
    if (!bodyContent || bodyContent === '<p><br></p>')
      newErrors.bodyContent = 'Body Content is required.';
    setErrors(newErrors);
    if (save) {
      setNavigateTrigger(save);
    }
    if (Object.keys(newErrors).length === 0) {
      if (update) {
        dispatch(
          updateEmailTemplates({
            id: data?.id,
            templateName,
            subjectName,
            bodyContent,
          }),
        );
      } else {
        dispatch(
          createEmailTemplates({ templateName, subjectName, bodyContent }),
        );
      }
    }
  };

  const handleFieldChange = (field, value) => {
    // Live update value
    switch (field) {
      case 'templateName':
        setTemplateName(value);
        break;
      case 'subjectName':
        setSubjectName(value);
        break;
      default:
        break;
    }

    // Remove error if any
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleBodyChange = (value) => {
    setBodyContent(value);
    if (value && value !== '<p><br></p>') {
      setErrors((prev) => ({ ...prev, bodyContent: '' }));
    }
  };
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Email Templates',
      link: 'app/templatelist',
    },
    {
      label: `${
        readOnly
          ? 'View Template'
          : data?.id
            ? ' Modify Template'
            : ' Create Template'
      }`,
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: `${
          readOnly
            ? 'View Template'
            : data?.id
              ? ' Modify Template'
              : ' Create Template'
        }`,
      }),
    );
  }, [breadcrumbArr, dispatch]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
      // handlers: {
      //   image: imageHandler,
      // }
      clipboard: {
        matchVisual: false,
      },
    },
  };

  useEffect(() => {
    if (data) {
      setTemplateName(data?.templateName);
      setBodyContent(data?.bodyContent);
      setSubjectName(data?.subjectName);
    }
  }, [data]);
  const handleReset = () => {
    if (data) {
      setTemplateName(data?.templateName);
      setBodyContent(data?.bodyContent);
      setSubjectName(data?.subjectName);
    } else {
      setTemplateName('');
      setBodyContent('');
      setSubjectName('');
    }
  };
  return (
    <React.Fragment>
      <div className="">
        {showModalState.type !== null &&
          showModalState.message !== null &&
          readOnly !== true && (
            <EEPSubmitModal
              data={showModalState}
              className={`modal-addmessage`}
              // hideModal={() => dispatch(hideModal())}
              successFooterData={
                <Link
                  to={navigateTrigger ? '/app/trigger' : '/app/templatelist'}
                  state={data?.id ? updateTemplates : templates}
                  type="button"
                  className="eep-btn  eep-btn-success"
                  onClick={() => dispatch(hideModal())}
                >
                  Ok
                </Link>
              }
              errorFooterData={
                <button
                  type="button"
                  className="eep-btn  eep-btn-danger"
                  onClick={() => dispatch(hideModal())}
                >
                  Close
                </button>
              }
            />
          )}
        <PageHeader
          title={tilte ? tilte : 'Create Template'}
          navLinksLeft={
            <Link
              to="/app/templatelist"
              className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
              dangerouslySetInnerHTML={{
                __html: svgIcons && svgIcons.lessthan_circle,
              }}
            ></Link>
          }
        />
        <Row className="px-3">
          <Col
            xs={9}
            className="mr-3 bg-f5f5f5 col-border-radius "
          >
            <div className=" p-4 mb-4 ">
              <Row>
                <Col xs={6}>
                  <div className="mb-3 input-form">
                    <label className="form-label fw-bold">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      style={
                        data?.is_password
                          ? { cursor: 'not-allowed' }
                          : readOnly
                            ? { cursor: 'not-allowed' }
                            : {}
                      }
                      readOnly={data?.is_password ? true : readOnly}
                      type="text"
                      className={`form-control ${
                        errors.templateName ? 'is-invalid' : ''
                      }`}
                      placeholder="Welcome Onboard"
                      value={templateName}
                      onChange={(e) =>
                        handleFieldChange('templateName', e.target.value)
                      }
                    />
                    {errors.templateName && (
                      <div className="invalid-feedback">
                        {errors.templateName}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={6}>
                  {' '}
                  <div className="mb-3 input-form">
                    <label className="form-label fw-bold">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      style={readOnly ? { cursor: 'not-allowed' } : {}}
                      type="text"
                      className={`form-control ${
                        errors.subjectName ? 'is-invalid' : ''
                      }`}
                      placeholder="Onboarding Teckonnect"
                      value={subjectName}
                      readOnly={readOnly}
                      onChange={(e) =>
                        handleFieldChange('subjectName', e.target.value)
                      }
                    />
                    {errors.subjectName && (
                      <div className="invalid-feedback">
                        {errors.subjectName}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12}>
                  {/* <div className="mb-3 div-ql-container">
                    <label className="form-label fw-bold">
                      Mail Content <span className="text-danger">*</span>
                    </label>
                    <ReactQuill
                      style={
                        readOnly
                          ? { cursor: 'not-allowed', minHeight: '200px' }
                          : { minHeight: '200px' }
                      }
                      readOnly={readOnly}
                      ref={quillRef}
                      theme="snow"
                      value={bodyContent}
                      modules={modules}
                      onChange={handleBodyChange}
                    />
                    {errors.bodyContent && (
                      <div className="text-danger mt-1 small">
                        {errors.bodyContent}
                      </div>
                    )}
                  </div> */}
                  <div className="mb-3 div-ql-container">
                    <label className="form-label fw-bold">
                      Mail Content <span className="text-danger">*</span>
                    </label>

                    <div className="quill-wrapper">
                      <ReactQuill
                        readOnly={readOnly}
                        ref={quillRef}
                        theme="snow"
                        value={bodyContent}
                        modules={modules}
                        onChange={handleBodyChange}
                      />
                    </div>

                    {errors.bodyContent && (
                      <div className="text-danger mt-1 small">
                        {errors.bodyContent}
                      </div>
                    )}
                  </div>
                </Col>

                <Col xs={12}>
                  {readOnly ? null : (
                    <div className="d-flex justify-content-end gap-3">
                      <button
                        className="btn eep-btn eep-btn-cancel button-border-9d9d9d"
                        onClick={() => handleReset()}
                      >
                        Reset
                      </button>
                      <button
                        className="btn eep-btn eep-btn-cancel mx-2 button-border-9d9d9d"
                        onClick={() => handleSubmit(data?.id ? true : '')}
                      >
                        Save
                      </button>
                      <button
                        className="btn eep-btn eep-btn-success "
                        style={{ color: '#ffff' }}
                        onClick={() => handleSubmit(data?.id ? true : '', true)}
                      >
                        Save & Send
                      </button>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          </Col>

          {/* Sidebar Tokens */}
          <Col
            // xs={3}
            className=" bg-f5f5f5 col-border-radius"
          >
            <div
              className=" p-3 "
              style={{ opacity: readOnly ? 0.2 : 1 }}
            >
              <h6>Plug-ins</h6>
              <p className="fs-12 color-a0a0a0">
                Add these tags to your email to personalize it with each
                applicant’s information.
              </p>
              <ul className="list-unstyled mt-5">
                {customizationTokens.map((token, index) => (
                  <li
                    key={index}
                    className="mb-2 color-2c2c2c my-4 text-decoration-underline"
                    style={{ cursor: readOnly ? 'not-allowed' : 'pointer' }}
                    onClick={
                      readOnly
                        ? null
                        : () =>
                            insertVariable(
                              `{{${token.toLowerCase().replace(/\s+/g, '_')}}}`,
                            )
                    }
                  >
                    {token}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default EmailTemplateFrom;

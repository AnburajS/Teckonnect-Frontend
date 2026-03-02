import React, { useEffect, useState } from 'react';

import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { hideModal } from '../../store/modalSlice';
import TableComponent from '../../UI/tableComponent';
import { getEmailTemplatesList } from '../../store/emailTemplateThunk';
import { getPlainTextFromHtml, truncateText } from '../../shared/SharedService';
import EmailActionDropDown from './EmailActionDropDown';
import moment from 'moment';
const CreateEmailTemplateList = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const { loading, data } = useSelector(
    (state) => state.emailTemplate?.getEmailTemplate
  );
  const showModalState = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const tableHeaders = [
    {
      header: 'Name',
      accessorKey: 'templateName',
    },
    {
      header: 'Subject',
      accessorKey: 'subjectName',
    },
    {
      header: 'Mail Content',
      accessorKey: 'bodyContent',
      accessorFn: (row) => {
        const plainText = getPlainTextFromHtml(row?.bodyContent);

        return truncateText(plainText, 50);
      },
    },

    // {
    //   header: 'Created On',
    //   accessorKey: 'createdAt',
    //   accessorFn: (row) =>
    //     row?.created_at ? moment(row.created_at).format('l') : '--',
    // },
    // {
    //   fieldLabel: null,
    //   fieldValue: "action",
    //   component: <UserManagementActionDropdown />,
    // },
  ];
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Email Templates',
      link: '',
    },
  ];

  useEffect(() => {
    // dispatch(getEmailTemplatesList());
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: ' Create Template',
      })
    );
  }, [breadcrumbArr, dispatch]);
  useEffect(() => {
    dispatch(getEmailTemplatesList());
  }, []);

  return (
    <React.Fragment>
      <div className="">
        {showModalState.type !== null && showModalState.message !== null && (
          <EEPSubmitModal
            data={showModalState}
            className={`modal-addmessage`}
            // hideModal={() => dispatch(hideModal())}
            successFooterData={
              <button
                type="button"
                className="eep-btn  eep-btn-success"
                onClick={() => dispatch(hideModal())}
              >
                Ok
              </button>
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
          title="Email Templates"
          navLinksRight={
            <Link
              className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
              to="/app/composeemail"
              dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
            ></Link>
          }
        ></PageHeader>

        <div
          className="eep-user-management eep-content-start"
          id="content-start"
        >
          <div
            className="table-responsive eep_datatable_table_div"
            style={{ visibility: 'visible' }}
          >
            <div
              id="user_dataTable_wrapper"
              className="dataTables_wrapper dt-bootstrap4 no-footer"
              style={{ width: '100%' }}
            >
              {!loading && (
                <div style={{ position: 'relative' }}>
                  <TableComponent
                    data={data?.response ?? []}
                    columns={tableHeaders}
                    // actionHidden={true}
                    enableRowNumbers={true}
                    action={<EmailActionDropDown />}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateEmailTemplateList;

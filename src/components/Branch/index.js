import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BranchMasterActions from '../../UI/CustomComponents/branchMasterAction';
import Filter from '../../UI/Filter';
import PageHeader from '../../UI/PageHeader';
import TableComponent from '../../UI/tableComponent';
import { URL_CONFIG } from '../../constants/rest-config';
import { FILTER_CONFIG } from '../../constants/ui-config';
import { downloadXlsx, pageLoaderHandler } from '../../helpers';
import { httpHandler } from '../../http/http-interceptor';
import CreateBranchModal from '../../modals/CreateBranchModal';
import EEPSubmitModal from '../../modals/EEPSubmitModal';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';

const BranchMaster = () => {
  const dispatch = useDispatch();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [state, setState] = useState({
    data: {},
    offset: 0,
    limit: 1000,
    showTable: { label: '15', value: 15 },
  });
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setisOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const isDelete = (argu) => {};
  const getDeptData = (argu) => {
    setEditData(argu);
  };

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Admin Panel',
      link: 'app/adminpanel',
    },
    {
      label: 'Branch Master',
      link: '',
    },
  ];

  const userDataTableHeaders = [
    {
      header: 'Country',
      accessorKey: 'country.countryName',
    },
    {
      header: 'Currency Code',
      accessorKey: 'country.currencyCode',
    },
    {
      header: 'Branch Name',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Department Master',
      })
    );
  }, [breadcrumbArr, dispatch]);

  const fetchAllBrachData = (search, limit, offset, arg = {}) => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.GET_ALL_BRANCH,
      method: 'get',
    };

    if (
      arg?.filterValue &&
      Object.keys(arg.filterValue).length &&
      arg.filterValue.value !== ''
    ) {
      obj['params'] = {
        ...obj['params'],
        active: arg.filterValue.value,
      };
    }

    obj['params'] = {
      ...obj['params'],
      offset: state?.offset,
    };

    obj['params'] = {
      ...obj['params'],
      limit: state?.limit,
    };

    if (state?.search) {
      obj['params'] = {
        ...obj['params'],
        search: state?.search ?? '',
      };
    }

    httpHandler(obj).then((response) => {
      setState({
        ...state,
        data: response?.data,
      });
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchAllBrachData();
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const hideModal = () => {
    let collections = document.getElementsByClassName('modal-backdrop');
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const filterOnChangeHandler = (arg) => {
    fetchAllBrachData(false, false, false, { filterValue: arg });
  };

  const handleExportDownload = () => {
    let xlData = state?.data?.data?.map((v) => {
      return {
        Id: v?.id,
        Name: v?.name,
        Active: v?.active,
        Description: v?.description,
        Country: v?.country?.countryName,
      };
    });
    downloadXlsx('BranchMasters.xlsx', xlData);
  };

  return (
    <React.Fragment>
      <React.Fragment>
        {showModal.type !== null && showModal.message !== null && (
          <EEPSubmitModal
            data={showModal}
            className={`modal-addmessage`}
            hideModal={hideModal}
            successFooterData={
              <button
                type="button"
                className="eep-btn eep-btn-xsml eep-btn-success"
                data-dismiss="modal"
                onClick={hideModal}
              >
                Ok
              </button>
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

        {isOpen && (
          <CreateBranchModal
            setisOpen={setisOpen}
            showModal={showModal}
            setShowModal={setShowModal}
            data={state?.data?.data ?? []}
            editData={editData}
            fetchDeptData={fetchAllBrachData}
          />
        )}

        <PageHeader
          title="Branch Masters "
          navLinksRight={
            <a
              className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg c1"
              data-toggle="modal"
              data-target="#CreateBranchModal"
              dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
              onClick={() => {
                setEditData(null);
                setisOpen(true);
              }}
            ></a>
          }
          filter={
            <Filter
              config={FILTER_CONFIG}
              onFilterChange={filterOnChangeHandler}
            />
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
            {!isLoading && (
              <div
                id="user_dataTable_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
                style={{ width: '100%' }}
              >
                <button
                  className="btn btn-secondary"
                  aria-controls="user_dataTable"
                  type="button"
                  style={{
                    position: 'absolute',
                    zIndex: '9',
                    right: '18px',
                    margin: ' 8px 0px',
                  }}
                  onClick={() => handleExportDownload()}
                >
                  <span>Excel</span>
                </button>
                <TableComponent
                  data={state?.data?.data ?? []}
                  columns={userDataTableHeaders}
                  action={
                    <BranchMasterActions
                      setisOpen={setisOpen}
                      isDelete={isDelete}
                      getDeptData={getDeptData}
                    />
                  }
                />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>

      {/* {!state?.data?.data?.length > 0 &&
                <div className="row eep-content-section-data no-gutters">
                    <ResponseInfo
                        title="No branch you have!."
                        responseImg="noRecord"
                        responseClass="response-info"
                    />
                </div>
            } */}
    </React.Fragment>
  );
};

export default BranchMaster;

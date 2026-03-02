import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../UI/PageHeader";
import TableComponent from "../../UI/tableComponent";
import { URL_CONFIG } from "../../constants/rest-config";
import { downloadXlsx, pageLoaderHandler } from "../../helpers";
import { httpHandler } from "../../http/http-interceptor";
import CreateYGGCountryModal from "../../modals/CreateYGGCountryModal";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import ResponseInfo from "../../UI/ResponseInfo";
import CountryMappingActions from "../../UI/CustomComponents/CountryMappingActions";
import ConfirmStateModal from "../../modals/ConfirmStateModal";
import Isloading from "../../UI/CustomComponents/Isloading";

const CountryMapping = () => {
  const dispatch = useDispatch();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [branchOptions, setBranchOptions] = useState([]);
  const [yggCountryOptions, setYGGCountryOptions] = useState([]);
  const [state, setState] = useState({
    data: {},
    offset: 0,
    limit: 1000,
    showTable: { label: "15", value: 15 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setisOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [yggMappedCountrylist, setYGGMappedCountrylist] = useState([]);
  const [confirmModalState, setConfirmModalState] = useState(false);
  const [deleteDataState, setDeleteDataState] = useState({});

  const isDelete = (argu) => {
    console.log("argu", argu);
    setConfirmModalState(true);
    setDeleteDataState(argu);
  };

  const confirmState = (isConfirmed) => {
    if (isConfirmed) {
      console.log("Delete confirmed", isConfirmed);
      const obj = {
        url: URL_CONFIG.YGG_COUNTRY + "?id=" + deleteDataState?.id,
        method: "delete",
      };
      httpHandler(obj)
        .then(() => {
          fetchAllMappedCountriesList();
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
        });
      setDeleteDataState({});
      disableExistModal();
    } else {
      setConfirmModalState(false);
    }
  };

  const getCountryData = (argu) => {
    setEditData(argu);
  };

  const breadcrumbArr = [
    { label: "Home", link: "app/dashboard" },
    { label: "Admin Panel", link: "app/adminpanel" },
    { label: "YGG Config", link: "" },
  ];

  const userDataTableHeaders = [
    { header: "Country", accessorKey: "name" },
    { header: "Country Code", accessorKey: "code" },
    { header: "Currency & Code", accessorKey: "currency_and_code" },
    { header: "Branch Name", accessorKey: "branch_name" },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "YGG Config",
      })
    );
  }, [breadcrumbArr, dispatch]);

  const fetchAllBrachData = (search, limit, offset, arg = {}) => {
    const obj = {
      url: URL_CONFIG.GET_ALL_BRANCH,
      method: "get",
      params: {
        offset: state?.offset,
        limit: state?.limit,
        ...(state?.search && { search: state.search }),
      },
    };

    if (arg?.filterValue?.value) {
      obj.params.active = arg.filterValue.value;
    }

    httpHandler(obj).then((response) => {
      setState((prev) => ({
        ...prev,
        data: response?.data,
      }));
      const formattedOptions = response?.data?.data
        ?.filter((branch) => branch.active)
        .map(({ id, name, country }) => ({
          country: country,
          value: id,
          label: name,
        }));
      setBranchOptions(formattedOptions);
    });
  };

  const fetchAllMappedCountriesList = () => {
    setIsLoading(true);
    const obj = {
      url: URL_CONFIG.YGG_GET_COUNTRIES_LIST,
      method: "get",
    };
    httpHandler(obj).then((response) => {
      const rawData = response?.data?.data;
      const formatted = rawData.map((item) => {
        const branchNames = item.ygg_branches
          .map((branch) => branch.branch_name)
          .join(", ");
        return {
          ...item,
          currency_and_code: `${item.currencyName} - ${item.currencyCode}`,
          branch_name: branchNames,
        };
      });
      setYGGMappedCountrylist(formatted);
      setIsLoading(false);
    });
  };

  const fetchYGGCountryData = () => {
    const obj = {
      url: URL_CONFIG.YGG_GET_COUNTRY,
      method: "get",
    };
    httpHandler(obj).then((response) => {
      console.log(response);
      setYGGCountryOptions(response?.data?.data?.countries);
    });
  };

  useEffect(() => {
    fetchAllBrachData();
    fetchYGGCountryData();
    fetchAllMappedCountriesList();
    setConfirmModalState(false);
    pageLoaderHandler(isLoading ? "show" : "hide");
  }, []);

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (let i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const handleExportDownload = () => {
    const xlData = state?.data?.data?.map((v) => ({
      Id: v?.id,
      Name: v?.name,
      Active: v?.active,
      Description: v?.description,
      Country: v?.country?.countryName,
    }));

    downloadXlsx("BranchMasters.xlsx", xlData);
  };

  const disableExistModal = () => {
    setConfirmModalState(false);
    setShowModal({ type: null, message: null });
  };

  return (
    <React.Fragment>
      {/* Modal */}
      {showModal.type && showModal.message && (
        <EEPSubmitModal
          data={showModal}
          className="modal-addmessage"
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
        />
      )}

      {/* Create Modal */}
      {isOpen && (
        <CreateYGGCountryModal
          setisOpen={setisOpen}
          showModal={showModal}
          setShowModal={setShowModal}
          branchData={branchOptions}
          yggCountryOptions={yggCountryOptions}
          editData={editData}
          fetchDeptData={fetchAllBrachData}
          fetchYGGMappedCountriesFunction={fetchAllMappedCountriesList}
        />
      )}

      {/* Delete Confirm Modal */}
      {confirmModalState && (
        <ConfirmStateModal
          hideModal={hideModal}
          confirmState={confirmState}
          confirmTitle={"Are you sure?"}
          confirmMessage={
            "Do you really want to delete this mapped country? Make ensure the brands also to be deleted."
          }
        />
      )}

      <PageHeader
        title="Country Mapping"
        navLinksRight={
          <a
            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg c1"
            data-toggle="modal"
            data-target="#CreateYGGCountryModal"
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.plus,
            }}
            onClick={() => {
              setEditData(null);
              setisOpen(true);
            }}
          />
        }
      />
      {isLoading ? (
        <Isloading />
      ) : (
        <>
          {yggMappedCountrylist.length > 0 && (
            <div
              className="eep-user-management eep-content-start"
              id="content-start"
            >
              <div
                className="table-responsive eep_datatable_table_div"
                style={{ visibility: "visible" }}
              >
                {!isLoading && (
                  <div
                    id="user_dataTable_wrapper"
                    className="dataTables_wrapper dt-bootstrap4 no-footer"
                    style={{ width: "100%" }}
                  >
                    <button
                      className="btn btn-secondary"
                      aria-controls="user_dataTable"
                      type="button"
                      style={{
                        position: "absolute",
                        zIndex: 9,
                        right: "18px",
                        margin: "8px 0px",
                      }}
                      onClick={handleExportDownload}
                    >
                      <span>Excel</span>
                    </button>

                    <TableComponent
                      data={yggMappedCountrylist ?? []}
                      columns={userDataTableHeaders}
                      action={
                        <CountryMappingActions
                          setisOpen={setisOpen}
                          isDelete={isDelete}
                          getCountryData={getCountryData}
                        />
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {yggMappedCountrylist.length === 0 && (
            <div className="row eep-content-section-data no-gutters">
              <ResponseInfo
                title="No country mapped!."
                responseImg="noRecord"
                responseClass="response-info"
              />
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default CountryMapping;

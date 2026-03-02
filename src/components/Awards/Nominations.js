import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NomineesInfo from "../../UI/CustomComponents/NomineesInfo";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import NominatedAwards from "./NominatedAwards";
import TableComponent from "../../UI/tableComponent";
import { pageLoaderHandler } from "../../helpers";
import Isloading from "../../UI/CustomComponents/Isloading";

const Nominations = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [nominatedList, setNominatedList] = useState([]);
  const [awardList, setAwardList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let userPicIndex;
  const getUserPicture = (picDataArr, uID) => {
    userPicIndex = picDataArr.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? picDataArr[userPicIndex].pic
      : process.env.PUBLIC_URL + "/images/user_profile.png";
  };

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get",
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.user_id,
              pic: item?.imageByte?.image,
            });
          }
        });
        fetchNomineeData(userPicTempArry);
      })
      .catch((error) => {});
  };

  const fetchNomineeData = (picDatas) => {
    setIsLoading(true);

    const obj = {
      url: URL_CONFIG.NOMINATIONS_LIST,
      method: "get",
    };
    httpHandler(obj)
      .then((nominatedLists) => {
        let usersInfo = [];
        let awardsInfo = [];
        nominatedLists?.data &&
          nominatedLists?.data.length &&
          nominatedLists?.data.map((lists) => {
            lists?.nominated &&
              lists?.nominations?.length &&
              lists?.nominations.map((users) => {
                users.userId.pic = getUserPicture(picDatas, users.userId.id);
                return usersInfo.push({
                  userData: users,
                  listData: lists,
                  name: users?.userId?.fullName,
                });
              });
            return awardsInfo?.push(lists);
          });
        setAwardList(awardsInfo);
        setNominatedList(usersInfo);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("fetchNomineeData error", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAllUsers();
    pageLoaderHandler(isLoading ? "show" : "hide");
  }, []);

  const nominatedTableHeaders = [
    {
      header: "Nominees",
      accessorKey: "action",
      accessorFn: (row) => row.userData?.userId?.fullName || "",
      Cell: ({ row, table }) => (
        <NomineesInfo
          data={row.original}
          globalFilter={table.getState().globalFilter}
        />
      ),
      size: 250,
    },
    {
      header: "Team",
      accessorKey: "listData.nominatorId.department.name",
    },
    {
      header: "Award",
      accessorKey: "listData.award.name",
    },
    // {
    //   header: 'Won',
    //   accessorKey: 'listData.award.points',
    // },
  ];

  const filterTable = (aLists) => {
    if (aLists.isData) {
      let usersInfo = [];
      aLists.aValues.nominated &&
        aLists.aValues.nominations.length &&
        aLists.aValues.nominations.map((users) => {
          return usersInfo.push({ userData: users, listData: aLists.aValues });
        });
      setNominatedList(usersInfo);
    }
    if (!aLists.isData) {
      fetchAllUsers();
    }
  };
  return (
    <React.Fragment>
      <PageHeader title="Nominated Awards" />
      {isLoading ? (
        <Isloading />
      ) : (
        <div
          className="row eep-award-approval eep-content-start"
          id="content-start"
        >
          <div className="col-md-7 col-lg-7 col-xl-8 col-sm-12 nm_lcol_div">
            <div
              className="table-responsive eep_datatable_table_div p-2 mt-3"
              style={{ visibility: "visible", overflowX: "hidden" }}
            >
              <div
                id="awardApprovalDatatable_wrapper"
                className="dataTables_wrapper dt-bootstrap4 no-footer"
              >
                {/* {nominatedList && ( */}
                {!isLoading && (
                  <TableComponent
                    data={nominatedList ?? []}
                    columns={nominatedTableHeaders}
                    actionHidden={true}
                  />
                )}
                {/* )} */}
              </div>
            </div>
          </div>
          <div className="col-md-5 col-lg-5 col-xl-4 col-sm-12 nm_rcol_div">
            {awardList && awardList.length > 0 && (
              <NominatedAwards
                awardList={awardList}
                filterTable={filterTable}
              />
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Nominations;

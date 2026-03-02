import React, { useEffect, useState } from "react";
import PageHeader from "../../UI/PageHeader";
import SyncPanel from "./SyncPanel";
import { useDispatch, useSelector } from "react-redux";
import { getCountryMappingList } from "../../store/yggRedeemThunk";
import ResponseInfo from "../../UI/ResponseInfo";
import Isloading from "../../UI/CustomComponents/Isloading";

const YGGSync = ({ YGGSync }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const yggBrands =
    useSelector((state) => state?.ygg?.getCountryMappingList?.data?.data) || [];

  const yggBrandState =
    useSelector((state) => state?.ygg?.getCountryMappingList) || [];

  useEffect(() => {
    dispatch(
      getCountryMappingList({
        currencyCode: "INR",
      })
    );
  }, [YGGSync]);

  return (
    <React.Fragment>
      <PageHeader title="Sync Brand"></PageHeader>
      {yggBrandState?.loading ? (
        <Isloading />
      ) : (
        <>
          {yggBrands?.length === 0 ? (
            <div className="row eep-content-section-data no-gutters">
              <ResponseInfo
                title="No record found!."
                responseImg="noRecord"
                responseClass="response-info"
              />
            </div>
          ) : (
            <div className="d-flex flex-wrap">
              {yggBrands?.map((item) => (
                <>
                  <SyncPanel datas={item} />
                </>
              ))}
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default YGGSync;

import React, { useEffect, useState } from 'react';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
// import CreateBadge from "../Badges/CreateBadge";

const Badges = () => {
  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Library',
      link: 'app/library',
    },
    {
      label: 'Badges',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Library',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const [badgeLibData, setBadgeLibData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  // const [createBadgeLibData, setCreateBadgeLibData] = useState([]);

  const fetchBadgeLibraryData = () => {
    const obj = {
      url: URL_CONFIG.LIBRARY_BADGES,
      method: 'get',
    };
    httpHandler(obj)
      .then((bData) => {
        setBadgeLibData(bData.data);
        setRefreshData(true);
      })
      .catch((error) => {
        setRefreshData(false);
        const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    // if(refreshData) {
    //   fetchBadgeLibraryData();
    // }
    fetchBadgeLibraryData();
  }, []);

  return (
    <React.Fragment>
      {/* <CreateBadge CreateBadgeData={createBadgeLibData} /> */}
      <div
        className="eep-content-start"
        id="content-start"
      >
        <div className="eep-content-section p-4 bg-ebeaea brtl-15 brtr-15 eep_scroll_y">
          <div className="row lib_row_div ">
            {badgeLibData.length > 0 &&
              badgeLibData.map((libValue, key) => {
                return (
                  <div
                    className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-center lib_col_div"
                    key={'badgeLib_' + key}
                  >
                    <Link
                      className="lib_link_a a_hover_txt_deco_none awardContent"
                      value="All Star.svg"
                      to={{
                        pathname: '/app/CreateBadge',
                      }}
                      state={{
                        libData: libValue,
                      }}
                      // onClick={() => createLibraryBadge(libValue.imageByte)}
                    >
                      <div className="lib_assign_div award_badge_gradient_bg">
                        <div className="award_badge_gradient_br">
                          <div className="lib_assign_div">
                            <div className="outter">
                              <img
                                src={libValue?.imageByte?.image}
                                className="lib_img"
                                alt={libValue.imageByte.name}
                                title={libValue.name}
                              />
                              <p className="lib_name font-helvetica-m c-888585">
                                {libValue.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Badges;

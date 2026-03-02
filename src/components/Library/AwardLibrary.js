import React, { useEffect, useState } from 'react';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';

const Awards = () => {
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
      label: 'Awards',
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

  const [awardLibData, setAwardLibData] = useState([]);

  const fetchAwardLibraryData = () => {
    const obj = {
      url: URL_CONFIG.LIBRARY_AWARDS,
      method: 'get',
    };
    httpHandler(obj)
      .then((aData) => {
        setAwardLibData(aData.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchAwardLibraryData();
  }, []);

  return (
    <React.Fragment>
      <div className="eep-content-start">
        <div className="eep-content-section p-4 bg-ebeaea brtl-15 brtr-15 eep_scroll_y">
          <div className="row lib_row_div ">
            {awardLibData.map((awardValue, key) => {
              return (
                <div
                  className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-center lib_col_div"
                  key={'AwardLib_' + key}
                >
                  <Link
                    to={{
                      pathname: '/app/createaward',
                    }}
                    state={{ libData: awardValue }}
                    className="lib_link_a a_hover_txt_deco_none awardContent"
                    value="All Star.svg"
                    // onClick={onClickHandler}
                  >
                    <div className="lib_assign_div award_badge_gradient_bg">
                      <div className="award_badge_gradient_br">
                        <div className="lib_assign_div">
                          <div className="outter">
                            <img
                              src={awardValue.imageByte.image}
                              className="lib_img"
                              alt={awardValue.imageByte.name}
                              title={awardValue.name}
                            />
                            <p className="lib_name font-helvetica-m c-888585">
                              {awardValue.name}
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
export default Awards;

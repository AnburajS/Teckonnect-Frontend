import React, { useEffect } from 'react';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
const Recognition = () => {
  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Recognize',
      link: 'app/recognition',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Recognition',
      })
    );
  });
  return (
    <React.Fragment>
      <div className="adminPanel-div p-0 m-0">
        <div className="row no-gutters">
          <div className="col-md-12">
            <h4 className="title_h4 c-2c2c2c">Recognize</h4>
          </div>
        </div>
        <div className="eep-dropdown-divider"></div>
      </div>

      <div className="recognition_container">
        <Link to="/app/ecardIndex">
          <div className="recognition_items recognition_items1  bg_ecard">
            <div className="outter outter1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  '/images/icons/recognition/e-cards.svg'
                }
                className="image-circle-1"
                alt="E-Cards"
              />
            </div>
            <span className="color_fffffff mt-2">E-Cards</span>
          </div>
        </Link>
        <Link to="/app/certificates">
          <div className="recognition_items recognition_items1  bg_certificates">
            <div className="outter outter1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  '/images/icons/recognition/certificates.svg'
                }
                className="image-circle-1"
                alt="Certificates"
              />
            </div>
            <span className="color_fffffff mt-2">Certificates</span>
          </div>
        </Link>
        <Link to="/app/badges">
          <div className="recognition_items recognition_items1  bg_badges">
            <div className="outter outter1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  '/images/icons/recognition/badges.svg'
                }
                className="image-circle-1"
                alt="Badges"
              />
            </div>
            <span className="color_fffffff mt-2">Badges</span>
          </div>
        </Link>
        <Link to="/app/awards">
          <div className="recognition_items recognition_items1  bg_awards">
            <div className="outter outter1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  '/images/icons/recognition/awards.svg'
                }
                className="image-circle-1"
                alt="Awards"
              />
            </div>
            <span className="color_fffffff mt-2">Awards</span>
          </div>
        </Link>
      </div>
    </React.Fragment>
  );
};
export default Recognition;

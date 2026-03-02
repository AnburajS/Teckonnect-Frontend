import React, { useEffect } from 'react';
import { BreadCrumbActions } from '../store/breadcrumb-slice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
const Communication = () => {
  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Engage',
      link: 'app/communication',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Engage',
      })
    );
  });
  return (
    <React.Fragment>
      <div className="adminPanel-div p-0 m-0">
        <div className="row no-gutters">
          <div className="col-md-12">
            <h4 className="title_h4 c-2c2c2c">Engage</h4>
          </div>
        </div>
        <div className="eep-dropdown-divider"></div>
      </div>

      <div className="recognition_container">
        <Link to="/app/mysurvey">
          <div className="recognition_items recognition_items1  bg_survey">
            <div className="outter outter1">
              <img
                src={'/images/icons/communications/surveyNew.svg'}
                className="image-circle-1"
                alt="Survey"
              />
            </div>
            <span className="color_fffffff  mt-2">Survey</span>
          </div>
        </Link>
        <Link
          to={{ pathname: '/app/forum' }}
          state={{ activeTab: 'forumpot' }}
        >
          <div className="recognition_items recognition_items1  bg_froum">
            <div className="outter outter1">
              <img
                src={'/images/icons/communications/forumNew.svg'}
                className="image-circle-1"
                alt="Forums"
              />
            </div>
            <span className="color_fffffff  mt-2">Forums</span>
          </div>
        </Link>
        <Link to="/app/closedpolls">
          <div className="recognition_items recognition_items1  bg_poll">
            <div className="outter outter1">
              <img
                src={'/images/icons/communications/pollNew.svg'}
                className="image-circle-1"
                alt="Polls"
              />
            </div>
            <span className="color_fffffff  mt-2">Polls</span>
          </div>
        </Link>
        <Link
          to={{ pathname: '/app/ideabox' }}
          state={{ activeTab: 'ideas' }}
        >
          <div className="recognition_items recognition_items1  bg_idea">
            <div className="outter outter1">
              <img
                src={'/images/icons/communications/ideaboxNew.svg'}
                className="image-circle-1"
                alt="Idea Box"
              />
            </div>
            <span className="color_fffffff  mt-2">Innovation Hub</span>
          </div>
        </Link>
        <Link
          to={{ pathname: '/app/feedback' }}
          state={{ activeTab: 'feedback' }}
        >
          <div className="recognition_items recognition_items1  bg_feed">
            <div className="outter outter1">
              <img
                src={'/images/icons/communications/feedbackNew.svg'}
                className="image-circle-1"
                alt="FeedBack"
              />
            </div>
            <span className="color_fffffff  mt-2">Feedback</span>
          </div>
        </Link>
      </div>
    </React.Fragment>
  );
};
export default Communication;

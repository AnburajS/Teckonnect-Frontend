import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import PageHeader from '../../UI/PageHeader';
import ToggleSidebar from '../../layout/Sidebar/ToggleSidebar';
import Filter from '../../UI/Filter';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';

const Polls = () => {
  const dispatch = useDispatch();
  const [toggleClass, setToggleClass] = useState(true);
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Engage',
      link: 'app/engage',
    },
    {
      label: 'POLL',
      link: 'app/closedpolls',
    },
    {
      label: 'Poll result',
      link: '#',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Create Survey',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  const sideBarClass = (tooglestate) => {
    setToggleClass(tooglestate);
  };

  return (
    <React.Fragment>
      <PageHeader title="Poll Results" />
      <div className="eep-container-sidebar h-100 eep_scroll_y">
        <div className="container-sm eep-container-sm">
          <div
            className={`row eep-create-survey-div eep_with_sidebar ${
              toggleClass ? 'side_open' : ''
            } vertical-scroll-snap`}
          >
            <ToggleSidebar
              toggleSidebarType="polls"
              sideBarClass={sideBarClass}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Polls;

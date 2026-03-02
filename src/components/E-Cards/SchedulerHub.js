import React, { useEffect } from 'react';
import PageHeader from '../../UI/PageHeader';
import { useDispatch, useSelector } from 'react-redux';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import ScheduleList from './ScheduleList';

function SchedulerHub() {
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'RECOGNIZE',
      link: 'app/recognition',
    },
    {
      label: 'Schedule Hub',
      link: 'app/Ecards',
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Recognition',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  });

  return (
    <React.Fragment>
      {userRolePermission.ecardTemplates && (
        <>
          <PageHeader title={'My Scheduler'} />
          <div
            className="eep_scroll_y urm_drage urm_drag_drop isDragging gride_view  px-3"
            id="drage_container"
          >
            <ScheduleList />
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default SchedulerHub;

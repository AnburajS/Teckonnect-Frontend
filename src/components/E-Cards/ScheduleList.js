import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const ScheduleCard = ({ title, link }) => (
  <div className="d-flex justify-content-between align-items-center bg-light p-4 mb-3 rounded shadow-sm">
    <h5 className="mb-0">{title}</h5>
    <Link
      to={link}
      state={{ activeTab: 'SchedulerTab' }}
    >
      {' '}
      <button className="btn btn-success rounded-pill px-4">Schedule</button>
    </Link>
  </div>
);

const ScheduleList = () => {
  return (
    <div
      className="mt-3"
      //   style={{ maxWidth: '800px' }}
    >
      <ScheduleCard
        title="Birthday"
        link={'/app/birthdaytemplatesettings'}
      />
      <ScheduleCard
        title="Work Anniversary"
        link={'/app/workanniversarysettings'}
      />
    </div>
  );
};

export default ScheduleList;

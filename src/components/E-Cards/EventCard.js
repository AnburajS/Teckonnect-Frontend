import moment from 'moment/moment';
import React, { useState } from 'react';
import CardModel from './CardModel';
import { formatDates } from '../../constants/utills';

const EventCard = ({ date, time, type, status, response_data, usersPic }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="gride_containerr  d_rewards_dtls">
      <div
        className="card  p-2  "
        style={{ borderRadius: '12px' }}
      >
        <div style={{ marginBottom: '-20px' }}>
          <button
            type="button"
            className="close eep-error-close"
            style={{ fontSize: '25px' }}
            onClick={() => setIsModalOpen(true)}
          >
            <span aria-hidden="true">
              <img
                src={process.env.PUBLIC_URL + '/images/icons/Info.svg'}
                alt="Info"
                height={20}
                title="Info"
              />
            </span>
          </button>
        </div>
        <div className="d-flex align-items-center">
          <div className="eventcard-img">
            <img
              src={
                type === 'birthday'
                  ? process.env.PUBLIC_URL +
                    '/images/temp/birthday/BirthdayIcon.svg'
                  : process.env.PUBLIC_URL +
                    '/images/temp/anniversary/Weddingicon.svg'
              }
              alt="Birthday"
              width="50"
              height="50"
            />
            <h5 className="mt-2 fw-bold">
              {type === 'birthday' ? 'Birthday' : 'Work Milestone'}
            </h5>
          </div>
          <div className="w-100 ml-20">
            <div className="mt-3">
              <p className="text-muted mb-1">
                Scheduled Date - {formatDates(date)}
              </p>
              <p className="text-muted">
                Scheduled Time - {moment(time)?.format('hh:mm A')}{' '}
              </p>
            </div>
            <div className="d-flex align-items-center mt-2">
              <span className={`  py-1 w-100 ml-8 event-button `}>
                <img
                  src={process.env.PUBLIC_URL + '/images/Success.svg'}
                  width="25"
                  height="25"
                />
                <span>{status?.success}</span>
                <span className="vr"></span>
                <span>{status?.failure}</span>
                <img
                  src={process.env.PUBLIC_URL + '/images/Faliure.svg'}
                  width="25"
                  height="25"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <CardModel
        data={response_data}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          type === 'birthday' ? 'Birthday Insight' : 'Work Anniversary Info'
        }
        usersPic={usersPic}
      />
    </div>
  );
};

export default EventCard;

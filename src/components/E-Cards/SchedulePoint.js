import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import ToggleRadioButton from '../../modals/ToggleRadioButton ';

const SchedulePoint = (props) => {
  const { templateType, getSchedulePoints, getScheduleIsPoint } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [schedulePoint, setSchedulePoint] = useState();
  const [scheduleIsPoint, setScheduleIsPoint] = useState(true);
  useEffect(() => {
    setSchedulePoint(null);
  }, []);

  const scheduledPointChange = (data) => {
    setSchedulePoint(data);
    getSchedulePoints(data);
  };

  const fetchScheduleTime = () => {
    const obj = {
      url: URL_CONFIG.GET_SCHEDULETIME,
      method: 'get',
    };
    httpHandler(obj)
      .then((response) => {
        if (response.data) {
          const dt =
            templateType?.category === 'birthday'
              ? response.data.birthdayPoint
              : response.data.anniversaryPoint;

          getSchedulePoints(dt);
          setScheduleIsPoint(
            templateType?.category === 'birthday'
              ? response.data.birthdayIsPoint
              : response.data.anniversaryIsPoint
          );
          setSchedulePoint(Number(dt) ? dt : 0);
        } else {
          setSchedulePoint(null);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchScheduleTime();
  }, []);
  useEffect(() => {
    getScheduleIsPoint(scheduleIsPoint);
  }, [scheduleIsPoint]);

  return (
    <div className="row eep-templates-setting-time  ">
      <div className="px-0 mx-0 py-2 my-2 w-100">
        <h4 className="c-2c2c2c mb-0">Enable Point?</h4>
      </div>
      <div className="px-2 mx-1 w-100">
        <ToggleRadioButton
          setScheduleJob={setScheduleIsPoint}
          scheduleJob={scheduleIsPoint}
        />
      </div>

      <div className="templates_time_div templates_card_whole_div px-0">
        <div className="form-group pmd-textfield pmd-textfield-floating-label">
          <div
            role="wrapper"
            className={
              !scheduleIsPoint
                ? 'opacity-6  position-relative'
                : 'position-relative'
            }
          >
            <div className="input-group b-dbdbdb border_input">
              <input
                readOnly={!scheduleIsPoint}
                value={schedulePoint ? schedulePoint : 0}
                type="number"
                className={` form-control  input-field `}
                onChange={(e) => scheduledPointChange(e?.target?.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePoint;

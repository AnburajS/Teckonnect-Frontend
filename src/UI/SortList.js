import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Select from 'react-select';

const SortList = (props) => {
  const {
    isForum,
    readAllCommunicationsFromList,
    arrowSx = {},
    totalSx = {},
    styleSx = {},
    DateSort = false,
    feedFilter,
    onChangeValues,
    communicationPostLists,
    dateReceivedOrder,
    isFeed,
  } = props;

  const [isDateReceived, setIsDateReceived] = useState(false);
  const [check, setCheck] = useState(false);
  let checker = (arr) => arr.every((v) => v.ideaIsRead === true);

  const markAllAsRead = () => {
    var checkBox = document.getElementById('postCheckbox');
    if (checkBox.checked === true) {
      // if (!checker(communicationPostLists)) {
      readAllCommunicationsFromList(true);
      // setCheck(true)
      setTimeout(() => {
        checkBox.checked = false;
      }, 100);
      // }
    } else {
      // setCheck(false)
    }
  };

  const sortDateReceived = () => {
    setIsDateReceived((prevState) => !prevState);
    dateReceivedOrder(!isDateReceived);
  };

  const initOptions = [
    {
      label: 'All Feedback',
      value: 'allpost',
    },
    {
      label: 'My Feedback',
      value: 'mypost',
    },
  ];

  return (
    <div
      className="row sticky-top bg-white mb-3"
      style={{ height: '30px' }}
    >
      <div className="col-12 bg-white">
        <div className="filter bg-white">
          <div
            className={`arrow_div feedback_arrow_div`}
            style={{ width: isFeed ? '100%' : '70%', ...arrowSx }}
          >
            {isFeed ? (
              <div
                className="flex"
                style={{ padding: isFeed ? '0px' : '0px 20px', ...totalSx }}
              >
                <Select
                  styles={{ height: '20px', maxHeight: '20px' }}
                  options={initOptions}
                  placeholder="Select..."
                  classNamePrefix="eep_select_common eep_select_common_sort select"
                  className="border_none select-with-bg"
                  onChange={(event) => {
                    onChangeValues(event);
                    dateReceivedOrder(false);
                  }}
                  value={feedFilter}
                />
                {isDateReceived ? (
                  <span
                    className="c1 i_position"
                    style={styleSx}
                    onClick={sortDateReceived}
                  >
                    Earliest
                    <FontAwesomeIcon
                      icon={faAngleUp}
                      style={{ fontSize: '15px', margin: '-2px 4px' }}
                    />
                    {/* <i className="fa fa-angle-up arrow_postion" ></i> */}
                  </span>
                ) : (
                  <span
                    className="c1 i_position"
                    style={styleSx}
                    onClick={sortDateReceived}
                  >
                    Latest
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      style={{ fontSize: '15px', margin: '-2px 4px' }}
                    />
                    {/* <i className="fa fa-angle-down arrow_postion" style={{ fontSize: "15px", marginTop: 1.5 }}></i> */}
                  </span>
                )}
              </div>
            ) : (
              <span
                className="c1 i_position"
                onClick={sortDateReceived}
              >
                {/* {isForum ? (!isDateReceived ? "Latest" : "Earliest") : "Date Received"} */}
                {!isDateReceived ? 'Latest' : 'Earliest'}
                {
                  isDateReceived && (
                    <FontAwesomeIcon
                      icon={faAngleUp}
                      style={{ fontSize: '15px', margin: '-2px 4px' }}
                    />
                  )
                  // <i className="fa fa-angle-up arrow_postion" style={{ fontSize: "15px" }}></i>
                }
                {
                  !isDateReceived && (
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      style={{ fontSize: '15px', margin: '-2px 4px' }}
                    />
                  )
                  // <i className="fa fa-angle-down arrow_postion" style={{ fontSize: "15px" }}></i>
                }
              </span>
            )}
          </div>
          {!isFeed && (
            <div
              className="form-check pr-2"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <input
                type="checkbox"
                className="form-check-input"
                checked={check}
                id="postCheckbox"
                onChange={markAllAsRead}
                style={{ marginTop: '1px' }}
              />
              <label
                className="form-check-label"
                htmlFor="postCheckbox"
              >
                {' '}
                Mark as read{' '}
              </label>
            </div>
          )}
          {DateSort && (
            <div
              className="form-check pr-2"
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '138px',
              }}
            >
              <input
                type="checkbox"
                className="form-check-input"
                checked={check}
                id="postCheckbox"
                onChange={markAllAsRead}
                style={{ marginTop: '1px' }}
              />
              <label
                className="form-check-label"
                htmlFor="postCheckbox"
              >
                {' '}
                Mark as read{' '}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortList;

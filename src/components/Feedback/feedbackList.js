import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SortList from '../../UI/SortList';
import { timeAgo } from '../../shared/SharedService';
import ResponseInfo from '../../UI/ResponseInfo';
import { emojiOptions } from '../../constants/utills';

const FeedbackList = (props) => {
  const {
    feedbackListsData,
    search,
    deleteFeedback,
    usersPic,
    mypost,
    onChangeSearch,
    feedFilter,
    onChangeValues,
    viewIdeaData,
    readIdeaData,
    markImportant,
    readAllIdeas,
    dateReceived,
  } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [ideaLists, setIdeaLists] = useState(
    feedbackListsData ? feedbackListsData : []
  );

  useEffect(() => {
    setIdeaLists(feedbackListsData);
  }, [feedbackListsData]);

  const viewIdea = (arg) => {
    viewIdeaData(arg);
  };

  const readIdea = (arg) => {
    readIdeaData(arg, false, true);
  };

  const unReadIdea = (arg) => {
    readIdeaData(arg, false, false);
  };

  const markImportantIdea = (arg) => {
    markImportant(arg, true);
  };

  const markUnimportantIdea = (arg) => {
    markImportant(arg, false);
  };

  const readAllCommunicationsFromList = (arg) => {
    readAllIdeas(arg);
  };

  const dateReceivedOrder = (isSortState) => {
    dateReceived(isSortState);
  };

  let checker = (arr) => arr.every((v) => v.ideaIsRead === true);
  const markAllAsRead = () => {
    var checkBox = document.getElementById('postCheckbox');
    if (checkBox.checked === true) {
      if (!checker(feedbackListsData)) {
        readAllCommunicationsFromList(true);
        setTimeout(() => {
          checkBox.checked = false;
        }, 100);
      }
    }
  };

  return (
    <div>
      <SortList
        arrowSx={{}}
        readAllCommunicationsFromList={readAllCommunicationsFromList}
        communicationPostLists={feedbackListsData}
        dateReceivedOrder={dateReceivedOrder}
        isFeed={true}
        onChangeValues={onChangeValues}
        feedFilter={feedFilter}
        DateSort
      />
      <div className="searchfeed">
        <div className="fixed-filter-feedback mb-3">
          <div
            className="feedback-search-value"
            style={{ padding: 0 }}
          >
            <input
              className="communication-title border_none eep_scroll_y w-100 feed-title"
              name="search"
              id="search"
              rows="2"
              placeholder="Search..."
              value={search}
              onChange={(event) => onChangeSearch(event.target.value)}
            />
          </div>
        </div>
      </div>
      {ideaLists?.length > 0 ? (
        <div
          className="feedback-listview"
          style={{ padding: 0 }}
        >
          {/* <div className="form-check"
              style={{ 
                padding: "10px 0px", display: "flex", justifyContent: "end"
              }}
            >
              <div style={{ display: "flex" }}>
                <label className="form-check-label" htmlFor="postCheckbox"> Mark all as read </label>&nbsp;
                <input type="checkbox"
                  className="form-check-input" id="postCheckbox"
                  onChange={markAllAsRead} />
              </div>
            </div> */}
          {/* <div className="fixed-filter-feedback mb-3">
          <div className="feedback-search-value" style={{ padding: 0 }}>
            <input
              className="communication-title border_none eep_scroll_y w-100 feed-title"
              name="search"
              id="search"
              rows="2"
              placeholder="Search..."
              value={search}
              onChange={(event) => onChangeSearch(event.target.value)}
            />
          </div>
        </div> */}
          {/* <div className="underline"></div> */}

          <div className="ideashorting_div">
            {ideaLists &&
              ideaLists?.map((item, index) => {
                return (
                  <div
                    className={`ideabox-profile-container  ideashorting_div_child align-items-start ${
                      item?.feedBackIsRead ? 'ideaMarkedAsRead' : ''
                    } ${
                      item.feedBackIsActive ? 'idebox-active-navigation' : ''
                    }`}
                    key={'ideabox_' + index}
                  >
                    <div
                      className="ideabox-profile-image c1"
                      onClick={() => viewIdea(item)}
                    >
                      <div
                        className=" rounded-circle"
                        style={{ fontSize: 33 }}
                      >
                        <img src={emojiOptions[item?.logo]?.iconActive} />
                      </div>
                    </div>
                    <div className="ideabox-font-style idea_box_heading ">
                      <div className="ideabox_username_fav_div">
                        <div
                          className="ideabox_descriptions_div c1 "
                          onClick={() => viewIdea(item)}
                        >
                          <h5 className="ideabox-font-style ideabox_user_name_size">
                            {item?.show_as}
                          </h5>
                          <p
                            className="ideabox-font-style ideabox-message-content-heading ideabox_truncate ideabox_contentt_size"
                            style={{ fontWeight: '500' }}
                          >
                            {item?.title}
                          </p>
                        </div>
                        <div className="funtional_parts-f">
                          <div
                            className="funtional_parts"
                            id="funtional_parts"
                          >
                            <div className="ideabox-star-position">
                              {item?.feedBackIsImportant && (
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/icons/static/StarFavourite.svg`}
                                  className="ideabox-star-img-size c1"
                                  alt="Favorite"
                                  onClick={() => markUnimportantIdea(item)}
                                />
                              )}
                            </div>
                            <div className="three_dot px-1">
                              <div className="dropdown c-c1c1c1 c1 eep_custom_dropdown">
                                <span
                                  className="eep_kebab_btn"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                  dangerouslySetInnerHTML={{
                                    __html: svgIcons && svgIcons.eep_kebab,
                                  }}
                                ></span>
                                <div
                                  className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg"
                                  x-placement="bottom-start"
                                >
                                  {!item.feedBackIsRead && (
                                    <label
                                      className="eep-options-item dropdown-item mb-0 c1"
                                      onClick={() => readIdea(item)}
                                    >
                                      Mark as Read
                                    </label>
                                  )}
                                  {item.feedBackIsRead && (
                                    <label
                                      className="eep-options-item dropdown-item mb-0 c1"
                                      onClick={() => unReadIdea(item)}
                                    >
                                      Mark as Unread
                                    </label>
                                  )}
                                  {!item.feedBackIsImportant && (
                                    <label
                                      className="eep-options-item dropdown-item mb-0 c1"
                                      onClick={() => markImportantIdea(item)}
                                    >
                                      Mark as Important
                                    </label>
                                  )}
                                  {item.feedBackIsImportant && (
                                    <label
                                      className="eep-options-item dropdown-item mb-0 c1"
                                      onClick={() => markUnimportantIdea(item)}
                                    >
                                      Mark as Unimportant
                                    </label>
                                  )}
                                  {item?.owner && (
                                    <label
                                      className="eep-options-item dropdown-item mb-0 c1"
                                      onClick={() => deleteFeedback(item)}
                                    >
                                      Delete
                                    </label>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* } */}
                          </div>
                        </div>
                      </div>
                      <div className="ideabox-font-style ideabox-date  clicked_content">
                        {timeAgo(item?.createdAt, true)}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="nodata">
          {' '}
          {mypost ? (
            <div className="nofound">
              <p className="eep_blank_quote">
                {' '}
                You haven't written any post's.
              </p>
              <p className="eep_blank_quote_by text-center">
                - <em> Start creating one!</em>-{' '}
              </p>
            </div>
          ) : (
            <div className="nofound">
              <p className="eep_blank_quote"> No Feed-backs found! </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;

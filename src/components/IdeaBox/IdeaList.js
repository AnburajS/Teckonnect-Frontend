import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SortList from '../../UI/SortList';
import { eepFormatDateTime } from '../../shared/SharedService';
import { useInView } from 'react-intersection-observer';

const IdeaList = (props) => {
  const {
    ideaListsData,
    usersPic,
    fetchIdeas,
    stopFetchIdea,
    viewIdeaData,
    readIdeaData,
    markImportant,
    readAllIdeas,
    dateReceived,
  } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [ideaLists, setIdeaLists] = useState(
    ideaListsData ? ideaListsData : []
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    setIdeaLists(ideaListsData);
  }, [ideaListsData]);
  useEffect(() => {
    if (inView && !stopFetchIdea) {
      fetchIdeas();
    }
  }, [inView, stopFetchIdea]);

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

  let userPicIndex;
  const getUserPicture = (uID) => {
    console.log(usersPic, uID);
    userPicIndex = usersPic.findIndex((x) => x.username === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };

  const readAllCommunicationsFromList = (arg) => {
    readAllIdeas(arg);
  };

  const dateReceivedOrder = (isSortState) => {
    dateReceived(isSortState);
  };

  return (
    <React.Fragment>
      <SortList
        readAllCommunicationsFromList={readAllCommunicationsFromList}
        communicationPostLists={ideaListsData}
        dateReceivedOrder={dateReceivedOrder}
      />

      <div className="ideashorting_div">
        {ideaLists &&
          ideaLists.map((item, index) => {
            return (
              <>
                <div
                  className={`ideabox-profile-container ideashorting_div_child ${
                    item.ideaIsRead ? 'ideaMarkedAsRead' : ''
                  } ${item.ideaIsActive ? 'idebox-active-navigation' : ''}`}
                  key={'ideabox_' + index}
                >
                  <div
                    className="ideabox-profile-image c1"
                    onClick={() => viewIdea(item)}
                  >
                    {console.log('item', item)}
                    <img
                      src={getUserPicture(item?.createdBy?.username)}
                      alt="profile"
                      className="ideabox-profile-img-size rounded-circle"
                    />
                  </div>
                  <div className="ideabox-font-style idea_box_heading ">
                    <div className="ideabox_username_fav_div">
                      <div
                        className="ideabox_descriptions_div c1"
                        onClick={() => viewIdea(item)}
                      >
                        <h5 className="ideabox-font-style ideabox_user_name_size">
                          {item.createdBy?.firstname +
                            ' ' +
                            item.createdBy?.lastname}
                        </h5>
                        <p
                          className="ideabox-font-style ideabox-message-content-heading ideabox_truncate ideabox_contentt_size"
                          style={{ fontWeight: '500' }}
                        >
                          {item.title}
                        </p>
                      </div>
                      <div
                        className="funtional_parts"
                        id="funtional_parts"
                      >
                        <div className="ideabox-star-position ">
                          {!item.ideaIsImportant && (
                            <img
                              src={`${process.env.PUBLIC_URL}/images/icons/static/StarDefault.svg`}
                              className="ideabox-star-img-size c1"
                              alt="Un Favorite"
                              onClick={() => markImportantIdea(item)}
                            />
                          )}
                          {item.ideaIsImportant && (
                            <img
                              src={`${process.env.PUBLIC_URL}/images/icons/static/StarFavourite.svg`}
                              className="ideabox-star-img-size c1"
                              alt="Favorite"
                              onClick={() => markUnimportantIdea(item)}
                            />
                          )}
                        </div>
                        {!item.ideaIsActive && (
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
                                {!item.ideaIsRead && (
                                  <label
                                    className="eep-options-item dropdown-item mb-0 c1"
                                    onClick={() => readIdea(item)}
                                  >
                                    Mark as Read
                                  </label>
                                )}
                                {item.ideaIsRead && (
                                  <label
                                    className="eep-options-item dropdown-item mb-0 c1"
                                    onClick={() => unReadIdea(item)}
                                  >
                                    Mark as Unread
                                  </label>
                                )}
                                {!item.ideaIsImportant && (
                                  <label
                                    className="eep-options-item dropdown-item mb-0 c1"
                                    onClick={() => markImportantIdea(item)}
                                  >
                                    Mark as Important
                                  </label>
                                )}
                                {item.ideaIsImportant && (
                                  <label
                                    className="eep-options-item dropdown-item mb-0 c1"
                                    onClick={() => markUnimportantIdea(item)}
                                  >
                                    Mark as Unimportant
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ideabox-font-style ideabox-date clicked_content">
                      {eepFormatDateTime(item.createdAt)}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        <div
          style={{ position: 'relative', bottom: '20px' }}
          ref={ref}
        ></div>
      </div>
    </React.Fragment>
  );
};

export default IdeaList;

import React from 'react';
import { useDispatch } from 'react-redux';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import { sharedDataActions } from '../../store/shared-data-slice';

const TourState = () => {
  const dispatch = useDispatch();

  const tourDataDefault = {
    myDashboard: false,
    rewardsAndRecognition: false,
    hallOfFame: false,
    ecards: false,
    ecardInbox: false,
    ecardTemplate: false,
    badges: false,
    createBadge: false,
    myBadges: false,
    awards: false,
    createAward: false,
    myAwards: false,
    awardNominatorView: false,
    awardNomination: false,
    awardMyNominations: false,
    awardApproval: false,
    awardManage: false,
    certificate: false,
    myCertificate: false,
    libraryBadges: false,
    libraryAwards: false,
    libraryCertificates: false,
    socialWall: false,
    ideaBox: false,
    createIdeaBox: false,
    myIdeas: false,
    forum: false,
    createforum: false,
    myForums: false,
    createPoll: false,
    activePolls: false,
    pollResults: false,
    closedPolls: false,
    createSurvey: false,
    mySurveys: false,
    surveyResults: false,
    surveyQuestionBank: false,
    rewardPoints: false,
    portalSettings: false,
    departmentMasters: false,
    userManagement: false,
    roleManagement: false,
    hashTag: false,
  };

  const fetchTourState = () => {
    const userData = sessionStorage.userData
      ? JSON.parse(sessionStorage.userData)
      : {};
    const obj = {
      url: URL_CONFIG.TOUR,
      method: 'get',
      params: { id: userData.id },
    };
    httpHandler(obj)
      .then((response) => {
        if (response.data) {
          dispatch(
            sharedDataActions.getTourState({
              tourState: response?.data,
            })
          );
        }
        if (!response.data) {
          dispatch(
            sharedDataActions.getTourState({
              tourState: tourDataDefault,
            })
          );
        }
      })
      .catch((error) => {});
  };

  return <React.Fragment></React.Fragment>;
};
export default TourState;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Outlet } from 'react-router-dom';
import IdleTimerContainer from '../../IdleTimer/IdleTimerContainer';
import Tab from '../../UI/Tab';
import BulkUploadOrgChart from '../../bulkUpload';
import AdminPanel from '../../components/AdminPanel';
import AwardNominations from '../../components/Awards/AwardNominations';
import Awards from '../../components/Awards/Awards';
import CreateAward from '../../components/Awards/CreateAward';
import ManageNominateAwardView from '../../components/Awards/ManageNominateAwardView';
import ManageSpotAwardView from '../../components/Awards/ManageSpotAwardView';
import NominationsApproval from '../../components/Awards/NominationsApproval';
import Badges from '../../components/Badges/Badges';
import CreateBadge from '../../components/Badges/CreateBadge';
import BranchMaster from '../../components/Branch';
import CertificateCompose from '../../components/Certificates/CertificateCompose';
import Certificates from '../../components/Certificates/Certificates';
import MyCertificate from '../../components/Certificates/MyCertificate';
import Communication from '../../components/Communication';
import AppreciationTemplateSettings from '../../components/E-Cards/AppreciationTemplateSettings';
import BirthdayTemplateSettings from '../../components/E-Cards/BirthdayTemplateSettings';
import ECardIndex from '../../components/E-Cards/ECardIndex';
import Inbox from '../../components/E-Cards/Inbox';
import InboxDetailView from '../../components/E-Cards/InboxDetailView';
import SeasonalTemplateSettings from '../../components/E-Cards/SeasonalTemplateSettings';
import WorkAnniversarySettings from '../../components/E-Cards/WorkAnniversarySettings';
import EEPApp from '../../components/EEPApp/EEPApp';
import Feedback from '../../components/Feedback';
import Forum from '../../components/Forum/Forum';
import ForumDetailView from '../../components/Forum/ForumDetailView';
import HashTag from '../../components/HashTag';
import Home from '../../components/Home/Home';
import UserDashboard from '../../components/Home/UserDashboard';
import IdeaBox from '../../components/IdeaBox/IdeaBox';
import Library from '../../components/Library/Library';
import ListDepartments from '../../components/ListDepartments';
import ModifyUser from '../../components/ModifyUser';
import MyProfile from '../../components/MyProfile';
import Notifications from '../../components/Notifications';
import ActivePolls from '../../components/Polls/ActivePolls';
import ClosedPolls from '../../components/Polls/ClosedPolls';
import CreatePoll from '../../components/Polls/CreatePoll';
import PollAnswer from '../../components/Polls/PollAnswer';
import PollResults from '../../components/Polls/PollResults';
import PortalSettings from '../../components/PortalSettings/PortalSettings';
import Recognition from '../../components/Recognition';
import RegisterUser from '../../components/RegisterUser';
import Rewards from '../../components/Rewards/Rewards';
import Search from '../../components/Search/Search';
import SocialWall from '../../components/SocialWall/SocialWall';
import CreateSurvey from '../../components/Survey/CreateSurvey';
import SurveyLibrarayAnswer from '../../components/Survey/LibrarySurveyAdd';
import MyLibrary from '../../components/Survey/MyLibrary';
import MySurvey from '../../components/Survey/MySurvey';
import SurveyAnswer from '../../components/Survey/SurveyAnswer';
import SurveyQuestions from '../../components/Survey/SurveyQuestions';
import Nps from '../../components/Survey/Nps';
import Pulse from '../../components/Survey/Pulse';
import Metric from '../../components/Survey/Metric';
import SurveyResponses from '../../components/Survey/SurveyResponses';
import SurveyResult from '../../components/Survey/SurveyResult';
import UserManagement from '../../components/UserManagement';
import ViewUser from '../../components/ViewUser';
import MyProfileCoupon from '../../components/myRedeemption';
import PointsConfig from '../../components/pointConfig';
import Wallet from '../../components/wallet';
import IdmRoleMapping from '../../idm/idm';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Header from '../Header/Header';
import Help from '../Header/Help';
import Sidebar from '../Sidebar/Sidebar';
import Notification from '../../components/Notification';
import PulseSurveyMetric from '../../components/Survey/PulseSurveyMetric';
import HelpCenter from '../Header/HelpCenter';

const MainContainer = (props) => {
  const getTabs = useSelector((state) => state?.tabs?.config);
  const getToggleSidebarState = useSelector(
    (state) => state?.toggleState?.isToggle
  );

  return (
    <main>
      <div id="wrapper">
        <IdleTimerContainer />
        <Sidebar theme={props.theme} />
        <div
          id="content-wrapper"
          className="d-flex flex-column"
        >
          <div
            id="content"
            className="content"
          >
            <Header />
            <br />
            <Breadcrumb isTrue={getTabs?.length > 0} />

            {getTabs?.length !== 0 && <Tab />}

            <div
              className={`container-fluid eep-container-fluid eep-has-title-content px-0 eep_scroll_y ${
                getTabs?.length ? 'eep-has-tab-menu' : ''
              }`}
            >
              <div
                className={`eep-container ${
                  getToggleSidebarState ? 'eep-container-with-sidebar' : ''
                }`}
              >
                <div className="container-sm eep-container-sm">
                  <div className="row no-gutters">
                    <div className="col-md-12 px-0">
                      <div className="eep-content-section-div">
                        <div className="eep-content-section eep_scroll_y">
                          <Outlet />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContainer;

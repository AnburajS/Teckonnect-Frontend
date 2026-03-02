import React, { useState } from 'react';
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
import Notification from '../../components/Notification';
import PulseSurveyMetric from '../../components/Survey/PulseSurveyMetric';
import { Route } from 'react-router-dom';
import HelpCenter from '../../components/HelpCenter/HelpCenter';
import CreateEmailTemplate from '../../components/EmailTemplate/CreateEmailTemplate';
import CreateEmailTemplateList from '../../components/EmailTemplate/CreateEmailTemplateList';
import ViewEmailTemplate from '../../components/EmailTemplate/ViewEmailTemplate';
import UpdateEmailTemplate from '../../components/EmailTemplate/UpdateEmailTemplate';
import TriggerEmail from '../../components/EmailTemplate/TriggerEmail';
import YggConfig from '../../components/YGG/YggConfig';

function AppRoutes() {
  const [initial, setInitial] = useState(true);
  return (
    <>
      <Route
        path="orgChart"
        element={<BulkUploadOrgChart />}
      />
      <Route
        path="idm"
        element={<IdmRoleMapping />}
      />
      <Route
        path="dashboard"
        element={
          <Home
            initial={initial}
            setInitial={setInitial}
          />
        }
      />
      <Route
        path="userdashboard"
        element={<UserDashboard />}
      />
      <Route
        path="usermanagement"
        element={<UserManagement />}
      />
      <Route
        path="newUser"
        element={<RegisterUser />}
      />
      <Route
        path="myprofile"
        element={<MyProfile />}
      />
      <Route
        path="listdepartments"
        element={<ListDepartments />}
      />
      <Route
        path="adminpanel"
        element={<AdminPanel />}
      />
      <Route
        path="branchMaster"
        element={<BranchMaster />}
      />
      <Route
        path="help"
        element={<HelpCenter />}
      />
      <Route
        path="users/view/:id"
        element={<ViewUser />}
      />
      <Route
        path="users/update/:id"
        element={<ModifyUser />}
      />
      <Route
        path="portalsettings"
        element={<PortalSettings />}
      />
      <Route
        path="hashtag"
        element={<HashTag />}
      />
      <Route
        path="recognition"
        element={<Recognition />}
      />
      <Route
        path="library"
        element={<Library />}
      />
      <Route
        path="createaward"
        element={<CreateAward />}
      />
      <Route
        path="badges"
        element={<Badges />}
      />
      <Route
        path="createbadge"
        element={<CreateBadge />}
      />
      <Route
        path="certificates"
        element={<Certificates />}
      />
      <Route
        path="mycertificates"
        element={<MyCertificate />}
      />
      <Route
        path="composecertificate"
        element={<CertificateCompose />}
      />
      <Route
        path="awards"
        element={<Awards />}
      />
      <Route
        path="awardnominations"
        element={<AwardNominations />}
      />
      <Route
        path="nominationsapproval"
        element={<NominationsApproval />}
      />
      <Route
        path="managespotawardview"
        element={<ManageSpotAwardView />}
      />
      <Route
        path="managenominateawardview"
        element={<ManageNominateAwardView />}
      />
      <Route
        path="ecardIndex"
        element={<ECardIndex />}
      />
      <Route
        path="birthdaytemplatesettings"
        element={<BirthdayTemplateSettings />}
      />
      <Route
        path="workanniversarysettings"
        element={<WorkAnniversarySettings />}
      />
      <Route
        path="appreciationtemplatesettings"
        element={<AppreciationTemplateSettings />}
      />
      <Route
        path="seasonaltemplatesettings"
        element={<SeasonalTemplateSettings />}
      />
      <Route
        path="inbox"
        element={<Inbox />}
      />
      <Route
        path="inboxdetailview"
        element={<InboxDetailView />}
      />
      <Route
        path="socialwall"
        element={<SocialWall />}
      />
      <Route
        path="engage"
        element={<Communication />}
      />
      <Route
        path="survey"
        element={<SurveyResult />}
      />
      <Route
        path="createsurvey"
        element={<CreateSurvey />}
      />
      <Route
        path="surveyanswer"
        element={<SurveyAnswer />}
      />
      <Route
        path="surveylibrary"
        element={<SurveyLibrarayAnswer />}
      />
      <Route
        path="mysurvey"
        element={<MySurvey />}
      />
      <Route
        path="librarysurvey"
        element={<MyLibrary />}
      />
      <Route
        path="surveyquestions"
        element={<SurveyQuestions />}
      />
      <Route
        path="nps"
        element={<Nps />}
      />
      <Route
        path="pulse"
        element={<Pulse />}
      />
      <Route
        path="metric"
        element={<Metric />}
      />
      <Route
        path="pulsemetric"
        element={<PulseSurveyMetric />}
      />
      <Route
        path="surveyresponses"
        element={<SurveyResponses />}
      />
      <Route
        path="ideabox"
        element={<IdeaBox />}
      />
      <Route
        path="feedback"
        element={<Feedback />}
      />
      <Route
        path="forum"
        element={<Forum />}
      />
      <Route
        path="forumdetailview"
        element={<ForumDetailView />}
      />
      <Route
        path="pollanswer"
        element={<PollAnswer />}
      />
      <Route
        path="createpoll"
        element={<CreatePoll />}
      />
      <Route
        path="closedpolls"
        element={<ClosedPolls />}
      />
      <Route
        path="polls"
        element={<PollResults />}
      />
      <Route
        path="activepolls"
        element={<ActivePolls />}
      />
      <Route
        path="notifications"
        element={<Notification />}
      />
      <Route
        path="notification"
        element={<Notifications />}
      />
      <Route
        path="points"
        element={<Rewards />}
      />
      <Route
        path="eepapp"
        element={<EEPApp />}
      />
      <Route
        path="search"
        element={<Search />}
      />
      <Route
        path="my-redeem"
        element={<MyProfileCoupon />}
      />
      <Route
        path="point-config"
        element={<PointsConfig />}
      />
      <Route
        path="ygg-config"
        element={<YggConfig />}
      />
      <Route
        path="wallet"
        element={<Wallet />}
      />{' '}
      <Route
        path="templatelist"
        element={<CreateEmailTemplateList />}
      />
      <Route
        path="composeemail"
        element={<CreateEmailTemplate />}
      />
      <Route
        path="viewtemplate"
        element={<ViewEmailTemplate />}
        UpdateEmailTemplate
      />
      <Route
        path="updatetemplate"
        element={<UpdateEmailTemplate />}
      />
      <Route
        path="trigger"
        element={<TriggerEmail />}
      />
    </>
  );
}

export default AppRoutes;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabsActions } from '../../store/tabs-slice';
import AwardLibrary from './AwardLibrary';
import BadgeLibrary from './BadgeLibrary';
import CertificateLibrary from './CertificateLibrary';
import ResponseInfo from '../../UI/ResponseInfo';
import Survey from './SurveyLibrary';
import { useLocation } from 'react-router-dom';

const Library = () => {
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const routerData = location.state || {
    activeTab: window.location.hash.substring(1)?.split('?')?.[0] || 'Awards',
  };
  // useEffect(() => {
  //   let tabConfig = [];
  //   if (userRolePermission.awardCreate) {
  //     tabConfig.push({ title: 'Awards', id: 'Awards' });
  //   }
  //   if (userRolePermission.badgeCreate) {
  //     tabConfig.push({ title: 'Badges', id: 'Badges' });
  //   }
  //   if (userRolePermission.certificateCreate) {
  //     tabConfig.push({ title: 'Certificates', id: 'Certificates' });
  //   }
  //   if (userRolePermission?.surveyCreate) {
  //     tabConfig.push({ title: 'Survey', id: 'Survey' });
  //   }
  //   if (routerData?.activeTab) {
  //     const activeTabId = routerData.activeTab;
  //     tabConfig.map((res) => {
  //       if (res.id === activeTabId) {
  //         return (res.active = true);
  //       }
  //     });
  //     dispatch(
  //       TabsActions.updateTabsconfig({
  //         config: tabConfig,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       TabsActions.updateTabsconfig({
  //         config: tabConfig,
  //       })
  //     );
  //   }

  //   return () => {
  //     dispatch(
  //       TabsActions.updateTabsconfig({
  //         config: [],
  //       })
  //     );
  //   };
  // }, [userRolePermission]);

  useEffect(() => {
    let tabConfig = [];
    if (userRolePermission.awardCreate) {
      tabConfig.push({ title: 'Awards', id: 'Awards' });
    }
    if (userRolePermission.badgeCreate) {
      tabConfig.push({ title: 'Badges', id: 'Badges' });
    }
    if (userRolePermission.certificateCreate) {
      tabConfig.push({ title: 'Certificates', id: 'Certificates' });
    }
    if (userRolePermission?.surveyCreate) {
      tabConfig.push({ title: 'Survey', id: 'Survey' });
    }

    dispatch(TabsActions.updateTabsconfig({ config: tabConfig }));

    const activeTabId = routerData?.activeTab;
    const matchedTab =
      tabConfig.find((tab) => tab.id === activeTabId) || tabConfig[0];

    if (matchedTab) {
      dispatch(TabsActions.tabOnChange({ tabInfo: matchedTab }));
    }

    return () => {
      dispatch(TabsActions.updateTabsconfig({ config: [] }));
    };
  }, [userRolePermission]);

  return (
    <React.Fragment>
      {(userRolePermission?.awardCreate ||
        userRolePermission?.badgeCreate ||
        userRolePermission?.certificateCreate ||
        userRolePermission?.surveyCreate) && (
        <div className="tab-content">
          <div
            id="Awards"
            className={
              activeTab?.id === 'Awards' ? 'tab-pane active' : 'tab-pane'
            }
          >
            {/* <AwardLibrary /> */}
            {activeTab && activeTab?.id === 'Awards' && <AwardLibrary />}
          </div>
          <div
            id="Badges"
            className={
              activeTab?.id === 'Badges' ? 'tab-pane active' : 'tab-pane'
            }
          >
            {activeTab && activeTab?.id === 'Badges' && <BadgeLibrary />}
          </div>
          <div
            id="Certificates"
            className={
              activeTab?.id === 'Certificates' ? 'tab-pane active' : 'tab-pane'
            }
          >
            {activeTab && activeTab?.id === 'Certificates' && (
              <CertificateLibrary />
            )}
          </div>
          <div
            id="Survey"
            className={
              activeTab?.id === 'Survey' ? 'tab-pane active' : 'tab-pane'
            }
          >
            {activeTab && activeTab?.id === 'Survey' && <Survey />}
          </div>
        </div>
      )}
      {!userRolePermission.awardCreate &&
        !userRolePermission.badgeCreate &&
        !userRolePermission.certificateCreate &&
        !userRolePermission?.surveyCreate && (
          <div className="row eep-content-section-data no-gutters">
            <ResponseInfo
              title="Oops! Looks illegal way."
              responseImg="accessDenied"
              responseClass="response-info"
              messageInfo="Contact Administrator."
            />
          </div>
        )}
    </React.Fragment>
  );
};
export default Library;

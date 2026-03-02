import React, { useEffect, useState } from 'react';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { TabsActions } from '../../store/tabs-slice';
import { useDispatch, useSelector } from 'react-redux';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import ResponseInfo from '../../UI/ResponseInfo';
import CountryMapping from './CountryMapping';
import YGGSync from './YGGSync';

const YggConfig = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const activeTab = useSelector((state) => state.tabs.activeTab);

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Admin Panel',
      link: 'app/adminpanel',
    },
    {
      label: 'YGG Config',
      link: '',
    },
  ];

  const tabConfig = [
    {
      title: 'Country Mapping',
      id: 'countryMappingTab',
    },
    {
      title: 'Sync Brand',
      id: 'syncBrandTab',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'YGG Config',
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: '',
      });
    };
  }, []);

  useEffect(() => {
    if (userRolePermission.adminPanel) {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
      return () => {
        dispatch(
          TabsActions.updateTabsconfig({
            config: [],
          })
        );
      };
    }
  }, []);

  return (
    <React.Fragment>
      {userRolePermission.adminPanel && (
        <div className="tab-content">
          <div id="countryMappingTab" className="tab-pane active">
            {activeTab && activeTab.id === 'countryMappingTab' && (
              <CountryMapping />
            )}
          </div>
          <div id="syncBrandTab" className="tab-pane ml-2">
            {activeTab && activeTab.id === 'syncBrandTab' && (
              <YGGSync isSync={activeTab.id === 'syncBrandTab'} />
            )}
          </div>
        </div>
      )}
      {!userRolePermission.adminPanel && (
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
export default YggConfig;

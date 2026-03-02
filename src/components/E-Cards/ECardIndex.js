import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import ECards from "./ECards";
import Template from "./Template";
import Inbox from "./Inbox";
import SchedulerHub from "./SchedulerHub";

const ECardIndex = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const getLocation = useLocation();
  const activeAccord = getLocation.state ? getLocation.state?.activeAccord : "";
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  //const history = useNavigate();
  // const routerData = location.state;
  const location = useLocation();
  const routerData = location.state || {
    activeTab: window.location.hash.substring(1)?.split("?")?.[0],
  };
  console.log("routerData", routerData);
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "RECOGNIZE",
      link: "app/recognition",
    },
    {
      label: "ECards",
      link: "app/ecardIndex",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "ECards",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const tabConfig = [
    {
      title: "Cards",
      id: "CardsTab",
    },
    {
      title: "My Cards",
      id: "InboxTab",
    },
  ];

  useEffect(() => {
    if (userRolePermission.ecardTemplates) {
      tabConfig.push({ title: "Template Library", id: "TemplatesTab" });
      tabConfig.push({ title: "Schedule Hub", id: "SchedulerTab" });
    }

    if (routerData) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          res.active = true;
        }
      });
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );

      // history.replace({ pathname: history.location.pathname, state: {} });
    } else {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
    }

    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
  }, [userRolePermission]);
  return (
    <React.Fragment>
      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100">
          <div id="CardsTab" className="tab-pane active h-100">
            {activeTab && activeTab.id === `CardsTab` && (
              <ECards
                isDashbaord={routerData?.active}
                isDashbaordData={routerData?.isDashbaordData}
              />
            )}
          </div>
          <div id="InboxTab" className="tab-pane h-100">
            {activeTab && activeTab.id === `InboxTab` && (
              <Inbox activeAccordTab={activeAccord} />
            )}
          </div>
          <div id="TemplatesTab" className="tab-pane h-100">
            {activeTab && activeTab.id === `TemplatesTab` && <Template />}
          </div>
          <div id="SchedulerTab" className="tab-pane h-100">
            {activeTab && activeTab.id === `SchedulerTab` && <SchedulerHub />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ECardIndex;

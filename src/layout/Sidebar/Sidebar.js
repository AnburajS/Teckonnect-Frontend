/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sideMenuHidden } from '../../helpers';
import Communication from './icon/communication';
import Dashboard from './icon/dashboard';
import DownArrow from './icon/downArrow';
import { TabsActions } from '../../store/tabs-slice';
import { useTranslation } from 'react-i18next';
import Library from './icon/library';
import Org from './icon/org';
import Recognition from './icon/recognition';
import Rewards from './icon/rewards';

// import UpArrow from "./icon/upArrrow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import i18n from 'i18next';
import SocialWall from './icon/socialWall';

const Sidebar = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [sidebarMenu, setSidebarMenu] = useState([]);
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [theme, setTheme] = useState(props?.theme);
  const [activeMenu, setActiveMenu] = useState(null);
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const { t } = useTranslation();
  const getBreadCrumb = useSelector((state) => state.breadcrumb.breadCrumbArr);
  const dir = i18n.dir(i18n.language);

  const fetchSidebarMenu = () => {
    fetch(`${process.env.PUBLIC_URL}/data/sidebarMenu.json`)
      .then((response) => response.json())
      .then(async (data) => {
        if (JSON.stringify(userRolePermission) !== '{}')
          setSidebarMenu(
            // data
            await sideMenuHidden(data, userRolePermission)
          );
      });
  };

  const sidebarToggleHanlder = () => {
    setSidebarToggled(!sidebarToggled);
  };

  React.useEffect(() => {
    setTheme({
      color: JSON.parse(sessionStorage.getItem('userData'))?.theme?.color,
    });
  }, [JSON.parse(sessionStorage.getItem('userData'))?.theme?.color]);

  useEffect(() => {
    fetchSidebarMenu();
  }, [userRolePermission]);

  const user_details = sessionStorage.getItem('userData');
  const theme_color =
    (theme?.color || theme || 'color_one') === 'color_two' ? '#000' : '#fff';
  const icon = {
    'socialwall.svg': <SocialWall color={theme_color} />,
    'Dashboard.svg': <Dashboard color={theme_color} />,
    'Recognition.svg': <Recognition color={theme_color} />,
    'Library.svg': <Library color={theme_color} />,
    'Communication.svg': <Communication color={theme_color} />,
    'Rewards.svg': <Rewards color={theme_color} />,
    'download.svg': <Org color={theme_color} />,
  };

  const activeTab = useSelector((state) => state?.tabs?.activeTab);

  const handleChangeMenu = (element, index) => {
    const checkCurrentElement = element?.tabs?.filter(
      (val) => val?.id === activeTab?.id
    );
    if (element?.subMenu?.tabs) {
      dispatch(
        TabsActions.tabOnChange({ tabInfo: element?.subMenu?.tabs?.[0] })
      );
      dispatch(
        TabsActions.updateTabsconfig({ config: element?.subMenu?.tabs?.[0] })
      );
    } else if (
      element?.tabs &&
      activeTab?.id !== element?.tabs?.[0]?.id &&
      !checkCurrentElement?.length > 0
    ) {
      dispatch(TabsActions.tabOnChange({ tabInfo: element?.tabs?.[0] }));
      dispatch(TabsActions.updateTabsconfig({ config: element?.tabs?.[0] }));
    }
    const newActiveMenu = index === activeMenu ? null : index;
    setActiveMenu(newActiveMenu);
  };

  const onSubMenu = (element, index) => {
    if (element?.tabs) {
      dispatch(
        TabsActions.updateTabsconfig({
          config: element?.tabs?.[0],
        })
      );
    } else {
      return element;
    }
  };

  // useEffect(() => {
  //   const activeIndex = sidebarMenu.findIndex(
  //     (menu) => `/app/`+ menu.link === window.location.pathname
  //   );
  //   if (activeIndex !== -1) {
  //     setActiveMenu(activeIndex);
  //   }
  // }, [window.location.pathname, sidebarMenu]);

  return (
    <React.Fragment>
      <ul
        className={`navbar-nav sidebar sidebar-dark accordion eep-navbar-div eep-navbar-newversion menu-bg-theme ${
          sidebarToggled ? 'eep-navbar-div-sm toggled' : ''
        }`}
        id="accordionSidebar"
        style={{ padding: '0px' }}
      >
        <li className="nav-item">
          <label
            className={`px-3 pt-3 pb-0 profile-greet text-white text-left`}
            style={{ marginBottom: '0px' }}
          >
            {t(`sidebar.Hello`)},
          </label>
          <div
            className={`px-3 pt-0 pb-2 text-white profile-nm text-wrap card-text`}
            style={{ textAlign: 'start' }}
          >
            <span className="u_full_name mb-2 mt-1">
              {(JSON.parse(user_details)?.firstName ?? '') +
                ' ' +
                (JSON.parse(user_details)?.lastName ?? '')}
            </span>

            <span className="u_initials mt-3 d-none">
              {(JSON.parse(user_details)?.firstName?.[0]?.toUpperCase() ?? '') +
                (JSON.parse(user_details)?.lastName?.[0]?.toUpperCase() ?? '')}
            </span>
          </div>
        </li>

        <hr className={`sidebar-divider my-2`} />

        <li className="nav-list">
          {sidebarMenu?.map((menu, index) => {
            if (menu && menu?.showMenu) {
              const currentPath = window.location.href;
              const menuLink = `/app/` + menu?.link;
              const isActive =
                currentPath.includes(menuLink) ||
                `/${getBreadCrumb?.[1]?.link}` === menuLink ||
                (getBreadCrumb?.lenght === 0 &&
                  `/${getBreadCrumb?.[0]?.link}` === menuLink);
              // currentPath.includes(menuLink)
              // ? true
              // : `/${getBreadCrumb?.[1]?.link}` === menuLink
              // ? true
              // : getBreadCrumb?.lenght === 0 &&
              //   `/${getBreadCrumb?.[0]?.link}` === menuLink
              // ? true
              // : index === activeMenu
              // ? true
              // : false
              return (
                <div
                  className="nav-item "
                  key={'list' + index}
                  style={{ padding: sidebarToggled ? '6px 0px' : '6px 12px' }}
                >
                  <Link
                    className={` nav-link collapsed ${
                      menu?.subMenu?.length > 0 ? 'borderSide' : 'borderNone'
                    } `}
                    style={{ display: 'flex', alignItems: 'center' }}
                    data-toggle={`collapse`}
                    data-target={`#collapseSection${index}`}
                    to={menu.isDirectLink ? menuLink : '#'}
                    onClick={() => handleChangeMenu(menu, index)}
                    aria-expanded={isActive}
                  >
                    <div dir={dir}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <span className="eep-menu-icon-sidebar">
                          {icon[menu.icon]}
                        </span>

                        <span className="profile-nm">
                          {' '}
                          {t(`sidebar.${menu.label}`)}
                        </span>
                      </div>
                    </div>
                    <div className="sideIconMenu">
                      {menu?.subMenu?.length > 0 && !sidebarToggled && (
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          color={theme_color}
                          className={` ${
                            activeMenu !== index
                              ? 'sidebaricondownup'
                              : 'sidebaricondownupTrnsform'
                          }`}
                        />
                      )}
                    </div>
                  </Link>

                  {/* <div
                    id={`collapseSection${index}`}
                    className={`collapse`}
                    data-parent="#accordionSidebar"
                  >
                    <div className="bg-white py-2 collapse-inner rounded">
                      {menu?.subMenu?.map((submenu, index) => {
                        if (submenu && submenu?.showMenu) {
                          return (
                            <Link
                              className={`collapse-item ${
                                `/app/` + submenu?.link ===
                                  window.location.pathname && 'active-menu'
                              }`}
                              key={'submenu' + index}
                              to={`/app/` + submenu.link}
                              onClick={() => onSubMenu(submenu, index)}
                            >
                              {t(`sidebar.${submenu.label}`)}
                            </Link>
                          );
                        }
                      })}
                    </div>
                  </div> */}
                </div>
              );
            }
          })}
        </li>

        <div className="text-center sidebarToggleDiv">
          <Link
            className="nav-link sidebarToggleLink collapsed"
            id="sidebarToggle"
            onClick={sidebarToggleHanlder}
            to="#"
          >
            <img
              alt="enlite logo"
              className="eep-logo-side-icon"
              src={`${process.env.PUBLIC_URL}/images/menu/Enlite.svg`}
            />
            <img
              alt="enlite logo"
              className="eep-logo-fav-side-icon d-none"
              src={`${process.env.PUBLIC_URL}/images/menu/Enlite-Fav-Icon.svg`}
            />
          </Link>
        </div>
      </ul>
    </React.Fragment>
  );
};
export default Sidebar;

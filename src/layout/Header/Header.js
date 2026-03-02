import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SvgComponent from '../../components/ViwerComponents';
import { TabsActions } from '../../store/tabs-slice';
import '../../styles/lib/eep-search.scss';
import classes from './Header.module.scss';
import HeaderSearch from './HeaderSearch';
import Notification from './Notification';
import UserNavItem from './UserNavItem';
import { useTranslation } from 'react-i18next';
import Library from '../Sidebar/icon/library';
import ToolTip from '../../modals/ToolTip';
import { headerMenuHidden } from '../../helpers';
import EmailTemplate from '../Sidebar/icon/EmailTemplate';

const Header = () => {
  const dispatch = useDispatch();
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );
  const headerLogo = useSelector((state) => state.storeState.logo);
  var userDetails = sessionStorage.getItem('userData');
  const History = useNavigate();
  const { t } = useTranslation();

  const [state, setState] = useState({
    allPoints: 0,
    HeaderLogo: null,
  });

  React.useEffect(() => {
    setState({
      ...state,
      HeaderLogo: JSON.parse(userDetails)?.HeaderLogo ?? '',
      allPoints: JSON.parse(userDetails)?.allPoints ?? 0,
    });
  }, [JSON.parse(userDetails)?.HeaderLogo, JSON.parse(userDetails)?.allPoints]);

  const points = () => {
    const tabs = [
      {
        title: 'Points',
        id: 'points',
      },
    ];
    if (tabs) {
      dispatch(TabsActions.tabOnChange({ tabInfo: tabs?.[0] }));
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabs?.map((res, i) => {
            if (i == 0) {
              return {
                ...res,
                active: true,
              };
            }
          }),
        })
      );
    }

    History('/app/points');
  };

  return (
    <div>
      {/* <div className="header-toggle-btn"></div> */}

      <nav
        className={`navbar navbar-expand navbar-bg-color navbar-light topbar static-top br-b-25`}
      >
        <button
          id="sidebarToggleTop"
          className={`btn btn-link d-md-none rounded-circle mr-3`}
        >
          <i className="fa fa-bars"></i>
        </button>
        <Link to="/app/dashboard">
          <div className={classes['logo-wrapper']}>
            {state?.HeaderLogo?.includes('.svg') ? (
              <SvgComponent svgUrl={state?.HeaderLogo} />
            ) : (
              <img
                src={
                  state?.HeaderLogo ||
                  process.env.PUBLIC_URL + '/images/icons/EnliteU Large.png'
                }
                alt="logo"
              />
            )}
          </div>
        </Link>
        {/* <div className={`eep-topbar-divider d-none d-sm-block`}></div>

        <div className={`pg_heading`}>
          <h2>{pageTitle}</h2>
        </div> */}

        {/* Search  */}
        <HeaderSearch />

        <button
          className="eep-btn our_points_in_dashboard c1 text-transform-none"
          onClick={() => points()}
        >
          EnliteU XP :{' '}
          {(state?.allPoints <= 9 && '0') + (state?.allPoints ?? 0)}
        </button>

        <ul className="navbar-nav">
          {/* Nav Item - Search Dropdown (Visible Only XS) */}
          <li className="nav-item dropdown no-arrow d-sm-none">
            <Link
              className="nav-link dropdown-toggle"
              id="searchDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              to="#"
            >
              <i className="fas fa-search fa-fw"></i>
            </Link>

            <div
              className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
              aria-labelledby="searchDropdown"
            >
              <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-0 small"
                    placeholder="Search for..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      type="button"
                    >
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>
          {/* Notification */}

          <Notification />
          {headerMenuHidden('library', userRolePermission) ? (
            <>
              <li className="nav-item dropdown no-arrow  eep_notification_li">
                <Link
                  className="nav-link dropdown-toggle pl-0 mx-1"
                  id="alertsDropdown"
                  role="button"
                  to="/app/library"
                >
                  <ToolTip
                    title="Library"
                    arrow
                    placement="top-end"
                    backgroundColor="#82889B"
                    color="#FFFFFF"
                    fontSize="12px"
                  >
                    <div className="position-relative">
                      <Library color={'#000'} />
                    </div>
                  </ToolTip>
                </Link>
              </li>

              <li className="nav-item dropdown no-arrow  eep_notification_li">
                <Link
                  className="nav-link dropdown-toggle pl-0 mx-1"
                  id="alertsDropdown"
                  role="button"
                  to="/app/templatelist"
                >
                  <ToolTip
                    title="Email Templates"
                    arrow
                    placement="top-end"
                    backgroundColor="#82889B"
                    color="#FFFFFF"
                    fontSize="12px"
                  >
                    <div className="position-relative">
                      <EmailTemplate color={'#000'} />
                    </div>
                  </ToolTip>
                </Link>
              </li>
            </>
          ) : null}

          {/* Nav Item User */}
          <UserNavItem />
        </ul>
      </nav>
    </div>
  );
};
export default Header;

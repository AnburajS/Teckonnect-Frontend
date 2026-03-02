import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ResponseInfo from '../UI/ResponseInfo';
import { BreadCrumbActions } from '../store/breadcrumb-slice';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const userRolePermission = useSelector(
    (state) => state.sharedData.userRolePermission
  );

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Admin Panel',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Users',
      })
    );
    return () => {
      dispatch(
        BreadCrumbActions.updateBreadCrumb({
          breadcrumbArr: [],
          title: '',
        })
      );
    };
  }, [breadcrumbArr, dispatch]);

  return (
    <React.Fragment>
      {userRolePermission?.adminPanel && (
        <React.Fragment>
          <div className="adminPanel-div p-0 m-0">
            <div className="row no-gutters">
              <div className="col-md-12">
                <h4 className="title_h4 c-2c2c2c">Admin Panel</h4>
              </div>
            </div>
            <div className="eep-dropdown-divider"></div>
          </div>
          <div className="admin_panel_container">
            <Link to="/app/portalsettings">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/portalsetting.svg'
                    }
                    className="image-circle"
                    alt="Portal Settings"
                  />
                </div>
                <span>Portal Settings</span>
              </div>
            </Link>
            <Link to="/app/listdepartments">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/departmentmasters.svg'
                    }
                    className="image-circle"
                    alt="Department Master"
                  />
                </div>
                <span>Department Master</span>
              </div>
            </Link>
            <Link to="/app/usermanagement">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/usermanagements.svg'
                    }
                    className="image-circle"
                    alt="User Management"
                  />
                </div>
                <span>User Management</span>
              </div>
            </Link>
            <Link to="/app/idm">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/rolemanagements.svg'
                    }
                    className="image-circle"
                    alt="Role Management"
                  />
                </div>
                <span>Role Management</span>
              </div>
            </Link>
            <Link to="/app/hashtag">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/hashtaglibrary.svg'
                    }
                    className="image-circle"
                    alt="Hashtag Vault"
                  />
                </div>
                <span>Hashtag Vault</span>
              </div>
            </Link>

            <Link to="/app/branchMaster">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/brachmaster.svg'
                    }
                    className="image-circle"
                    alt="Branch Master"
                  />
                </div>
                <span>Branch Master</span>
              </div>
            </Link>

            {/* <Link to="/app/my-redeem">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/icons/adminpanel/Branch.svg"
                    }
                    className="image-circle"
                    alt="Redeem Points"
                  />
                </div>
                <span>Redeem Points</span>
              </div>
            </Link> */}

            <Link to="/app/point-config">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/pointconfig.svg'
                    }
                    className="image-circle"
                    alt="Point Config"
                  />
                </div>
                <span>Point Config</span>
              </div>
            </Link>

            <Link to="/app/wallet">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/wallet.svg'
                    }
                    className="image-circle"
                    alt="Wallet"
                  />
                </div>
                <span>Wallet</span>
              </div>
            </Link>

            <Link to="/app/ygg-config">
              <div className="admin_panel_items bg-white">
                <div className="outter">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/adminpanel/yougotagift.svg'
                    }
                    className="image-circle"
                    alt="YGG Config"
                  />
                </div>
                <span>YGG Config</span>
              </div>
            </Link>
          </div>
        </React.Fragment>
      )}
      {!userRolePermission?.adminPanel && (
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
export default AdminPanel;

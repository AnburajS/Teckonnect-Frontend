// import { UserManagement } from "@crayond_dev/user-management-test";
import React, { useEffect } from "react";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch } from "react-redux";
import { REST_CONFIG } from "../constants/rest-config";
import RoleManagement from "../components/RoleManagement";

const IdmRoleMapping = (props) => {
    const dispatch = useDispatch();
    const breadcrumbArr = [
        {
            label: "Home",
            link: "dashboard",
        },
        {
            label: "Admin Panel",
            link: "app/adminpanel",
        },
        {
            label: "Role",
            link: "",
        },
    ];

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "Library",
            })
        );
        return () => {
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr: [],
                title: "",
            });
        };
    }, []);
    return (
        // <UserManagement
        //     apiUrl={REST_CONFIG.IDM_URL}
        //     apiToken={REST_CONFIG.API_KEY}
        //     title={"Role Management"}
        // />
        <RoleManagement />
    );
};
export default IdmRoleMapping; 

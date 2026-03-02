import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ActionCustomComponent = (props) => {

  const { data, readUnreadNotifications, clearNotifications } = props;

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const markAsRead = (arg) => {
    readUnreadNotifications(arg, "read");
  }

  const markAsUnread = (arg) => {
    readUnreadNotifications(arg, "unRead");
  }

  const clearNotification = (arg) => {
    clearNotifications({ data: arg, action: "clear" });
  }

  return (
    <React.Fragment>
      <div className="ans-type c1 px-4">
        <span className="eep_kebab_btn" data-toggle="dropdown" aria-expanded="false" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.colon, }}></span>
        <div className="eep-dropdown-menu dropdown-menu dropdown-menu-right shadow pt-4 pb-4">
          {!data?.seen &&
            <Link to="#" className="dropdown-item" onClick={() => markAsRead(data.id)}> Mark As Read </Link>
          }
          {data?.seen &&
            <Link to="#" className="dropdown-item" onClick={() => markAsUnread(data.id)}> Mark As Unread </Link>
          }
          <Link to="#" className="dropdown-item" onClick={() => clearNotification(data.id)} > Clear </Link>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ActionCustomComponent;

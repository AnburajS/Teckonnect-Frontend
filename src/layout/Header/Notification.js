// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import ToolTip from '../../modals/ToolTip';

// const Notification = () => {
//   const isNotification = useSelector(
//     (state) => state.sharedData.isNotification
//   );

//   return (
//     <React.Fragment>
//       <li className="nav-item dropdown no-arrow mx-1 eep_notification_li">
//         <Link
//           className="nav-link dropdown-toggle"
//           id="alertsDropdown"
//           role="button"
//           to="/app/notifications"
//         >
//           <ToolTip
//             title="Notifications"
//             arrow
//             placement="top-end"
//             backgroundColor="#82889B"
//             color="#FFFFFF"
//             fontSize="12px"
//           >
//             <div className="position-relative">
//               <img
//                 alt=""
//                 src={process.env.PUBLIC_URL + `/images/notification.svg`}
//               />
//               {/* <span className="badge badge-danger badge-counter">0</span> */}
//               {Object.keys(isNotification).length > 0 &&
//                 isNotification.filter((e) => e.seen === false).length > 0 && (
//                   <span className="notification-highlight"></span>
//                 )}
//             </div>
//           </ToolTip>
//         </Link>
//       </li>
//     </React.Fragment>
//   );
// };
// export default Notification;

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ToolTip from '../../modals/ToolTip';

const Notification = () => {
  const isNotification = useSelector(
    (state) => state.sharedData.isNotification
  );
  const [animate, setAnimate] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const hasMounted = useRef(false);
  const prevUnseenCount = useRef(0);
  const animationInterval = useRef(null);
  const stopTimer = useRef(null);

  const notifications = Array.isArray(isNotification) ? isNotification : [];
  const unseenCount = notifications.filter((e) => e.seen === false).length;

  useEffect(() => {
    if (!hasMounted.current) {
      if (unseenCount > 0) {
        startAnimation(6000);
      }
      hasMounted.current = true;
      prevUnseenCount.current = unseenCount;
      return;
    }

    if (unseenCount > prevUnseenCount.current) {
      startAnimation(6000);
    }

    prevUnseenCount.current = unseenCount;
  }, [unseenCount]);

  const startAnimation = (duration) => {
    stopAnimation(); // clear any existing animation first

    // 🔁 Faster shake speed: run every 800ms instead of 1500ms
    animationInterval.current = setInterval(() => {
      setAnimate(true);
      setShowMessage(true);

      setTimeout(() => {
        setAnimate(false);
        setShowMessage(false);
      }, 500); // shake duration shorter (faster effect)
    }, 800); // repeat every 0.8s

    // ⏱️ If duration provided (e.g., 5 min on login), stop after that
    if (duration) {
      stopTimer.current = setTimeout(() => {
        stopAnimation();
      }, duration);
    }
  };

  const stopAnimation = () => {
    if (animationInterval.current) {
      clearInterval(animationInterval.current);
      animationInterval.current = null;
    }
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
  };

  // ✅ Stop on component unmount
  useEffect(() => {
    return () => stopAnimation();
  }, []);

  return (
    <li className="nav-item dropdown no-arrow mx-1 eep_notification_li">
      <Link
        className="nav-link dropdown-toggle"
        id="alertsDropdown"
        role="button"
        to="/app/notifications"
        onClick={stopAnimation} // 👈 stop when user visits notifications
      >
        <ToolTip
          title="Notifications"
          arrow
          placement="top-end"
          backgroundColor="#82889B"
          color="#FFFFFF"
          fontSize="12px"
        >
          <div className="position-relative">
            <img
              id="bell-img"
              alt="bell"
              src={process.env.PUBLIC_URL + `/images/notification.svg`}
              className={animate ? 'bell-shake' : ''}
            />
            {unseenCount > 0 && (
              <span className="notification-highlight"></span>
            )}
            {showMessage && (
              <img
                src={process.env.PUBLIC_URL + `/images/messagii.png`}
                alt="message"
                className="message-fly"
              />
            )}
          </div>
        </ToolTip>
      </Link>
    </li>
  );
};

export default Notification;

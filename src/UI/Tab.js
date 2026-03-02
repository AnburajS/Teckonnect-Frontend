/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TabsActions } from '../store/tabs-slice';

const Tab = (props) => {
  const dispatch = useDispatch();
  const getTabs = useSelector((state) => state?.tabs?.config);

  const activeTab = Array.isArray(getTabs)
    ? getTabs?.filter((res) => res?.active)
    : [];

  // useEffect(()=>{
  //   if (getTabs?.length && !activeTab?.length) {
  //     dispatch(TabsActions.tabOnChange({ tabInfo: getTabs?.[0] }))
  //   } else if (activeTab?.length) {
  //     const elements = document.getElementsByClassName('tab-pane');
  //     for (let i = 0; i < elements?.length; i++) {
  //       elements[i].classList.remove('active');
  //     }

  //     document.getElementById(activeTab?.[0]?.id)?.classList?.add('active');

  //     dispatch(TabsActions.tabOnChange({ tabInfo: activeTab[0] }))
  //   }
  // },[])

  useEffect(() => {
    // dispatch(TabsActions.tabOnChange({ tabInfo: getTabs?.[0] }))

    if (getTabs?.length && !activeTab?.length) {
      dispatch(TabsActions.tabOnChange({ tabInfo: getTabs?.[0] }));
    } else if (activeTab?.length) {
      const elements = document.getElementsByClassName('tab-pane');
      for (let i = 0; i < elements?.length; i++) {
        elements[i].classList.remove('active');
      }

      document.getElementById(activeTab?.[0]?.id)?.classList?.add('active');

      dispatch(TabsActions.tabOnChange({ tabInfo: activeTab[0] }));
    }
  }, [dispatch, getTabs]);

  const tabChangeHandler = (tab) => {
    dispatch(TabsActions.tabOnChange({ tabInfo: tab }));
  };

  return (
    <React.Fragment>
      <div className="container-sm eep-container-sma eep-tab-menus">
        <div
          className="nav nav-tabs"
          role="tablist"
          style={{ borderBottom: 'none' }}
        >
          {getTabs?.length &&
            getTabs?.map((tab, index) => (
              <div
                data-toggle="tab"
                href={'#' + tab?.id}
                // className={`btn btn-secondaryy ${index === 0 ? "active" : ""}`}
                className={`btn btn-secondaryy-color c1 ${
                  activeTab?.length && tab?.active ? 'active' : ''
                }
                  ${!activeTab?.length && index === 0 ? 'active' : ''}`}
                key={'tab_' + index}
                onClick={() => tabChangeHandler(tab)}
                // style={{ padding: !activeTab?.length && "0.3rem 30px !important" }}
              >
                {tab?.title}
              </div>
            ))}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Tab;

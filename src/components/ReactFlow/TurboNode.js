import { Link } from 'react-router-dom';
import './style.css';
import React from 'react';
import { Handle, Position } from 'reactflow';

export const TurboNode = ({ data, nodeEevent, handleAction }) => {
  return (
    <div className="react-flow">
      <div className="cloud gradient">
        <Link
          className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
          data-toggle="modal"
          data-target="#UserDetailView"
          onClick={() => {
            handleAction(data);
          }}
          to="#"
          dangerouslySetInnerHTML={{
            __html: "<img src='/images/icons8-info-50.svg'/>",
          }}
        ></Link>
      </div>
      <div
        className="wrapper gradient"
        style={{
          border: data?.color && `2px solid ${data?.color}`,
          borderRadius: 7,
        }}
      >
        <div className="inner">
          <div
            className="body"
            style={{ background: data?.background }}
          >
            <div className="icon">
              <img
                className="img"
                src={
                  data?.icon ||
                  `${process.env.PUBLIC_URL}/images/user_profile.png`
                }
              />
            </div>
            <div>
              <div className="title">
                {data?.title + ' ' + (data?.isloggedUser ? '(You)' : '')}
              </div>
              {data?.subline && <div className="subline">{data?.subline}</div>}
            </div>
          </div>
          <div
            className="footer"
            style={{
              background: data?.active && data?.background,
              borderTop:
                data?.background && data?.active && '1px solid #46464652',
            }}
            onClick={(e) => nodeEevent(e, data)}
          >
            <img
              className="img"
              src={`${process.env.PUBLIC_URL}/images/icons8-broadcasting-50.svg`}
            />
            &nbsp;{data?.children?.length > 0 ? data?.children?.length : ' No'}
            &nbsp;Users
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
      />
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
};

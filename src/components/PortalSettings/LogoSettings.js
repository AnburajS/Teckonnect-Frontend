import React, { useState } from 'react';
import AddLogo from './AddLogo';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import SvgComponent from '../ViwerComponents';

const LogoSettings = (props) => {
  const [clearImage, setClearImage] = useState({
    clear: false,
    clearImgId: '',
  });
  const [uploadImgArry, setUploadImgArry] = useState([]);

  const clearImageHandler = ({ key }) => {
    props.setState({ ...props.state, [key]: null });
    // setClearImage(arg);
  };

  const checkKey = (objVal, data) => {
    const formData = new FormData();
    formData.append('image', data);
    const obj = {
      url: URL_CONFIG.UPLOAD_FILES,
      method: 'post',
      payload: formData,
    };
    httpHandler(obj).then((reponse) => {
      props.setState({
        ...props.state,
        [objVal]: reponse?.data?.data?.[0]?.url ?? '',
      });
    });

    // let keyExist = Object.values(obj).some(value => value === data.id);
    // let arry = uploadImgArry;
    // if (!keyExist) {
    //   arry.push(data);
    //   setUploadImgArry(arry);
    // }
  };
  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading">
          <span>Login Page Logo </span>
        </div>
        <div className="setting_icon c1">
          <img
            src={`${process.env.PUBLIC_URL}/images/icons/static/kebab.svg`}
            width="20px"
            height="20px"
            alt="Settings"
            data-toggle="dropdown"
            data-trigger="focus"
            aria-expanded="false"
            style={{ transform: 'rotate(270deg)' }}
          />
          <div
            className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg"
            x-placement="bottom-start"
          >
            {/* <label className="eep-options-item dropdown-item mb-0 c1">Add / Replace</label>
            <label className="eep-options-item dropdown-item mb-0 c1">View</label> */}
            <label
              className="eep-options-item dropdown-item mb-0 c1"
              onClick={() =>
                clearImageHandler({
                  clear: true,
                  clearImgId: 'page-logo',
                  key: 'loginLogoByte',
                })
              }
            >
              Delete
            </label>
          </div>
        </div>
      </div>

      <div className="row no-gutters mb-3">
        <div
          className="col-md-12 Logo"
          style={{ display: props?.state?.loginLogoByte && 'flex' }}
        >
          {props?.state?.loginLogoByte?.includes('.svg') ? (
            <SvgComponent svgUrl={props?.state?.loginLogoByte} />
          ) : props?.state?.loginLogoByte ? (
            <img
              className="imgs"
              src={props?.state?.loginLogoByte}
            />
          ) : (
            <AddLogo
              clickId={'pageLogo'}
              settings={{
                isClear: clearImage,
                imgHeight: '200px',
                imgWidth: '200px',
                imgId: 'page-logo',
                key: 'loginLogoByte',
                checkKey: checkKey,
                isNew: true,
                uploadImgArry: uploadImgArry,
                clearImageHandler: clearImageHandler,
              }}
            />
          )}{' '}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading">
          <span>Product Header Logo </span>
        </div>
        <div className="setting_icon c1">
          <img
            src={`${process.env.PUBLIC_URL}/images/icons/static/kebab.svg`}
            width="20px"
            height="20px"
            alt="Settings"
            data-toggle="dropdown"
            aria-expanded="false"
            style={{ transform: 'rotate(270deg)' }}
          />
          <div
            className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg"
            x-placement="bottom-start"
          >
            {/* <label className="eep-options-item dropdown-item mb-0 c1">Add / Replace</label>
            <label className="eep-options-item dropdown-item mb-0 c1">View</label> */}
            <label
              className="eep-options-item dropdown-item mb-0 c1"
              onClick={() =>
                clearImageHandler({
                  clear: true,
                  clearImgId: 'header-logo',
                  key: 'headerLogoByte',
                })
              }
            >
              Delete
            </label>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div
          className="col-md-12 Logo"
          style={{ display: props?.state?.headerLogoByte && 'flex' }}
        >
          {props?.state?.headerLogoByte?.includes('.svg') ? (
            <SvgComponent svgUrl={props?.state?.headerLogoByte} />
          ) : props?.state?.headerLogoByte ? (
            <img
              className="imgs"
              src={props?.state?.headerLogoByte}
            />
          ) : (
            <AddLogo
              clickId={'headerLogo'}
              settings={{
                isClear: clearImage,
                imgHeight: '200px',
                imgWidth: '200px',
                imgId: 'header-logo',
                key: 'headerLogoByte',
                checkKey: checkKey,
                isNew: true,
                uploadImgArry: uploadImgArry,
                clearImageHandler: clearImageHandler,
              }}
            />
          )}{' '}
        </div>
      </div>
    </React.Fragment>
  );
};
export default LogoSettings;

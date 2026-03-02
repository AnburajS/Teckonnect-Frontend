import React, { useEffect, useState } from 'react';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import SignaturePad from 'react-signature-canvas';
import { httpHandler } from '../http/http-interceptor';
import { URL_CONFIG } from '../constants/rest-config';
import { translate } from 'pdf-lib';
import { base64ToFile } from '../helpers';

const SignatureUploadModal = () => {
  const [signValue, setSignValue] = useState('');
  const [toggleChecked, setToggleChecked] = useState(true);
  const [signResponseMsg, setSignResponseMsg] = useState('');
  const [signResponseClassName, setSignResponseClassName] = useState('');
  const [uploadDisable, setUploadDisable] = useState(true);
  //const [dataUrl, setDataUrl] = useState(null);
  const [sigPad, setSigPag] = useState({});

  var signDefault =
    process.env.PUBLIC_URL + '/images/icons/special/attachment-add.svg';

  useEffect(() => {
    return () => {
      let collections = document.getElementsByClassName('modal-backdrop');
      for (var i = 0; i < collections.length; i++) {
        collections[i].remove();
      }
    };
  }, []);

  const onChangeCheckbox = () => {
    setSignResponseMsg('');
    setSignResponseClassName('');
    setToggleChecked((prevState) => !prevState);
    setUploadDisable(false);
  };

  const clearSignature = () => {
    setSignResponseMsg('');
    setSignResponseClassName('');
    setUploadDisable(true);
    if (toggleChecked) {
      document.getElementById('signatureUpload').value = null;
      setSignValue('');
    } else {
      sigPad.clear();
    }
  };

  const triggerSignatureUpload = () => {
    if (toggleChecked) {
      document.getElementById('signatureUpload').click();
    } else {
      if (!sigPad.isEmpty()) {
        setUploadDisable(false);
      }
    }
  };

  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const onChangeHandler = (event) => {
    var file = event.target.files[0];
    var fileType = file['type'];
    if (validImageTypes.includes(fileType)) {
      //var tempFileName = file.name;
      var reader = new FileReader();
      reader.onload = function () {
        setSignValue(reader.result);
      };
      reader.readAsDataURL(file);
      setSignResponseClassName('');
      setSignResponseMsg('');
      setUploadDisable(false);
    } else {
      setUploadDisable(true);
      setSignResponseClassName('eep-text-warn');
      setSignResponseMsg('Invalid file! Please choose JPEG, JPG or PNG');
    }
  };

  const uploadSignature = () => {
    let dataUrlVal = null;
    if (!toggleChecked) {
      dataUrlVal = sigPad.getCanvas().toDataURL('image/png');
    }

    const base64Data = (
      toggleChecked
        ? signValue
          ? signValue
          : null
        : dataUrlVal
        ? dataUrlVal
        : null
    ).replace(/^data:image\/\w+;base64,/, '');

    const file = base64ToFile(base64Data);

    const formData = new FormData();
    formData.append('image', file);
    const obj = {
      url: URL_CONFIG.UPLOAD_FILES,
      method: 'post',
      payload: formData,
    };
    // const obj = {
    //   url: URL_CONFIG.UPDATE_USER_SIGNATURE,
    //   method: "put",
    //   payload: {
    //     "image": toggleChecked ? (signValue ? signValue : null) : (dataUrlVal ? dataUrlVal : null),
    //     "name": "Signature"
    //   }
    // };
    httpHandler(obj)
      .then((res) => {
        const userData = sessionStorage.userData
          ? JSON.parse(sessionStorage.userData)
          : {};
        const update = {
          url: URL_CONFIG.GETUSER_PROFILE,
          method: 'put',
          payload: {
            signPic: res?.data?.data?.[0]?.url ?? '',
          },
        };

        if (userData?.id) {
          update['payload'] = {
            ...update['payload'],
            id: userData.id,
          };
        }

        httpHandler(update).then((res_update) => {
          // const respMsg = res?.data?.data?.[0]?.message;
          const respMsg = 'Your signature uploaded successfully!';
          setSignResponseMsg(respMsg);
          setSignResponseClassName('response-succ');
          document.getElementById('signature-image').src =
            res?.data?.data?.[0]?.url ?? '';
          //  toggleChecked ? (signValue ? signValue : signDefault) : (dataUrlVal ? dataUrlVal : signDefault);
        });
      })
      .catch((error) => {
        const errMsg = error?.data?.data?.[0]?.message;

        setSignResponseMsg(errMsg);
        setSignResponseClassName('response-err');
      });
  };

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade modalClass"
        id="SignatureUploadModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ width: '480px' }}
        >
          <div className="modal-content">
            <div className="modal-header justify-content-center border-0 p-0">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="d-flex justify-content-center w-100 modal-icon-box">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      '/images/icons/popup/signature-gradient.svg'
                    }
                    className="modal-icon-image"
                    alt="Failure"
                  />
                </div>
                <div className="modal-desc mb-0 c-2c2c2c">
                  <BootstrapSwitchButton
                    checked={toggleChecked}
                    width={195}
                    onstyle="success"
                    onlabel="Upload your signature"
                    offlabel="Draw your signature"
                    onChange={onChangeCheckbox}
                    style="toggle_switch"
                    id="toggle-switch"
                  />
                </div>
                <div
                  className={`signatureContainer position-relative ${
                    !toggleChecked ? 'border' : ''
                  }`}
                  style={{ margin: toggleChecked ? '1px' : '0px' }}
                >
                  <img
                    className="position-absolute c1 sign_clear"
                    title="Remove"
                    src={
                      process.env.PUBLIC_URL + '/images/icons/static/clear.svg'
                    }
                    alt="Clear"
                    width="30px"
                    height="30px"
                    onClick={clearSignature}
                  />
                  {toggleChecked && (
                    <div className="d-flex flex-column justify-content-center align-items-center signatureUpload-div">
                      <img
                        src={signValue ? signValue : signDefault}
                        className="c1"
                        alt="Add Signature"
                        style={{ maxWidth: '80px' }}
                        onClick={triggerSignatureUpload}
                      />
                      <p
                        className="mb-0 mt-2"
                        style={{ fontSize: '14px' }}
                      >
                        Edit signature
                      </p>
                      <input
                        id="signatureUpload"
                        name="signature-image-upload"
                        className="d-none"
                        type="file"
                        onChange={(event) => onChangeHandler(event)}
                      />
                    </div>
                  )}
                  {!toggleChecked && (
                    <div
                      className="d-flex justify-content-center"
                      onClick={triggerSignatureUpload}
                    >
                      <SignaturePad
                        canvasProps={{
                          width: 420,
                          height: 160,
                          className: 'sigCanvas',
                        }}
                        ref={(ref) => {
                          setSigPag(ref);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0 flex-column p-0 mt-2">
                  {signResponseMsg && (
                    <div className="response-div m-0">
                      <p className={`${signResponseClassName} response-text`}>
                        {signResponseMsg}
                      </p>
                    </div>
                  )}
                  <div className="d-flex justify-content-center">
                    <button
                      className="eep-btn eep-btn-cancel mr-2"
                      type="button"
                      data-dismiss="modal"
                    >
                      Cancel
                    </button>
                    {/* <button className="eep-btn eep-btn-warn mx-2" type="button" onClick={clearSignature}>
                      Clear
                    </button> */}
                    <button
                      className="eep-btn eep-btn-success"
                      onClick={uploadSignature}
                      disabled={uploadDisable}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignatureUploadModal;

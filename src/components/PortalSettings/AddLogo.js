import React, { useEffect, useState } from 'react';
import { validateFileSize } from '../../constants/utills';
import Fileupload from '../../fileUpload/Fileupload';

const AddLogo = (props) => {
  const { clickId, settings } = props;
  const [showAdd, setShowAdd] = useState(true);
  const [imageByte, setImageByte] = useState({ image: '', name: '' });
  const initFileMessage = 'Click to Add/Update Logo';
  const initFileClassName = 'mt-2 eep-text-light-grey';
  const [fileMessage, setFileMessage] = useState(initFileMessage);
  const [fileClassName, setFileClassName] = useState(initFileClassName);
  const [imgArry, setImgArry] = useState(settings.uploadImgArry);

  const addLogoHandler = () => {
    let tempfile = document.getElementById(clickId);
    tempfile.value = '';
    document.getElementById(clickId).click();
  };

  const validImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
  ];

  const logoUploadHandlerIsNew = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const isValid = validateFileSize(file, 1);

      if (isValid === true) {
        settings.checkKey(settings?.key, file);
      } else {
        setImageByte({ image: '', name: '' });
        setShowAdd(true);
        setFileClassName('mt-2 eep-text-warn');
        setFileMessage(isValid);
      }
    }
  };

  const logoUploadHandler = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const isValid = validateFileSize(file, 1);

      if (isValid === true) {
        var fileType = file['type'];
        if (validImageTypes.includes(fileType)) {
          var tempFileName = file.name;
          tempFileName = tempFileName.replace(/\s/g, '');
          var reader = new FileReader();
          reader.onload = function () {
            let obj = { image: reader.result, name: tempFileName };
            setImageByte(obj);
            setShowAdd(false);
            let tempImgArry = imgArry;
            let imgObj = { id: settings.imgId, imgData: obj };
            if (!tempImgArry.length) {
              tempImgArry.push(imgObj);
              setImgArry(tempImgArry);
            } else {
              tempImgArry.map((item) => {
                settings.checkKey(item, imgObj);
              });
            }
          };
          reader.readAsDataURL(file);
          setFileClassName(initFileClassName);
          setFileMessage(initFileMessage);
        } else {
          setImageByte({ image: '', name: '' });
          setShowAdd(true);
          setFileClassName('mt-2 eep-text-warn');
          setFileMessage('Invalid file! Please choose JPEG, JPG, PNG or SVG');
        }
      } else {
        setImageByte({ image: '', name: '' });
        setShowAdd(true);
        setFileClassName('mt-2 eep-text-warn');
        setFileMessage(isValid);
      }
    } else {
      clearImage('', true);
    }
  };

  const clearImage = (arg, val = true) => {
    if (arg === settings.imgId) {
      document.getElementById(arg).src = ' ';
      let tempimgArry = imgArry;
      tempimgArry.map((item, index) => {
        if (item.id === arg) {
          tempimgArry.splice(index, 1);
        }
      });
      setImgArry(tempimgArry);
      setShowAdd(true);
      settings.clearImageHandler({ clear: false, clearImgId: '' });
      if (val) {
        let tempfile = document.getElementById(clickId);
        tempfile.value = '';
        document.getElementById(clickId).click();
      }
    }
  };

  useEffect(() => {
    if (settings && settings.isClear.clear && !showAdd) {
      let clrId = settings.isClear.clearImgId;
      clearImage(clrId);
    }
  }, [settings]);

  return (
    <React.Fragment>
      <div
        // className="img_container"
        title="Add Logo"
      >
        {showAdd && (
          <React.Fragment>
            <div className="justify-items">
              <Fileupload
                addIconClickHandler={addLogoHandler}
                onChangeHandler={
                  settings?.isNew ? logoUploadHandlerIsNew : logoUploadHandler
                }
                height={settings.imgHeight}
                width={settings.imgWidth}
                inputId={clickId}
                accept={'image/png, image/jpg, image/jpeg'}
                suggested={clickId === 'pageLogo' ? '700x200' : '150x44'}
              />
            </div>
            <div className={`pl-1 text-center ${fileClassName}`}>
              {fileMessage}
            </div>
          </React.Fragment>
        )}
        {!showAdd && (
          <div
            className="img_box mx-auto bg-transparentt Logo-width"
            style={{ width: settings.imgWidth, height: settings.imgHeight }}
          >
            <img
              id={settings.imgId}
              src={settings && imageByte.image}
              width="100%"
              height="100%"
              title={settings && imageByte.name}
              alt="Logo"
              onClick={() => clearImage(settings.imgId)}
            />
          </div>
        )}
        {/* <input
          id={clickId}
          className="d-none"
          accept=".png, .jpg, .jpeg"
          type="file"
          onChange={(event) =>
            settings?.isNew
              ? logoUploadHandlerIsNew(event)
              : logoUploadHandler(event)
          }
        /> */}
      </div>
    </React.Fragment>
  );
};
export default AddLogo;

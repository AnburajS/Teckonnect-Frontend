import React, { useContext, useEffect, useState } from 'react';
import { FormContext } from './FormContext';
import SignatureUploadModal from '../../modals/SignatureUploadModal';

const FileField = (props) => {
  const { field } = props;
  const initValue = field.value && field.value !== undefined ? field.value : '';
  const [signatureValue, setSignatureValue] = useState(initValue);

  useEffect(() => {
    const value = initValue ? initValue : '';
    setSignatureValue(value);
  }, [initValue]);

  return (
    <React.Fragment>
      {field.disabled && (
        <React.Fragment>
          <SignatureUploadModal />
          <div
            className={`col-md-12 form-group text-left ${
              field.mandatory ? 'required' : ''
            }`}
          >
            <div className="d-flex flex-column align-items-center text-center">
              <img
                alt="User Signature"
                src={
                  signatureValue
                    ? signatureValue
                    : `${process.env.PUBLIC_URL}/images/icons/special/attachment-add.svg`
                }
                id="signature-image"
                className="c1 mb-2"
                width="100"
                title="Signature"
                data-toggle="modal"
                data-target="#SignatureUploadModal"
              />
              <div className="eep-text-light-grey">
                Add/Update your Signature
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default FileField;

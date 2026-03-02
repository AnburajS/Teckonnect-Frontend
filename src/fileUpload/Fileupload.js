import React from 'react';

function Fileupload({
  addIconClickHandler,
  onChangeHandler,
  width,
  height,
  className,
  inputId,
  imgId,
  accept,
  suggested,
  suggestedText,
}) {
  return (
    <>
      {' '}
      <div
        className={className ? className : 'n_card_add_col_inner'}
        title="Add Template"
        style={{ width: width, height: height }}
      >
        <div className="add_temp_img n_card_add_col">
          <div>
            <div className="outter p-3">
              <img
                src={`${process.env.PUBLIC_URL}/images/icons/plus-white.svg`}
                className="plus_white_img"
                alt="Plus White"
                title="Add Image"
                onClick={() => {
                  addIconClickHandler();
                }}
                id={imgId}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: '500',
              paddingTop: '4px',
              color: '#9d9d9d',
            }}
          >
            {suggestedText
              ? suggestedText
              : `Prefered upload size ${suggested}px`}
          </div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: '500',
              paddingTop: '5px',
              color: '#9d9d9d',
            }}
          >
            (Max 1MB)
          </div>
        </div>
      </div>
      <input
        id={inputId ? inputId : 'imgFileLoader'}
        className="invisible"
        type="file"
        accept={accept ? accept : 'image/png, image/jpg, image/jpeg'}
        onChange={(event) => onChangeHandler(event)}
      />
    </>
  );
}

export default Fileupload;

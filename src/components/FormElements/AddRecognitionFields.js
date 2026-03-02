import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';

const AddRecognitionFields = (props) => {
  const { libNameData, getFormData, recogType } = props;
  const [hashTagValue, setHashTagValue] = useState([]);
  const [options, setOptions] = useState([]);
  let recogTempName = libNameData ? libNameData : '';
  const [recogName, setRecogName] = useState(recogTempName);
  const [recogPoints, setRecogPoints] = useState(0);

  useEffect(() => {
    const hValue = [];
    hashTagValue.map((res) => {
      hValue.push({ id: res });
    });
    const obj = {
      name: recogName,
      points: recogPoints,
      hashTag: hValue,
    };
    getFormData(obj);
  }, [hashTagValue, recogName, recogPoints]);

  const fetchhashTag = () => {
    const obj = {
      url: URL_CONFIG.ACTIVE_HASHTAG,
      method: 'get',
      params: { active: true },
    };
    httpHandler(obj)
      .then((hashTag) => {
        let optionsTemp = [];
        {
          hashTag.data.map((hashTagValue) => {
            optionsTemp.push({
              value: hashTagValue.id,
              label: hashTagValue.hashtagName,
            });
          });
        }
        setOptions(optionsTemp);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchhashTag();
  }, []);

  const onChangeHashTagHandler = (e) => {
    setHashTagValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const onChangeNameHandler = (event) => {
    setRecogName(event.target.value);
  };

  const onChangePointsHandler = (event) => {
    setRecogPoints(event.target.value);
  };

  return (
    <React.Fragment>
      <div className="col-md-12 form-group">
        <input
          type="text"
          className="form-control eep-form-control"
          name="name"
          placeholder={
            recogType === 'badges' ? 'Enter Badge Name' : 'Enter Award Name'
          }
          autoComplete="off"
          onChange={(event) => onChangeNameHandler(event)}
          value={recogName}
        />
      </div>
      <div className="col-md-12 form-group select_bgwhite">
        <Select
          name="hashTag"
          isMulti={true}
          placeholder="Select Hashtags"
          options={options}
          values={hashTagValue}
          classNamePrefix="eep_select_common select"
          onChange={(event) => onChangeHashTagHandler(event)}
        />
      </div>
      <div className="col-md-12 form-group">
        <input
          type="number"
          className="form-control eep-form-control positive-number"
          name="points"
          placeholder="Points"
          value={recogPoints}
          onChange={(event) => onChangePointsHandler(event)}
          min="0"
        />
      </div>
    </React.Fragment>
  );
};

export default AddRecognitionFields;

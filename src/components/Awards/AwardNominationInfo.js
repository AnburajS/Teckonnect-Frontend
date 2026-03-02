import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AwardNominationInfo = (props) => {
  const {
    aDataVal,
    isCommonMessageChecked,
    isCommonMsg,
    getCommonMessageValue,
    getHashValues,
    commonMsgValue,
  } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const msgMaxLength = 120;
  const [hashId, setHashId] = useState([]);
  const getMyHashTag = (arg) => {
    const arr = [];
    arg?.map((res) => {
      return res?.hashtagName
        ? arr?.push('#' + res?.hashtagName)
        : res?.hashtag?.hashtag_name
        ? arr?.push('#' + res?.hashtag?.hashtag_name)
        : '';
    });

    return arr.join(', ');
  };

  useEffect(() => {
    setHashId([]);
  }, [aDataVal]);

  const hashOnChangeHandler = (eve, name) => {
    const { value, checked } = eve.target;
    var hashIdTemp = hashId;
    if (checked) {
      hashIdTemp.push({ id: value, hashName: name });
    } else {
      for (let i = 0; i < hashIdTemp.length; i++) {
        if (value === hashIdTemp[i].id) {
          hashIdTemp.splice(i, 1);
          break;
        }
      }
    }
    setHashId(hashIdTemp);
    getHashValues(hashIdTemp);
  };

  return (
    <React.Fragment>
      <ReactTooltip />
      <div>
        {aDataVal && (
          <React.Fragment>
            <div className="r_award_lcol_inner text-center">
              <img
                src={
                  aDataVal?.imageByte?.image
                    ? aDataVal?.imageByte?.image
                    : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                }
                className="r_award_img selected"
                alt="Award Icon"
                title="Award Name"
              />
            </div>
            <div className="col-md-12 text-center">
              <label className="n_award_add_label font-helvetica-m n_award_name">
                {aDataVal?.award?.name}
              </label>
            </div>
            <div className="n_award_info_div">
              <div className="n_dtls_info">
                <label className="n_dtls_lb font-helvetica-m">Tags</label>
                <p className="n_award_category mb-1 text-right eep_truncate_auto">
                  {getMyHashTag(aDataVal?.award?.hashTag)}
                </p>
              </div>
              <div className="n_dtls_info">
                <label className="n_dtls_lb font-helvetica-m">Points</label>
                <p className="n_award_points mb-1 text-right">
                  {aDataVal?.award?.points}
                </p>
              </div>
              <div className="n_dtls_info ">
                <label className="n_dtls_lb font-helvetica-m">Team</label>
                <p className="n_award_dept mb-1 text-right">
                  {aDataVal?.type === 'spot_award'
                    ? aDataVal?.departmentId?.name
                    : aDataVal?.type === 'nomi_award'
                    ? aDataVal?.nominatorId?.department?.name
                    : ''}
                </p>
              </div>
              {aDataVal && aDataVal?.type === 'nomi_award' && (
                <React.Fragment>
                  <div className="n_dtls_info ">
                    <label className="n_dtls_lb font-helvetica-m">
                      Nomination Type
                    </label>
                    <p className="n_award_type mb-1 text-right">
                      {aDataVal?.subType}
                    </p>
                  </div>
                  <div className="n_dtls_info ">
                    <label className="n_dtls_lb font-helvetica-m">Judge</label>
                    <p className="n_award_judge mb-1 text-right">
                      {aDataVal?.judgeId?.fullName}
                    </p>
                  </div>
                </React.Fragment>
              )}
            </div>
            <div className="col-md-12 px-0 mb-2 r_award_common_msg_div">
              <div className="r_a_commomMessage eep_toggle_switch_sm">
                <label className="commomMessage_view mb-0 font-helvetica-m">
                  <span className="mr-1">Common Message</span>
                  <Link
                    className="eep_help_section"
                    to="#"
                    dangerouslySetInnerHTML={{
                      __html: svgIcons && svgIcons.info_icon,
                    }}
                    data-tip="Enable common message for all selected users.<br />Note:-The filled messages will be get empty. <br /> Can't revert it back."
                    data-multiline={true}
                    data-border={true}
                    data-effect="solid"
                    data-background-color="#f8d7da"
                    data-class="eep-tootip"
                    data-text-color="#721c24"
                    data-border-color="#f5c6cb"
                    data-arrow-color="#f5c6cb"
                    data-place="top"
                  ></Link>
                </label>
                <label className="eep_toggle_switch switch">
                  <input
                    type="checkbox"
                    className="eep_toggle_input commonMessageToggle"
                    onChange={(e) => isCommonMessageChecked(e)}
                  />
                  <span className="eep_toggle_slider slider round"></span>
                </label>
              </div>
              <textarea
                className="form-control r_award_common_msg eep_scroll_y"
                id="r_award_common_msg"
                rows="3"
                placeholder="Enable common message for type here...."
                maxLength="120"
                disabled={!isCommonMsg.isChecked}
                value={commonMsgValue}
                onChange={(e) => getCommonMessageValue(e)}
              ></textarea>
              <span className="help-block">
                <p
                  id="characterLeft"
                  className="help-block "
                >
                  {commonMsgValue?.length}/{msgMaxLength}
                </p>
              </span>
            </div>

            {aDataVal && aDataVal?.type === 'spot_award' && (
              <React.Fragment>
                <div className="eep-dropdown-divider"></div>
                <div
                  className="btn-group eep_tags_group hashTag eep_scroll_y"
                  style={{ maxHeight: '70px' }}
                >
                  {aDataVal?.award?.hashTag &&
                    aDataVal?.award?.hashTag.map((dataHash, i) => (
                      <div
                        className="eep_tags"
                        key={'hash_' + i}
                      >
                        <input
                          type="checkbox"
                          className="btn-check socialHashTag"
                          name="hashtag"
                          id={'check' + i}
                          value={dataHash.id}
                          autoComplete="off"
                          onChange={(e) =>
                            hashOnChangeHandler(e, dataHash.hashtagName)
                          }
                        />
                        <label
                          className="btn btn-outline-primary"
                          htmlFor={'check' + i}
                        >
                          #{dataHash.hashtagName}
                        </label>
                      </div>
                    ))}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {!aDataVal && (
          <React.Fragment>
            <div
              className="alert alert-danger"
              role="alert"
            >
              Not able to fetch property data. Please try again from beginning.
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default AwardNominationInfo;

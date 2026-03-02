import React, { useEffect, useState } from 'react';
import { httpHandler } from '../../http/http-interceptor';
import { URL_CONFIG } from '../../constants/rest-config';
import ResponseInfo from '../../UI/ResponseInfo';
import ShareToWall from '../../modals/ShareToWall';
import PageHeader from '../../UI/PageHeader';
import YearFilter from '../../UI/YearFilter';
import { formatDate } from '../../shared/SharedService';
import { pageLoaderHandler } from '../../helpers';
import InViewScrol from '../../UI/InViewScrol';

const MyBadge = () => {
  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [myBadgeData, setMyBadgeData] = useState([]);
  const [myBadgeModalShow, setMyBadgeModalShow] = useState(false);
  const [shareBadgeID, setShareBadgeID] = useState(null);
  const [isloading, setIsloding] = useState(false);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [stopFetch, setStopFetch] = useState(false);
  const [offset, setOffset] = useState(1);
  const [direction] = useState('desc');
  const [limit] = useState(12);
  const fetchMyBadgeData = (paramData = {}, customOffset = offset) => {
    setIsloding(true);
    const paramsTemp = {
      limit: limit,
      offset: customOffset,
      direction: direction,
      ...paramData,
    };

    const obj = {
      url: URL_CONFIG.MY_BADGES,
      method: 'get',
      params: paramsTemp,
    };

    httpHandler(obj)
      .then((bData) => {
        const dataTemp =
          customOffset === 1
            ? [...bData?.data]
            : [...myBadgeData, ...bData?.data];
        setMyBadgeData(dataTemp);
        setOffset(customOffset + 1);
        setStopFetch(bData.data?.length < limit ? true : false);
        setIsloding(false);
      })
      .catch((error) => {
        console.error('Error fetching badge data', error);
        setIsloding(false);
      });
  };

  useEffect(() => {
    fetchMyBadgeData({ filterby: yearFilterValue?.filterby }, 1);
    setStopFetch(false);
    pageLoaderHandler(isloading ? 'show' : 'hide');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMyHashTag = (arg) => {
    return arg.map((res) => `#${res.hashtagName}`).join(', ');
  };

  const MyBadgeModalHandler = (arg) => {
    setMyBadgeModalShow(true);
    setShareBadgeID(arg);
  };

  const onFilterChange = (filterValue) => {
    const newOffset = 1;
    setYearFilterValue({ filterby: filterValue.value });
    setOffset(newOffset);
    setStopFetch(false);
    fetchMyBadgeData({ filterby: filterValue.value }, newOffset);
  };

  const shareHandlerOnClick = () => {
    console.log('Share clicked');
    console.log('DSF');
    const newOffset = 1;
    setOffset(newOffset);
    setStopFetch(false);
    fetchMyBadgeData({ filterby: yearFilterValue?.filterby }, newOffset);
  };
  const inViewHandlerOnClick = () => {
    console.log('Share clicked');
    console.log('DSF');

    fetchMyBadgeData({ filterby: yearFilterValue?.filterby }, offset);
  };
  return (
    <React.Fragment>
      <PageHeader
        title="Badges"
        filter={<YearFilter onFilterChange={onFilterChange} />}
      />

      {myBadgeModalShow && (
        <ShareToWall
          ShareID={shareBadgeID}
          fetchMyData={shareHandlerOnClick}
        />
      )}

      {!isloading && (
        <div
          className={`${
            myBadgeData.length <= 0 ? 'h-100' : 'mt-4'
          } row eep-content-start eep-mybadge-div`}
          id="content-start"
        >
          {myBadgeData.map((data, index) => (
            <div
              className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-left badge_col_div card-container"
              key={'MyBadge_' + index}
              onClick={() =>
                setFlippedCardId((prev) => (prev === data.id ? null : data.id))
              }
            >
              <div
                className={`card-flip ${
                  flippedCardId === data.id ? 'flipped' : ''
                }`}
              >
                <div className="badge_assign_div card front">
                  <div className="outter">
                    <img
                      src={
                        data?.imageByte?.image
                          ? data.imageByte.image
                          : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`
                      }
                      className="badge_img"
                      alt="Performer"
                      title="Performer"
                    />
                  </div>
                  <div className="p-2">
                    <div className="badge_info_div">
                      <p className="badge_info font-helvetica-m">
                        {data.badge?.name || ''}
                      </p>
                      {data?.hashTag?.length > 0 && (
                        <p
                          className="badge_info badge_info_hash eep_truncate"
                          style={{ maxWidth: '100%' }}
                        >
                          {getMyHashTag(data.hashTag)}
                        </p>
                      )}
                      <p className="badge_info font-helvetica-m">
                        {data.badge ? `${data.badge.points} XP` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card back rewards_backside_list_div bg-598B9E color-ffff">
                  <div className="card-block h-100">
                    <div className="d-flex flex-column p-2 h-100">
                      {data.wallPost && (
                        <div className="c1 d-flex justify-content-end">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/icons/static/reply.svg `}
                            className=""
                            alt="Share"
                            title="EnliteU Wall Share"
                            onClick={() => MyBadgeModalHandler(data.id)}
                            data-toggle="modal"
                            data-target="#ShareToWall"
                          />
                        </div>
                      )}

                      <div className="rewards_backside_list_row flex-column h-100">
                        <h6 className="b_r_flip_nm font-helvetica-m">
                          {data?.createdBy?.fullName}
                        </h6>
                        <div className="d-flex flex-column flex-grow-1">
                          <div
                            className="flex-grow-1 eep_scroll_y"
                            style={{ maxHeight: '125px' }}
                          >
                            <p className="b_r_flip_msg">{data.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="b_r_flip_dt mb-0">
                              {data.createdAt ? formatDate(data.createdAt) : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {myBadgeData.length <= 0 && (
            <ResponseInfo
              title="Yet to earn!"
              responseImg="noRecord"
              responseClass="response-info"
            />
          )}
        </div>
      )}
      <InViewScrol
        apiCall={() =>
          fetchMyBadgeData({ filterby: yearFilterValue?.filterby })
        }
        stopFetch={stopFetch}
      />
    </React.Fragment>
  );
};

export default MyBadge;

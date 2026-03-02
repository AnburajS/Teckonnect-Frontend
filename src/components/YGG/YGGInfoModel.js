import React, { useEffect, useState } from 'react';
import Modal from '../../modals/Model';
import { Row, Col } from 'react-bootstrap';
import { formatDates } from '../../constants/utills';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';

const YGGInfoModel = ({ isOpen, onClose, info }) => {
  const [usersPic, setUsersPic] = useState([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);
  const fetchAllUsers = async () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: 'get',
    };
    await httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response?.data?.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push({
              id: item.user_id,
              pic: item?.imageByte?.image,
              userName: item?.username,
            });
          }
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {});
  };
  let userPicIndex;
  const getUserPicture = (uID, userName) => {
    userPicIndex =
      usersPic.findIndex((x) => x.userName === userName) ||
      usersPic.findIndex((x) => x.id === uID);
    // userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + '/images/user_profile.png';
  };
  const color =
    info?.sync_status === 4
      ? '#FF686D'
      : info?.isAuto === 2
      ? '#CFCFCF'
      : '#19C573';
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="tc_design"
      header={false}
      isModelWidth={true}
      width="380px"
      isModelHeight={true}
      height="210px"
      padding={0}
      paddingBody={0}
      isPaddingBody={true}
    >
      <div
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* Top Green Section */}
        <div
          style={{
            backgroundColor: color,
            color: '#fff',
            padding: '16px',
          }}
        >
          <div className="d-flex justify-content-between  align-items-center">
            <div>
              <span
                style={{
                  backgroundColor: '#fff',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: color,
                }}
              >
                {info?.syncType}
              </span>
            </div>
            <div className="fs-9">
              Created at : {formatDates(info?.createdAt, true)}
            </div>
          </div>
          <div className="mt-2 text-align-center">
            <img
              src={
                info?.isAuto === 1
                  ? getUserPicture(info?.createdBy?.id)
                  : process.env.PUBLIC_URL + '/images/enlite.svg'
              }
              alt="logo"
              height={50}
              width={50}
              style={{ borderRadius: '50px', border: '2px solid transparent' }}
            />
            {info?.isAuto === 1 ? (
              <>
                <div className="mt-2 mb-1 fs-16">
                  {info?.createdBy?.fullName}
                </div>
                <p className="fs-12">{info?.createdBy?.department}</p>
              </>
            ) : (
              <>
                {' '}
                <div className="mt-2 mb-1 fs-16">EnliteU </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom White Section */}
        <div
          style={{
            backgroundColor: '#fff',
            padding: ' 30px 20px',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          {info?.sync_status === 4 ? (
            <>
              <div className="mt-2 mb-1 fs-16">Oops!</div>
              <p className="fs-12">Something went wrong. Brand was not Sync</p>
            </>
          ) : (
            <Row>
              <Col>
                <strong>
                  {info?.country} & {info?.currencyCode}
                </strong>
                <div style={{ fontSize: '12px', color: '#777' }}>
                  Country & Currency
                </div>
              </Col>
              <Col>
                <strong>{info?.totalBrands}</strong>
                <div style={{ fontSize: '12px', color: '#777' }}>
                  Total Brands
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default YGGInfoModel;

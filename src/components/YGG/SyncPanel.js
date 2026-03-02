import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import SyncData from './SyncData';
import SyncConfirmModle from './SyncConfirmModle';
import { useDispatch, useSelector } from 'react-redux';
import {
  brandSyncByCountry,
  getCountryMappingList,
  getSyncInfo,
} from '../../store/yggRedeemThunk';
import YGGInfoModel from './YGGInfoModel';
import { closeSyncInfoModal } from '../../store/yggRedeem-slice';
import ToolTip from '../../modals/ToolTip';

const SyncPanel = ({ datas }) => {
  const status = {
    1: '/images/icons/waiting.svg',
    3: '/images/icons/popup/success.svg',
    4: '/images/icons/popup/oops.svg',
    2: '/images/Process.svg',
  };

  const dispatch = useDispatch();
  const [isModelOpen, setModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data, error, loading } =
    useSelector((state) => state?.ygg?.brandSyncByCountry) || [];
  const info = useSelector((state) => state?.ygg?.getSyncInfo) || [];

  const handleSubmit = () => {
    setIsLoading(true);
    dispatch(
      brandSyncByCountry({
        code: datas?.code,
        ygg_country_id: datas?.id,
      })
    );
  };
  useEffect(() => {
    if (isLoading) {
      dispatch(getCountryMappingList());
    }
    setIsLoading(false);
  }, [isLoading]);
  const handelInfo = () => {
    console.log('handelInfo', datas?.sync_status);

    setIsLoading(true);
    dispatch(
      getSyncInfo({
        code: datas?.currencyCode,
      })
    );
  };
  return (
    <div
      className="p-4 bg-white sync-box mt-3 mb-4 mr-4"
      style={{ maxWidth: 320 }}
    >
      <YGGInfoModel
        isOpen={info?.modelOpen}
        info={info?.data?.data}
        isFailed={datas?.sync_status === 4 ? true : false}
        onClose={() => dispatch(closeSyncInfoModal())}
      />
      <SyncConfirmModle
        isOpen={isModelOpen}
        onClose={() => setModelOpen(false)}
        loading={status[datas?.sync_status] === 2 ? true : loading}
        onSubmit={handleSubmit}
      />
      <div
        className="d-flex justify-content-end "
        style={{ marginTop: '-20px' }}
      >
        {[1, 2].includes(datas?.sync_status) ? (
          <ToolTip
            title={
              datas?.sync_status === 2
                ? 'Sync is in progress, please wait until it completes.'
                : 'Sync is pending, yet to start the process.'
            }
            arrow
            placement="bottom-end"
            backgroundColor="#82889B"
            color="#FFFFFF"
            fontSize="12px"
          >
            <button
              type="button"
              className="close eep-error-close"
              style={{ fontSize: '25px' }}
              // onClick={() => setIsModalOpen(true)}
            >
              <span aria-hidden="true">
                <img
                  src={process.env.PUBLIC_URL + '/images/icons/Info.svg'}
                  alt="Info"
                  height={20}
                />
              </span>
            </button>
          </ToolTip>
        ) : (
          <button
            type="button"
            className="close eep-error-close"
            style={{ fontSize: '25px' }}
            // onClick={() => setIsModalOpen(true)}
          >
            <span aria-hidden="true">
              <img
                src={process.env.PUBLIC_URL + '/images/icons/Info.svg'}
                alt="Info"
                height={20}
                title="Info"
                onClick={handelInfo}
              />
            </span>
          </button>
        )}
      </div>

      <div className="text-center mb-3">
        <img
          // src={process.env.PUBLIC_URL + '/images/Process.svg'}
          src={process.env.PUBLIC_URL + status[datas?.sync_status]}
          alt="Process"
          height={35}
          title="Sync"
        />
      </div>

      <Form>
        <SyncData
          name={'Country'}
          value={datas?.name}
        />
        <SyncData
          name={'Currency'}
          value={datas?.currencyCode}
        />

        <SyncData
          name={'Branch'}
          value={datas?.ygg_branches}
          badge={true}
        />

        <div className="text-center">
          <Button
            variant="warning"
            className="w-100 d-flex align-items-center justify-content-center sync-button"
            onClick={() => setModelOpen(true)}
            disabled={status[datas?.sync_status] === 2}
          >
            <img
              src={process.env.PUBLIC_URL + '/images/ProcessWhite.svg'}
              alt="Process"
              height={20}
              title="Sync"
              className="mr-1"
            />
            Sync Now
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SyncPanel;

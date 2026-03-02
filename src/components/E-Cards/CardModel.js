import React, { useEffect, useState } from 'react';
import Modal from '../../modals/Model';
import ModelCard from './ModelCard';

const CardModel = ({ data, isOpen, onClose, title, usersPic }) => {
  const findUser = (data1) => {
    return usersPic?.find((datas) => datas?.id === data1);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      modalWidth="w-75"
      className="tc_design"
    >
      <div className=" gride_view py-2 px-3">
        <div className="card-containers">
          {data?.map((item) => {
            return (
              <ModelCard
                type={item?.status === 'SUCCESS' ? false : true}
                image={JSON.parse(item?.card_info)?.card_file_name}
                user_image={
                  findUser(JSON.parse(item?.card_info)?.to_user_id)?.pic
                }
                message={JSON.parse(item?.card_info)?.message}
                error={item?.error_info}
                userName={JSON.parse(item?.card_info)?.userName}
                title={title}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default CardModel;

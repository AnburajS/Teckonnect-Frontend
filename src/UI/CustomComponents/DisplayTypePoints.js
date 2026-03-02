import React from 'react';

const DisplayTypePoints = (props) => {
  const { data, cSettings } = props;
  return (
    <React.Fragment>
      <div>
        <span>
          {
            // cSettings?.typeArr?.[
            //   cSettings?.typeArr.findIndex(
            //     (x) => x.type === data?.[cSettings?.objReference]
            //   )
            // ]?.textDisplay

            cSettings?.typeArr?.find(
              (data1) => Number(data1?.type) === Number(data?.type)
            )?.textDisplay
          }
        </span>
      </div>
    </React.Fragment>
  );
};

export default DisplayTypePoints;

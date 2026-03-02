
import React, { useEffect, useState } from "react";

const CheckBoxComponent = (props) => {

  const { data, getCheckedData, bulkCheckState ,totalCheckBoxSx={}} = props;

  const [bulkCheck, setBulkCheck] = useState(false);

  const clickHandler = (evnt, data) => {
    getCheckedData && getCheckedData(evnt.target.checked, data);
  }

  useEffect(() => {
    if (bulkCheckState) {
      setBulkCheck(true);
    } else {
      setBulkCheck(false);
    }
  }, [bulkCheckState]);

  return (
    <React.Fragment>
      <div className="chek_box" style={{...totalCheckBoxSx}}>
        {!bulkCheck &&
          <input type="checkbox" className="field-wbr" name="hastagName" autoComplete="off" onChange={(e) => clickHandler(e, data)} />
        }
        {bulkCheck &&
          <input type="checkbox" className="field-wbr" name="hastagName" autoComplete="off" checked={bulkCheck} onChange={(e) => clickHandler(e, data)} />
        }
      </div>
    </React.Fragment>
  );
};
export default CheckBoxComponent;


import React from 'react'
import IndividualData from './IndividualData'

const Data = (props) => {

  const { excelData } = props;

  return excelData.rows.map((item, index) => (
    <tr key={index}>
      <IndividualData individualExcelData={{ item: item }} />
    </tr>
  ));

};

export default Data;
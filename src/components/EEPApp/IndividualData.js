import React from 'react';
import { eepFormatDateTime } from "../../shared/SharedService";

const IndividualData = (props) => {

  const { individualExcelData } = props;
  

  return (
    <React.Fragment>
      <th>{individualExcelData.item.username}</th>
      <th>{individualExcelData.item.firstname}</th>
      <th>{individualExcelData.item.lastname}</th>
      <th>{individualExcelData.item.email}</th>
      <th>{eepFormatDateTime(individualExcelData.item.doj)}</th>
      <th>{eepFormatDateTime(individualExcelData.item.dob)}</th>
      <th>{individualExcelData.item.designation}</th>
      <th>{individualExcelData.item.telephone_number}</th>
      <th>{individualExcelData.item.active}</th>
      <th>{individualExcelData.item.country_code}</th>
      <th>{individualExcelData.item.dept}</th>
      <th>{individualExcelData.item.role}</th>
      <th>{individualExcelData.item.password}</th>
    </React.Fragment>
  )
};

export default IndividualData;
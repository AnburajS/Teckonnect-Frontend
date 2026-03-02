import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import readXlsxFile from 'read-excel-file';
import PageHeader from "../../UI/PageHeader";
import Data from "./Data";
import { httpHandler } from "../../http/http-interceptor";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { URL_CONFIG } from "../../constants/rest-config";
import { REST_CONFIG } from "../../constants/rest-config";

const EEPApp = () => {

  const [fileData, setFileData] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [error, setError] = useState("");
  const [excelFile, setExcelFile] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const schema = {

    "username": {
      prop: `username`,
      type: String
    },
    "firstname": {
      prop: `firstname`,
      type: String
    },
    "lastname": {
      prop: `lastname`,
      type: String
    },
    "email": {
      prop: `email`,
      type: String
    },
    'doj': {
      prop: 'doj',
      type: Date
    },
    'dob': {
      prop: 'dob',
      type: Date
    },
    "designation": {
      prop: `designation`,
      type: String
    },
    "telephone number": {
      prop: `telephone_number`,
      type: Number
    },
    "active": {
      prop: `active`,
      type: Number
    },
    "country code": {
      prop: `country_code`,
      type: Number
    },
    "dept": {
      prop: `dept`,
      type: Number
    },
    "role": {
      prop: `role`,
      type: Number
    },
    "isdefault": {
      prop: `isdefault`,
      type: Number
    },
    "password": {
      prop: `password`,
      type: String
    },
  }

  const clickFile = () => {
    document.getElementById("attachmentFileLoader").value = null;
    document.getElementById("attachmentFileLoader").click();
    setError("");
  }

  const validImageTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  const addFile = (event) => {
    var file = event.target.files[0];
    var fileType = file["type"];
    if (validImageTypes.includes(fileType)) {
      setExcelData(null);
      // var tempFileName = file.name;
      // tempFileName = tempFileName.replace(/\s/g, "");
      var reader = new FileReader();
      setExcelFile(event.target.files[0]);
      reader.readAsArrayBuffer(file);
      reader.onload = function () {
        setFileData(reader.result);
      };
    } else {
      setError("Please select an Excel file (.xlsx) to upload");
    }
  }

  const uploadFile = () => {
    setError("");
    if (!fileData) {
      setError("Please select an Excel file (.xlsx) to upload");
      return;
    }
    readXlsxFile(fileData, { schema }).then((arryData) => {
      setExcelData(arryData);
    });
  }

  const submitHandler = () => {
    if (excelFile) {
      let formData = new FormData();
      formData.append('file', excelFile);
      const obj = {
        url: URL_CONFIG.IMPORT_USERS,
        method: "post",
        formData: formData,
      };

      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }

      const finalAPIUrl = `${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}:${REST_CONFIG.PORT}/${REST_CONFIG.RESTAPPNAME}${URL_CONFIG.IMPORT_USERS}`;
      axios.post(finalAPIUrl, formData, config)
        .then(response => {
          setShowModal({
            ...showModal,
            type: "success",
            message: response?.data?.message,
          });
          setFileData(null);
          setExcelData(null);
          setExcelFile([]);
        })
        .catch(error => {
          const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
          setShowModal({
            ...showModal,
            type: "danger",
            message: errMsg,
          });
        });

    } else {
      setFileData(null);
      setExcelData(null);
      setExcelFile([]);
      setError("Oops! Some error occured. Please try again.");
    }
  }

  return (
    <React.Fragment>

      <PageHeader title="User Bulk Upload" />

      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <Link to="#" type="button" className="eep-btn eep-btn-xsml eep-btn-success" onClick={hideModal}> Ok </Link>
          }
          errorFooterData={
            <button type="button" className="eep-btn eep-btn-xsml eep-btn-danger" data-dismiss="modal" onClick={hideModal}>Close</button>
          }
        ></EEPSubmitModal>
      )}

      <div className="row justify-content-center">
        <div className="col-5 p-5">
          <div className="bg-f5f5f5 br-15 p-5 h-100">
            <div className="attachments_list_a text-center">
              <Link to={process.env.PUBLIC_URL + `/data/SampleUsers.xlsx`} target="_thapa" download="Users">
                <img src={process.env.PUBLIC_URL + `/images/icons/special/xlsx.svg`} width="64px" height="74px" className="image-circle c1" alt="excel-icon" />
              </Link>
            </div>
            <div className="attachments_list_a text-center mt-3">
              <Link to="" className="a_hover_txt_deco_none c-2c2c2c">Sample file</Link>
            </div>
          </div>
        </div>

        <div className="col-5 p-5">
          <div className="bg-f5f5f5 br-15 p-5 w-100 h-100">
            <div className="attachments_list_a text-center mb-3">
              {!fileData &&
                <img src={process.env.PUBLIC_URL + `/images/icons/special/attachment-add.svg`} className="image-circle c1 h-100 attachments_add" alt="excel-icon" onClick={clickFile} />
              }
              {fileData &&
                <img src={process.env.PUBLIC_URL + `/images/icons/special/xlsx.svg`} className="image-circle c1 h-100 attachments_add" width="64px" height="74px" alt="excel-icon" onClick={clickFile} />
              }
              <input type="file" className="d-none attachmentFileLoader" id="attachmentFileLoader" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" name="file" title="Load File" onChange={(e) => addFile(e)} />
            </div>
            <div className="uploadaction_div text-center">
              <div type="submit" className="eep-btn eep-btn-success" onClick={uploadFile}>Upload file</div>
              {error !== "" &&
                <p className="fileerror" style={{ color: "red", margin: "10px 0" }}>{error}</p>
              }
            </div>
          </div>
        </div>

      </div>

      {excelData &&
        <React.Fragment>
          <div className="row">
            <div className="col-12">
              <div className='table-responsive eep_scroll_y' style={{ maxHeight: "250px" }}>
                <table className='table'>
                  <thead className="c-2c2c2c">
                    <tr>
                      <th scope='col'>User Name</th>
                      <th scope='col'>First Name</th>
                      <th scope='col'>Last Name</th>
                      <th scope='col'>E-mail</th>
                      <th scope='col'>DOJ</th>
                      <th scope='col'>DOB</th>
                      <th scope='col'>designation</th>
                      <th scope='col'>telephone_number</th>
                      <th scope='col'>active</th>
                      <th scope='col'>country_code</th>
                      <th scope='col'>dept</th>
                      <th scope='col'>role</th>
                      <th scope='col'>password</th>
                    </tr>
                  </thead>
                  <tbody className="c-2c2c2c font-helvetica-t">
                    <Data excelData={excelData} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <button className="eep-btn eep-btn-success" onClick={submitHandler}>Import Users</button>
          </div>

        </React.Fragment>
      }

    </React.Fragment>
  );
};

export default EEPApp;
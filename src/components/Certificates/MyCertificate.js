import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../UI/PageHeader';
import ResponseInfo from '../../UI/ResponseInfo';
import YearFilter from '../../UI/YearFilter';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';
import CertificatePreviewModal from '../../modals/CertificatePreviewModal';
import jsPDF from 'jspdf';
import { pageLoaderHandler } from '../../helpers';
import Isloading from '../../UI/CustomComponents/Isloading';
import InViewScrol from '../../UI/InViewScrol';

const MyCertificate = () => {
  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [myCertificateData, setMyCertificateData] = useState([]);
  const [myCertificateModalShow, setMyCertificateModalShow] = useState(false);
  const [previewDataUri, setPreviewDataUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stopFetch, setStopFetch] = useState(false);
  const [offset, setOffset] = useState(1);
  const [direction] = useState('desc');
  const [limit] = useState(9);

  const fetchMyCertificateData = (paramData = {}, customOffset = offset) => {
    setIsLoading(true);
    const paramsTemp = {
      limit: limit,
      offset: customOffset,
      direction: direction,
      ...paramData,
    };

    const obj = {
      url: URL_CONFIG.MY_CERTIFICATES,
      method: 'get',
      params: paramsTemp,
    };

    httpHandler(obj)
      .then((cData) => {
        const dataTemp =
          customOffset === 1
            ? [...cData?.data]
            : [...myCertificateData, ...cData?.data];
        setMyCertificateData(dataTemp);
        setOffset(customOffset + 1);
        setStopFetch(cData.data?.length < limit ? true : false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log('fetchMyCertificateData error', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMyCertificateData(yearFilterValue);
    pageLoaderHandler(isLoading ? 'show' : 'hide');
  }, []);

  const onFilterChange = (filterValue) => {
    setYearFilterValue({ filterby: filterValue.value });
    fetchMyCertificateData({ filterby: filterValue.value });
  };

  // const certPreviewModalHandler = (arg) => {
  //   setMyCertificateModalShow(true);
  //   let obj = {
  //     isIframe: false,
  //     dataSrc: arg,
  //   };
  //   setPreviewDataUri(obj);
  // };
  const certPreviewModalHandler = (data) => {
    // pick correct src
    let previewSrc = null;

    if (data?.imageByte?.image) {
      previewSrc = data.imageByte.image; // base64 or url for image
    } else if (data?.pdfByte?.image) {
      previewSrc = data.pdfByte.image; // base64 or url for pdf
    }

    // fallback if no valid src
    if (!previewSrc) {
      console.error('No valid preview source found for certificate.');
      return;
    }

    // send correct values only
    setPreviewDataUri({
      isIframe: previewSrc?.toLowerCase().endsWith('.pdf'),
      dataSrc: previewSrc,
    });

    // open modal
    setMyCertificateModalShow(true);
  };

  const handleDownload = (data) => {
    const imageUrl = data?.imageByte?.image
      ? data?.imageByte?.image
      : data?.pdfByte?.image; // Assuming the image URL is here
    if (imageUrl) {
      if (data?.imageByte?.image) {
        const img = new Image();
        img.src = imageUrl;

        // Ensure the image is loaded before generating the PDF
        img.onload = () => {
          // Create a new jsPDF instance
          const doc = new jsPDF();

          // Add the image to the PDF (you can adjust position and size)
          doc.addImage(img, 'PNG', 10, 10, 180, 160); // x, y, width, height

          // Save the generated PDF with the certificate name as the filename
          const fileName = `${data?.certificate?.name || 'certificate'}.pdf`;
          doc.save(fileName);
        };
        img.onerror = () => {
          console.error('Error loading the image from URL.');
        };
      } else {
        if (isValidPdfUrl(imageUrl)) {
          // Download the PDF directly
          const link = document.createElement('a');
          link.href = imageUrl;

          link.download = `${data?.certificate?.name || 'document'}.pdf`; // Set the filename
          link.click();
        } else {
          console.error('Invalid PDF URL.');
        }
      }

      // Handle image loading errors
    } else {
      console.error('No image URL available.');
    }
  };
  const isValidPdfUrl = (url) => {
    const pdfPattern = /\.pdf$/i;
    return pdfPattern.test(url); // Simple check for ".pdf" extension
  };
  return (
    <React.Fragment>
      <PageHeader
        title="My Certificates"
        filter={<YearFilter onFilterChange={onFilterChange} />}
      />
      {myCertificateModalShow && (
        <CertificatePreviewModal previewDataUri={previewDataUri} />
      )}
      {isLoading ? (
        <Isloading />
      ) : (
        <div
          className={`${
            myCertificateData.length <= 0 ? 'h-100 ' : 'mt-4'
          } row eep-content-start eep-myCertificate-div`}
          id="content-start"
        >
          {myCertificateData &&
            myCertificateData.length > 0 &&
            myCertificateData.map((data, index) => (
              <div
                className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-center cert_col_div"
                key={'myCertificate_' + index}
              >
                <div className="mycert_list_div mycert_modal_a box9">
                  <div className="mycert_assign_div">
                    <div className="outter">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/certificates/certificateThumbnail.svg`}
                        className="mycert_img"
                        alt="Certificate"
                        loading="lazy"
                        title={data.imageByte?.name}
                      />
                      {/* <img src={data.imageByte ? data.imageByte.image : `${process.env.PUBLIC_URL}/images/certificates/certificate-default.png`} className="mycert_img" alt="Certificate" title={data.imageByte?.name} /> */}
                      {/* <embed src={data.pdfByte ? data.pdfByte.image : `${process.env.PUBLIC_URL}/images/certificates/certificate-default.png`} type="application/pdf" className="mycert_img" alt="Certificate" title={data.imageByte?.name} width="100%" height="auto" style={{ overflow: "hidden !imporatnt", maxWidth: "100%" }} /> */}
                    </div>
                  </div>
                  <div className="box-content">
                    <h3 className="title">
                      {data?.certificate_name ? data?.certificate_name : ''}
                      {/* {data?.certificate ? data?.certificate?.name : ''} */}
                    </h3>
                    <ul className="icon">
                      {/* <li>
                      <a
                        className="mycert_modal_a fa fa-share-alt c1"
                        onClick={() => certPreviewModalHandler(data)}
                        data-toggle="modal"
                        data-target="#certPreviewModal"
                      ></a>
                    </li> */}
                      <li>
                        <a
                          className="mycert_modal_a c1"
                          onClick={() => certPreviewModalHandler(data)}
                          data-toggle="modal"
                          data-target="#certPreviewModal"
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/icons/static/View.svg`}
                            className="mycert_icons"
                            alt="Preview Certificate"
                            title="Preview Certificate"
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          className="mycert_modal_a c1 "
                          onClick={() => handleDownload(data)}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/icons/static/Download.svg`}
                            className="mycert_icons"
                            alt="Download Certificate"
                            title="Download Certificate"
                          />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <i class=" "></i>
                </div>
              </div>
            ))}
          {myCertificateData && myCertificateData.length <= 0 && (
            <ResponseInfo
              title="No certificates found!"
              responseImg="noRecord"
              responseClass="response-info"
            />
          )}
        </div>
      )}
      <InViewScrol
        apiCall={() =>
          fetchMyCertificateData({ filterby: yearFilterValue?.filterby })
        }
        stopFetch={stopFetch}
      />
    </React.Fragment>
  );
};
export default MyCertificate;

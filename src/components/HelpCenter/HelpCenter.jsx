import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Accordion,
  Button,
  Form,
} from 'react-bootstrap';
import ProductFlow from '../../layout/Header/ProductFlow';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';
import { useDispatch } from 'react-redux';

const HelpCenter = () => {
  const dispatch = useDispatch();

  const [activeKey, setActiveKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accordion, setAccordion] = useState();
  const fetchCertificateLibraryData = async (arg) => {
    await fetch(`${process.env.PUBLIC_URL}/data/helpCenter.json`)
      .then((response) => response.json())
      .then((data) => {
        setAccordion(data);
      });
  };
  useEffect(() => {
    fetchCertificateLibraryData();
  }, []);
  // const accordion = `${process.env.PUBLIC_URL}/data/helpCenter.json`;
  const filteredAccordion = accordion
    ?.map((section) => {
      const filteredItems = section.accordions.filter(
        (item) => item.header.toLowerCase().includes(searchTerm.toLowerCase())
        // ||
        //   item.body.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredItems.length > 0) {
        return { ...section, accordions: filteredItems };
      }

      return null;
    })
    .filter(Boolean); // remove nulls
  const highlightText = (text, highlight) => {
    if (!highlight) return text;

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const breadcrumbArr = [
    {
      label: 'Home',
      link: 'app/dashboard',
    },
    {
      label: 'Help',
      link: '',
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: 'Help',
      })
    );
  }, [breadcrumbArr, dispatch]);
  return (
    <>
      <Container className="py-4">
        <Row className="d-flex justify-content-center">
          <Col
            md={9}
            className=""
          >
            <Row className="mb-3 header-help py-4">
              {' '}
              <Col xs={5}>
                <div className={`fs-14  mb-3  d-flex color-2c2c2c `}>
                  Welcome to EnliteU Support
                </div>
                <div className={`fs-25 fw-600  `}>
                  Look For Help? Here our most frequently asked question.{' '}
                </div>
              </Col>
              <Col
                xs={7}
                className="d-flex justify-content-end align-items-end"
              >
                <div className="search-head">
                  <div className="search-bar mt-1 justify-items-end">
                    <div className={`fs-14  mb-1 d-flex color-a0a0a0 `}>
                      How can I help you?
                    </div>
                    <div className="input-group">
                      <span className="input-group-text-search">
                        <i class="fas fa-search"></i>
                        {/* This is the search icon */}
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <button>
                  {' '}
                  <i class="fas fa-search"></i> Search
                </button> */}
                </div>
              </Col>
            </Row>

            <div className="my-5">
              {/* <div className={`fs-20 fw-600 my-5 text-align-center `}>
                Showing Frequently Asked Questions
              </div> */}
              <div className="mt-5">
                {filteredAccordion?.map((data, index) => (
                  <div className="mt-5">
                    <div
                      className={`fs-18 fw-600 mb-3 ${
                        index === 0 ? '' : 'mt-4 '
                      }`}
                    >
                      {highlightText(data?.title, searchTerm)}
                    </div>
                    {data?.accordions?.map((item, i) => (
                      <>
                        <Accordion
                          className="accordion-main"
                          activeKey={activeKey}
                          onSelect={(key) => setActiveKey(key)}
                        >
                          <Accordion.Item
                            eventKey={`${index}-${i}`} // Combine index and i to create a unique eventKey
                            key={`${index}-${i}`} // Use a unique key for each Accordion.Item
                          >
                            <Accordion.Header
                              className={
                                activeKey === `${index}-${i}`
                                  ? 'active-accord'
                                  : 'inactive-accord'
                              }
                            >
                              <span className="d-flex align-items-center justify-content-between w-100">
                                <span>
                                  {highlightText(item?.header, searchTerm)}
                                </span>
                                <i
                                  className={`fas fa-chevron-${
                                    activeKey === `${index}-${i}`
                                      ? 'up'
                                      : 'down'
                                  } fs-14`}
                                ></i>
                              </span>
                              {/* {highlightText(item?.header, searchTerm)}

                          <i
                            className={`fas fa-chevron-${
                              activeKey === `${index}-${i}` ? 'up' : 'down'
                            } fs-14`}
                          ></i> */}
                            </Accordion.Header>
                            <Accordion.Body>
                              {highlightText(item?.body, searchTerm)}
                              <ul className="mt-1">
                                {item?.subBody
                                  ?.split(',')
                                  .map((part, index) => (
                                    <li key={index}>
                                      {highlightText(part.trim(), searchTerm)}
                                    </li>
                                  ))}
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="my-3">
              <div className={`fs-18 fw-600 my-5  `}>
                "Explore Our Product Video Tour"
              </div>
              <ProductFlow />
            </div>

            <Row className="buttom-section py-4">
              <Col xs={12}>
                <div className="text-center mb-4">
                  <div className={`fs-18 fw-600  `}>
                    Couldn't find the answer you were looking for?
                  </div>
                </div>
              </Col>
              <Col
                md={5}
                // className="mb-3"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <div className="fs-14 fw-600">
                      <img
                        src={process.env.PUBLIC_URL + '/images/mail.svg'}
                        className="image-circle mr-2"
                        alt="Mail"
                      />
                      Get help with Email
                    </div>
                    <p className="text-muted fs-14 my-3">
                      Send an email to and we will get back to you soon as we
                      can.
                    </p>
                    <div className="search-buttom">
                      <a href="mailto:support@enliteu.com">
                        <button>Send Mail</button>
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col
                md={5}
                // className="mb-3"
              >
                <Card style={{ height: '100%' }}>
                  <Card.Body>
                    <div className="fs-14 fw-600">
                      <img
                        src={process.env.PUBLIC_URL + '/images/call.svg'}
                        className="image-circle mr-2"
                        alt="Call"
                      />
                      Give call to us
                    </div>
                    <p className="text-muted my-3 fs-14">
                      Give us a call and we will get back to you soon as we can
                    </p>
                    {/* <div className="fs-14 fw-600 mt-2">+61-4550-779-345</div> */}
                    <a href="tel:+614550779345" className="fs-14 fw-600 mt-2 c-2c2c2c">+61-4550-779-345</a>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HelpCenter;

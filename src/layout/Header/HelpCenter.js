import React, { useEffect, useState } from 'react';
import HelpCenterSidebar from './HelpCenterSidebar';
import { Accordion, Col, Container, Form, Row } from 'react-bootstrap';
import Help from './Help';
import ProductFlow from './ProductFlow';
import { useDispatch } from 'react-redux';
import { BreadCrumbActions } from '../../store/breadcrumb-slice';

function HelpCenter() {
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState(null);
  const [activeMenu, setActiveMenu] = useState(0);

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
  const helpMenu = {
    infoItems: [
      {
        title: 'FAQs',
        description: 'Get quick answer to your question from enliteu.',
        active: true,
      },
      {
        title: 'Product Flow',
        description: 'Get quick work flow to your question from enliteu.',
        active: false,
      },
      {
        title: 'Help Tour',
        description: 'Get quick work flow to your question from enliteu.',
        active: false,
      },
    ],
  };

  const accordion = [
    {
      title: 'Recognize',
      accordions: [
        // {
        //   header: 'Accordion Item #1',
        //   body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        // },
        {
          header: 'What is the "Recognize" module, and how does it work?',
          body: 'Explanation about how the "Recognize" module works.',
        },
        {
          header: 'Can I customize recognition categories or rewards?',
          body: 'Details about customizing recognition.',
        },
      ],
    },

    {
      title: 'EnliteU Wall',
      accordions: [
        {
          header: 'What is the purpose of the "EnliteU Wall"?',
          body: 'Explanation about the EnliteU Wall purpose.',
        },
        {
          header: 'Can I control what gets posted on the EnliteU Wall?',
          body: 'Details about controlling posts on the EnliteU Wall.',
        },
        {
          header: 'How can employees interact with posts on the EnliteU Wall?',
          body: 'Information about post interactions.',
        },
      ],
    },
  ];

  return (
    <Row className=" eep-content-section-data">
      {/* <div className="main-section "> */}
      <Col
        md={3}
        className=" position_sticky"
      >
        <div className="left-section">
          <HelpCenterSidebar
            data={helpMenu}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        </div>
      </Col>

      <Col
        md={activeMenu === 2 ? 9 : 6}
        className="titel-div-main "
      >
        {activeMenu === 2 ? (
          <Help />
        ) : (
          <Row className="titel-div-sub eep-content-section eep_scroll_y bg-f8f8f8">
            <Col
              md={12}
              // className="titel-div-sub "
            >
              {activeMenu === 1 ? (
                <ProductFlow />
              ) : (
                <>
                  <div className="fs-24 fw-700  mb-4">
                    Frequently Asked Questions?
                  </div>

                  {accordion?.map((data, index) => (
                    <>
                      <div
                        className={`fs-18 fw-700 mb-3 ${
                          index === 0 ? '' : 'mt-4 '
                        }`}
                      >
                        {data?.title}
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
                                {item?.header}{' '}
                                {/* <i class="fas fa-chevron-down fs-14"></i> */}
                                <i
                                  className={`fas fa-chevron-${
                                    activeKey === `${index}-${i}`
                                      ? 'up'
                                      : 'down'
                                  } fs-14`}
                                ></i>
                              </Accordion.Header>
                              <Accordion.Body>{item?.body}</Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </>
                      ))}
                    </>
                  ))}
                </>
              )}
            </Col>
          </Row>
        )}

        {/* Help Section */}
      </Col>

      <Col
        md={3}
        className={' pl-0'}
      >
        <div
          className={
            activeMenu === 2
              ? 'd-none'
              : 'd-flex flex-column justify-content-between position_sticky bg-f8f8f8 titel-div-search'
          }
        >
          <div className="search-bar mt-4">
            <div className="input-group">
              <span className="input-group-text-search">
                <i class="fas fa-search"></i>
                {/* This is the search icon */}
              </span>
              <Form.Control
                type="text"
                placeholder="Search your questions"
              />
            </div>
          </div>
          <div className="help-section mb-5">
            <div className="fw-700 fs-12 mb-3">
              Couldn't find the answer you were looking for?
            </div>
            <div className="fs-12 mb-3 color-a0a0a0">
              Send us an email and we will get back to you soon as we can.
            </div>
            <button>Send Email</button>
          </div>
        </div>
      </Col>
      {/* </div> */}
    </Row>
  );
}

export default HelpCenter;

import React from 'react';
import { Form, Button, Badge, Row, Col } from 'react-bootstrap';
// import { FaSyncAlt, FaInfoCircle } from 'react-icons/fa';

const SyncData = ({ name, value, badge }) => {
  return (
    <Row className="mb-3 align-items-baseline">
      <Col xs={3}>
        <Form.Label>{name}</Form.Label>
      </Col>
      <Col xs={9}>
        {badge ? (
          <div className="bg-light rounded p-2">
            {value?.map((data) => (
              <Badge
                pill
                bg="light"
                text="dark"
                className="p-1 px-2 m-1 border"
              >
                {data?.branch_name}
              </Badge>
            ))}
          </div>
        ) : (
          <Form.Control type="text" value={value} readOnly />
        )}
      </Col>
    </Row>
  );
};

export default SyncData;

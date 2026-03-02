import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import YouTube from 'react-youtube';

const ProductFlow = () => {
  const opts = {
    height: '150',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // Optional: Disable autoplay
      rel: 0, // Disable related videos
    },
  };
  return (
    <div>
      {/* <h2 className="mb-4">Product Flow</h2> */}
      <Row>
        {/* {Array.from({ length: 9 }).map((_, index) => ( */}
        <Col
          // key={index}
          xs={12}
          sm={6}
          md={4}
          className="mb-4"
        >
          <YouTube
            videoId="89PBRpwUAdQ" // Replace with your video ID
            opts={opts}
          />
        </Col>
        <Col
          // key={index}
          xs={12}
          sm={6}
          md={4}
          className="mb-4"
        >
          <YouTube
            videoId="bGxZB9kaWu8" // Replace with your video ID
            opts={opts}
          />
        </Col>
        <Col
          // key={index}
          xs={12}
          sm={6}
          md={4}
          className="mb-4"
        >
          <YouTube
            videoId="PdIR9XUy4FU" // Replace with your video ID
            opts={opts}
          />
        </Col>{' '}
        {/* <Col
          // key={index}
          xs={12}
          sm={6}
          md={4}
          className="mb-4"
        >
          <YouTube
            videoId="AV4duQGEIhw" // Replace with your video ID
            opts={opts}
          />
        </Col> */}
        {/* // ))} */}
      </Row>
    </div>
  );
};

export default ProductFlow;

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

function InViewScrol({ apiCall, stopFetch }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    console.log('inView && !stopFetch', inView && !stopFetch);
    if (inView && !stopFetch) {
      console.log('🟢 Triggering API from InViewScrol');
      apiCall();
    } else {
      console.log('🔴 Skipping fetch: stopFetch =', stopFetch);
    }
  }, [inView, stopFetch]);

  return (
    <div
      ref={ref}
      style={{ height: '20px' }}
    />
  );
}

export default InViewScrol;

import React from 'react';
import Loader from 'react-loader-spinner';
function MyLoader({ right }) {
  return (
    <Loader
      type="Puff"
      color="#00BFFF"
      height={50}
      width={50}
      style={{ position: 'fixed', right: right && 0 }}
    />
  );
}

export default MyLoader;

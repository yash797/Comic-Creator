// src/components/DownloadButton.js
import React from 'react';

const DownloadButton = ({ onClick }) => {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6 inline-block mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Download
    </button>
  );
};

export default DownloadButton;

// src/components/ComicPanel.js
import React from "react";

const ComicPanel = ({ images }) => {
  const convertToBlob = (data) => {
    const uint8Array = new Uint8Array(data);

    return new Blob([uint8Array], { type: "image/png" });
  };

  return (
    <div className="flex flex-wrap justify-center">
      {images.map((imageData, index) => {
        console.log(imageData); // Add this line for logging
        return (
          <div key={index} className="m-4">
            <img
              src={URL.createObjectURL(convertToBlob(imageData))}
              alt={`Panel ${index + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ComicPanel;

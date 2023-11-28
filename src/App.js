// src/App.js
import React, { useState, useEffect } from "react";
import ComicForm from "./components/ComicForm";
import ComicPanel from "./components/ComicPanel";
import ErrorComponent from "./components/ErrorComponent";
import Spinner from "./components/Spinner";
import DownloadButton from "./components/DownloadButton";
import axios from "axios";

const API_URL =
  "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud";

const App = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateComic = async (texts) => {
    try {
      setIsLoading(true);
      const imageResponses = await Promise.all(
        texts.map(async (text) => {
          const response = await axios.post(
            API_URL,
            { inputs: text },
            {
              headers: {
                Accept: "image/png",
                Authorization:
                  "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", // Replace with your actual API key
                "Content-Type": "application/json",
              },
              responseType: "arraybuffer",
            }
          );
          return response.data;
        })
      );
      setImages(imageResponses);
      setError(null);
    } catch (err) {
      setError("Error generating comic. Please try again.");
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImages = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      console.error("Unable to get 2D context for canvas");
      return;
    }

    const p = 5; // padding
    const colm = 2;
    const rows = Math.ceil(images.length / colm);
    canvas.width = colm * 256 + (colm - 1) * p; // Adjusted padding to create a grid
    canvas.height = rows * 256 + (rows - 1) * p; // Adjusted padding to create a grid

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const imagePromises = images.map((blob) => {
        if (!blob) {
          console.error("Invalid blob:", blob);
          return Promise.reject("Invalid blob");
        }

        return (
          new Promise() <
          HTMLImageElement >
          ((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              resolve(img);
            };
            img.onerror = (error) => {
              console.error("Error loading image:", error);
              reject(error);
            };
            img.src = URL.createObjectURL(new Blob([blob]));
          })
        );
      });

      const loadedImages = await Promise.allSettled(imagePromises);

      const validImages = loadedImages
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      validImages.forEach((img, i) => {
        const x = (i % colm) * (256 + p);
        const y = Math.floor(i / colm) * (256 + p);
        context.drawImage(img, x, y, 256, 256);
      });

      // Trigger download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "comic_grid.png";
      link.click();
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  useEffect(() => {
    // Reset loading state when images change
    setIsLoading(false);
  }, [images]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Comic Creator</h1>
      <ComicForm onSubmit={generateComic} />
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorComponent message={error} />
      ) : (
        images.length > 0 && (
          <>
            <ComicPanel images={images} />
            {/* <DownloadButton onClick={downloadImages} /> */}
          </>
        )
      )}
    </div>
  );
};

export default App;

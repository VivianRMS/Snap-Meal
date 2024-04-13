import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from "../helpers/imageHelper";

const AiwithImage = () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAJcTSS_Ru7jk7dl03P-4e3ZVaG28bnNms"
  );

  const [image, setImage] = useState("");
  const [imageInineData, setImageInlineData] = useState("");
  const [aiResponse, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Generative AI Call to fetch image insights
   */
  async function aiImageRun() {
    setLoading(true);
    setResponse("");
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([
      "What food are in the picture? Return a dictionary with the food name as the key, 'purchaseDate' and 'expirationDate' as values. The purchaseDate will be the current date of the picture being uploaded, for exmaple today is April 13 2024, and the expiration date will be the general expiration date of the food. For example, red peppers are in the graph, the purchase date will be April 13, 2024 and the general expiration date of red peppers is about 7 days, so the expiration date of it will be April 20,2024",
      imageInineData,
    ]);
    const response = await result.response;
    const text = response.text();
    setResponse(text);
    setLoading(false);
  }

  const handleClick = () => {
    aiImageRun();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // getting base64 from file to render in DOM
    getBase64(file)
      .then((result) => {
        setImage(result);
      })
      .catch((e) => console.log(e));

    // generating content model for Gemini Google AI
    fileToGenerativePart(file).then((image) => {
      setImageInlineData(image);
    });
  };

  // Converts a File object to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  return (
    <div>
      <div>
        <div style={{ display: "flex" }}>
          <input type="file" onChange={(e) => handleImageChange(e)} />
          <button style={{ marginLeft: "20px" }} onClick={() => handleClick()}>
            Search
          </button>
        </div>
        <img src={image} style={{ width: "30%", marginTop: 30 }} />
      </div>

      {loading == true && aiResponse == "" ? (
        <p style={{ margin: "30px 0" }}>Loading ...</p>
      ) : (
        <div style={{ margin: "30px 0" }}>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AiwithImage;

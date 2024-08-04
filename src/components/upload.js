import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from "../helpers/imageHelper";

const AiwithImage = ({ start_id, setfoods }) => {
  const genAI = new GoogleGenerativeAI(
    "place_your_own"
  );

  const [image, setImage] = useState("");
  const [imageInineData, setImageInlineData] = useState("");
  const [aiResponse, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // const start_id = foods.length;
  // console.log(start_id);

  /**
   * Generative AI Call to fetch image insights
   */
  async function aiImageRun() {
    setLoading(true);
    setResponse("");
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([
      `What food are in the picture? Only return a JSON array with 'id' incrementing from ${start_id} (for example, if start_id is 3, then the first id will be 4), 'name' (name of each food), 'count' (count of each food), 'purchaseDate' and 'expirationDate' as values. The purchaseDate will be the current date of the picture being uploaded in the formate of year-month-day, for exmaple today is 2024-04-13, and the expiration date will be the general expiration date of the food. For example, red peppers are in the graph, the purchase date will be April 13, 2024 and the general expiration date of red peppers is about 7 days, so the expiration date of it will be April 20,2024. Make Sure the JSON is valid and the array syntax valid, but do not write '''json before json array`,
      imageInineData,
    ]);
    const response = await result.response;
    const text = await response.text();
    setfoods((foods) => [...foods, ...JSON.parse(text)]);
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
        <div className="food-form-photo">
          <input type="file" title=" " onChange={(e) => handleImageChange(e)} />
          <button
            className="btn btn-large"
            disabled={loading}
            onClick={() => handleClick()}
          >
            {" "}
            Generate Foods
          </button>
        </div>
        <img
          src={image}
          style={{
            width: "30%",
            marginTop: 10,
            marginBottom: 15,
            marginLeft: 15,
          }}
        />
      </div>

      {loading === true && aiResponse === "" ? (
        <p style={{ margin: "30px 0" }}>Loading ...</p>
      ) : null}
    </div>
  );
};

export default AiwithImage;

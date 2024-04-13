import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAqmfslqSGlrqWbSllhR5ce0NPD2hxMuGs");
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

const now_date = new Date();
const exp_date = new Date(now_date);
exp_date.setDate(exp_date.getDate() + 3);

const testfoods = [
  {
    id: 1,
    name: "apple",
    count: 3,
    purchaseDate: now_date,
    expirationDate: exp_date,
  },
  {
    id: 2,
    name: "pork belly",
    count: 2,
    purchaseDate: now_date,
    expirationDate: exp_date,
  },
  {
    id: 3,
    name: "spinach",
    count: 1,
    purchaseDate: now_date,
    expirationDate: exp_date,
  },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [aiResponse, setResponse] = useState("");
  const [foods, setfoods] = useState(testfoods);
  const [loading, setLoading] = useState(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // Generative AI Call to fetch dishes

  async function aiRun() {
    setLoading(true);
    const prompt = `random meals related to ${search} category with images and prices`;
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();
    setResponse(text);
    setLoading(false);
  }

  const handleClick = () => {
    aiRun();
  };

  return (
    <div>
      <h1>Generative AI Restaurant App!</h1>
      <p>Built with ❤️ using ReactJS + Redux + Google Gemini</p>

      <div style={{ display: "flex" }}>
        <input
          placeholder="Search Food with Category using Generative AI"
          onChange={(e) => handleChangeSearch(e)}
        />
        <button style={{ marginLeft: "20px" }} onClick={() => handleClick()}>
          Search
        </button>
      </div>

      {loading == true && search != "" ? (
        <p style={{ margin: "30px 0" }}>Loading ...</p>
      ) : (
        <div style={{ margin: "30px 0" }}>
          <p>{aiResponse}</p>
        </div>
      )}

      <FoodList foods={foods} setfoods={setfoods} />
    </div>
  );
};

function FoodList({ foods, setfoods }) {
  if (foods.length === 0) {
    return <p className="message">No foods Now. Upload a photo to add!</p>;
  }

  return (
    <section>
      <ul className="facts-list">
        {foods.map((food) => (
          <Food key={food.id} food={food} setfoods={setfoods} />
        ))}
      </ul>
      <p>There are {foods.length} foods in the fridge!</p>
    </section>
  );
}

function Food({ food, setfoods }) {
  const [isUpdating, setIsUpdating] = useState(false);
  async function handleChange(columnName) {
    if (columnName === "add") {
      setfoods((foods) =>
        foods.map((f) =>
          f.id === food.id ? { ...food, count: food.count + 1 } : f
        )
      );
    } else {
      if (food.count === 1) {
        setfoods((foods) => foods.filter((f) => f.id !== food.id));
      }
      setfoods((foods) =>
        foods.map((f) =>
          f.id === food.id ? { ...food, count: food.count - 1 } : f
        )
      );
    }
  }

  return (
    <li className="food">
      <p>{food.name}</p>
      <div className="food-description">
        <span className="tag">{food.count}</span>
        <span className="tag">{food.purchaseDate.toLocaleString()}</span>
        <span className="tag">{food.expirationDate.toLocaleString()}</span>
      </div>

      <div className="change-buttons">
        <button onClick={() => handleChange("add")} disabled={isUpdating}>
          +
        </button>
        <button onClick={() => handleChange("minus")} disabled={isUpdating}>
          -
        </button>
      </div>
    </li>
  );
}

export default Home;

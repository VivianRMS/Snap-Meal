import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAqmfslqSGlrqWbSllhR5ce0NPD2hxMuGs");
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const model_text = genAI.getGenerativeModel({ model: "gemini-pro" });

const now_date = new Date();
const exp_date = new Date(now_date);
exp_date.setDate(exp_date.getDate() + 3);


const result_schedule = [
  { recipeName: "", recipeDescription: "", numberIn14Days: 0 },
];


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
  const [recipes, setRecipe] = useState(result_schedule);
  const [loading, setLoading] = useState(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // Generative AI Call to fetch dishes

  async function aiRun() {
    setLoading(true);
    const prompt = `random meals related to ${search} category with images and prices`;
    const result = await model_text.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();
    setResponse(text);
    setLoading(false);
  }

  const handleClick = () => {
    aiRun();
  };

  async function generateRecipe() {
    setLoading(true);
    try {
      // Format the expiration dates as strings for the prompt
      const prompt = `Generate an evenly distributed 14-day schedule of recipes for each of the following foods based on their expiration dates: ${testfoods
        .map(
          (food) =>
            `${food.name} (expires on ${food.expirationDate
              .toISOString()
              .substring(0, 10)})`
        )
        .join(", ")}, and restricted to the diet type${
        selectedDiets.length > 1 ? "s" : ""
      } ${selectedDiets
        .join(", ")
        .replace(
          /, ([^,]*)$/,
          " and $1"
        )}. Please provide the answer in the form of an array [{recipeName, recipeDescription, numberIn14Days}].`;

      const result = await model_text.generateContent(prompt);
      setRecipe(result);
      //const text = await result_schedule.text();
      // setRecipe(text);
    } catch (error) {
      console.error("Failed to generate schedule", error);
      setRecipe("Error generating schedule: " + error.message);
    } finally {
      setLoading(false);
    }
  }
  const handleClick2 = () => {
    generateRecipe();
  };

  const [diets, setDiets] = useState([
    { type: "Vegan Diet", isSelected: false },
    { type: "Ketogenic", isSelected: false },
    { type: "Mediterranean Diet", isSelected: false },
    { type: "Paleo Diet", isSelected: false },
    { type: "Atkins", isSelected: false },
    { type: "Carnivore Diet", isSelected: false },
    { type: "Dubrow Diet", isSelected: false },
    { type: "Intermittent Fasting", isSelected: false },
  ]);

  const [selectedDiets, setSelectedDiets] = useState([]);

  const handleDietChange = (changedDiet) => {
    const updatedDiets = diets.map((diet) => {
      if (diet.type === changedDiet.type) {
        return { ...diet, isSelected: !diet.isSelected };
      }
      return diet;
    });
    setDiets(updatedDiets);

    // Update selected diets array
    const updatedSelectedDiets = updatedDiets
      .filter((diet) => diet.isSelected)
      .map((diet) => diet.type);
    setSelectedDiets(updatedSelectedDiets);
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
        <button style={{ marginLeft: "20px" }} onClick={() => handleClick2()}>
          Regenerate
        </button>
      </div>

      {loading === true && search !== "" ? (
        <p style={{ margin: "30px 0" }}>Loading ...</p>
      ) : (
        <div style={{ margin: "30px 0" }}>
          <p>{aiResponse}</p>
        </div>
      )}
      <div>
        <DietFilters diets={diets} onDietChange={handleDietChange} />
      </div>

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

const DietFilters = ({ diets, onDietChange }) => {
  const handleChange = (dietType) => {
    onDietChange(dietType);
  };

  return (
    <div>
      <h3>Select Your Diet Type:</h3>
      {diets.map((diet, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={diet.type}
            name={diet.type}
            checked={diet.isSelected}
            onChange={() => handleChange(diet)}
          />
          <label htmlFor={diet.type}>{diet.type}</label>
        </div>
      ))}
    </div>
  );
};


export default Home;

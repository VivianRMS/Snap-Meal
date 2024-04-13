import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AiwithImage from "./upload";
import Planner from "./weeklyplanner";

const genAI = new GoogleGenerativeAI("AIzaSyAqmfslqSGlrqWbSllhR5ce0NPD2hxMuGs");
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const model_text = genAI.getGenerativeModel({ model: "gemini-pro" });

const now_date = new Date();
const exp_date = new Date(now_date);
exp_date.setDate(exp_date.getDate() + 3);

const recipeTemplate = {
  recipeName: "",
  recipeDescription: "",
  numberIn14Days: 0,
};

const result_schedule = Array.from({ length: 14 }, () => ({
  ...recipeTemplate,
}));
const CATEGORIES = [
  { name: "food", color: "#3b82f6" },
  { name: "receipe", color: "#16a34a" },
];

const testfoods = [
  {
    id: 1,
    name: "apple",
    count: 3,
    purchaseDate: "2023",
    expirationDate: "2023",
  },
  {
    id: 2,
    name: "pork belly",
    count: 2,
    purchaseDate: "2023",
    expirationDate: "2023",
  },
  {
    id: 3,
    name: "spinach",
    count: 1,
    purchaseDate: "2023",
    expirationDate: "2023",
  },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [allergies, setAllergies] = useState("");
  const [foods, setfoods] = useState([]);
  const [recipes, setRecipe] = useState(result_schedule);
  const [loading, setLoading] = useState(false);

  const [showAddFood, setShowAddFood] = useState(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // Generative AI Call to fetch dishes

  async function changeAllergies() {
    setLoading(true);
    setAllergies("${search}");
    setLoading(false);
  }

  const handleClick = () => {
    changeAllergies();
  };

  async function generateRecipe() {
    setLoading(true);
    try {
      // Format the expiration dates as strings for the prompt
      const prompt = `Generate a evenly distributed 14-day schedule of recipes for each of the following foods based on their expiration dates: ${testfoods
        .map((food) => `${food.name} (expires on ${food.expirationDate})`)
        .join(", ")}, and restricted to the diet type${
        selectedDiets.length > 1 ? "s" : ""
      } ${selectedDiets
        .join(", ")
        .replace(
          /, ([^,]*)$/,
          " and $1"
        )}. Please provide the answer in the form of strictly JSON array, make JSON valid: an array [{recipeName, recipeDescription, numberIn14Days}]. only give the array, the array has 14 items, if one day i is empty, then there is write {"","",i}, try to start fill the array from the beginning`;

      const result = await model_text.generateContent([prompt]);
      const response = await result.response.candidates[0].content.parts[0]
        .text;
      console.log(response);
      setRecipe(JSON.parse(response));
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

  const appTitle = "Food Planner";

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
      <header className="header">
        <div className="logo">
          {/* <img src="logo.png" height="68" width="68" alt="Today I Learned Logo" /> */}
          <h1>{appTitle}</h1>
        </div>
      </header>
      <AiwithImage start_id={foods.length} setfoods={setfoods} />

      {loading === true && search !== "" ? (
        <p style={{ margin: "30px 0" }}>Loading ...</p>
      ) : (
        <div style={{ margin: "30px 0" }}></div>
      )}
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowAddFood((show) => !show)}
      >
        {showAddFood ? "Close" : "Add food!"}
      </button>
      {showAddFood ? (
        <NewFoodForm
          foods={foods}
          setfoods={setfoods}
          setShowAddFood={setShowAddFood}
        />
      ) : null}{" "}
      <div style={{ display: "flex" }}>
        <DietFilters diets={diets} onDietChange={handleDietChange} />
        <div>
          <p>
            Have other allergies? No worries! Tell us you want to avoid these
            food:
          </p>
          <input
            placeholder="Last time record"
            onChange={(e) => handleChangeSearch(e)}
          />
          <button style={{ marginLeft: "20px" }} onClick={() => handleClick()}>
            Confirm
          </button>
          <button style={{ marginLeft: "20px" }} onClick={() => handleClick2()}>
            Regenerate
          </button>
        </div>
      </div>

      <FoodList foods={foods} setfoods={setfoods} />
      <Planner recipeArrayProp={recipes} />
    </div>
  );
};

function Loader() {
  return <p className="message">Loading ...</p>;
}

function NewFoodForm({ foods, setfoods, setShowAddFood }) {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  async function handleSubmit(e) {
    setIsUpLoading(true);
    const newfood = {
      id: foods.length,
      name: name,
      count: count,
      purchaseDate: purchaseDate,
      expirationDate: expirationDate,
    };

    setfoods((foods) => [...foods, newfood]);

    //5. Reset input fields
    setName("");
    setCount(0);

    //6. Close the form
    setShowAddFood(false);
    setIsUpLoading(false);
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What's your food?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isUpLoading}
      />
      <input
        type="number"
        placeholder="How many do you buy?"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        disabled={isUpLoading}
      />
      <input
        type="date"
        placeholder="Purchase Date"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
        disabled={isUpLoading}
      />
      <input
        type="date"
        placeholder="Expiration Date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        disabled={isUpLoading}
      />
      <button className="btn btn-large" disabled={isUpLoading}>
        Post
      </button>
    </form>
  );
}

function FoodList({ foods, setfoods }) {
  if (foods.length === 0) {
    return <p className="message">No foods Now. Upload a photo to add!</p>;
  }

  return (
    <section>
      <ul className="food-list">
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
    setIsUpdating(true);
    if (columnName === "add") {
      setfoods((foods) =>
        foods.map((f) =>
          f.id === food.id ? { ...food, count: food.count + 1 } : f
        )
      );
    } else if (columnName === "minus") {
      if (food.count === 1) {
        setfoods((foods) => foods.filter((f) => f.id !== food.id));
      }
      setfoods((foods) =>
        foods.map((f) =>
          f.id === food.id ? { ...food, count: food.count - 1 } : f
        )
      );
    } else {
      setfoods((foods) => foods.filter((f) => f.id !== food.id));
    }
    setIsUpdating(false);
  }

  return (
    <li className="food">
      <p>{food.name}</p>
      <div className="food-description">
        <span className="tag">{food.count}</span>
        <span className="tag">{food.purchaseDate}</span>
        <span className="tag">{food.expirationDate}</span>
      </div>

      <div className="change-buttons">
        <button onClick={() => handleChange("add")} disabled={isUpdating}>
          +
        </button>
        <button onClick={() => handleChange("minus")} disabled={isUpdating}>
          -
        </button>
      </div>
      <div className="confirm-button">
        <button onClick={() => handleChange("delete")} disabled={isUpdating}>
          Delete
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

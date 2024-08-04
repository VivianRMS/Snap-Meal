import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AiwithImage from "./upload";
import Planner from "./weeklyplanner";

const genAI = new GoogleGenerativeAI("place_your_own");
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const model_text = genAI.getGenerativeModel({ model: "gemini-pro" });

const now_date = new Date();
const exp_date = new Date(now_date);
exp_date.setDate(exp_date.getDate() + 3);

const result_schedule = [];

const CATEGORIES = [
  { name: "food", color: "#3b82f6" },
  { name: "recipe", color: "#db2777" },
];

const Home = () => {
  const [selectedDay, setSelectedDay] = useState(7); // Default value for selected day
  const [recipeCount, setRecipeCount] = useState(1); // Default value for recipe count
  const [search, setSearch] = useState("");
  const [allergies, setAllergies] = useState("");
  const [lovedFood, setLovedFood] = useState("");
  const [foods, setfoods] = useState([]);
  const [recipes, setRecipe] = useState(result_schedule);
  const [loading, setLoading] = useState(false);
  const [currentCatgory, setCurrentCategory] = useState("food");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreference, setShowPreference] = useState(false);

  const [showAddFood, setShowAddFood] = useState(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // Generative AI Call to fetch dishes

  async function changeAllergies() {
    setLoading(true);
    setAllergies(search);
    setLoading(false);
  }

  async function changeLoveFoods() {
    setLoading(true);
    setLovedFood(search);
    setLoading(false);
  }

  const handleClick = () => {
    changeAllergies();
  };

  const handleClick2 = () => {
    generateRecipe();
  };

  const handleClick3 = () => {
    changeLoveFoods();
  };

  async function generateRecipe() {
    setLoading(true);
    try {
      // Format the expiration dates as strings for the prompt
      const date = "2024.4.14";
      const count = selectedDay * recipeCount;
      const prompt = `Today is ${date}. Generate only and exactly ${count} recipes. You can only use the given food as ingredients, do not use expired food and try to use food that will expire earlier first: ${foods
        .map(
          (food) =>
            `${food.name} (has amount of ${food.count} and expires on ${food.expirationDate})`
        )
        .join(", ")}, and restricted to the diet type${
        selectedDiets.length > 1 ? "s" : ""
      } ${selectedDiets
        .join(", ")
        .replace(
          /, ([^,]*)$/,
          " and $1"
        )}. Also strictly avoid foods in ${allergies}. Only return a JSON array with 'id' incrementing from 1 by 1 each time, 'recipeName' (name of each recipe), 'recipeDescription' (description of each recipe, what's the step to make the food),'ingredients'(only mention the food given and used in this recipe and number used, do not include food that is not provided to you! it will be in the form of a list of dictionaries in the format of [{"food": "red peppers", "amount": 1}, {food:"onions", amount:2}]). Make Sure the JSON is valid and the array syntax valid, but do not write '''json before json array`;
      console.log(prompt);
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

  const appTitle = "Snap ❤ Meal";

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
          <img
            src="logo.png"
            height="68"
            width="68"
            alt="Today I Learned Logo"
          />
          <h1>{appTitle}</h1>
        </div>
      </header>

      {/* {loading === true && search !== "" ? (
        <p style={{ margin: "30px 0" }}>Loading ...</p>
      ) : (
        <div style={{ margin: "30px 0" }}></div>
      )} */}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : currentCatgory === "food" ? (
          <div>
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
            ) : null}
            <FoodList foods={foods} setfoods={setfoods} />
          </div>
        ) : (
          <div>
            <div>
              <div className="header-buttons">
                <button
                  className="btn btn-large"
                  style={{ marginLeft: "20px" }}
                  onClick={() => handleClick2()}
                >
                  Generate Recipes
                </button>
                <button
                  className="btn btn-large"
                  style={{
                    backgroundColor: "#14b8a6",
                    backgroundImage: "none",
                  }}
                  onClick={() => setShowPreference((show) => !show)}
                >
                  {showPreference ? "Close" : "Preference"}
                </button>
              </div>
              {showPreference ? (
                <div>
                  <DietFilters diets={diets} onDietChange={handleDietChange} />
                  <div>
                    <div className="food-form">
                      <div className="food-instruction">
                        <p>Have other allergies? No worries!</p>
                        <p>
                          Tell us you want to avoid these food(ONLY food names):
                        </p>
                      </div>
                      <div className="preference-form">
                        <input
                          placeholder="Last time record"
                          onChange={(e) => handleChangeSearch(e)}
                          style={{ flex: 9 }}
                        />
                        <button
                          className="btn btn-category"
                          style={{ backgroundColor: "#16a34a", flex: 1 }}
                          onClick={() => handleClick()}
                        >
                          Confirm
                        </button>
                      </div>
                      <p
                        className="food-instruction"
                        style={{ fontSize: "20px", fontWeight: "normal" }}
                      >
                        Last Saved: {allergies}
                      </p>
                    </div>
                    {/* <label htmlFor="day">Select Day:</label> */}
                    <div className="food-form day-selection">
                      <p className="food-instruction">Prepare meals for </p>
                      <input
                        type="number"
                        id="day"
                        value={selectedDay}
                        onChange={(e) =>
                          setSelectedDay(parseInt(e.target.value, 10))
                        }
                      />
                      {/* <label htmlFor="recipeCount">Recipe Count per Day:</label> */}
                      <p className="food-instruction">days.</p>
                      <p className="food-instruction">Generate</p>
                      <input
                        type="number"
                        id="recipeCount"
                        value={recipeCount}
                        onChange={(e) =>
                          setRecipeCount(parseInt(e.target.value, 10))
                        }
                      />
                      <p className="food-instruction">receipe(s) per day. </p>
                    </div>
                  </div>
                  <div className="food-form">
                    <p className="food-instruction">
                      Have something really want to eat?
                    </p>
                    <div className="preference-form">
                      <input
                        placeholder="what do you want?"
                        onChange={(e) => handleChangeSearch(e)}
                        style={{ flex: 9 }}
                      />
                      <button
                        className="btn btn-category"
                        style={{ backgroundColor: "#16a34a", flex: 1 }}
                        onClick={() => handleClick3()}
                      >
                        Confirm
                      </button>
                    </div>
                    <p
                      className="food-instruction"
                      style={{ fontSize: "20px", fontWeight: "normal" }}
                    >
                      Favorite foods: {lovedFood}
                    </p>
                  </div>
                  <div className="divider"></div>
                </div>
              ) : null}
            </div>
            {loading ? (
              <Loader />
            ) : (
              <Planner
                recipeArrayProp={recipes}
                days={selectedDay}
                num_recipe={recipeCount}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

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
      <p className="food-instruction">
        Automatically get foods details by uplaoding a photo of clearly
        positioned foods.
      </p>
      <AiwithImage start_id={foods.length} setfoods={setfoods} />
      <p className="food-instruction">Specify new food by yourself.</p>
      <div className="food-form-input">
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
        <button
          className="btn btn-large"
          style={{ backgroundColor: "#8b5cf6", backgroundImage: "none" }}
          disabled={isUpLoading}
        >
          Add
        </button>
      </div>
    </form>
  );
}

function FoodList({ foods, setfoods }) {
  if (foods.length === 0) {
    return <p className="message">No foods Now. Add new foods!🤩</p>;
  }

  return (
    <section>
      <ul className="food-list">
        <FoodHeader />
        {foods.map((food) => (
          <Food key={food.id} food={food} setfoods={setfoods} />
        ))}
      </ul>
      <p>There are {foods.length} foods in the fridge!</p>
    </section>
  );
}

const FoodHeader = () => {
  return (
    <li className="food food-list-header">
      <p style={{ flex: 3, fontFamily: "Coiny" }}>Name</p>
      <span
        className="tag"
        style={{ flex: 2, display: "flex", justifyContent: "center" }}
      >
        Count
      </span>
      <span
        className="tag"
        style={{ flex: 2, display: "flex", justifyContent: "center" }}
      >
        Purchase Date
      </span>
      <span
        className="tag"
        style={{ flex: 2, display: "flex", justifyContent: "center" }}
      >
        Expiration Date
      </span>
      <span
        className="tag"
        style={{ flex: 1, display: "flex", justifyContent: "center" }}
      >
        Remove
      </span>
    </li>
  );
};

function Food({ food, setfoods }) {
  const [isUpdating, setIsUpdating] = useState(false);
  async function handleChange(columnName) {
    setIsUpdating(true);
    if (columnName === "add") {
      setfoods((foods) =>
        foods.map((f) =>
          f.id === food.id
            ? { ...food, count: parseInt(food.count, 10) + 1 }
            : f
        )
      );
    } else if (columnName === "minus") {
      if (food.count === 1) {
        setfoods((foods) => foods.filter((f) => f.id !== food.id));
      }
      setfoods((foods) =>
        foods.map((f) =>
          f.id === food.id
            ? { ...food, count: parseInt(food.count, 10) - 1 }
            : f
        )
      );
    } else {
      setfoods((foods) => foods.filter((f) => f.id !== food.id));
    }
    setIsUpdating(false);
  }

  return (
    <li className="food food-reg">
      <p style={{ flex: 3, fontFamily: "Coiny" }}>{food.name.toUpperCase()}</p>
      <span
        className="count"
        style={{ flex: 2, display: "flex", justifyContent: "center" }}
      >
        <button
          className="change-buttons"
          onClick={() => handleChange("minus")}
          disabled={isUpdating}
        >
          -
        </button>
        <span className="tag">{food.count}</span>
        <button
          className="change-buttons"
          onClick={() => handleChange("add")}
          disabled={isUpdating}
        >
          +
        </button>
      </span>
      <span
        className="tag"
        style={{ flex: 2, display: "flex", justifyContent: "center" }}
      >
        {food.purchaseDate}
      </span>
      <span
        className="tag"
        style={{ flex: 2, display: "flex", justifyContent: "center" }}
      >
        {food.expirationDate}
      </span>

      <div
        className="confirm-button"
        style={{ flex: 1, display: "flex", justifyContent: "center" }}
      >
        <button
          className="btn btn-category btn-delete"
          style={{ backgroundColor: "#ef4444" }}
          onClick={() => handleChange("delete")}
          disabled={isUpdating}
        >
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
    <div className="food-form">
      <p className="food-instruction">Select Your Diet Type:</p>
      {diets.map((diet, index) => (
        <label key={index} className="checkbox-custom">
          <input
            type="checkbox"
            id={diet.type}
            name={diet.type}
            checked={diet.isSelected}
            onChange={() => handleChange(diet)}
            style={{ display: "none" }} // Hide the default checkbox
          />
          <span className="checkmark"></span>
          <p className="diet">{diet.type}</p>
        </label>
      ))}
    </div>
  );
};

export default Home;

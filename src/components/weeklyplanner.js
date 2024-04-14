import React, { useState, useEffect } from "react";

function Planner({ recipeArrayProp, days, num_recipe }) {
  const [recipeArray, setRecipeArray] = useState([]);
  const [tooltipContent, setTooltipContent] = useState(""); // State to manage tooltip content
  const [tooltipVisible, setTooltipVisible] = useState(false); // State to manage tooltip visibility
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // State to manage tooltip position
  const [starredRecipes, setStarredRecipes] = useState(new Set()); // State to store starred recipes

  // Function to handle recipe hover
  const handleRecipeHover = (recipe, event) => {
    // Set tooltip content and position
    setTooltipContent(recipe);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    // Show tooltip
    setTooltipVisible(true);
  };

  // Function to handle recipe hover leave
  const handleRecipeHoverLeave = () => {
    // Hide tooltip
    setTooltipVisible(false);
  };

  // Function to handle star click
  const handleStarClick = (dayIndex, recipeIndex) => {
    const newStarredRecipes = new Set(starredRecipes);
    const index = dayIndex * num_recipe + recipeIndex;
    if (newStarredRecipes.has(index)) {
      newStarredRecipes.delete(index);
    } else {
      newStarredRecipes.add(index);
    }
    setStarredRecipes(newStarredRecipes);
  };

  useEffect(() => {
    // Define a function to create the planner
    function createPlanner(dataArray, days, num_recipe) {
      if (dataArray.length === 0) return [];
      const recipe_sum = [];
      try {
        for (let index = 0; index < dataArray.length; index += num_recipe) {
          let chunk = dataArray.slice(index, index + num_recipe);
          recipe_sum.push(chunk);
        }
      } catch (error) {
        console.error("Wrong with return recipe, please try generating again");
        recipe_sum.push("Generate failed, please generate again");
      }
      return recipe_sum;
    }

    // Create the planner table
    setRecipeArray(createPlanner(recipeArrayProp, days, num_recipe));
  }, [recipeArrayProp, days, num_recipe]);

  return (
    <div>
      <div>
        {recipeArray.map((recipeList, listIndex) => (
          <DailyRecipe
            recipeList={recipeList}
            listIndex={listIndex}
            handleStarClick={handleStarClick}
            starredRecipes={starredRecipes}
            num_recipe={num_recipe}
          />
        ))}
      </div>
      {tooltipVisible && (
        <div
          style={{
            position: "absolute",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            border: "1px solid black",
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}

function DailyRecipe({
  recipeList,
  listIndex,
  handleStarClick,
  starredRecipes,
  num_recipe,
}) {
  return (
    <div key={listIndex} className="food-form">
      <h2>Day {listIndex + 1}</h2>
      <div className="divider"></div>
      {recipeList.map((recipe, index) => (
        <OneReceipe
          recipe={recipe}
          index={index}
          handleStarClick={handleStarClick}
          starredRecipes={starredRecipes}
          listIndex={listIndex}
          num_recipe={num_recipe}
        />
      ))}
    </div>
  );
}

function OneReceipe({
  recipe,
  index,
  handleStarClick,
  starredRecipes,
  listIndex,
  num_recipe,
}) {
  return (
    <div key={index}>
      <div className="recipe-header">
        <button
          className="star-button"
          onClick={() => handleStarClick(listIndex, index)}
        >
          {starredRecipes.has(listIndex * num_recipe + index) ? "★" : "☆"}
        </button>
        <h3>{recipe.recipeName}</h3>
      </div>

      <p>
        <strong>💡Description:</strong>
      </p>
      <p style={{ marginBottom: "5px", marginLeft: "26px" }}>
        {recipe.recipeDescription.replace(/\n/g, " ")}
      </p>
      <p>
        <strong>🧑‍🍳 Ingredients:</strong>
      </p>
      <ul style={{ marginLeft: "30px" }}>
        {recipe.ingredients.map((ingredient, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between", // This will put the items on opposite ends.
              alignItems: "center",
              width: "25%", // Set the width to 100% to use the full width of the container.
            }}
          >
            <p>{ingredient.food}</p>

            <p>✕ {ingredient.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Planner;

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
          <div key={listIndex}>
            <h2>Day {listIndex + 1}</h2>
            {recipeList.map((recipe, index) => (
              <div key={index}>
                <h3>{recipe.recipeName}</h3>
                <button onClick={() => handleStarClick(listIndex, index)}>
                  {starredRecipes.has(listIndex * num_recipe + index) ? "★" : "☆"}
                </button>

                <p>
                  <strong>Description:</strong>{" "}
                  {recipe.recipeDescription.replace(/\n/g, " ")}
                </p>
                <p>
                  <strong>Ingredients:</strong>
                </p>
                <ul>
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>
                      {ingredient.food} - {ingredient.amount}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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

export default Planner;

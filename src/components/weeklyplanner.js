import React, { useState, useEffect } from "react";

function Planner({ recipeArrayProp, days, num_recipe }) {
  const [recipeArray, setRecipeArray] = useState([]);
  const [recipes, setRecipes] = useState([]);
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
  const handleStarClick = (index) => {
    const newStarredRecipes = new Set(starredRecipes);
    if (newStarredRecipes.has(index)) {
      newStarredRecipes.delete(index);
    } else {
      newStarredRecipes.add(index);
    }
    setStarredRecipes(newStarredRecipes);
  };

  useEffect(() => {
    // Define a function to create the biweekly planner
    function createPlanner(dataArray, days, num_recipe) {
      if (dataArray.length === 0) return [];
      console.log(dataArray);
      let recipe_sum = [];
      try {
        for (let index = 0; index < dataArray.length; index += num_recipe) {
          let chunk = dataArray.slice(index, index + num_recipe);
          recipe_sum.push(chunk);
        }
        // for (let i = 0; i < days; i++) {
        //   const day_recipe = [];
        //   for (let j = 0; j < num_recipe; j++) {
        //     const index = i + j;
        //     day_recipe.push(dataArray[index]);
        //     console.log(day_recipe);
        //     const isStarred = starredRecipes.has(index);
        //   days.push(
        //     <td
        //       key={`recipe-${index}`}
        //       onMouseEnter={(e) =>
        //         handleRecipeHover(recipe.recipeDescription, e)
        //       }
        //       onMouseLeave={handleRecipeHoverLeave}
        //     >
        //       <div>
        //         <span>{recipe.recipeName}</span>
        //         <button onClick={() => handleStarClick(index)}>
        //           {isStarred ? "★" : "☆"}
        //         </button>
        //       </div>
        //     </td>
        //   );
        //   }
        //   recipe_sum.push(day_recipe);
        //   console.log(recipe_sum);
        // }
        console.log(recipe_sum);
      } catch (error) {
        console.error("wrong with return receipe, please try generate again");
        recipe_sum.push("generate failed, please generage again");
      }
      return recipe_sum;
    }

    // Create the biweekly planner table
    setRecipeArray(createPlanner(recipeArrayProp, days, num_recipe));
  }, [starredRecipes, recipeArrayProp]); // Include starredRecipes in the dependency array

  return (
    <div>
      <div>
        {recipeArray.map((recipeList, listIndex) => (
          <div key={listIndex}>
            <h2>Day {listIndex + 1}</h2>
            {recipeList.map((recipe, index) => (
              <div key={index}>
                <h3>{recipe.recipeName}</h3>
                {/* <button onClick={() => handleStarClick(index)}>
                  {isStarred ? "★" : "☆"}
                </button> */}

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

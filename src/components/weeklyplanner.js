import React, { useState, useEffect } from 'react';

function Planner(recipeArrayProp) {
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
    function createBiweeklyPlanner(dataArray) {

      const weeks = [];
      for (let week = 0; week < 2; week++) {
        const days = [];
        const daynums = [];
        for (let day = 1; day <= 7; day++) {
          const index = day + week * 7 - 1;
          const recipe = dataArray.recipeArrayProp[index];
          console.log(recipe)
          const isStarred = starredRecipes.has(index);
          daynums.push(
            <td key={`daynum-${index}`}>
              {day}
            </td>
          );
          days.push(
            <td key={`recipe-${index}`} onMouseEnter={(e) => handleRecipeHover(recipe.recipeDescription, e)} onMouseLeave={handleRecipeHoverLeave}>
            <div>
              <span>{recipe.recipeName}</span>
              <button onClick={() => handleStarClick(index)}>{isStarred ? '★' : '☆'}</button>
            </div>
          </td>
          );
        }
        weeks.push(
          <React.Fragment key={`week-${week}`}>
            <thead>
              <tr>
                <th colSpan="7">Week {week + 1}</th>
              </tr>
            </thead>
            <tbody>
              <tr>{daynums}</tr>
              <tr>{days}</tr>
            </tbody>
          </React.Fragment>
        );
      }
      return weeks;
    }


    // Create the biweekly planner table
    setRecipeArray(createBiweeklyPlanner(recipeArrayProp));
  }, [starredRecipes,recipeArrayProp]); // Include starredRecipes in the dependency array


  return (
    <div>
      <table>
        {recipeArray}
      </table>
      {tooltipVisible && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            border: '1px solid black',
            backgroundColor: 'white',
            padding: '5px',
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
}

export default Planner;

## Inspiration

Snap❤Meal was inspired by the everyday challenges of home cooking. How often do we find ourselves standing in front of an open fridge, staring at a pile of groceries, yet unsure of what to make? Even worse, discovering that some items have already expired, and throwing them to trash. This not only leads to stress but also contributes to the pressing issue of food waste. Moreover, accommodating various dietary preferences, like veganism or ketogenic diets, can require more thought when planning meals for guests. Snap❤Meal aims to address these challenges by revolutionizing how we approach cooking. Our app empowers users to effortlessly create gourmet meals from their grocery hauls, minimizing waste and maximizing culinary enjoyment.

[Demo](https://www.youtube.com/watch?v=2w96Dpqqt2M)


## What it does

Snap❤Meal is a web app that revolutionizes home cooking with its innovative approach. With a simple snapshot of your groceries, it becomes your culinary companion, effortlessly transforming them into personalized meal plans tailored precisely to your tastes and dietary preferences. Every time you complete a grocery purchase, take a snapshot and your ingredient inventory is updated and you can also make necessary adjustments. It carefully analyzes your inventory, calculating the number of recipes needed and the optimal duration for your meal plan, ensuring every ingredient is utilized efficiently. Moreover, Snap❤Meal prioritizes ingredient freshness by considering expiration dates, thereby minimizing food waste and promoting sustainability. Explore new culinary horizons and savor the joy of creating delicious meals with Snap❤Meal. You can even "star" your favorite recipes to easily access them later. With Snap❤Meal, cooking becomes a delightful experience, free from stress and guesswork. 


## How we built it
The web app for Snap❤Meal is built with **ReactJS**.

**Gemini Pro Vision model**: extract details of each food item from pictures.

**Gemini Pro model**: generate recipes tailored to user’s preferences, including the expiration dates of available foods:
- Specified number of recipes for a specified number of days
- Specific diet category, if required
- Consideration for allergies
- Food preferences

## Challenges we ran into
Extended Processing time of Gemini API: Often, it takes up to 30 seconds to receive a response from the API after users upload a picture. This could lead to user impatience and frustration, particularly during real-time meal preparation. Currently, we haven’t come up with a specific solution to this due to time constraints, but we consider improvements in the final section. 

Accuracy of Gemini Pro Vision: Another persistent challenge was the accuracy of the food recognition capabilities of the API. For instance, the API only provides the general food item, which identifies ground beef as beef. This could result in inappropriate meal suggestions. This issue raised concerns about the reliability of the app in providing accurate and useful meal-planning advice based on the user’s actual grocery items. To solve this issue, we experimented with various prompts and built a more robust one for use.

Instability of the output format: Occasionally, the Gemini API failed to produce the expected output as a JSON array, which led to inconsistencies in how the data was handled and presented in the app. This unpredictability in output format could potentially disrupt the user experience, making the app seem less dependable. 

## Accomplishments that we're proud of
One of our proudest achievements is the seamless incorporation of the Gemini API, which has been instrumental in enabling real-time food recognition and recipe generation based on user-uploaded images. This sophisticated technology, although challenging, has significantly enhanced the functionality and user engagement of our app, by providing tailored meal suggestions with a high degree of customization.

In addition to the Gemini API, our use of ReactJS stands out as a fundamental accomplishment. ReactJS has empowered us to build a dynamic and responsive web application that efficiently handles state management and offers an interactive user experience. The seamless interplay between ReactJS and the Gemini API illustrates our commitment to utilizing cutting-edge technology to solve practical problems in the kitchen, turning everyday cooking into a more streamlined and enjoyable activity.

These technological integrations not only reflect our capability to harness and apply complex APIs and frameworks but also underscore our dedication to innovation and quality in crafting digital solutions that address real-world issues like meal planning and food waste. Through these achievements, Snap❤Meal has not only improved how individuals manage their kitchen inventory but has also made a significant step towards enhancing sustainability in everyday life.

## What we learned
Undoubtedly, our journey with Snap❤Meal provided an incredible learning curve for our team. Firstly, delving into Gemini APIs was an enlightening experience that allowed us to truly grasp how LLM can collaborate with humans for practical use. Understanding how these cutting-edge models functioned under the hood not only expanded our knowledge base but also honed our skills in applying them to solve real-world challenges. 

Additionally, prompt engineering is the focus of our project. By adjusting prompt content including what kind of recipes are preferred, what foods are provided, and which foods should be used first, we learned how to make best use of LLM for our own sake. Moreover, the practice of modifying prompts so that the output form satisfies our needs offers us a bridge between our app and the LLM, introducing more powerful functionalities that can be implemented way more easily than before.


## What's next for Snap❤Meal
The journey ahead for Snap❤Meal is filled with exciting opportunities to further revolutionize the home cooking experience. Here's a glimpse into what’s planned for:

Continuous Innovation and Improvement: At Snap❤Meal, we're committed to delivering a seamless and swift user experience. Currently, we acknowledge there's notable latency in image recognition and recipe generation. To address this, we're intensifying our tech efforts to optimize performance and add some loading animation like culinary tips while users are waiting for a response. Furthermore, while our web app is not yet officially deployed, we're actively working on its release, alongside plans to develop a mobile app to provide greater accessibility to our users.

Expansion of Recipe Variety and Customization Options: We're dedicated to enriching our recipe database with an even wider array of culinary delights. From international cuisines to serving sizes, we aim to cater to every palate and preference.

Community Engagement and Collaboration: We're committed to fostering a vibrant community of home cooks on Snap❤Meal, with collaborative recipe sharing, cooking challenges, and interactive forums. We plan to implement a user database. This will enable us to store user preferences, past activities, and other essential information securely.

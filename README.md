# Cookbook
Cookbook is a fusion between social media and traditional cookbooks and aims to revolutionalise how we share our recipes online. Users may create their own recipes and cookbooks and publish it for their followers to view, like and comment. This project is inspired by my mother who loves to share her own recipe creation online through Instagram and Whatsapp, but wished that there was a way to group recipes together easily and let her peers to view and comment just like in other social medias. From aspiring chefs to michelin star masterchefs, you can be the next big cooking influencer by sharing your recipes and cookbook here!
### Features
1. Recipes
  * Users may create and share their recipes and publish it for other users to see. 
  * Each recipe will have their own ingredients and instructions. Ingredients and instructions will be shown as a ordered list on the recipe page in a user-friendly manner. When       creating a new recipe, the user just have to seperate each ingredients and instructions respectively with a comma `,`. This will be handled automatically and stored and           displayed as a list.
  * Creators of the recipe may also wish to edit the recipe ingredients and instructions on the recipe page.
  
2. Cookbooks
  * Users may create cookbooks and add their own recipes into the cookbook. This may help organise the recipes by their cuisines or how the author deemed fit. From the cookbook,       users may view individual recipes

3. Like and Comment
  * Improved function from previous project that behaves like most modern social media platform.
  * Users may give a like on any recipe to show support like in any other social media application.
  * Users can comment on both recipes and cookbooks. This allows users to appraise one another or have a discussion on how to improve on them.

4. Message
  * Distinct function from previous project that allows messages between users
  * Users privately messages other users at either their own or the other user profile page
  * Messages are private and so only showned between talking parties
  
5. Follow
  * Users may follow each other as with in many other social media application. 
  * Users may view all the post and cookbooks by the users they are following.

6. Search
  * Finding recipe is made easy by the search bar at the navigation bar located at the top right corner.
  * Search result will show all recipes that starts with the search query
  
7. User friendly view
  * The website is designed to give users the best interface possible. This is done by using pagination when viewing all the recipes and cookbooks.
  * When viewing either a user, recipe or cookbook, contents in differnt section in seperated and users can view each section with a tab function on the left side of the page. This is to avoid cluttering on each page.

### Files
1. cookbook.js, index.js, profile.js, recipe.js
  * Includes all the script that dynamically adds recipes and cookbook, along with the comment and message section, to the indivual pages
2. Templates: cookbook.html, following.html, index.html, newcookbook.html, newrecipe.html, profile.html, recipe.html and search.thml
  * Contains the template for each respective pages viewed by the user.
  * Uses pills tab for cookbook, profile and recipe to divide the content users see
  * index.html haves carousell that improves on the visuals of the website
3. views.py
  * Contains all the API and sql queries to provide data for the templates
  * Have authentication processing that only logged in users can view sensitive data (Such as private messages and creating new recipes and cookbooks)
4. models.py
  * Have 6 models that stores all the relevant information to allow the modern social media experience
  
### Justification for project
1. Combines and improves on previous projects, yet distinct
  * This project consolidates all the implemented function in previous project and improves on them
  * For example, the private messages between users was inspired from the email project and like function was from the network project. These distinct functions is implemented together for a complete package
  * Example of improvements include allowing users to comment on a published post which combines the commerce and network project. This adds complexity in the code implemented
2. Users can group objects(recipes) into another object(cookbooks)
  * This is implemented by using the ManyToMany field and a form that saves such relations.
  * The form is user friendly such that the users can add recipes to cookbook seemingly
  * This also adds complexity to the code compared to previous project.
3. Modern social media experience
  * This project has all the function of a modern social media such as Facebook and Instagram.
  * The website is given a modern feel by having many interactive function between users.
4. A lot of coding was done
  * If the above have not convinced the requirement yet, the project has about 2.7k lines of code(including blank lines). This pressumable is a lot for a solo developer such as myself (scoring myself some petty points here) 
  
### Final thoughts
Hopefully, this project meets all the requirements needed as I poured much time developing and bug testing all the functions working together. This could be a real IP as a social media platform for chefs and homecook to use. I would like to thank the CS50 staff and Brian Yu for the experience and lesson learned that provides clear insight on how to be a good web programmer.
 

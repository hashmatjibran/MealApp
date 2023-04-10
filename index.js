
  
// getting the content section which is main because we want to populate data in there
const content = document.getElementById('content');

// creating an array of items that are being fetched from the MEAL API
let items = new Array(); 

 // creating an array of ingredients
 let ingredients = new Array();

//  creating an array to store favorite meals
let  favorites = new Array();

// creating a function to fetch data from the MEAL API (The function is async)
 function fetchCategories(){

     fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then((result) => {
        result.json()
        .then((data) => {

            // storing the fetche items into an Array
            items = data.categories;

        //    calling the setCategories function
           setCategories();
        })
    }).catch((err) => {
        console.log(`server is currently down ; please try after sometime ${err}`);
    });

}

// setting categories in here
 function setCategories() {

    const row = content.getElementsByClassName('row')[0];

     // hide the search results by default
     hideDiv();

    // traversing through the list of array and populating the data likewise
    for(let i of items){
        row.innerHTML+=
        `<div class="col-3 card item " style="width: 18rem;">
         
        <img class="cardImage" src="${i.strCategoryThumb}" data-name="${i.strCategory}" alt="..." onclick="checkUrl(event)">
        <div class="card-body">
        <h5 class="card-title">${i.strCategory}</h5>
        </div>
        </div>`; 
    }
   

}

// function to check which category has been choosen
function checkUrl(event){
    
    // trying to get the data name of the category menu
    const categoryName = event.target.getAttribute('data-name');
     hideDiv();
    switch(categoryName)
    {
       
        case 'favorites':
            favorites = JSON.parse(localStorage.getItem('favorites'));
            if(favorites == null || favorites == undefined || favorites == "")
            {
                favorites = new Array();
            }
                items = favorites;
            showFavorites();
            break;

        case 'hots':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast');
            break;
        case 'Beef':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=beef');
            break;
        case 'Chicken':
           
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=chicken');
            break;
        case 'Lamb':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=lamb');
            break;

        case 'Miscellaneous':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=Miscellaneous');
            break;

        case 'Pasta':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=pasta');
            break;

        case 'Seafood':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=seafood');
            break;

        case 'Starter':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=starter');
            break;

        case 'Vegan':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=vegan');
            break;

        case 'Vegetarian':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=Miscellaneous');
            break;

        case 'Breakfast':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=vegetarian');
            break;

        case 'Goat':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=goat');
            break;

         case 'Pork':
             break;

        case 'Dessert':
            fetchUrl('https://www.themealdb.com/api/json/v1/1/filter.php?c=dessert');
            break;

        default:
          
            break;
    }
}

// calling fetchCategories function
fetchCategories();

// fetching the meals using the on click url. 
function fetchUrl(url)
{
    fetch(url)
    .then((result) => {

        result.json()
        .then((data)=>{

            items = data.meals;
            return setMeals();
        })
    }).catch((err) => {

        console.log("Server down");

    });
}

// setting the meals or in other words displaying the meals from the MealApi
function setMeals()
{
    const row = content.getElementsByClassName('row')[0];
    row.innerHTML='';
    // traversing through the list of array and populating the data likewise
    for(let i of items){
                if(isInFavorites(i.strMeal)){
                    row.innerHTML+=
                        `<div class="col-3 card item " style="width: 18rem;">
                        <img class="cardImage" src="${i.strMealThumb}" data-name="${i.strMeal}" alt="..." onclick="fetchIngredients(event)">
                       <div class="card-body">
                           <h5 class="card-title">${i.strMeal} <i class="fa-solid fa-heart heart-icon favorite"
                            data-name="${i.strMeal}" data-thumb="${i.strMealThumb}"
                            onclick="setFavorite(event)"></i>
                            </h5>
                        </div>
                     </div>`; 
                }
                else{
                   
                     row.innerHTML+=
                        `<div class="col-3 card item " style="width: 18rem;">
                        <img class="cardImage" src="${i.strMealThumb}" data-name="${i.strMeal}" alt="..." onclick="fetchIngredients(event)">
                       <div class="card-body">
                           <h5 class="card-title">${i.strMeal} <i class="fa-solid fa-heart heart-icon"
                            data-name="${i.strMeal}" data-thumb="${i.strMealThumb}"
                            onclick="setFavorite(event)"></i>
                            </h5>
                        </div>
                    </div>`; 
                }
   
    }
}

// fetching the ingredients of particular meal that is selected by the user
function fetchIngredients(event) {
    
    event.stopPropagation();

    // trying to get the data-name attribute of the category menu
        const categoryName = event.target.getAttribute('data-name');

    // fetching the data related to a specified meal
         fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+categoryName)
        .then((result) => {

        result.json()
        .then((data)=>{
            let newdata =data.meals[0];

        // populating Ingredients Array
        for(let i=1;i<=20;i++ )
        {
            
            //  loop to check if an empty / null ingredient is reached
            if(newdata[`strIngredient${i}`]=="" || newdata[`strIngredient${i}`]==undefined || newdata[`strIngredient${i}`]==null)
            {
                // break the loop if an empty / null ingredient is reached
                break;
                
            }
            else{
                // creating an object to store ingredient name and ingredient measure 
                     let newIngredient={};

                // populating the object
                    newIngredient.name = newdata[`strIngredient${i}`];
                    newIngredient.measure = newdata[`strMeasure${i}`];

                // pushing the object into the Array
                    ingredients.push(newIngredient);
            }
            
        }
        // display the meal information in a new function 
            displayMealInfo(newdata, ingredients);
        })
        }).catch((err) => {
            // logging the error to the console
            console.log(`error in fetching the datafrom the server :- ${err}`);
        });

}

// displaying the ingredients and the instruction about how to cook the meal
function displayMealInfo(newdata , ingredients)
{
    // getting the element where we want to display the data
    const row = content.getElementsByClassName('row')[0];

    // first making the field empty
    row.innerHTML='';

    // after it is empty , we need to populate the data inside the field 
    row.innerHTML+=`
    <div class="col-3 card item ">
        <img class="cardImage" src="${newdata.strMealThumb}" data-name="${newdata.strMeal}" alt="${newdata.strMeal}" >
        <div class="card-body">
            <h5 class="card-title">${newdata.strMeal}</h5>
        </div>
    </div>

    <div class="col-8 card item">
        <h5 class="text-center orange">
            Instructions
        </h5>
        <p class="text-center">${newdata.strInstructions}</p>
    </div>
    
    <hr class="mt-2">

    <h2 class="text-center text-info">
        Ingredients
    </h2>`;


    // displaying the ingredients and its measure quantity related to the selected meal

    for(let i of ingredients){
       row.innerHTML+=
       `<div class="col-2 card item ">
            <img class="cardImage" src='https://www.themealdb.com/images/ingredients/${i.name}.png' alt="${i.name}" >
            <div class="card-body">
                    <h5 class="card-title">${i.name} (${i.measure})</h5>
            </div>
        </div>`;
    }
   
}

// searching functionality
 function inputSearch(e)
 {
    // getting the value of the input field
        let value = e.target.value

    // condition to check user input is not empty and does not contain spaces only
         if (value && value.trim().length > 0){

    // trimming the value i.e excluding spaces
         value = value.trim();

        //returning only the results which match the user input 
        // And passing those results to setList function for displaying purpose

            setList(value , items.filter(item => {
                if(item.strCategory == undefined || item.strCategory == null)
                {
                    // note the input entered in the search bar should be in lower case
                    return item.strMeal.toLowerCase().includes(value);
                }
                else{
                    // note the input entered in the search bar should be in lower case
                return item.strCategory.toLowerCase().includes(value) 
                }
            }))
    }
 }

//  function to set list of the search items which match the user input
 function setList(value , data){

    // getting the list group where we will be showing our data
         const list_group = document.getElementById('list_group');

    // emptying the div to display the search items 
         list_group.innerHTML='';

    // if no results are to found , then display such a message
        if(data[0] == undefined || data[0] == null)
        {
            list_group.innerHTML+=`
            <li class="list-group-item bg-secondary">No search results found for ${value} .
            </li>
            `;
        }
    // otherwise if results are found and are of type Meals 
    // note category results have a little bit different format so needed to handele the case explicitly 
        else if(data[0].strCategory == undefined || data[0].strCategory == null)
        {
        
            for (let i of data) {
                list_group.innerHTML+=`
                <li class="list-group-item bg-secondary"  
                data-name="${i.strMeal}" onclick="fetchIngredients(event)">${i.strMeal}
                <img class="listImage" src="${i.strMealThumb}" width="50" height="50">
                </li>
                `;
            }
            
        }
    // if results are found and are of type category 
        else{
            
            for (let i of data) {
                list_group.innerHTML+=`
                <li class="list-group-item bg-secondary " 
                data-name="${i.strCategory}" onclick="checkUrl(event)">${i.strCategory}
                <img class="listImage" src="${i.strCategoryThumb}" width="50" height="50"> </li>
                `;
            }
        }
   
 }

// function to set favorites
function setFavorite(e)
{
    // creating the toggle functionality for the specified heart icon
        const classes= e.target.classList;
        classes.toggle("favorite");

    // condition to check if marked as favorite or removed from favorite
        if(classes[classes.length-1] == 'favorite')
        {
            //  store the meal data like meal-name , meal-thumb inside the favObject 

            // creating the favObject
                let favObject={};
            // now storing the data inside the favObject
                favObject.strMeal = e.target.getAttribute('data-name');
                favObject.strMealThumb = e.target.getAttribute('data-thumb');
                favObject.id = favorites.length;

            // storing the favorites permanently inside the localStorage and adding the new ones also 
           let allEntries = JSON.parse(localStorage.getItem('favorites'));
           if(allEntries == null || allEntries == undefined)
           {
               allEntries=new Array();
           }
               
               allEntries.push(favObject);
               localStorage.setItem('favorites',JSON.stringify(allEntries));
        }
        else{
            removeFavorite(e);
        }
    
}

// function to remove items from favorites
function removeFavorite(e)
{
    let mealById ='';

    // getting the id for the one which needs to be deleted and is then set in mealById
        for(let i of favorites)
        {
            if(e.target.getAttribute('data-name') == i.strMeal)
            {
                mealById = i.id;
                break; 
            }

        }

    // filtering out the values and removing the meal which needs to be deleted
        let keys = Object.keys(favorites).filter((id)=>{
            return id != mealById;
        });

        // creating a temporary array to store the new array ater feleting the favorite items 
             let temp = new Array();
        
        // storing thr values inside the temporary array
            for(let i of keys){
                favorites[i].id = temp.length;
            temp.push(favorites[i]) ;
            }

        // now restoring the values rom the temp array into the main array i.e favorites
            favorites = temp;

        // updating the local storage with new values
            localStorage.setItem('favorites',JSON.stringify(favorites));
  

   
}

// function to display favorites
function showFavorites(){
    
    // getting the row where we need to display our content and setting it to empty for the first time 
        const row = content.getElementsByClassName('row')[0];
        row.innerHTML='';

    // condition to check if no items are in favorites , then display such a message.
        if(items.length==0)
        {
            row.innerHTML+=
            `<div class="col-3 card item " style="width: 18rem;">
                <span> You have no items as favorites please select some!</span> 
            </div>`; 
        }

    // traversing through the list of favorite items and populating the data likewise
        for(let i of items){
        row.innerHTML+=
        `<div class="col-3 card item " style="width: 18rem;">
                <img class="cardImage" src="${i.strMealThumb}" data-name="${i.strMeal}" alt="..." onclick="fetchIngredients(event)">
                <div class="card-body">
                    <h5 class="card-title">
                            ${i.strMeal} 
                            <i class="fa-solid fa-heart heart-icon favorite"
                            data-name="${i.strMeal}" data-thumb="${i.strMealThumb}" data-id="${i.id}"
                            onclick="setFavorite(event)"></i>
                    </h5>
                </div>
        </div>`; 
        }

}

// function to show the search result-div here
function showDiv()
{
    // showing the div in which we are displaying the search results
    const searchingItems = document.getElementById('searchingItems');
    searchingItems.style.display='block';
}

// function to hide the search result-div here
function hideDiv()
{
    // removing the value inside the search bar
    const searchValue = document.getElementById('inputSearch');
    searchValue.value='';

    // adding an event listener to check whether user has clicked outside the search results 
         document.addEventListener('click',
          function handleClickOutsideBox(event) {

    // getting the necessary elements
            const box = document.getElementById('box');
            const searchingItems = document.getElementById('searchingItems');

    // if user has clicked outside or anywhere other than the search results , the search results will hide
            if (!box.contains(event.target)) 
            {
                searchingItems.style.display = 'none';
            }
      });
   
}

// function to check whwther meal is present in favorites or not 
function isInFavorites(meal)
{
     // checking whether a meal is in favorites or not 
    // this function will return a boolean value


    // populating the favorite meals rom local storage
        let fav = JSON.parse(localStorage.getItem('favorites'));

    // check in favorites whether empty or not
    if( fav == null ||  fav == undefined || fav.length == 0 )
    {
        // if no fav item is present , return false
            return false;
    }
    else
    {
        // other wise check for every element whether it is a favorite meal or not
            for(let i of fav)
                {
                    if(i.strMeal == meal)
                    {
                        return true;
                    }
                    
                }
                // if the loop is complete and doesn't match the result , return false
            return false;

    }
    
}
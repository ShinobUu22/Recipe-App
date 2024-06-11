import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css"
import * as api from "./api"
import { Recipe } from "./types";
import RecipeCard from "./comps/RecipeCard";
import RecipieModel from "./comps/RecipieModel";

type Tabs = "search" | "favourites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favRecipes, setfavRecipes] = useState<Recipe[]>([]);

  const pageNum = useRef(1);

  useEffect(() => {
    const fetchFav = async () => {
      try {
        const favouriteRecipes = await api.getFavourites();
        console.log(favouriteRecipes);  // Log the response to check its structure
        setfavRecipes(favouriteRecipes.results || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFav();
  }, []);
  
  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
    } catch (e) {
      console.log(e);
    }
  };

  const handleViewMore = async () => {
    const nextPage = pageNum.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNum.current = nextPage;
    } catch (e) {
      console.log(e);
    }
  };

  const addFavorite = async (recipe: Recipe) => {
    try {
      await api.addFav(recipe);
      setfavRecipes([...favRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };
  
  const delFavorite = async (recipe: Recipe) => {
    try {
      await api.delFav(recipe)
      const uRecipe = favRecipes.filter((fav) => recipe.id !== fav.id)
      setfavRecipes(uRecipe)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="app-container d-flex flex-column align-items-center">
        <div className="header position-relative w-100">
          <img src="/hero-image.png" alt="Hero" className="w-100 h-50 my-5 opacity-75 border border-3"/>
          <div className="position-absolute top-50 start-50 translate-middle text-white text-center fw-bold fs-1">Recipe App</div>
        </div>
        
        <div className="tabs d-flex justify-content-around w-100 mb-4">
          <h2 className={`navbar-brand tab-item fw-bold fs-3 ${selectedTab === "search" ? "active" : ""}`} onClick={() => setSelectedTab("search")}>Recipe Search</h2>
          <h2 className={`navbar-brand tab-item fw-bold fs-3 ${selectedTab === "favourites" ? "active" : ""}`} onClick={() => setSelectedTab("favourites")}>Favourite</h2>
        </div>

        {selectedTab === "search" && (
          <>
            <form className="d-flex mb-4 w-75" onSubmit={handleSearchSubmit}>
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} required />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
            <div className="d-flex flex-wrap justify-content-center">
              {recipes.map((recipe) => {
                const isFav = favRecipes.some((favorRecipe) => recipe.id === favorRecipe.id);
                
                return (
                  <RecipeCard key={recipe.id} onFavBtnClick={isFav ? delFavorite : addFavorite} recipe={recipe} oncClick={() => setSelectedRecipe(recipe)} isFav={isFav} />
                );
              })}
            </div>
            <button className="btn btn-outline-secondary my-4" onClick={handleViewMore}>View more</button>
          </>
        )}

        {selectedTab === "favourites" && (
          <div className="d-flex flex-wrap justify-content-center">
            {Array.isArray(favRecipes) && favRecipes.map((recipe) => {
              const isFav = favRecipes.some((favorRecipe) => recipe.id === favorRecipe.id);
              
              return (
                <RecipeCard key={recipe.id} recipe={recipe} oncClick={() => setSelectedRecipe(recipe)} onFavBtnClick={delFavorite} isFav={isFav} />
              );
            })}
          </div>
        )}

        {selectedRecipe && <RecipieModel recipeId={selectedRecipe.id.toString()} onClose={() => setSelectedRecipe(undefined)} />}
      </div>
    </>
  );
};

export default App;

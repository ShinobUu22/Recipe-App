import { Recipe } from "../types"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import '../App.css'
interface Props{
recipe: Recipe;
oncClick: () => void;
onFavBtnClick: (recipe:Recipe) => void;
isFav: boolean;
}

const RecipeCard = ({recipe,oncClick,onFavBtnClick,isFav}: Props) => {
  return (
    <div className="image-cont" onClick={oncClick}>
      <div className="recipie-card">
       
         
           
        <img src={recipe.image} alt="" />
              
        <div className="recipe-card-title">
          <span onClick={(event)=>{event.stopPropagation()
            onFavBtnClick(recipe)}
          }>
            {isFav?<AiFillHeart size={25} color="red"/>:<AiOutlineHeart size={25} color="black"/>}
            
          </span>
            <h3>{recipe.title}</h3>
       
        </div>
      
      </div>
    </div>
  )
}

export default RecipeCard

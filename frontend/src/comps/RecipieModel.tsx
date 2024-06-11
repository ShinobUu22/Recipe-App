import { useEffect, useState } from "react"
import "../App.css"
import { RecipeSummary } from "../types";
import * as recipeApi from "../api";

interface Props{
  recipeId:string;
  onClose:() => void;
}


const RecipieModel = ({recipeId,onClose}:Props) => {
const [recipeSummary,setRecipeSummary] = useState<RecipeSummary>();
useEffect(()=>{
  const fetchRecipeSummary =async ()=>{
    try {
      const recipeSummary = await recipeApi.getRecipeSummary(recipeId)
      setRecipeSummary(recipeSummary)
    } catch (e) {
      console.log(e)
    }
  }
  fetchRecipeSummary()
},[recipeId])


  if(!recipeSummary){return <></>}
  return (
    <>
        <div className="container-overlay">

        </div>
        <div className="model">
            <div className="recipe-model-content">
                <div className="recipe-model-header">
                    <h2 className="recipe-model-title">{recipeSummary.title}
                    <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </h2>
                </div>
                <p dangerouslySetInnerHTML={{__html:recipeSummary.summary}}></p>
             
            </div>
        </div>
    </>
  )
}

export default RecipieModel

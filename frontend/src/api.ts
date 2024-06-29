import { Recipe } from "./types"


export const searchRecipes = async (searchTerm:string, page:number) => {
    const baseUrl = new URL("https://recipe-app-api-drab.vercel.app/api/recipes/search")
    baseUrl.searchParams.append("searchTerm",searchTerm)
    baseUrl.searchParams.append("page",String(page))

    const response = await fetch(baseUrl, {
  mode: 'no-cors'
})
    if(!response.ok){
        throw new Error(`HTTP err! Status: ${response.status}`)
    }
    return response.json()
}

export const getRecipeSummary=async (recipeId:string)=>{
    const url = new URL(`https://recipe-app-api-drab.vercel.app/api/recipes/${recipeId}/summary`)
    const response = await fetch(url, {
  mode: 'no-cors'
})
    if(!response.ok){
        throw new Error(`HTTP err! Status: ${response.status}`)
    }
    return response.json()
}

export const getFavourites=async ()=>{
    const url =new URL(`https://recipe-app-api-drab.vercel.app/api/recipes/favourite`)
    const response = await fetch(url, {
  mode: 'no-cors'
})
    if(!response.ok){
        throw new Error(`Http err! Status: ${response.status}`);
        
    }
    return response.json()
}

export const addFav=async(recipe:Recipe)=>{
    const url = new URL(`https://recipe-app-api-drab.vercel.app/api/recipes/favourite`)
    const body = {
        recipeId:recipe.id
    }
    const response = await fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
         mode: 'no-cors',
        body:JSON.stringify(body)
    })

    if(!response.ok){
        throw new Error(`Http err! Status: ${response.status}`);
        
    }
   
}
export const delFav=async(recipe:Recipe)=>{
    const url = new URL(`https://recipe-app-api-drab.vercel.app/api/recipes/favourite`)
    const body = {
        recipeId:recipe.id
    }
    const response = await fetch(url,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        mode: 'no-cors',
        body:JSON.stringify(body)
    })

    if(!response.ok){
        throw new Error(`Http err! Status: ${response.status}`);
        
    }

}

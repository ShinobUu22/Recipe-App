import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as recipeApi from './recipe-api';

// Define Mongoose schema and model
const favouriteRecipeSchema = new mongoose.Schema({
    recipeId: { type: String, required: true }
});

const FavouriteRecipe = mongoose.model('FavouriteRecipe', favouriteRecipeSchema);

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin:["https://recipe-app-frontend-sage.vercel.app"],
        methods:["POST","GET","DELETE"],
        credentials:true
    }
));

// Connect to MongoDB


mongoose.connect('mongodb+srv://Saphin:P4982oykvI2jUOMz@recipe-app.z72yosw.mongodb.net/recipe-app?retryWrites=true&w=majority&appName=Recipe-app');

app.get("/api/recipes/search", async (req, res) => {
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);
    const results = await recipeApi.searchRecipes(searchTerm, page);
    return res.json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
    const recipeId = req.params.recipeId;
    const results = await recipeApi.getRecipeSummary(recipeId);
    return res.json(results);
});

app.post("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;

    try {
        const favouriteRecipe = new FavouriteRecipe({ recipeId });
        await favouriteRecipe.save();
        return res.status(201).json("success");
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Oops! Something went wrong." });
    }
});

app.get("/api/recipes/favourite", async (req, res) => {
    try {
        const recipes = await FavouriteRecipe.find();
        const recipeIds = recipes.map((recipe) => recipe.recipeId);

        const favourites = await recipeApi.getFavouriteRecipeIDs(recipeIds);
        return res.json(favourites);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Oops! Something went wrong." });
    }
});

app.delete("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;
    try {
        await FavouriteRecipe.deleteOne({ recipeId });
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Oops! Something went wrong." });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

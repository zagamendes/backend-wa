import { Schema, model } from "mongoose";
const movieSchema = new Schema({
  title: String,
  image: String,
  director: String,
  producer: String,
  banner: String,
  description: String,
});

const MovieModel = model("movie", movieSchema);
export default MovieModel;

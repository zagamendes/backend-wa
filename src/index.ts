import express from "express";
import { AxiosResponse } from "axios";
import { Movie, MovieResponse, MoviesWithImageResponse } from "./types/movie";
import MovieModel from "./schemas/movie";
import mongoose from "mongoose";
import api from "./api";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));
mongoose
  .connect(
    "mongodb+srv://izaac:WWdQMreOR1nd1CiS@api-wa.dgx9njl.mongodb.net/?retryWrites=true&w=majority"
  )
  .catch((e) => {
    throw new Error(e);
  });

const startAt = async () => {
  const qtdMovies = (await MovieModel.find()).length;
  if (qtdMovies == 0) return 8;
  if (qtdMovies == 8) return 16;
  if (qtdMovies == 16) return 22;
  if (qtdMovies == 22) return 0;
};

app.post("/updatedb", async (req, res) => {
  const qtdMovies = (await MovieModel.find()).length;
  try {
    if (qtdMovies == 22) {
      res.send({
        message: "Não existem mais filmes para serem adicionados!",
        type: "info",
      });
    }

    let { data } = await api<Array<MovieResponse>>("/films", {
      params: {
        fields: "id,title,banner,description,director,producer",
        limit: await startAt(),
      },
    }).catch((e) => {
      throw new Error(e);
    });

    let arrayPromises: Promise<AxiosResponse<MoviesWithImageResponse, any>>[];

    if (qtdMovies == 0) {
      //setting array of movies with image included
      arrayPromises = data.map((movie) =>
        api<MoviesWithImageResponse>(`/films/${movie.id}`)
      );
    } else {
      //setting array of movies with image included
      let newMovies = data.slice(qtdMovies, data.length);
      arrayPromises = newMovies.map((movie) =>
        api<MoviesWithImageResponse>(`/films/${movie.id}`)
      );
    }

    const responses = await Promise.all(arrayPromises);

    const movies: Movie[] = responses.map(({ data }) => {
      return {
        title: data.title,
        image: data.image,
        director: data.director,
        producer: data.producer,
        banner: data.movie_banner,
        description: data.description,
      };
    });

    await MovieModel.insertMany(movies);
    res.send({ message: "Filmes adicionados com sucesso!", type: "success" });
  } catch (e) {
    res.send({ error: e.message });
  }
});
app.get("/movies", async (req, res) => {
  try {
    const allMovies = await MovieModel.find().catch((e) => {
      throw new Error(e);
    });

    const page = req.query.page;
    let movies;
    if (!page || page == "1") {
      movies = allMovies.slice(0, 8);
      res.send(movies);
    }
    const endAt = parseInt(page as string) * 8;

    res.send(
      allMovies.slice(
        endAt - 8,
        endAt > allMovies.length ? allMovies.length : endAt
      )
    );
  } catch (e) {
    res.send({ error: e.message });
  }
});
app.delete("/deleteMovies", async (req, res) => {
  const allMovies = await MovieModel.find().limit(8);
  allMovies.forEach(async (movie) => {
    await MovieModel.deleteOne({ title: movie.title });
  });
  console.log((await MovieModel.find()).length);
  res.send({ message: "Filmes apagados", type: "success" });
});
app.get("/totalMovies", async (req, res) => {
  try {
    const allMovies = await MovieModel.find().catch((e) => {
      throw new Error(e);
    });

    res.send({ total: allMovies.length });
  } catch (e) {
    res.send({ error: e.message });
  }
});

app.listen(8080, () => console.log("running🔥"));

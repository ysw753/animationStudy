import { IForm } from './components/Header';
const API_KEY = process.env.REACT_APP_THEMOVIEDB_API_KEY
const BASE_PATH ="https://api.themoviedb.org/3";
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: number;
  release_date:number;
  first_air_date:number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
  
}
interface ISearchData{
    adult: boolean;
    backdrop_path: string;
    id: number;
    media_type: string;
    original_title: string;
    overview: string;
    popularity:number;
    poster_path: string;
    release_date: string;
    title: string;
    name: string;
    vote_average: number;
    vote_count: number;
    first_air_date:number;
}

export interface IGetSearchMovie{
  results:ISearchData[];
}

export function getMovies(){
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  .then((response)=>response.json())
};
export const getTv = async (number?: number) => {
  const response = await fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&page=${number}`
  );
  return await response.json();
};
export async function searchMovies(query:string|null){
  const response = await fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${query}&page=1&include_adult=false`
  );
  return await response.json();
}
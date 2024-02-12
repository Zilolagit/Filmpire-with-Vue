import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from "vue"

export const useMovieStore = defineStore('movie', {
  state: () => ({
    api_key : "732dfe94c237f44327af913ebba97825",
    movies : [],
    page_number : 1,
    loader : false,
    movie_type : "popular",
    total_pages : 1,
    searchString : "",
    user : "",
  }),
  actions : {
    async reload() {
      let response = ref(null)
      this.loader = false
      if (this.searchString) {
        response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${this.searchString}&page=${this.page_number}&api_key=${this.api_key}`)
      }else {
        response = await axios.get(`https://api.themoviedb.org/3/movie/${this.movie_type}?page=${this.page_number}&api_key=${this.api_key}`)      
        }
      this.movies = response.data.results

      if (response.data.total_pages > 500){
        this.total_pages = 500
      }else {
        this.total_pages = response.data.results
      }
      this.loader = true
    },
    async searchForm(value){
      this.loader = false
      this.page_number = 1
      let response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${value}&page=${this.page_number}&api_key=${this.api_key}`)
      this.movies = response.data.results
      this.loader = false

    }
  }
})
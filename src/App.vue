<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { MDBBtn } from "mdb-vue-ui-kit";
import { onMounted, ref } from 'vue';
import axios from "axios";

// Pinia
import { storeToRefs } from 'pinia';
import { useMovieStore } from "@/stores/movie"
const useMovie = useMovieStore()
let { api_key, movie_type, page_number, loader, movies, searchString, user } = storeToRefs(useMovie)

let genres = ref([])



onMounted(async  () => {
  const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key.value}`)
  genres.value = response.data.genres
  const respond = await axios.get(`https://api.themoviedb.org/3/account?session_id=0bb461dbcf92b7578b64569d486f97e923680fe7&api_key=${api_key.value}`)
  user.value = respond.data.username[0].toUpperCase()
});

function otherCategory(value) {
  this.searchString = ""
  movie_type.value = value
  page_number.value = 1
  useMovie.reload()
}

async function genreClick(value) {
  loader.value = false
  page_number.value = 1
  this.searchString = ""
  let response = await axios.get(`https://api.themoviedb.org/3/discover/movie?with_genres=${value}&page=${page_number.value}&api_key=${api_key.value}`)
  movies.value = response.data.results
  loader.value = true
}



</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <img src="../public/logo.png" alt="logo">
    </div>
    <div class="category">
      <div class="category_sticky">
        <p>Categories</p>
      </div>
      <div class="category-group">
        <MDBBtn color="light" size="lg" style="width: 100%; text-align: left;" @click="otherCategory('popular')">
          <img src="../public/popular.png" alt="popular" class="me-3" style="width: 30px;">
          Popular
        </MDBBtn>
        <MDBBtn color="light" size="lg" style="width: 100%; text-align: left;" @click="otherCategory('top_rated')">
          <img src="../public/top_rated.png" alt="popular" class="me-3" style="width: 30px;">
          Top Rated
        </MDBBtn>
        <MDBBtn color="light" size="lg" style="width: 100%; text-align: left;" @click="otherCategory('upcoming')">
          <img src="../public/upcoming.png" alt="popular" class="me-3" style="width: 30px;">
          Upcoming
        </MDBBtn>
      </div>
    </div>
    <div class="genres">
      <div class="genres_sticky">
        <p>Genres</p>
      </div>
      <div class="category-group">
        <template v-for="genre in genres" :key="genre.id">
          <MDBBtn color="light" size="lg" style="width: 100%; text-align: left;" @click="genreClick(genre.id)">
            <img :src="`../public/${genre.id}.png`" alt="popular" class="me-3" style="width: 30px;">
            {{ genre.name }}
          </MDBBtn>
        </template>
      </div>
    </div>
  </div>
  <div class="top">
    <MDBBtn color="transparent" style="border-radius: 50%;">
      <i class="fas fa-cog text-white fs-5"></i>
    </MDBBtn> 

    <form class="d-flex input-group w-auto" @submit.prevent="useMovie.reload">
      <input
        type="search"
        v-model="searchString"
        class="form-control rounded"
        placeholder="Search"
        aria-label="Search"
        aria-describedby="search-addon"
      />
    </form>
     <MDBBtn color="transparent" size="lg" style="text-align: left; ">
      <span>My Movies</span>  <div class="circle text-dark"><p>{{ user }}</p> </div>
      </MDBBtn>

  </div>
  <div class="content">
    <RouterView />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

.logo {
  text-align: center;
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #ccc;
}

img {
  width: 150px;
  text-align: center;
  max-width: 100%;
}

.sidebar {
  width: 240px;
  position: fixed;
  top: 0px;
  overflow: hidden;
  overflow-y: auto;
  left: 0px;
  height: 100vh;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a5a5a5;
  }
  &::-webkit-scrollbar-track {
    background: #cfcfcf;
  }
}

.top {
  position: fixed;
  width: calc(100% - 240px);
  background-color: rgb(25, 118, 210);
  right: 0;
  top: 0;
  padding: 20px 20px 15px 30px;
  min-height: 64px;
  display: flex;
  justify-content: space-between;
}

h2 {
  margin: 0;
}

.content {
  top: 80px;
  position: fixed;
  width: calc(100% - 240px);
  right: 0;
  overflow-y:auto;
  height: calc(100% - 64px);
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a5a5a5;
  }
  &::-webkit-scrollbar-track {
    background: #cfcfcf;
  } 

}

.category {
  border-bottom: 1px solid #ccc;
  font-weight: 400;
  font-size: 15px;

  button {
    border-radius: 0;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 18px;
    text-transform: capitalize;
  }
  &_sticky {
    margin: 0;
    padding: 15px 15px;
    padding-left: 30px;
    position:sticky;
    top: 0px;
    z-index: 2;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.6);
  }
}

.genres {
  &_sticky {
    margin: 0;
    padding: 15px 15px;
    padding-left: 30px;
    position:sticky;
    top: 0px;
    z-index: 3;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.6);
  }
  button {
    border-radius: 0;
    display: flex;
    font-size: 18px;
    align-items: center;
    font-weight: 400;
    text-transform: capitalize;
  }
}
p {
  margin: 0;
  padding: 0;
}

.top {
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 0;
    // background-color: transparent;
    box-shadow: none;
    color: #fff;
    padding: 5px 15px;
    &:hover {
      color: #fff;
      background-color: transparent;
      box-shadow: none;
    }
    span {
      margin-right: 20px;
    }
  }
  .circle {
    width: 35px;
    height: 35px;
    background-color: #ddd;
    border-radius: 50%;
    display: flex; 
    justify-content: center; 
    font-size: 19px;
    align-items: center;
    p {
      margin: 0;
      padding: 0px;
    }
  }
}


</style>
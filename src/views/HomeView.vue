<script setup>

import { onMounted } from "vue";

// Pinia
import { storeToRefs } from 'pinia';
import { useMovieStore } from "@/stores/movie"
const useMovie = useMovieStore()
let { movies, page_number, loader, movie_type, total_pages, searchString } = storeToRefs(useMovie)


import { RouterLink } from "vue-router";


function nextPage() {
  page_number.value++
  useMovie.reload(searchString)
}

function prevPage() {
  page_number.value--
  useMovie.reload(searchString)
}

onMounted(() => {
  useMovie.reload(searchString)
});



</script>

<template>
  <main class="main" v-if="loader">
    <template v-if="movies.length > 0">
      <router-link to="/">
        <div class="banner"
          :style="`background-image: url(https://image.tmdb.org/t/p/original/${movies[0].backdrop_path});`">
          <p>{{ movies[0].title }}</p>
          <span>
            {{ movies[0].overview }}
          </span>
        </div>
      </router-link>
    </template>
    <div class="movies" id="movies" v-if="movies.length > 0">
      <template v-for="movie in movies" :key="movie.id">
        <div v-if="movie.id != movies[0].id" class="card" >
          <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : 'https://via.placeholder.com/400' " :alt="movie.title">
          <p>{{ movie.title }}</p>
          <div>
            <v-rating :length="5" :model-value="movie.vote_average / 2" half-increments color="warning" :size="25"
              readonly></v-rating>
            <v-tooltip activator="parent" location="bottom">{{ (movie.vote_average / 2).toFixed(2) }}</v-tooltip>
          </div>
        </div>
      </template>
    </div>
    <div class="pagination">
      <v-btn :disabled="page_number == 1" @click="prevPage" color="primary">
        Prev
      </v-btn>
      <p>{{ page_number }}</p>
      <v-btn color="primary" @click="nextPage" :disabled="page_number == total_pages">
        Next
      </v-btn>
    </div>
  </main>
  <div v-else class="loader-box">
    <div class="loader"></div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  padding: 20px 30px;
}

.banner {
  height: 490px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-bottom: 25px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 5px;
  color: #fff;
  padding: 40px 30px;
  overflow: hidden;
  position: relative;

  p {
    font-size: 25px;
    margin-bottom: 10px;
    z-index: 3;
  }

  span {
    display: block;
    width: 450px;
    z-index: 3;
  }

  &::before {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.5;
    content: "";
  }
}

.movies {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15%, 1fr));
  grid-column-gap: 10px;
  grid-row-gap: 20px;
  text-align: center;
  .card {
    cursor: pointer;
  }

  img {
    width: 100%;
    max-width: 100%;
    height: 300px;
    overflow-clip-margin: content-box;
    overflow: clip;
    border-radius: 5px;
    // object-fit: cover;
    // object-position: center;
  }

  p {
    font-size: 22px;
    overflow: hidden;
    color: #000;
    white-space: nowrap;
    padding: 0 10px;
    padding-top: 10px;
    padding-bottom: 5px;
    text-overflow: ellipsis;

    &+div {
      padding-bottom: 10px;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  align-items: center;
  p {
    margin: 0 20px;
    font-weight: 500;
    font-size: 25px;
  }
}

.loader-box {
  height: 100%;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: rgb(25, 118, 210);
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {to{transform: rotate(1turn)}}

</style>

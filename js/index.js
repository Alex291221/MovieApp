const API_KEY = "3a54ecc1-ccbd-479c-9f08-3307d7e01981";

const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";

const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
get_movies(API_URL_POPULAR);

async function get_movies(url) {
    const resp = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    })
    const respData = await resp.json()
    ShowMovies(respData)
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green"
    }
    else if (vote > 5) {
        return "orange"
    }
    else {
        return "red"
    }
}

function ShowMovies(data) {
    const moviesEl = document.querySelector(".movies")

    document.querySelector(".movies").innerHTML = "";

    data.films.forEach(movie => {
        const movieEl = document.createElement("div")
        movieEl.classList.add("movie")
        movieEl.innerHTML = `
        <div class="movie_cover-inner">
                <img src="${movie.posterUrlPreview}"
                alt="${movie.nameRu}" class="movie_cover">
                <div class="movie_cover--darkned"></div>
        </div>
        <div class="movie_info">
            <div class="movie-title">
                ${movie.nameRu}
            </div>
            <div class="movie_category"> 
                ${movie.genres.map(
            (genre) => ` ${genre.genre}`
        )
            }
            </div>
            <div class="movie_average movie_average--${getClassByRate(movie.rating)}">
                ${movie.rating}
            </div>
        </div>
        `;
        movieEl.addEventListener("click", () => openModel(movie.filmId))
        moviesEl.appendChild(movieEl);
    })
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        get_movies(apiSearchUrl);

        search.value = ""
    }
})

// ModalWindow

const modalEl = document.querySelector(".modal_window")

async function openModel(id) {
    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    })
    const respData = await resp.json()

    modalEl.classList.add("modal_window--show")

    document.body.classList.add("stop-scrolling")

    modalEl.innerHTML = `
        <div class="modal_card">
            <img class="modal_movie-backdrop" src="${respData.posterUrl}" alt="" >
            <h2>
                <span class="modal_movie_title">Название - ${respData.nameRu}</span>
                <span class="modal_movie_title">Год - ${respData.year}</span>
            </h2>
            <ul class="modal_movie-info">
                <div class="loader"></div>
                <li class="modal_movie-genre"> Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
                ${respData.filmLength ? `<li class="modal_movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
                <li>Сайт <a href="${respData.webUrl}"class="modal_movie-site">${respData.webUrl}</a></li>
                <li class="modal_movie-overview">${respData.description}</li>
            </ul>
            <button type = "button" class="modal_button-close">Закрыть</button>
        </div>
    `
    const btnClose = document.querySelector(".modal_button-close")
    btnClose.addEventListener("click", () => closeModal());
}

function closeModal(){
    modalEl.classList.remove("modal_window--show");
    document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
    if (e.target === modalEl){
        closeModal()
    }
})

window.addEventListener("keydown", (e) =>{
    if(e.keyCode === 27){
        closeModal()
    }
})

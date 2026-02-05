// to build a unstyled list of movies 

let movies = [];
async function fetchMovies() {
    let movieResponse = await fetch("https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/523c324c7fcc36efab8224f9ebb7556c09b69a14/Film.JSON")

    movies = await movieResponse.json()
    console.log(movies, "movies")
    populateMovies(movies)



}


// console.log(fetchMovies().then((data)=>{console.table(data[0],"movie data")}).catch(),"list of movies")

function populateMovies(movieList) {
    document.getElementById("movie-list").innerHTML = "";
    // get the innerHTML of the list element 
    // update the innerHTML with list elements i.e movie title 
    // update the list component with the new innerHTML


    let listElement = document.getElementById("movie-list").innerHTML;

    movieList.forEach((movie) => {
        listElement += `<li>${movie.Title}</li>`
    })


    document.getElementById("movie-list").innerHTML = listElement
}


function searchMovie() {

    let searchValue = document.getElementById("search-input").value
    let searchGenre = document.getElementById("search-genre").value

    let filteredMovies = movies.filter((movie) => {
        return movie.Title.toLowerCase().includes(searchValue.toLowerCase())|| isSubsequenceOf(movie.Title.toLowerCase(),searchValue.toLowerCase()) && movie.Genre.toLowerCase().includes(searchGenre.toLowerCase())
       
    })
    // fetch the value from the input field
    // it needs to check for substrings in all movies 
    // update the list with the filter movie 
    populateMovies(filteredMovies)
}


function isSubsequenceOf(str, seq) {
    let seqIndex = 0
    let strIndex = 0

    while (seqIndex < seq.length && strIndex < str.length) {
        if (seq[seqIndex] === str[strIndex]) {
            seqIndex++
        }
        strIndex++
    }
    return seqIndex === seq.length
}
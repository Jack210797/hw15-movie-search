const moviesListElement = document.querySelector('#movies-list')
const searchInput = document.querySelector('#search')
const searcCheckbox = document.querySelector('#checkbox')

let lastSearchQuery = null
let isSearchTriggerEnabled = false

const debounceTime = (() => {
  let timer = null
  return (callback, time) => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  timer = setTimeout(callback, time)
  }
})()

const getData = url => fetch(url)
  .then(res => res.json())
  .then(data => {
    if (!data || !data.Search) throw new Error('Сервер повернув некоректні дані')
    return data.Search
  })

const addMovieToList = movie => {
  const item = document.createElement('div')
  const itemDescription = document.createElement('div')
  const img = document.createElement('img')

  item.classList.add('movie')
  itemDescription.classList.add('movie__title')

  img.classList.add('movie__image')
  img.src = /^(http|https):\/\//i.test(movie.Poster) ? movie.Poster : 'img/no-image.png'
  img.alt = `${movie.Title} ${movie.Year}`
  img.title = `${movie.Title} ${movie.Year}`

  item.append(img)
  itemDescription.innerHTML = `${movie.Title} (${movie.Year})`
  item.append(itemDescription)
  moviesListElement.prepend(item)
}

const clearMoviesMarkup = () => {
  if (moviesListElement) moviesListElement.innerHTML = ''
}

const inputSearchHandler = (e) => {
  debounceTime(() => {
    const searchQuery = e.target.value.trim()

    if (!searchQuery || searchQuery.length < 4 || searchQuery === lastSearchQuery) return
    if (!isSearchTriggerEnabled) clearMoviesMarkup()

    getData(`http://www.omdbapi.com/?apikey=4ecdee2&s=${searchQuery}`)
      .then(movies => movies.forEach(addMovieToList))
      .catch(error => console.log(error))

    lastSearchQuery = searchQuery
  },2000)
}

searchInput.addEventListener('input', inputSearchHandler)
searcCheckbox.addEventListener('change', e => (isSearchTriggerEnabled = e.target.checked))






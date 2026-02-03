// https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/523c324c7fcc36efab8224f9ebb7556c09b69a14/Film.JSON
``


document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('.search-input')
    const suggestions = document.querySelector('.suggestions')
    let currentFoucsedIndex = -1



    input.addEventListener('keyup', debounce(handleAutoSuggestions, 300))

    function createSearchItem(item) {
        const searchItem = document.createElement('div')
        searchItem.classList.add('searchItem')
        searchItem.textContent = item;
        return searchItem
    }


    function handleClick(event) {
        input.value = event.target.textContent
        clearSuggestions()
    }

    function clearSuggestions() {
        suggestions.innerHTML = ''
    }



    function renderSuggestions(suggestionsList) {
        clearSuggestions()
        suggestionsList.forEach((item) => {
            const searchitem = createSearchItem(item)
            searchitem.addEventListener('click', handleClick)
            suggestions.appendChild(searchitem)

        })
    }



    async function getSuggestions(searchInput) {
        try {
            const res = await fetch(`https://dummyjson.com/products/search?q=${searchInput}`)
            const data = await res.json()
            console.log(data, "apidata")
            const list = data.products.map((item) => item.title)
            renderSuggestions(list)



        } catch (error) {
            console.error(error)
        }
    }



    function handleAutoSuggestions(event) {
        console.log(event.target.value)

        const key = event.key

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            event.preventDefault()
            currentFoucsedIndex = updateFoucsedIndex(key, suggestions.children.length)
            updateFocus()
        } else if (key === 'Enter') {
            handleEnterKey()
        } else {
            if (!event.target.value.trim()) {
                clearSuggestions()
                return
            }
            getSuggestions(event.target.value)
        }       
    }



    function handleEnterKey() {
        if (currentFoucsedIndex !== -1) {
            input.value = suggestions.children[currentFoucsedIndex].textContent;
            clearSuggestions()
        }
    }
    function updateFoucsedIndex(key, maxIndex) {
        if (key === 'ArrowDown') {
            return Math.min(currentFoucsedIndex + 1, maxIndex - 1)
        }
        else {
            return Math.max(currentFoucsedIndex - 1, -1)
        }
    }

    function updateFocus() {
        for (let i = 0; i < suggestions.children.length; i++) {
            suggestions.children[i].classList.remove('focused')
        }
        if (currentFoucsedIndex >= 0 && currentFoucsedIndex < suggestions.children.length) {
            suggestions.children[currentFoucsedIndex].classList.add('focused')
        }
    }


    function debounce(fun, delay) {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                timer = null;
                fun.apply(context, args)
            }, delay)
        }

    }
    document.body.addEventListener('click', function (event) {
        console.log(event.target.classList[0])
        if (event.target.classList[0] === 'searchContainer') {
            clearSuggestions()
        }
    })
})


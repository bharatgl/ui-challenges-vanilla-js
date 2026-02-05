console.log("this js is working fine")



const productList = document.querySelector(".product-list")
const loader = document.querySelector(".loader")

let state = {
    page: 0,
    limit: 1000,
    loading: false,
    hasMore: true

}



async function fetchProducts() {

    if (state.loading || !state.hasMore) return

    state.loading = true;
    loader.style.display = "block"

    try {
        const limit = state.limit
        const skip = limit * state.page

        const fetchAPIData = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)

        const data = await fetchAPIData.json()

        const products = data.products || []
        if (products.length === 0) {
            state.hasMore = false;
            loader.innerText = "no more products"
        }

        if (products.length < state.limit) {
            state.hasMore = false;
        }

        renderProducts(products)
        state.page++;

        console.log("data", data, products)
    } catch (error) {
        console.error(error)
    }finally{
        state.loading= false
        if(state.hasMore){
            loader.style.display="none"
        }
    }

}

fetchProducts()


function renderProducts(products) {
    const fragments = document.createDocumentFragment();

    products.forEach((product) => {
        const div = document.createElement("div")
        div.className = "product-card"


        div.innerHTML = `<h4>${product.title}</h4>
<p>${product.price}</p>
`
        fragments.appendChild(div)

    })

    productList.appendChild(fragments)


}


// function handleScroll() {
//     const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//     if (scrollTop + clientHeight >= scrollHeight - 100) { fetchProducts() }
// }

// window.addEventListener("scroll", handleScroll)



const observer = new IntersectionObserver(enteries => {
    if (enteries[0].isIntersecting) {
        fetchProducts()
    }
})

observer.observe(loader)
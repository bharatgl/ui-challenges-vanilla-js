console.log("this js is working")


let state = {
    originalData: [],
    filteredData: [],
    searchItem: '',
    selectedCategory: 'all',
    currentPage: 1,
    rowsPerPage: 5

}


const searchItem = document.querySelector(".inputBox")
const filter = document.querySelector(".filter")
const prevBtn = document.querySelector(".prev")
const nextBtn = document.querySelector(".next")
const pageInfo = document.querySelector(".page-info")


async function fetchProducts() {
    const fetchAPIData = await fetch(`https://dummyjson.com/products`)
    const res = await fetchAPIData.json()
    const products = res.products || []
    console.log(products, "products")
    state.originalData = products
    state.filteredData = products
    populateSearch()
    applyPipeLine()
}



function applyPipeLine() {

    let data = [...state.originalData]

    console.log(data, "data from pipeline")

    if (state.searchItem) {
        data = data.filter((product) => {
            return product.title.toLowerCase().includes(state.searchItem.toLowerCase())
        })

    }
    if (state.selectedCategory !== "all") {
        data = data.filter((product) => {
            return product.category === state.selectedCategory
        })
    }

    state.filteredData = data
    state.currentPage=1;
    renderTable()


}

function populateSearch() {

    filter.innerHTML = `<option value="all">All Categories</option>`

    const categories = [...new Set(state.originalData.map((p) => p.category))]


    console.log("categories", categories);


    categories.forEach((category) => {
        const option = document.createElement("option")
        option.textContent = category
        option.value = category
        filter.appendChild(option)
    })
}


function updatedPaginatedControls(){
    const totalPages = Math.ceil(state.filteredData.length/state.rowsPerPage)
    pageInfo.textContent=`Page ${state.currentPage} of ${totalPages}`
    prevBtn.disabled = state.currentPage===1
    nextBtn.disabled = state.currentPage===totalPages
}


function renderTable() {

    const tbody = document.querySelector(".table-body")
    tbody.innerHTML = ""

  if(!state.filteredData.length){
        tbody.innerHTML=`<tr><td colspan=5>No Products found</td></tr>`
        return
    }
    const startIndex = (state.currentPage-1) * state.rowsPerPage
    const endIndex = startIndex + state.rowsPerPage

    const paginatedData = state.filteredData.slice(startIndex,endIndex)


  
    paginatedData.forEach((product) => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${product.id}</td>

          <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.category}</td>
            <td>${product.rating}</td>

            `
        tbody.appendChild(row)
        
    })
    updatedPaginatedControls()
}



searchItem.addEventListener("input", function (e) {
    state.searchItem = e.target.value
    applyPipeLine()
})


filter.addEventListener("change", function (e) {
    state.selectedCategory = e.target.value
    applyPipeLine()
})


prevBtn.addEventListener("click",function(){
if(state.currentPage>1){
    state.currentPage--
    renderTable()
}
})

nextBtn.addEventListener("click",function(){
const totalPages = Math.ceil(state.filteredData.length/state.rowsPerPage)


    if(state.currentPage <totalPages){
        state.currentPage++
        renderTable()
    }
})


fetchProducts()     
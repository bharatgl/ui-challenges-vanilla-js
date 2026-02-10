// console.log("this js is working");

// let state = {
//   products: [],
//   selectedCategory: "all",
// };

// const option = document.querySelector(".option");
// const input = document.querySelector(".inputBox");
// const filter = document.querySelector(".filter");
// const searchContainer = document.querySelector(".searchItems");

// searchContainer.style.display = "none";

// async function fetchProducts() {
//   const apiData = await fetch(`https://dummyjson.com/products`);
//   const res = await apiData.json();
//   const products = res.products || [];

//   console.log(products, "products");
//   //   renderProducts(products);
//   state.products = products;
// }

// function handleSearch(e) {
//   const value = e.target.value.toLowerCase();

//   if (!value) {
//     searchContainer.innerHTML = "";
//     searchContainer.style.display = "none";
//     return;
//   }

//   const filteredProducts = state.products.filter((product) => {
//     return product.title.toLowerCase().includes(value);
//   });
//   renderProducts(filteredProducts);
// }

// function debouncedSearch(fn, delay) {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(this, args);
//     }, delay);
//   };
// }

// function renderProducts(products) {
//   searchContainer.innerHTML = "";
//   console.log(products, "data");

//   if (!products.length) {
//     searchContainer.style.display = "none";
//     return;
//   }
//   searchContainer.style.display = "block";

//   products.forEach((product) => {
//     const item = document.createElement("div");
//     item.className = "searchItem";
//     item.textContent = product.title;
//     searchContainer.appendChild(item);

//     item.addEventListener("click", function () {
//       input.value = product.title;
//       searchContainer.innerHTML = "";
//       searchContainer.style.display = "none";
//     });
//   });
// }

// const debounceHandler = debouncedSearch(handleSearch, 300);
// input.addEventListener("input", debounceHandler);

// document.addEventListener("click", function (e) {
//   if (!e.target.closest(".inputContainer")) {
//     searchContainer.innerHTML = "";
//     searchContainer.style.display = "none";
//   }
// });

// fetchProducts();

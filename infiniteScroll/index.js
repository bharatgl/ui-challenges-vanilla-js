console.log("this is working");

let state = {
  limit: 50,
  skip: 0,
  hasMore: true,
  loading: false,
};

const productLst = document.querySelector(".product-list");
const loader = document.querySelector(".loader");

async function fetchProducts() {
  if (state.loading || !state.hasMore) return;
  state.loading = true;
  //   const limit = state.limit;
  //   const skip = state.skip;

  const { limit, skip } = state;
  console.log("limit", limit, skip);

  const apiData = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
  );

  const res = await apiData.json();
  const products = res.products || [];
  console.log(products, "products");
  renderProducts(products);

  state.skip += state.limit;
  if (products.length < state.limit) {
    state.hasMore = false;
    loader.style.display = "none";
  }
  state.loading = false;
}

function renderProducts(products) {
  const fragments = document.createDocumentFragment();
  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "products";
    div.innerHTML = `<h4>${product.title}</h4>
    <span>${product.price}</span>`;
    fragments.appendChild(div);
  });
  productLst.appendChild(fragments);
}

const observer = new IntersectionObserver((enteries) => {
  if (enteries[0].isIntersecting) {
    fetchProducts();
  }
});

observer.observe(loader);

fetchProducts();

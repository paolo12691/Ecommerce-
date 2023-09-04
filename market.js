const API_URL = 'https://striveschool-api.herokuapp.com/api/product';
const TOKEN =
	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVjZmNiMGM1NGNhODAwMTRhNDVhYzgiLCJpYXQiOjE2OTMyNTI3ODQsImV4cCI6MTY5NDQ2MjM4NH0.SC3MO7ZPvjmTIvlyqb7TiUQFhlObtPeNw4KO1mjOGt0';

async function fetchProducts() {
	try {
		const options = {
			method: 'GET',
			headers: {
				Authorization: TOKEN
			}
		};
		const response = await fetch(API_URL, options);
		const products = await response.json();
		setTimeout(() => {
			//document.querySelector('.spinner-container').classList.add('d-none');
			displayProducts(products);
		}, 500);
	} catch (error) {
		console.log(error);
	}
}

function displayProducts(products) {
	const productsContainer = document.getElementById('products-container');
	productsContainer.innerHTML = '';

	products.forEach((product) => {
		//<p class="card-text">${product.description}</p>
		const card = `
      <div class="col-md-3 col-xl-2 mb-4">
        <div class="card">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h6 class="card-title">${product.name}</h6>
            
            <p class="card-text">${product.price} euro</p>
            <a href="#" class="btn btn-primary" onclick="addToCart('${product._id}', '${product.name}', '${product.imageUrl}',${product.price})">Aggiungi al carrello</a>
          </div>
        </div>
      </div>
    `;

		productsContainer.innerHTML += card;
	});
}

function addToCart(productId, productName, productImageUrl, productPrice) {
	let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

	if (!cartItems[productId]) {
		cartItems[productId] = {
			name: productName,
			price: productPrice,
			imageUrl: productImageUrl,
			quantity: 1
		};

		localStorage.setItem('cartItems', JSON.stringify(cartItems));
		appendAlert('Prodotto aggiunto al carrello!');
	} else {
		cartItems[productId].quantity++;
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
		appendAlert('Prodotto aggiunto al carrello!');
	}
	updateCartIcon();

	setTimeout(function() {
		const alertElement = document.querySelector('.alert');
		if (alertElement) {
			alertElement.style.display = 'none';
		}
	}, 3000); //  3 secondi
}

function updateCartIcon() {
	const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
	let totalQuantity = 0;

	for (const productId in cartItems) {
		totalQuantity += cartItems[productId].quantity;
	}

	const cartQuantityElement = document.getElementById('cart-quantity');
	cartQuantityElement.textContent = totalQuantity.toString();
}

document.addEventListener('DOMContentLoaded', function() {
	updateCartIcon();
});
fetchProducts();

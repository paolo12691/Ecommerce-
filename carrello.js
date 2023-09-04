document.addEventListener('DOMContentLoaded', function() {
	const clearCartButton = document.getElementById('clear-cart');
	const cartItemsElement = document.getElementById('cart-items');
	const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

	for (const productId in cartItems) {
		const product = cartItems[productId];
		const li = document.createElement('li');
		li.className =
			'list-group-item d-flex justify-content-between align-items-center';
		li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${product.imageUrl}" alt="${product.name}" width="100" class="me-3">
        <div>
          <h5>${product.name}</h5>
          <p>Prezzo: ${product.price} euro</p>
        </div>
      </div>
      <span class="badge bg-secondary">${product.quantity}</span>
    `;
		cartItemsElement.appendChild(li);
	}
	clearCartButton.addEventListener('click', function() {
		localStorage.removeItem('cartItems');
		cartItemsElement.innerHTML = '';
		updateCartIcon();
	});
});

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

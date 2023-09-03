const API_URL = 'https://striveschool-api.herokuapp.com/api/product';
const TOKEN =
	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVjZmNiMGM1NGNhODAwMTRhNDVhYzgiLCJpYXQiOjE2OTMyNTI3ODQsImV4cCI6MTY5NDQ2MjM4NH0.SC3MO7ZPvjmTIvlyqb7TiUQFhlObtPeNw4KO1mjOGt0';
async function fetchProducts() {
	handleAlertMessage();
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
			document.querySelector('.spinner-container').classList.add('d-none');
			displayProducts(products);
		}, 500);
	} catch (error) {
		console.log(error);
	}
}

function displayProducts(products) {
	const tableBody = document.getElementById('products-table-body');
	tableBody.innerHTML = '';

	products.forEach((product) => {
		//<td>${product.description}</td>
		const row = `
      <tr>
        <td scope="row">${product._id}</td>
        <td><img src="${product.imageUrl}" width="150"></td>
        <td>${product.name}</td>
        
        <td>${product.price}</td>
        <td>
          <a class="btn btn-primary me-2" onclick="editProduct('${product._id}')">Modifica</a>
          <a class="btn btn-danger ms-2" onclick="deleteProduct('${product._id}')">Cancella</a>
        </td>
      </tr>
    `;

		tableBody.innerHTML += row;
	});
}
fetchProducts();

function addProduct() {
	window.location.href = 'product-form.html';
}

function editProduct(productId) {
	window.location.href = `product-form.html?id=${productId}`;
}

async function deleteProduct(productId) {
	if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
		try {
			await fetch(`${API_URL}/${productId}`, {
				method: 'DELETE',
				headers: {
					Authorization: TOKEN
				}
			});
			window.location.href = 'index.html?status=cancel-ok';
		} catch (error) {
			console.log("Errore nel'eleminazione del prodotto: ", error);
		}
	}
}

function editProduct(productId) {
	window.location.href = `product-form.html?id=${productId}`;
}

function handleAlertMessage() {
	const qsParams = new URLSearchParams(window.location.search);
	const status = qsParams.get('status');

	if (status && status === 'create-ok') showAlert('create');
	if (status && status === 'edit-ok') showAlert('update');
	if (status && status === 'cancel-ok') showAlert('cancel');

	clearQueryString();
}

function showAlert(actionType) {
	const alertCnt = document.getElementById('alert-container');
	alertCnt.classList.remove('d-none');
	alertCnt.innerHTML =
		actionType === 'create'
			? 'Prodotto creato con successo'
			: actionType === 'update'
				? 'Prodotto modificato con successo'
				: 'Prodotto eliminato con successo';

	setTimeout(() => {
		alertCnt.classList.add('d-none');
	}, 4000);
}

function clearQueryString() {
	const url = new URL(window.location.href);
	url.search = '';
	window.history.replaceState({}, '', url.toString());
}

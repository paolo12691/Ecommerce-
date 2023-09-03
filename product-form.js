const API_URL = 'https://striveschool-api.herokuapp.com/api/product/';
const Token =
	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGVjZmNiMGM1NGNhODAwMTRhNDVhYzgiLCJpYXQiOjE2OTMyNTI3ODQsImV4cCI6MTY5NDQ2MjM4NH0.SC3MO7ZPvjmTIvlyqb7TiUQFhlObtPeNw4KO1mjOGt0';
function goBack() {
	window.location.href = 'index.html';
}
const form = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('user-id');
const imageSelect = document.getElementById('image-select');
const imagePreview = document.getElementById('image-preview');
const selectImageContainer = document.getElementById('select-image');
const urlImageContainer = document.getElementById('url');
const textUrl = document.getElementById('urlImage');
const descriptionInput = document.getElementById('description');
const brandInput = document.getElementById('brand');
const numberInput = document.getElementById('number');
const autocompleteOptions = document.getElementById('autocompleteOptions');
let typingTimer;
const typingDelay = 500;

nameInput.addEventListener('input', async (event) => {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(async () => {
		try {
			const response = await fetch(
				'https://db.ygoprodeck.com/api/v7/cardinfo.php?language=it&fname=' +
					event.target.value.replaceAll(' ', '%20')
			);
			const data = await response.json();

			if (response.status === 200) {
				autocompleteOptions.innerHTML = '';

				let dataLength = data.data.length;

				let randomIndeces = [];
				while (randomIndeces.length < Math.min(dataLength, 5)) {
					let randomIndex = Math.floor(Math.random() * dataLength);
					if (!randomIndeces.includes(randomIndex)) {
						randomIndeces.push(randomIndex);
					}
				}

				randomIndeces.forEach((randomIndex) => {
					const card = data.data[randomIndex];

					const option = document.createElement('div');
					option.classList.add('autocomplete-option');
					const innerDiv = document.createElement('div');
					innerDiv.textContent = card.name;

					innerDiv.classList.add(
						'btn',
						'btn-light',
						'p-2',
						'w-100',
						'text-start'
					);
					innerDiv.addEventListener('click', function() {
						autocompleteOptions.innerHTML = '';
						// Nascondi l'input manuale dell'URL dell'immagine
						urlImageContainer.classList.add('d-none');
						// Mostra la selezione delle immagini
						selectImageContainer.classList.remove('d-none');

						nameInput.value = card.name;

						// Popola l'opzione di selezione con le immagini delle carte
						imageSelect.innerHTML =
							'<option value="">Seleziona un\'immagine</option>';
						card.card_images.forEach((image, index) => {
							const option = document.createElement('option');
							option.value = image.image_url;
							option.textContent = `Immagine ${index + 1}`;
							imageSelect.appendChild(option);
						});

						descriptionInput.value = card.desc;
						descriptionInput.disabled = true;
						brandInput.value = 'Yu-Gi-Oh';
						brandInput.disabled = true;
						imagePreview.src = '';
						imagePreview.alt = '';

						// Mostra l'anteprima dell'immagine selezionata
						imageSelect.addEventListener('change', () => {
							const selectedImage = imageSelect.value;
							imagePreview.src = selectedImage;
							imagePreview.alt = card.name;
							imagePreview.style.display = selectedImage ? 'block' : 'none';
						});
					});
					option.appendChild(innerDiv);
					autocompleteOptions.appendChild(option);
				});
			} else {
				// Mostra l'input manuale dell'URL dell'immagine
				urlImageContainer.classList.remove('d-none');
				// Nascondi la selezione delle immagini
				selectImageContainer.classList.add('d-none');
			}
		} catch (error) {
			console.log(error);
		}
	}, typingDelay);
});
function buildTitle(userId) {
	const pageTitle = document.getElementById('page-title');
	pageTitle.innerHTML = userId ? 'Modifica utente' : 'Crea nuovo prodotto';
}

async function getProduct() {
	const productId = new URLSearchParams(window.location.search).get('id');
	buildTitle(productId);

	if (productId) {
		// MODIFICA UTENTE

		try {
			const options = {
				method: 'GET',
				headers: {
					Authorization: Token
				}
			};
			const response = await fetch(`${API_URL}/${productId}`, options);
			const product = await response.json();

			if (!product._id) {
				alert('Il prodotto non esiste');
				return;
			}
			idInput.value = product._id;
			try {
				const response = await fetch(
					'https://db.ygoprodeck.com/api/v7/cardinfo.php?language=it&fname=' +
						product.name.replaceAll(' ', '%20')
				);
				const data = await response.json();

				if (response.status === 200) {
					setTimeout(() => {
						document
							.querySelector('.spinner-container')
							.classList.add('d-none');
						document.querySelector('#product-form').classList.remove('d-none');
					}, 500);

					const card = data.data[0];

					// Nascondi l'input manuale dell'URL dell'immagine
					urlImageContainer.classList.add('d-none');
					// Mostra la selezione delle immagini
					selectImageContainer.classList.remove('d-none');

					// Popola l'opzione di selezione con le immagini delle carte
					/* imageSelect.innerHTML = '<option value="">Seleziona un\'immagine</option>'; */
					imagePreview.src = product.imageUrl;
					imagePreview.style.display = product.imageUrl ? 'block' : 'none';
					card.card_images.forEach((image, index) => {
						const option = document.createElement('option');
						if (image.image_url === product.imageUrl) {
							option.selected = true;
						}
						option.value = image.image_url;
						option.textContent = `Immagine ${index + 1}`;
						imageSelect.appendChild(option);
					});

					// Mostra l'anteprima dell'immagine selezionata
					imageSelect.addEventListener('change', () => {
						const selectedImage = imageSelect.value;
						imagePreview.src = selectedImage;
						imagePreview.style.display = selectedImage ? 'block' : 'none';
					});
				} else {
					// Mostra l'input manuale dell'URL dell'immagine
					urlImageContainer.classList.remove('d-none');
					// Nascondi la selezione delle immagini
					selectImageContainer.classList.add('d-none');
				}
			} catch (error) {
				console.log(error);
			}
			nameInput.value = product.name;
			descriptionInput.value = product.description;
			brandInput.value = product.brand;
			numberInput.value = product.price;
		} catch (error) {
			console.log('Errore nel recupero degli utenti: ', error);
		}
	} else {
		// CREAZIONE UTENTE
		document.querySelector('.spinner-container').classList.add('d-none');
		document.querySelector('#product-form').classList.remove('d-none');
	}
}
getProduct();

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const isFormValid = handelFormValidation();
	if (!isFormValid) return false;
	const productId = new URLSearchParams(window.location.search).get('id');
	const name = nameInput.value;
	const description = descriptionInput.value;
	const brand = brandInput.value;
	const price = numberInput.value;
	const imageUrl = imageSelect.value || textUrl.value;
	const product = {
		name: name,
		description: description,
		brand: brand,
		price: price,
		imageUrl: imageUrl
	};
	const options = {
		method: productId ? 'PUT' : 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: Token
		},
		body: JSON.stringify(product)
	};

	try {
		const URL = productId ? `${API_URL}/${productId}` : `${API_URL}`;

		const response = await fetch(URL, options);
		const data = await response.json();

		if (response.ok) {
			window.location.href = productId
				? `index.html?status=edit-ok`
				: `index.html?status=create-ok`;
		} else {
			alert(JSON.stringify(data.error)); //data.error
		}
	} catch (error) {
		console.log('Errore nel salvataggio del prodotto: ', error);
	}
});
async function addProduct() {
	const isFormValid = handelFormValidation();
	if (!isFormValid) return false;
	const productId = new URLSearchParams(window.location.search).get('id');
	const name = nameInput.value;
	const description = descriptionInput.value;
	const brand = brandInput.value;
	const price = numberInput.value;
	const imageUrl = imageSelect.value || textUrl.value;
	const product = {
		name: name,
		description: description,
		brand: brand,
		price: price,
		imageUrl: imageUrl
	};
	const options = {
		method: productId ? 'PUT' : 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: Token
		},
		body: JSON.stringify(product)
	};

	try {
		const URL = productId ? `${API_URL}/${productId}` : `${API_URL}`;

		const response = await fetch(URL, options);
		const data = await response.json();

		if (response.ok) {
			window.location.href = productId
				? `index.html?status=edit-ok`
				: `index.html?status=create-ok`;
		} else {
			alert(JSON.stringify(data.error)); //data.error
		}
	} catch (error) {
		console.log('Errore nel salvataggio del prodotto: ', error);
	}
}

function handelFormValidation() {
	const validation = validateForm();
	let isValid = true;

	if (!validation.isValid) {
		for (const field in validation.errors) {
			const errorElement = document.getElementById(`${field}-error`);
			errorElement.textContent = '';
			errorElement.textContent = validation.errors[field];
		}

		isValid = false;
	}

	return isValid;
}

function validateForm() {
	const errors = {};

	if (!nameInput.value) errors.name = 'Il campo nome è obbligatorio.';
	else errors.name = '';

	if (!descriptionInput.value)
		errors.description = 'Il campo descrizione è obbligatorio.';
	else errors.description = '';

	if (!brandInput.value) errors.brand = 'Il campo brand è obbligatorio.';
	else errors.brand = '';

	if (!numberInput.value) errors.number = 'Il campo prezzo è obbligatorio.';
	else errors.number = '';

	if (imageSelect.value == '' && !textUrl.value) {
		//capire quali dei due è in block
		var element = document.getElementById('select-image'); // Sostituisci "yourElementId" con l'ID effettivo dell'elemento
		var displayValue = getComputedStyle(element).getPropertyValue('display');
		if (displayValue == 'block')
			errors.selectImage = 'Il campo immagine è obbligatorio.';
		else errors.urlImage = 'Il campo immagine è obbligatorio.';
	} else errors.urlImage = '';

	return {
		isValid: Object.values(errors).every((value) => value === ''),
		errors
	};
}

// Inicjalizacja EmailJS (podstaw swój publiczny klucz)
emailjs.init("DPJDvtIl4vXD9ByX1");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Filtruj produkty na liście po nazwie
function filterProducts() {
  const input = document.getElementById("search").value.toLowerCase();
  const products = document.querySelectorAll(".product");
  products.forEach(product => {
    const title = product.querySelector("h3").textContent.toLowerCase();
    product.style.display = title.includes(input) ? "block" : "none";
  });
}

// Dodaj produkt do koszyka i zapisz w localStorage
function addToCart(productName, price) {
  cart.push({ name: productName, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Usuń produkt z koszyka wg indeksu
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Aktualizuj widok koszyka i sumę
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name}</span>
      <span>${item.price} zł</span>
      <button class="remove-from-cart" onclick="removeFromCart(${index})">Usuń</button>
    `;
    cartItems.appendChild(div);
    total += item.price;
  });

  totalDisplay.textContent = total;
}

// Obsługa wysyłania zamówienia
function submitOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Koszyk jest pusty. Dodaj produkty przed złożeniem zamówienia.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !address) {
    alert("Wypełnij wszystkie pola formularza.");
    return;
  }

  const productsText = cart.map(item => `${item.name} — ${item.price} zł`).join("\n");
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const params = {
    from_name: name,
    reply_to: email,
    address: address,
    products: productsText,
    total: total,
  };

  // Wyślij e-mail przez EmailJS
  emailjs.send("service_lfgulnx", "template_ez09au9", params)
    .then(() => {
      alert(`Zamówienie od ${name} zostało przyjęte i wysłane! Dziękujemy za zakupy.`);
      localStorage.removeItem("cart");
      cart = [];
      updateCart();
      document.getElementById("order-form").reset();
    })
    .catch(error => {
      console.error("Błąd przy wysyłaniu zamówienia:", error);
      alert("Wystąpił błąd przy wysyłaniu zamówienia. Spróbuj ponownie później.");
    });
}

// Aktualizacja koszyka przy załadowaniu strony
updateCart();

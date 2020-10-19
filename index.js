/*
    Benemérita Universidad Autónoma de Puebla
    Facultad de Ciencias de la Computación
    Desarrollo de Aplicaciones Web

    Examen 1: Front-End de aplicación para restaurante

    Marco Antonio Coria Rios (201734576)
    Otoño 2020
*/

// Total income from orders
if (localStorage.income == null) localStorage.setItem('income', 0.0);

// Exchanges Menu and Order sections (in mobile version)
var menuDisplayed = true;
var displayOrderButton = document.getElementById("display_order");
displayOrderButton.onclick = () => {
    var menuSection = document.getElementById("menu");
    var orderSection = document.getElementById("order");

    if (menuDisplayed) {
        menuDisplayed = false;
        menuSection.style.display = "none";
        orderSection.style.display = "block";

        displayOrderButton.innerHTML = "Carta";
    }
    else {
        menuDisplayed = true;
        menuSection.style.display = "block";
        orderSection.style.display = "none";

        displayOrderButton.innerHTML = "Pedido";
    }
}

// Displays both Menu and Order section when widescreen (for width min 1000px)
window.onresize = () => {
    var menuSection = document.getElementById("menu");
    var orderSection = document.getElementById("order");
    if (window.innerWidth >= 1000) {
        menuSection.style.display = "block";
        orderSection.style.display = "block";
    }
    else {
        if (menuDisplayed) orderSection.style.display = "none";
        else menuSection.style.display = "none";
    }
}

// Changes states of product edit and delete buttons
var selected = ""; // Product ID is saved for 
var productList = document.getElementsByClassName("info");
[...productList].forEach(product => {
    product.onclick = selectProductEvent;
});

// Change of the product quantity
// Also activates the add-to-order button if the quantity is bigger than 1
// Deactivates if not
var incrementButtons = document.getElementsByClassName("increment");
[...incrementButtons].forEach(incrementButton => {
    incrementButton.onclick = incrementProductEvent;
});

var decrementButtons = document.getElementsByClassName("decrement");
[...decrementButtons].forEach(decrementButton => {
    decrementButton.onclick = decrementProductEvent;
});

// Adds an element to the order
var addProductButtons = document.getElementsByClassName("add-to-order");
[...addProductButtons].forEach(addProductButton => {
    addProductButton.onclick = orderProductEvent;
});

// Confirms the order
var confirmOrderButton = document.getElementById("confirm-order");
confirmOrderButton.onclick = () => {
    var orderProducts = document.getElementById("order-products");
    orderProducts.innerHTML = ""; // Deletes all products

    var orderIncome = parseFloat(document.getElementById("total").innerHTML.substring(1));
    localStorage.setItem('income', parseFloat(localStorage.income) + orderIncome);

    document.getElementById("total").innerHTML = "$0.0";
    confirmOrderButton.disabled = true;

    alert("Total Ganado en el Tiempo: " + localStorage.income);
}

// For control in edit information card
var editing = false;
var idCount = document.getElementById("menu-products").childElementCount;

// Shows edit product information card for adding new product to menu
var createProductButton = document.getElementById("create-button");
createProductButton.onclick = () => {
    editing = false;

    var productInfo = document.getElementById(selected);
    var overlay = document.getElementById("edit-overlay");

    document.getElementById("edit-title").innerHTML = "Crear Producto";

    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-type").value = "Aperitivo";

    overlay.classList.remove("hidden");
};

// Shows edit product information panel
var editButton = document.getElementById("edit-button");
editButton.onclick = () => {
    editing = true;

    var productInfo = document.getElementById(selected);
    var overlay = document.getElementById("edit-overlay");

    document.getElementById("edit-title").innerHTML = "Editar Producto";

    [...productInfo.childNodes].forEach(info => {
        if (info.nodeType == 1) {
            var productName = document.getElementById("product-name");
            var productPrice = document.getElementById("product-price");
            var productType = document.getElementById("product-type");

            if (info.classList.contains("name")) productName.value = info.innerHTML;
            if (info.classList.contains("price")) productPrice.value = info.innerHTML.substring(1);
            if (info.classList.contains("type")) productType.value = info.innerHTML;
        }
    });

    overlay.classList.remove("hidden");
};

// Closes edit product information panel
var closeEditButton = document.getElementById("close-edit");
closeEditButton.onclick = () => {
    var overlay = document.getElementById("edit-overlay");
    overlay.classList.add("hidden");
};

// Updates the info for a product when the edit product form is submited
var editForm = document.getElementById("edit-form");
editForm.onsubmit = e => {
    e.preventDefault();

    // Takes the new info from the form
    var types = document.getElementById("product-type");
    var newInfo = [
        document.getElementById("product-name").value,
        "$" + parseFloat(document.getElementById("product-price").value).toFixed(2),
        types.options[types.selectedIndex].value
    ];

    // Chekc operation (creating or editing)
    if (editing) {
        // Puts the new info in its product card
        var infoIter = document.getElementById(selected).firstElementChild;
        for (var i = 0; i < 3; i++, infoIter = infoIter.nextElementSibling) {
            infoIter.innerHTML = newInfo[i];
        }

        // Verifies existence of this product in the order
        var orderedProduct = document.getElementsByClassName(selected);
        if (orderedProduct.length == 1) {
            // The product was already ordered. Info will be changed
            var orderedName = orderedProduct[0].firstElementChild;
            var orderedQuantity = orderedProduct[0].firstElementChild.nextElementSibling;
            var orderedType = orderedProduct[0].firstElementChild.nextElementSibling.nextElementSibling;
            var orderedPrice = orderedProduct[0].nextElementSibling;

            // Recalculates total import
            var totalTag = document.getElementById("total");
            var total = parseFloat(totalTag.innerHTML.substring(1));
            total -= parseFloat(orderedPrice.innerHTML.substring(1));

            orderedName.innerHTML = newInfo[0];
            orderedType.innerHTML = newInfo[2];
            console.log(parseFloat(newInfo[1].substring(1)));
            orderedPrice.innerHTML = "$" + (parseFloat(newInfo[1].substring(1)) * parseInt(orderedQuantity.innerHTML)).toFixed(2);

            
            total += parseFloat(orderedPrice.innerHTML.substring(1));
            totalTag.innerHTML = "$" + total.toFixed(2);
        }
    }
    else {
        // Puts the info in a new card
        const productMarkup = `
            <div class="product">
                <div class="info" id="p${++idCount}">
                    <p class="name">${newInfo[0]}</p>
                    <p class="price">${newInfo[1]}</p>
                    <p class="type">${newInfo[2]}</p>
                </div>

                <div class="control">
                    <button class="decrement">-</button>
                    <input type="text" class="quantity" disabled value="0">
                    <button class="increment">+</button>
                </div>

                <button class="add-to-order" disabled>Añadir</button>
            </div>
        `;

        // Puts the new product in the menu
        var menu = document.getElementById("menu-products");
        menu.insertAdjacentHTML('beforeend', productMarkup);

        // Adds the event listener for select product
        var product = menu.lastElementChild;
        product.firstElementChild.onclick = selectProductEvent;

        // Adds the event listener for adding to order
        var addProductButton = product.lastElementChild;
        addProductButton.onclick = orderProductEvent;

        // Adds event listeners for increment and decrement buttons
        var incrementButton = product.firstElementChild.nextElementSibling.lastElementChild;
        var decrementButton = product.firstElementChild.nextElementSibling.firstElementChild;
        incrementButton.onclick = incrementProductEvent;
        decrementButton.onclick = decrementProductEvent;
    }

    // Hides edit product card
    var overlay = document.getElementById("edit-overlay");
    overlay.classList.add("hidden");
}

// Deletes a product from menu
var deleteProductButton = document.getElementById("delete-button");
deleteProductButton.onclick = () => {
    var menuProducts = document.getElementById("menu-products");
    var toDeleteProduct = document.getElementById(selected).parentElement;

    menuProducts.removeChild(toDeleteProduct);

    // Verifies if product was already in the order
    var orderedProduct = document.getElementsByClassName(selected);
    if (orderedProduct.length == 1) {
        /* Recalculate total import */
        var totalTag = document.getElementById("total");
        var total = parseFloat(totalTag.innerHTML.substring(1));
        var productPrice = parseFloat(orderedProduct[0].nextElementSibling.innerHTML.substring(1));
        total -= productPrice;
        totalTag.innerHTML = "$" + total;

        var orderProducts = document.getElementById("order-products");
        orderProducts.removeChild(orderedProduct[0].parentElement);
    }

    // Resets environment
    var editButton = document.getElementById("edit-button");
    editButton.disabled = true;
    deleteProductButton.disabled = true;
    selected = "";
};





/*  F U N C T I O N S  */

// Increment product quantity in menu
// IF quantity gets greater than 0, then the button for adding product to order is enabled
const MAX_PRODUCTS = 10;
function incrementProductEvent() {
    var quantity = this.previousElementSibling;
    if (++quantity.value > MAX_PRODUCTS) quantity.value = MAX_PRODUCTS;
    if (quantity.value > 0) {
        var addToOrderButton = this.parentElement.nextElementSibling;
        addToOrderButton.disabled = false;
    }
}

// Decrement product quantity in menu
// IF quantity gets lower than 0, then the button for adding product to order is disabled
function decrementProductEvent() {
    var quantity = this.nextElementSibling;
    if (--quantity.value <= 0) {
        quantity.value = 0;

        var addToOrderButton = this.parentElement.nextElementSibling;
        addToOrderButton.disabled = true;
    }
}

// Select a product for editing or deleting
function selectProductEvent() {
    var modifyButton = document.getElementById("edit-button");
    var deleteButton = document.getElementById("delete-button");

    // A product selected twice will deselect it
    if (this.id === selected) {
        modifyButton.disabled = true;
        deleteButton.disabled = true;
        selected = "";

        this.parentElement.style.backgroundColor = "#f6f1f1";
    }
    // A product selected once, will activate buttons and deselect previous
    // selected product if exists
    else {
        var previous = document.getElementById(selected); // previous product selected

        modifyButton.disabled = false;
        deleteButton.disabled = false;
        selected = this.id;

        this.parentElement.style.backgroundColor = "#ffb36b";

        if (previous != null) previous.parentElement.style.backgroundColor = "#f6f1f1";

        console.log(selected);
    }
}

// Add an element to the order
function orderProductEvent() {
    // Obtains product information
    var product = {};
    var info = this.previousElementSibling.previousElementSibling;
    [...info.childNodes].forEach(child => {
        if (child.nodeType == 1) {
            if (child.classList.contains("name")) product["name"] = child.innerHTML;
            if (child.classList.contains("type")) product["type"] = child.innerHTML;
            if (child.classList.contains("price")) product["price"] = child.innerHTML.substring(1);
        }
    });

    // Obtains desired quantity
    var control = this.previousElementSibling;
    [...control.childNodes].forEach(child => {
        if (child.nodeType != 3) {
            if (child.classList.contains("quantity")) product["quantity"] = child.value;
        }
    });

    // Gets the final price
    product["totalPrice"] = product.price * product.quantity;

    // Verifies existence of this product in the order
    var orderedID = this.previousElementSibling.previousElementSibling.id;
    var orderedProduct = document.getElementsByClassName(orderedID);
    console.log(orderedProduct.length);
    if (orderedProduct.length == 1) {
        // The product was already ordered. Only total price and quantity will be
        // modified
        var orderedQuantity = orderedProduct[0].firstElementChild.nextElementSibling;
        var orderedPrice = orderedProduct[0].nextElementSibling;

        orderedQuantity.innerHTML = parseInt(orderedQuantity.innerHTML) + parseInt(product.quantity);
        orderedPrice.innerHTML = "$" + (parseFloat(orderedPrice.innerHTML.substring(1)) + product.totalPrice).toFixed(2);
    }
    else {
        // Generates the HTML element
        const productMarkup = `
            <div class="product">
                <div class="order-info ${orderedID}">
                    <p class="name">${product.name}</p>
                    <p class="quantity">${product.quantity}</p>
                    <p class="type">${product.type}</p>
                </div>

                <p class="subtotal">$${product.totalPrice.toFixed(2)}</p>

                <button class="remove-product" type="button">Quitar</button>
            </div>
        `;

        // Puts the new element in the order
        var order = document.getElementById("order-products");
        order.insertAdjacentHTML('beforeend', productMarkup);

        var removeProductButton = order.lastElementChild.lastElementChild;
        console.log(removeProductButton);
        removeProductButton.onclick = removeProductEvent;

        // Activates the order confirmation button
        var confirmOrderButton = document.getElementById("confirm-order");
        confirmOrderButton.disabled = false;
    }
    // Recalculates total import
    var totalTag = document.getElementById("total");
    var total = parseFloat(totalTag.innerHTML.substring(1));
    total += parseFloat(product.totalPrice);
    totalTag.innerHTML = "$" + total.toFixed(2);
}

// Remove a product from the order
function removeProductEvent() {
    /* Recalculate total import */
    var totalTag = document.getElementById("total");
    var total = parseFloat(totalTag.innerHTML.substring(1));
    var productPrice = parseFloat(this.previousElementSibling.innerHTML.substring(1));
    total -= productPrice;

    totalTag.innerHTML = "$" + total.toFixed(2);

    // Deletes product from order
    var product = this.parentElement;
    var orderProducts = product.parentElement;
    orderProducts.removeChild(product);

    // If there's no more products in the order, disables the order confirmation button
    if (orderProducts.childElementCount == 0) {
        var confirmOrderButton = document.getElementById("confirm-order");
        confirmOrderButton.disabled = true;
    }
}
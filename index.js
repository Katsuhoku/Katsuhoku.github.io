// Resizes window avoiding browser interface crops
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`)
});

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
    }
    else {
        menuDisplayed = true;
        menuSection.style.display = "block";
        orderSection.style.display = "none";
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
    product.onclick = () => {
        var modifyButton = document.getElementById("edit-button");
        var deleteButton = document.getElementById("delete-button");

        // A product selected twice will deselect it
        if (product.id === selected) {
            modifyButton.disabled = true;
            deleteButton.disabled = true;
            selected = "";

            product.parentElement.style.backgroundColor = "#f6f1f1";
        }
        // A product selected once, will activate buttons and deselect previous
        // selected product if exists
        else {
            var previous = document.getElementById(selected); // previous product selected

            modifyButton.disabled = false;
            deleteButton.disabled = false;
            selected = product.id;

            product.parentElement.style.backgroundColor = "greenyellow";

            if (previous != null) previous.parentElement.style.backgroundColor = "aqua";

            console.log(selected);
        }
    };
});

// Change of the product quantity
// Also activates the add-to-order button if the quantity is bigger than 1
// Deactivates if not
var MAX_PRODUCTS = 10;
var incrementButtons = document.getElementsByClassName("increment");
[...incrementButtons].forEach(incrementButton => {
    incrementButton.onclick = () => {
        var quantity = incrementButton.previousElementSibling;
        if (++quantity.value > MAX_PRODUCTS) quantity.value = MAX_PRODUCTS;
        if (quantity.value > 0) {
            var addToOrderButton = incrementButton.parentElement.nextElementSibling;
            addToOrderButton.disabled = false;
        }
    };
});

var decrementButtons = document.getElementsByClassName("decrement");
[...decrementButtons].forEach(decrementButton => {
    decrementButton.onclick = () => {
        var quantity = decrementButton.nextElementSibling;
        if (--quantity.value <= 0) {
            quantity.value = 0;

            var addToOrderButton = decrementButton.parentElement.nextElementSibling;
            addToOrderButton.disabled = true;
        }
    };
});

// Shows edit product information panel
var editButton = document.getElementById("edit-button");
editButton.onclick = () => {
    var productInfo = document.getElementById(selected);
    var overlay = document.getElementById("edit-overlay");

    [...productInfo.childNodes].forEach(info => {
        if (info.nodeType == 1) {
            var productName = document.getElementById("product-name");
            var productPrice = document.getElementById("product-price");
            var productType = document.getElementById("product-type");

            if (info.classList.contains("name")) productName.value = info.innerHTML;
            if (info.classList.contains("price")) productPrice.value = info.innerHTML.substring;
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

"use strict";

/* start basket */
const meals = Array.from(document.querySelectorAll(".meal"));
const basket = document.querySelector(".basket");
const basketItems = document.querySelector(".basket-items");
const checkoutButton = document.querySelector(".checkout-button");
const mobileCart = document.querySelector(".mobile-cart");
const basketClose = document.querySelector(".basket-close");
const backdrop = document.querySelector(".basket-backdrop");
let cart = {};

try {
    const savedCart = JSON.parse(localStorage.getItem("burgerhouse-cart")) || {};
    for (const meal of meals) {
        const count = savedCart[meal.dataset.id];
        if (Number.isInteger(count) && count > 0 && count <= 99) {
            cart[meal.dataset.id] = count;
        }
    }
} catch {
    cart = {};
}

function money(cents) {
    return (cents / 100).toFixed(2).replace(".", ",") + "€";
}

function renderBasket() {
    let subtotal = 0;
    let itemCount = 0;
    basketItems.innerHTML = "";

    for (const meal of meals) {
        const id = meal.dataset.id;
        const count = cart[id] || 0;
        const name = meal.querySelector("h3").textContent;
        const addButton = meal.querySelector(".add-button");
        addButton.textContent = count ? "Added " + count : "Add to basket";
        addButton.classList.toggle("added", count > 0);
        addButton.disabled = count === 99;
        addButton.setAttribute("aria-label", "Add " + name + " to basket" + (count ? ", " + count + " already added" : ""));
        if (!count) continue;

        const price = Number(meal.dataset.price) * count;
        subtotal += price;
        itemCount += count;
        basketItems.innerHTML += `
            <article class="basket-item">
                <h3>${count} x ${name}</h3>
                <div class="basket-item-row">
                    <div class="quantity">
                        <button data-action="remove" data-id="${id}" aria-label="Remove ${name}"><svg viewBox="0 0 20 22" aria-hidden="true"><path d="M3 5h14M7 5V2h6v3M5 5v15h10V5M8 8v9m4-9v9"/></svg></button>
                        ${count > 1 ? `<button data-action="minus" data-id="${id}" aria-label="Decrease ${name}">−</button>` : ""}
                        <span>${count}</span>
                        <button data-action="plus" data-id="${id}" aria-label="Increase ${name}" ${count === 99 ? "disabled" : ""}>+</button>
                    </div>
                    <span>${money(price)}</span>
                </div>
            </article>`;
    }

    if (!itemCount) {
        basketItems.innerHTML = '<p class="empty-basket">Your basket is empty.<br>Add something delicious!</p>';
    }

    const delivery = itemCount ? 499 : 0;
    document.querySelector("#subtotal").textContent = money(subtotal);
    document.querySelector("#delivery-fee").textContent = money(delivery);
    document.querySelector("#total").textContent = money(subtotal + delivery);
    checkoutButton.textContent = "Buy now (" + money(subtotal + delivery) + ")";
    checkoutButton.disabled = itemCount === 0;
    const badge = document.querySelector(".cart-count");
    badge.textContent = itemCount;
    badge.hidden = itemCount === 0;
    mobileCart.setAttribute("aria-label", "Open basket, " + itemCount + " items");

    try {
        localStorage.setItem("burgerhouse-cart", JSON.stringify(cart));
    } catch {
        document.querySelector("#cart-status").textContent = "Your basket is available for this visit. Browser storage is unavailable.";
    }
}

for (const meal of meals) {
    meal.querySelector(".add-button").addEventListener("click", () => {
        const id = meal.dataset.id;
        cart[id] = Math.min((cart[id] || 0) + 1, 99);
        renderBasket();
        document.querySelector("#cart-status").textContent = meal.querySelector("h3").textContent + " added to basket.";
    });
}

basketItems.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const id = button.dataset.id;
    if (button.dataset.action === "remove") delete cart[id];
    if (button.dataset.action === "minus") cart[id] -= 1;
    if (button.dataset.action === "plus") cart[id] = Math.min(cart[id] + 1, 99);
    renderBasket();
    const nextButton = basketItems.querySelector(`[data-id="${id}"][data-action="${button.dataset.action}"]:not(:disabled)`);
    (nextButton || basketItems.querySelector("button") || (basketClose.hidden ? meals[0].querySelector("button") : basketClose)).focus();
    document.querySelector("#cart-status").textContent = "Basket updated. Total " + document.querySelector("#total").textContent;
});

function closeBasket() {
    basket.classList.remove("open");
    basket.removeAttribute("role");
    basket.removeAttribute("aria-modal");
    backdrop.hidden = true;
    basketClose.hidden = true;
    mobileCart.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
}

mobileCart.addEventListener("click", () => {
    basket.classList.add("open");
    basket.setAttribute("role", "dialog");
    basket.setAttribute("aria-modal", "true");
    backdrop.hidden = false;
    basketClose.hidden = false;
    mobileCart.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    basketClose.focus();
});

basketClose.addEventListener("click", () => { closeBasket(); mobileCart.focus(); });
backdrop.addEventListener("click", () => { closeBasket(); mobileCart.focus(); });
window.matchMedia("(min-width: 1001px)").addEventListener("change", (event) => {
    if (event.matches) closeBasket();
});

checkoutButton.addEventListener("click", () => {
    if (!Object.keys(cart).length) return;
    cart = {};
    renderBasket();
    closeBasket();
    document.querySelector("#confirmation").showModal();
});
renderBasket();
/* end basket */

/* start navigation and dialogs */
const menuToggle = document.querySelector(".menu-toggle");
const headerMenu = document.querySelector("#header-menu");
menuToggle.addEventListener("click", () => {
    headerMenu.hidden = !headerMenu.hidden;
    menuToggle.setAttribute("aria-expanded", String(!headerMenu.hidden));
});
headerMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        headerMenu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

for (const button of document.querySelectorAll("[data-dialog]")) {
    button.addEventListener("click", () => document.getElementById(button.dataset.dialog).showModal());
}
for (const button of document.querySelectorAll(".dialog-close")) {
    button.addEventListener("click", () => button.closest("dialog").close());
}
document.querySelector("#confirmation").addEventListener("close", () => {
    if (window.matchMedia("(max-width: 1000px)").matches) mobileCart.focus();
    else meals[0].querySelector("button").focus();
});
document.querySelector("#clear-basket").addEventListener("click", () => {
    cart = {};
    renderBasket();
    document.querySelector("#cookies").close();
    document.querySelector("#cart-status").textContent = "Saved basket cleared.";
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        headerMenu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        if (basket.classList.contains("open")) { closeBasket(); mobileCart.focus(); }
    }
    if (event.key === "Tab" && basket.classList.contains("open")) {
        const buttons = Array.from(basket.querySelectorAll("button:not(:disabled):not([hidden])"));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
});
/* end navigation and dialogs */

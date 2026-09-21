"use strict";

let cart = {};
let mobileLayout;

function init() {
    renderMenu();
    mobileLayout = window.matchMedia("(max-width: 1320px)");
    loadCart();
    renderBasket();
    initMealEvents();
    initBasketEvents();
    initNavigationEvents();
    initDialogEvents();
}

function renderMenu() {
    for (const list of document.querySelectorAll(".meal-list")) {
        list.innerHTML = "";
    }
    for (const meal of meals) {
        const list = document.querySelector("#" + meal.category + " .meal-list");
        list.innerHTML += mealTemplate(meal, money(meal.price));
    }
}

function createBasketItem(meal) {
    const count = cart[meal.id];
    const price = money(meal.price * count);
    const controls = createBasketControls(meal, count);
    return basketItemTemplate(meal.name, count, price, controls);
}

function createBasketControls(meal, count) {
    let html = removeButtonTemplate(meal.id, meal.name);
    const disabled = count === 99 ? "disabled" : "";
    if (count > 1) {
        html = quantityButtonTemplate(meal.id, meal.name, "minus", "Decrease", "−", "");
    }
    html += quantityCountTemplate(count);
    html += quantityButtonTemplate(meal.id, meal.name, "plus", "Increase", "+", disabled);
    return html;
}

function initMealEvents() {
    for (const meal of meals) {
        document.querySelector(`[data-id="${meal.id}"] .add-button`).addEventListener("click", addMeal);
    }
}

function initBasketEvents() {
    document.querySelector(".basket-items").addEventListener("click", changeQuantity);
    document.querySelector(".mobile-cart").addEventListener("click", openBasket);
    document.querySelector(".basket-close").addEventListener("click", closeBasket);
    document.querySelector(".checkout-button").addEventListener("click", checkout);
    document.querySelector("#basket-dialog").addEventListener("close", restoreBasket);
    document.querySelector("#clear-basket").addEventListener("click", clearSavedBasket);
    mobileLayout.addEventListener("change", updateBasketLayout);
}

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem("burgerhouse-cart")) || {};
        for (const meal of meals) {
            const count = saved[meal.id];
            if (Number.isInteger(count) && count > 0 && count <= 99) cart[meal.id] = count;
        }
    } catch {
        cart = {};
    }
}

function saveCart() {
    try {
        localStorage.setItem("burgerhouse-cart", JSON.stringify(cart));
    } catch {
        document.querySelector("#cart-status").textContent = "Your basket is available for this visit. Browser storage is unavailable.";
    }
}

function money(cents) {
    return (cents / 100).toFixed(2).replace(".", ",") + "€";
}

function renderBasket() {
    const totals = getCartTotals();
    renderBasketItems();
    updateMealButtons();
    updateTotals(totals);
    updateBadge(totals.count);
    saveCart();
}

function getCartTotals() {
    let subtotal = 0;
    let count = 0;
    for (const meal of meals) {
        subtotal += meal.price * (cart[meal.id] || 0);
        count += cart[meal.id] || 0;
    }
    return { subtotal: subtotal, count: count, delivery: count ? 499 : 0 };
}

function renderBasketItems() {
    let html = "";
    for (const meal of meals) {
        if (cart[meal.id]) html += createBasketItem(meal);
    }
    document.querySelector(".basket-items").innerHTML = html || emptyBasketTemplate();
}

function updateMealButtons() {
    for (const meal of meals) {
        const count = cart[meal.id] || 0;
        const button = document.querySelector(`[data-id="${meal.id}"] .add-button`);
        const name = meal.name;
        button.textContent = count ? "Added " + count : "Add to basket";
        button.classList.toggle("added", count > 0);
        button.disabled = count === 99;
        button.ariaLabel = "Add " + name + " to basket" + (count ? ", " + count + " already added" : "");
    }
}

function updateTotals(totals) {
    const total = money(totals.subtotal + totals.delivery);
    const button = document.querySelector(".checkout-button");
    document.querySelector("#subtotal").textContent = money(totals.subtotal);
    document.querySelector("#delivery-fee").textContent = money(totals.delivery);
    document.querySelector("#total").textContent = total;
    button.textContent = "Buy now (" + total + ")";
    button.disabled = totals.count === 0;
}

function updateBadge(count) {
    const badge = document.querySelector(".cart-count");
    badge.textContent = count;
    badge.hidden = count === 0;
    document.querySelector(".mobile-cart").ariaLabel = "Open basket, " + count + " items";
}

function addMeal(event) {
    const id = event.currentTarget.closest(".meal").dataset.id;
    const meal = meals.find(item => item.id === id);
    cart[id] = Math.min((cart[id] || 0) + 1, 99);
    renderBasket();
    document.querySelector("#cart-status").textContent = meal.name + " added to basket.";
}

function changeQuantity(event) {
    const button = event.target.closest("button");
    if (!button) return;
    const id = button.dataset.id;
    if (button.dataset.action === "remove") delete cart[id];
    if (button.dataset.action === "minus") cart[id] -= 1;
    if (button.dataset.action === "plus") cart[id] = Math.min(cart[id] + 1, 99);
    if (cart[id] <= 0) delete cart[id];
    renderBasket();
    focusBasketButton(id, button.dataset.action);
    document.querySelector("#cart-status").textContent = "Basket updated. Total " + document.querySelector("#total").textContent;
}

function focusBasketButton(id, action) {
    const items = document.querySelector(".basket-items");
    const next = items.querySelector(`[data-id="${id}"][data-action="${action}"]:not(:disabled)`);
    const fallback = mobileLayout.matches ? document.querySelector(".basket-close") : document.querySelector(".add-button");
    (next || items.querySelector("button") || fallback).focus();
}

function openBasket() {
    const dialog = document.querySelector("#basket-dialog");
    if (!mobileLayout.matches || dialog.open) return;
    dialog.append(document.querySelector(".basket"));
    dialog.showModal();
    document.querySelector(".mobile-cart").ariaExpanded = "true";
    syncScrollLock();
}

function closeBasket() {
    document.querySelector("#basket-dialog").close();
}

function restoreBasket() {
    if (document.querySelector("#basket-dialog").open) return;
    document.querySelector(".basket-column").append(document.querySelector(".basket"));
    document.querySelector(".mobile-cart").ariaExpanded = "false";
    syncScrollLock();
}

function updateBasketLayout() {
    if (!mobileLayout.matches) closeBasket();
}

function checkout() {
    if (!Object.keys(cart).length) return;
    cart = {};
    renderBasket();
    closeBasket();
    document.querySelector("#confirmation").showModal();
    syncScrollLock();
}

function clearSavedBasket() {
    cart = {};
    renderBasket();
    document.querySelector("#cookies").close();
    document.querySelector("#cart-status").textContent = "Saved basket cleared.";
}

function initNavigationEvents() {
    document.querySelector(".menu-toggle").addEventListener("click", toggleMenu);
    document.querySelector("#header-menu").addEventListener("click", selectMenuLink);
    document.addEventListener("keydown", handleEscape);
}

function toggleMenu() {
    const menu = document.querySelector("#header-menu");
    menu.hidden = !menu.hidden;
    document.querySelector(".menu-toggle").ariaExpanded = String(!menu.hidden);
}

function closeMenu() {
    document.querySelector("#header-menu").hidden = true;
    document.querySelector(".menu-toggle").ariaExpanded = "false";
}

function selectMenuLink(event) {
    if (event.target.closest("a")) closeMenu();
}

function handleEscape(event) {
    if (event.key === "Escape") closeMenu();
}

function initDialogEvents() {
    for (const button of document.querySelectorAll("[data-dialog]")) {
        button.addEventListener("click", openInformation);
    }
    for (const button of document.querySelectorAll(".dialog-close")) {
        button.addEventListener("click", closeDialog);
    }
    for (const dialog of document.querySelectorAll("dialog")) {
        dialog.addEventListener("close", syncScrollLock);
        dialog.addEventListener("click", closeOnBackdrop);
    }
    document.querySelector("#confirmation").addEventListener("close", focusAfterOrder);
}

function openInformation(event) {
    document.getElementById(event.currentTarget.dataset.dialog).showModal();
    syncScrollLock();
}

function closeDialog(event) {
    event.currentTarget.closest("dialog").close();
}

function closeOnBackdrop(event) {
    const dialog = event.currentTarget;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (event.target === dialog && outside) dialog.close();
}

function syncScrollLock() {
    document.body.classList.toggle("no-scroll", !!document.querySelector("dialog[open]"));
}

function focusAfterOrder() {
    const button = mobileLayout.matches ? document.querySelector(".mobile-cart") : document.querySelector(".add-button");
    button.focus();
}

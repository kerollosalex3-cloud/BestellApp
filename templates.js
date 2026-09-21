"use strict";

function basketItemTemplate(name, count, price, controls) {
    return `<article class="basket-item">
        <h3>${count} x ${name}</h3>
        <div class="basket-item-row">
            <div class="quantity">${controls}</div>
            <span>${price}</span>
        </div>
    </article>`;
}

function quantityCountTemplate(count) {
    return `<span>${count}</span>`;
}

function removeButtonTemplate(id, name) {
    return `<button data-action="remove" data-id="${id}" aria-label="Remove ${name}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M9 6V3h6v3M6 6v15h12V6M10 9v9m4-9v9"/></svg>
    </button>`;
}

function quantityButtonTemplate(id, name, action, label, symbol, disabled) {
    return `<button data-action="${action}" data-id="${id}" aria-label="${label} ${name}" ${disabled}>${symbol}</button>`;
}

function emptyBasketTemplate() {
    return '<p class="empty-basket">Your basket is empty.<br>Add something delicious!</p>';
}

function mealTemplate(meal, price) {
    return `<article class="meal" data-id="${meal.id}">
        <picture class="meal-picture">
            <source media="(max-width: 600px)" srcset="${meal.mobileImage}">
            <img class="meal-image" src="${meal.image}" alt="${meal.name}">
        </picture>
        <div class="meal-details">
            <h3>${meal.name}</h3>
            <p>${meal.description}</p>
            <span class="meal-price">${price}</span>
            <button class="add-button" aria-label="Add ${meal.name} to basket">Add to basket</button>
        </div>
    </article>`;
}

"use strict";

/* start basket templates */
function basketItemTemplate(meal) {
    const id = meal.dataset.id;
    const name = meal.querySelector("h3").textContent;
    const count = cart[id];
    const price = Number(meal.dataset.price) * count;
    return `<article class="basket-item">
        <h3>${count} x ${name}</h3>
        <div class="basket-item-row">
            <div class="quantity">${basketControlsTemplate(id, name, count)}</div>
            <span>${money(price)}</span>
        </div>
    </article>`;
}

function basketControlsTemplate(id, name, count) {
    return `${removeButtonTemplate(id, name)}
        ${count > 1 ? quantityButtonTemplate(id, name, "minus", "Decrease", "−", false) : ""}
        <span>${count}</span>
        ${quantityButtonTemplate(id, name, "plus", "Increase", "+", count === 99)}`;
}

function removeButtonTemplate(id, name) {
    return `<button data-action="remove" data-id="${id}" aria-label="Remove ${name}">
        <svg viewBox="0 0 20 22" aria-hidden="true"><path d="M3 5h14M7 5V2h6v3M5 5v15h10V5M8 8v9m4-9v9"/></svg>
    </button>`;
}

function quantityButtonTemplate(id, name, action, label, symbol, disabled) {
    return `<button data-action="${action}" data-id="${id}" aria-label="${label} ${name}" ${disabled ? "disabled" : ""}>${symbol}</button>`;
}

function emptyBasketTemplate() {
    return '<p class="empty-basket">Your basket is empty.<br>Add something delicious!</p>';
}
/* end basket templates */

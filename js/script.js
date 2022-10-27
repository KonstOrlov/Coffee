'use strict';

const cartCount = document.querySelector('.cart__number');
const featuredMugsProducts = document.querySelector('.products');
const moreProducts = document.querySelector('.products-gallery');
const cart = {
  countGoodsCart: 0,
  countFavoriteGoods: 0,
  productInCart: [],
};
const LOCALES = {
  buttonTitle: {
    favorite: {
      add: 'Добавить в избранное',
      remove: 'Удалить из избранного',
    },
    onCart: {
      add: 'Добавить товар в корзину',
      remove: 'Удалить товар из корзины',
    },
  }
};

(function getGoodsByApi() {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://62b8272503c36cb9b7c292cf.mockapi.io/Goods');
  request.send();
  request.onload = () => {
    let arrayGoods;
    arrayGoods = JSON.parse(request.response);
    arrayGoods.forEach(obj => (obj.featuredMugs) ? createProductCard(featuredMugsProducts, obj) : createProductCard(moreProducts, obj));
  };
  request.onerror = () => console.log(`Не удалось получить товары`);
})();

document.addEventListener("click", (event) => {
  const target = event.target;
  changeCartButtonData(target);
  changeFavoriteButtonData(target);
});

function createProductCard(parent, obj) {
  const {id} = obj;
  let good = document.createElement('li');
  good.classList.add('goods');
  good.innerHTML = createTemplate(obj);
  good.setAttribute('data-product-id', id);
  parent.append(good);

}

function changeFavoriteButtonData(target) {
  if (target.classList.contains("goods__favorite-button")) {
    const productsInFavorite = target.classList.contains("goods__favorite-button_active");
    addCountFavoriteProducts(productsInFavorite);
    toggleFavoriteClass(target);
    changeTitleOnButton(target, productsInFavorite, LOCALES.buttonTitle.favorite);
  }
}

function changeCartButtonData(target) {
  if (target.classList.contains("goods__cart-button")) {
    const productInCart = target.classList.contains("goods__cart-button_active");
    addCountGoodsInCart(!productInCart);
    toggleCartClass(target);
    changeTitleOnButton(target, productInCart, LOCALES.buttonTitle.onCart)
  }
}

function counterElement(isAdd, countElement) {
  return isAdd ? ++countElement : --countElement;
}

function addCountGoodsInCart(isAdd) {
  cart.countGoodsCart = counterElement(isAdd, cart.countGoodsCart);
  cartCount.innerHTML = `${cart.countGoodsCart}`;
}

function toggleCartClass(element) {
  element.classList.toggle("goods__cart-button_active");
}

function addCountFavoriteProducts(isAdd) {
  cart.countFavoriteGoods = counterElement(isAdd, cart.countFavoriteGoods);
}

function toggleFavoriteClass(target) {
  target.classList.toggle("goods__favorite-button_active");
}

function changeTitleOnButton(button, isAdd, typeButton) {
  button.setAttribute("title", isAdd ? typeButton.add : typeButton.remove);
}

function createTemplate(obj) {
  const {name, picture} = obj;
  return `
        <img src=${picture} class="goods__picture" alt="Кофе ${name}">
        <button class="goods__favorite-button" type="button" title="Добавить в избранное"></button>
        <button class="goods__cart-button" type="button" title ="Добавить товар в корзину"></button>
        <h3 class="goods__name">${name}</h3>
        <div class="goods__prices">
            ${chooseBlockPriceForTemplate(obj)}
        </div>
    `;
}

function chooseBlockPriceForTemplate(priceData) {
  const {price, newPrice, priceCurrency, priceCurrencySymbol} = priceData;
  return newPrice ?
    `<p class="goods__discount">${priceCurrencySymbol} ${newPrice}</p>
         <p class="goods__price goods__price_discount">${priceCurrencySymbol} ${price} ${priceCurrency}</p>` :
    `<p class="goods__price">${priceCurrencySymbol} ${price} ${priceCurrency}</p>`;
}
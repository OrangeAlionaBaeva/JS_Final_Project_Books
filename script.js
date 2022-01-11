const shoppingConatiner = document.querySelector('.shopping-conatiner');
const cartTotalValue = document.querySelector('.total span');



// ------------- Описываем класс для корзины -------------
class Cart {

    total; //Свойства, которые будет содержать объект на основе созданного класса
    numberOfItems;

    constructor() {
        this.total = 0;
        this.numberOfItems = 0;
    }

    // Метод для подсчета всей стоимости корзины
    updateTotal(priceNum) {
        this.total = this.total + priceNum;
    }

    // Метод для подсчета всей стоимости корзины если удалили позицию или нажали минус
    decreseTotal(priceNum) {
        this.total = this.total - priceNum;
    }

    // Метод для подсчета кол-ва выбранных позиций
    updateNumberOfItems() {
        this.numberOfItems++;
    }

    get cartTotal() {
        return this.total;
    }

    get cartNumberOfItems() {
        return this.numberOfItems;
    }
}



// ------------- Инициализируем объект класса корзины -------------
const myCart = new Cart();



// ------------- Ищем targetId для выбранного Item -------------
const takeTargetIdFromEvent = (event) => {
    let targetId = '';
    if (event.target.parentNode.parentNode.id) {
        targetId = event.target.parentNode.parentNode.id;
    } else {
        targetId = event.target.parentNode.parentNode.parentNode.id;
    }

    return targetId;
}



// ------------- Отображение статуса корзины -------------
function toggleCartStatus() {
    if (document.getElementsByClassName('btn-warning').length > 0) {
        document.querySelector('.shopping-cart-empty').style.display = 'none';
    } else if (document.getElementsByClassName('btn-warning').length === 0) {
        document.querySelector('.shopping-cart-empty').style.display = 'block';
    }
}



// ------------- Добавление выбранной позиции в корзину -------------

// bookItemList содержит в себе всю инф-ю о добавляемом продукте
function addInShoppingCart(bookItemList) {
    myCart.updateNumberOfItems(); //numberOfItems был изначально =0, updateNumberOfItems увеличивает значение numberOfItems на 1

    const productInfo = {
        name: bookItemList.querySelector('.book-item-list-name').innerText,
        author: bookItemList.querySelector('.book-item-list-author').innerText,
        price: bookItemList.querySelector('.book-item-list-price').innerText,
    }

    const bookItemHTML = `        
                <ul id="id${myCart.cartNumberOfItems}" class="shopping-body">
                   
                    <li class="title">${productInfo.name}</li>
                    <li class="counter">1</li>
                    <li class="price">${productInfo.price}</li>
                    <li>
                        <button class="btn btn-warning disableClass" disabled="disabled">
                  <i class="fas fa-minus"></i>
                </button>
                        <button class="btn btn-success">
                  <i class="fas fa-plus"></i>
                </button>
                        <button class="btn btn-danger">
                  <i class="fas fa-trash-alt"></i>
                </button>
                    </li>
                </ul> `;

    shoppingConatiner.insertAdjacentHTML('beforeend', bookItemHTML);

    // тк в корзине появился Item, то нужно изменить общую стоимость покупки
    let priceNum = productInfo.price.substr(1);
    priceNum = +priceNum;
    myCart.updateTotal(priceNum); // метод updateTotal возьмет цену которая была (изначально она = 0) и прибавит к нему текущую цену и запишет эту цену в total
    cartTotalValue.innerHTML = myCart.cartTotal; // cartTotal вернет общую цену total с учетом прибаления и записываем в общую цену (cartTotalValue) 

    const removeBtn = document.querySelector('#id' + myCart.cartNumberOfItems + ' button.btn-danger');
    removeBtn.addEventListener('click', removeItem, true);

    const plusBtn = document.querySelector('#id' + myCart.cartNumberOfItems + ' button.btn-success');
    plusBtn.addEventListener('click', plusBookItem, true);

    const minusBtn = document.querySelector('#id' + myCart.cartNumberOfItems + ' button.btn-warning');
    minusBtn.addEventListener('click', minusBookItem, true);

}

// ------------- Удаление выбранной позиции Item -------------
function removeItem(event) {
    let price;
    let targetId = takeTargetIdFromEvent(event);

    let counter = Number(document.querySelector('#' + targetId + ' .counter').innerHTML);

    price = document.querySelector('#' + targetId + ' .price').innerHTML;
    document.getElementById(targetId).remove();

    price = price.substr(1);
    price = +price;
    price = counter * price;

    myCart.decreseTotal(price);
    cartTotalValue.innerHTML = myCart.cartTotal;

    toggleCartStatus();
}

//Увеличение кол-ва выбранных книг (при нажатии на плюс)
function plusBookItem(event) {
    let targetId = takeTargetIdFromEvent(event);

    let counter = Number(document.querySelector('#' + targetId + ' .counter').innerHTML) + 1;
    document.querySelector('#' + targetId + ' .counter').innerHTML = counter;

    let price = document.querySelector('#' + targetId + ' .price').innerHTML;

    const minusBtn = document.querySelector('#' + targetId + ' button.btn-warning');
    minusBtn.classList.remove("disableClass");
    minusBtn.removeAttribute("disabled");

    price = price.substr(1);
    price = +price;
    myCart.updateTotal(price);

    cartTotalValue.innerHTML = myCart.cartTotal;
}



//Уменьшение кол-ва выбранных книг (при нажатии на минус)
function minusBookItem(event) {
    let targetId = takeTargetIdFromEvent(event);

    let counter = Number(document.querySelector('#' + targetId + ' .counter').innerHTML); //2

    let price = document.querySelector('#' + targetId + ' .price').innerHTML;
    const minusBtn = document.querySelector('#' + targetId + ' button.btn-warning');

    if (counter - 1 > 1) {
        document.querySelector('#' + targetId + ' .counter').innerHTML = counter - 1;
        price = price.substr(1);
        price = +price;
        myCart.decreseTotal(price);
        cartTotalValue.innerHTML = myCart.cartTotal;
    } else if (counter - 1 == 1) {
        document.querySelector('#' + targetId + ' .counter').innerHTML = counter - 1;
        price = price.substr(1);
        price = +price;
        myCart.decreseTotal(price);
        cartTotalValue.innerHTML = myCart.cartTotal;
        minusBtn.classList.add("disableClass");
        minusBtn.setAttribute("disabled", "disabled");
    }
}

window.onload = function() {
    //Находим все кнопки Add
    const addBtn = document.getElementsByClassName('addBtn');
    //Проходимся по всем конопкам
    for (let i = 0; i < addBtn.length; i++) {
        //Вешаем на кпонки listner
        addBtn[i].addEventListener("click", function(event) {

            //Находим родителя кнопки
            const bookItemList = event.target.closest('.book-item-list');

            //Вызываем функцию добавления в корзину
            addInShoppingCart(bookItemList);

            //Вызываем функцию проверки статуса корзины: Еть что-то в корзине или она пуста
            toggleCartStatus();
        });
    }
};
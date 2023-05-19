

print()





//PARTIE FONCTIONS


/** On créé ou récupère le panier de commande
 * 
 * @returns le panier de commande
 */
function getCart() {
  /**
   * 
   * Renvoi du panier (tableau d'objets)
   * Vient du LocalStorage
   * Si présent dans LS, alors on retourne le panier.
   * Sinon, retour d'un tableau vide
   * 
   */
  const cart = localStorage.getItem("cart")
  if (cart === null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}



/**
* Push le tableau dans le localStorage
* @param {Array} cart contient le tableau d'objet
*/
function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

/**
 * Affiche le panier, calcul les quantités, rend possible la modification de quantité et suppression d'une ligne
 */
function print() {
  //On vérifie que le panier existe dans le LS, ou on le créé, et on l'enregistre dans une constante
  const cart = getCart();
  let kanapTotal = 0;
  let priceTotal = 0;
  const basketPrice = document.getElementById("totalPrice");
  const basketQuantity = document.getElementById("totalQuantity");
  //Récupération de l'élement du DOM qui va accueillir le panier.
  const sectionCartItems = document.querySelector("#cart__items");


  //On le définit comme vide de façon à pouvoir tenir compte des modifs du panier (on repart avec le nouveau panier)
  sectionCartItems.innerHTML = "";
  basketPrice.innerText = "0";
  basketQuantity.innerText = "0"; 
  if (cart.length === 0){
    sectionCartItems.innerHTML = `
    <p>Votre panier est vide :(</p>
    <p>Pour retourner à l'accueil, cliquez <a href="./index.html">ici</a>
    `;
    return
  }
  //On va récupérer les infos manquantes pour chaque produit présent dans le panier
  for (let i = 0; i < cart.length; i++) {
    //On va récupérer les infos produits de l'API grâce à l'ID de cartItem et les envoyer dans le nouveau tableau
    fetch("http://localhost:3000/api/products/" + cart[i].itemID).then(response => {
      response.json().then(product => {
        console.table(product)
        //Création de l'objet qui va être utilisé pour afficher le panier
        const article = {
          img: product.imageUrl,
          alt: product.altTxt,
          name: product.name,
          price: product.price,
          description: product.description,
          color: cart[i].itemColor,
          quantity: cart[i].quantity,
          _id: cart[i].itemID,
        };

        //On créé le HTML avec les constantes que l'on a définit précédemment
        //On créé un élément qu'il faudra rattacher à son parent à la fin
        const articleElement = document.createElement("article")
        articleElement.className = "cart__item";
        articleElement.dataset.id = article._id;
        articleElement.dataset.color = article.color;
        articleElement.innerHTML += `<div class="cart__item__img">
      <img src="${article.img}" alt="${article.alt}">
      </div>
      <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${article.name}</h2>
        <p>${article.color}</p>
        <p>${article.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${article.quantity} </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
      </div>`;

        //Une fois le HTML créé on ajoute la suppression au click.
        const deleteButton = articleElement.getElementsByClassName("deleteItem")
        //getElements renvoie un tableau car on cherche une classe (qui peut se trouver sur plusieurs balises), et addEventListener n'agit que sur des éléments : on indique qu'il faut agir sur le premier (et ici le seul) élément du tableau
        deleteButton[0].addEventListener("click", function (event) {
          //Splice permet de modifier un tableau
          cart.splice(i, 1);
          setCart(cart)
          //On imprime à nouveau le panier, sachant qu'on supprime le précédent en rendant la section vide au début de la fonction.
          print()
        })
        //Une fois tout effectué on affecte l'élément à son parent
        sectionCartItems.appendChild(articleElement);

        //On ajoute la possibilité de modifier la quantité dans le panier
        const quantityInput = articleElement.querySelector("input")
        //On indique qu'on cible le premier élément du tableau renvoyé par getElements en réaction à la saisie de l'utilisateur
        quantityInput.addEventListener("change", function (event) {
          let newQuantity = quantityInput.value;
          //if >100 on remet la quantité à 100, 0 = 1
          if (newQuantity <= 0) {
            newQuantity = 1;
          } else {
            if (newQuantity > 100) {
              newQuantity = 100;
            } else {
            }
          }
          cart[i].quantity = newQuantity;
          setCart(cart)
          print();
        });
        //Une fois tout effectué on affecte l'élément à son parent
        sectionCartItems.appendChild(articleElement);
        //Calcul des prix et quantités totaux
        priceTotal += parseInt(article.quantity) * article.price;
        kanapTotal += parseInt(article.quantity);
        //Ajout dans le HTML via innerText
        basketPrice.innerText = priceTotal;
        basketQuantity.innerText = kanapTotal;
      })
    });
  }//ici fin de la boucle for
}


//---------------------------FORMULAIRE-------------------------------------------//

function validateEmail(email) {
  var emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
  return emailReg.test(email);
}
function validateName(name) {
  var nameReg = new RegExp(/^(?:[^\d\W][\-\s\']{0,1}){2,20}$/i);
  return nameReg.test(name);
}

function validateAdress(adress) {
  var adressReg = new RegExp(/^[a-zA-Z0-9 ]+$/);
  return adressReg.test(adress);
}



function validateCity(city) {
  var cityReg = new RegExp(/^([0-9]{5})\s([A-Z]{2,20})/i);
  return cityReg.test(city);
}

let email = false;
let firstName = false;
let lastName = false;
let adress = false;
let city = false;

//Récupération des Inputs de l'utilisateur

const formulaire = document.querySelector(".cart__order")
const firstNameInput = document.getElementById("firstName")
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
const lastNameInput = document.getElementById("lastName")
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
const adressInput = document.getElementById("address")
const adressErrorMsg = document.getElementById("addressErrorMsg")
const cityInput = document.getElementById("city")
const cityErrorMsg = document.getElementById("cityErrorMsg")
const emailInput = document.getElementById("email")
const emailErrorMsg = document.getElementById("emailErrorMsg")

//Vérification de la validité, sinon message d'erreur

firstNameInput.addEventListener("change", function (event) {
  if (validateName(firstNameInput.value)) {
    firstName = true;
    firstNameErrorMsg.innerText = "";
  } else {
    firstNameErrorMsg.innerText = "Votre prénom n'est pas valide";
  }
})

lastNameInput.addEventListener("change", function (event) {
  if (validateName(lastNameInput.value)) {
    lastName = true;
    lastNameErrorMsg.innerText = "";
  } else {
    lastNameErrorMsg.innerText = "Votre nom n'est pas valide";
  }
})

adressInput.addEventListener("change", function (event) {
  if (validateAdress(adressInput.value)) {
    adress = true;
    adressErrorMsg.innerText = "";
  } else {
    adressErrorMsg.innerText = "Votre adresse n'est pas valide";
  }
})

cityInput.addEventListener("change", function (event) {
  if (validateCity(cityInput.value)) {
    city = true;
    cityErrorMsg.innerText = "";
  } else {
    cityErrorMsg.innerText = "Votre adresse n'est pas valide (format 00000 VILLE)";
  }
})


emailInput.addEventListener("change", function (event) {
  if (validateEmail(emailInput.value)) {
    email = true;
    emailErrorMsg.innerText = "";
  } else {
    emailErrorMsg.innerText = "Votre adresse mail n'est pas valide";
  }
})


//Si tout est ok, création de l'objet commande à envoyer

const commandButton = document.querySelector("#order")

commandButton.addEventListener("click", function (event) {
  event.preventDefault();

  //On créé le tableau d'ID
  const products = []
  const cartID = getCart()
  for (let i = 0; i < cartID.length; i++) {
    productArrayID = cartID[i].itemID
    products.push(productArrayID)
  }

  //On créé l'object contact si le tableau d'Id n'est pas vide et les informations de contact sont correctes
  if (firstName && lastName && adress && city && email && (products.length != 0)) {
    const contact = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      address: adressInput.value,
      city: cityInput.value,
      email: emailInput.value,
    }

    //On associe les deux pour pouvoir les envoyer à l'API
    let order = {contact, products};
    //On envoie l'objet à l'API pour récupérer l'ID
    const orderId = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(order),
      headers: { "Content-Type": "application/json" },
    });
    orderId.then(async function (response) {
      const renvoi = await response.json();
      window.location.href = `confirmation.html?orderId=${renvoi.orderId}`;
    })
  } else {
    alert("Votre panier est vide ou vos informations de contact ne sont pas valides")
  }
})



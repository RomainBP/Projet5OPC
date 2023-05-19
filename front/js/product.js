// Récupération de l'ID du produit dans l'adresse URL

let url = new URL(location.href);
let productID = url.searchParams.get("id");



const sectionPieceImg = document.querySelector(".item__img");
const sectionPieceName = document.querySelector("#title");
const sectionPiecePrice = document.querySelector("#price");
const sectionPieceDescr = document.querySelector("#description");
const sectionPieceColors = document.querySelector("#colors");

fetch(`http://localhost:3000/api/products/${productID}`).then(response => {
    response.json().then(product => {
        console.table(product)

        const pieceImg = product.imageUrl;
        const pieceAlt = product.altTxt;
        const pieceName = product.name;
        const piecePrice = product.price;
        const pieceDescription = product.description;
        const pieceColor = product.colors;
        for (let color of pieceColor) {
            sectionPieceColors.innerHTML += `<option value="${color}">${color}</option>`
        }

        sectionPieceImg.innerHTML += `<img src="${pieceImg}" alt="${pieceAlt}">`;
        sectionPieceName.innerHTML += `${pieceName}`;
        sectionPiecePrice.innerHTML += `${piecePrice}`;
        sectionPieceDescr.innerHTML += `${pieceDescription}`;

        const addToCart = document.querySelector("#addToCart");
        const quantity = document.querySelector("#quantity");

        addToCart.addEventListener("click", function (event) {
            event.preventDefault();
            //Vérification de la validité de la couleur et de la quantité
            if (sectionPieceColors.value === "") {
                alert("Vous devez choisir une couleur pour ce canapé")
                return
            }
            if (quantity.value < 1 || quantity.value > 100) {
                alert("Votre quantité saisie doit être supérieure à 0 et inférieure ou égale à 100")
                return
            }
            //On vérifie que le panier existe dans le LS, ou on le créé, et on l'enregistre dans une constante
            const cart = getCart();
            // On créé l'objet qui correspond à la ligne de commande créé par l'utilisateur
            let cartItem = {
                itemID: productID,
                itemName: pieceName,
                itemColor: sectionPieceColors.value,
                quantity: quantity.value,
            }
            //On vérifie si la ligne (ID + color) est déjà présente dans le panier. Si oui, modif de quantité. Si non, création de la ligne
            let findItem = cart.find((item) => item.itemID === cartItem.itemID && item.itemColor === cartItem.itemColor);
            if (findItem === undefined) {
                cart.push(cartItem)
            } else {
                newQuantity = Number(findItem.quantity) + Number(cartItem.quantity);
                findItem.quantity = newQuantity;
            };
            setCart(cart);
        })

    })

}).catch(reason => {
    console.error(reason)
})



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



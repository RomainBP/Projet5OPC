// Récupération des produits depuis l'API'
fetch('http://localhost:3000/api/products').then(response => {
    response.json().then(products => {
        generateProducts(products)
    })

}).catch(reason => {
    console.error(reason)
})


// Génération fiches produits

function generateProducts(products) {

    for (let i = 0; i < products.length; i++) {
        const article = products[i];
        //Récupération de l'élément du DOM qui accueillera les fiches
        const sectionItems = document.querySelector(".items");
        sectionItems.innerHTML += `<a href="./product.html?id=${article._id}">
            <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class="productName">${article.name}</h3>
                <p class="productDescription">${article.description} </p>
            </article>
        </a>`
    }
}


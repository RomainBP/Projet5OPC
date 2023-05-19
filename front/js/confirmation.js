let url = new URL(location.href);

const orderId = document.querySelector("#orderId")
orderId.innerHTML = url.searchParams.get("orderId");
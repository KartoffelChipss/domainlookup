window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("__hidden");

    loader.addEventListener("transitionend", () => {
        document.body.removeChild(loader);
    });
});

async function fetchAsync(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}
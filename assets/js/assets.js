window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("__hidden");

    loader.addEventListener("transitionend", () => {
        document.body.removeChild(loader);
    });
});

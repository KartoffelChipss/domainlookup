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

function formatDate(preString) {
    let date = new Date(preString);

    const month = date.getMonth() + 1;
    let monthString = `${month}`;
    if (month < 10) monthString = `0${month}`;

    const day = date.getDate();
    let dayString = `${day}`;
    if (day < 10) dayString = `0${day}`;

    return `${date.getFullYear()}-${monthString}-${dayString}`;
}
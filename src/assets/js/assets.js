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

function timeDiffString(pastTime) {
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime - pastTime);

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
}
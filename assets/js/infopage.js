function changeSection(section) {
    console.log("Change section to:", section)

    document.querySelectorAll(".boxlist._shown").forEach((ele) => {
        ele.classList.remove("_shown");
    });

    document.getElementById(section).classList.add("_shown");
}
const neonButtonWrapper = document.querySelector("#neonButtonWrapper");
const rippleTemplate = document.createElement("div");
rippleTemplate.classList.add("ripple");

function ripple(type) {
    const newRipple = rippleTemplate.cloneNode();
    if (type === "big") {
        newRipple.classList.add("ripple--big");
    }
    neonButtonWrapper.appendChild(newRipple);
    newRipple.addEventListener("animationend", () => {
        newRipple.remove();
    });
}

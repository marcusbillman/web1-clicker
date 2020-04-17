const plusButtonWrapper = document.querySelector("#plusButtonWrapper");
const rippleTemplate = document.createElement("div");
rippleTemplate.classList.add("ripple");

function ripple(type) {
    const newRipple = rippleTemplate.cloneNode();
    if (type === "big") {
        newRipple.classList.add("ripple--big");
    }
    plusButtonWrapper.appendChild(newRipple);
    newRipple.addEventListener("animationend", () => {
        newRipple.remove();
    });
}

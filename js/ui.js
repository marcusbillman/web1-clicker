const plusButtonWrapper = document.querySelector("#plusButtonWrapper");
const rippleTemplate = document.createElement("div");
rippleTemplate.classList.add("ripple");

function ripple() {
    const newRipple = rippleTemplate.cloneNode();
    plusButtonWrapper.appendChild(newRipple);
    newRipple.addEventListener("animationend", () => {
        newRipple.remove();
    });
}

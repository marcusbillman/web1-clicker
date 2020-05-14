/* Clicker spelobjektet
 * score är spelets score
 * timer är den timer som räknas upp av requestanimframe
 * den är per frame och används av bonus
 * activebonusar är en array för att hålla koll på vilka bonusar vi har
 *
 * update körs av requestanimationframe
 * click(värde) körs för att uppdatera score
 */
const Clicker = function () {
    const clicker = {};
    clicker.score = 0;
    clicker.timer = 0;
    clicker.activeBonuses = [];
    clicker.bonuses = [
        {
            name: "Afterglow",
            value: 1,
            interval: 2,
            price: 30,
            quantity: 0,
        },
        {
            name: "Radiance",
            value: 1,
            interval: 1,
            price: 80,
            quantity: 0,
        },
    ];

    clicker.update = function () {
        clicker.timer++;
    };

    clicker.click = function (val) {
        clicker.score += val;
    };

    return clicker;
};

/* Bonus objekt, skapas för varje aktiv bonus
 * duration är antalet intervaller som bonusen ska gälla
 * value är hur mycket score ska öka med
 * intervallen är hur många frames ska löpa mellan att score uppdateas
 *
 * update kallas i requestanimationframe
 */
const Bonus = function (name, value, interval) {
    const bonus = {};
    bonus.name = name;
    bonus.value = value;
    bonus.interval = interval * 60;

    bonus.update = function (timer) {
        if (timer % this.interval === 0) {
            clicker.click(this.value);
        }
    };
    return bonus;
};

// Initiera spelets objekt
let clicker = Clicker();
let score;

// Hämta html element
const clickerButton = document.querySelector("#plusButton");
const bonusBuyButtons = document.querySelectorAll(".bonus__buy");
const bonusCounters = document.querySelectorAll(".bonus__counter");
const scoreCounter = document.querySelector("#scoreCounter");
const scorePerSecond = document.querySelector("#scorePerSecond");
const bonusTemplate = document.querySelector("#bonusTemplate");
const shopBonuses = document.querySelector("#shopBonuses");

// Vänta på att sidan ska laddas
window.addEventListener(
    "load",
    (event) => {
        clicker.bonuses.forEach((bonus) => {
            bonus.element = bonusTemplate.cloneNode(true);
            shopBonuses.appendChild(bonus.element);
            bonus.element.querySelector(".bonus__title").innerHTML = bonus.name;
            bonus.element.querySelector(".bonus__specs").innerHTML =
                "+" + bonus.value + " points / " + bonus.interval + " s";
            bonus.element.querySelector(".bonus__price").innerHTML =
                bonus.price + " points";
            bonus.element
                .querySelector(".bonus__buy")
                .setAttribute("bonusIndex", clicker.bonuses.indexOf(bonus));
            bonus.element
                .querySelector(".bonus__counter")
                .setAttribute("bonusIndex", clicker.bonuses.indexOf(bonus));
            bonus.element.id = "";
        });

        // eventlisteners för knappar med tillhörande funktioner
        clickerButton.addEventListener(
            "click",
            (e) => {
                clicker.click(1);
                if (clicker.score % 100 === 0) {
                    ripple("big");
                } else {
                    ripple("normal");
                }
            },
            true
        );

        document.querySelectorAll(".bonus__buy").forEach((button) => {
            button.addEventListener(
                "click",
                (e) => {
                    // vid click skapa och lägg till denna bonus
                    const bonus =
                        clicker.bonuses[button.getAttribute("bonusIndex")];
                    clicker.score -= bonus.price;
                    clicker.activeBonuses.push(
                        Bonus(bonus.name, bonus.value, bonus.interval)
                    );
                    bonus.quantity += 1;
                    button
                        .querySelector(".material-icons")
                        .classList.add("wiggle");
                    button
                        .querySelector(".material-icons")
                        .addEventListener("animationend", () => {
                            button.classList.remove("wiggle");
                        });
                },
                false
            );
        });

        window.requestAnimationFrame(runClicker);
    },
    false
);

/*
 * runClicker är vår requestAnimationFrame metod
 * som webbläsaren försöker köra med 60 fps
 * så allt som sker i denna funktion försöker
 * webbläsaren köra 60 ggr i sekunden
 */
function runClicker() {
    clicker.update(); // uppdatera spelet

    let perSecond = 0;

    // gå igenom spelets bonusar och aktivera dem
    for (let bonus of clicker.activeBonuses) {
        bonus.update(clicker.timer);
        perSecond += bonus.value / (bonus.interval / 60);
    }

    clicker.bonuses.forEach((bonus) => {
        bonus.element.querySelector(".bonus__specs").innerHTML =
            "+" + bonus.value + " points / " + bonus.interval + " s";
        bonus.element.querySelector(".bonus__price").innerHTML =
            bonus.price + " points";
    });

    document.querySelectorAll(".bonus__buy").forEach((button) => {
        const bonusIndex = button.getAttribute("bonusIndex");
        if (bonusIndex) {
            button.disabled =
                clicker.score <
                clicker.bonuses[button.getAttribute("bonusIndex")].price;
        }
    });

    // uppdaterar score texten
    scoreCounter.innerHTML = clicker.score;

    // uppdatera score/second
    scorePerSecond.textContent = perSecond + " points/s";

    // uppdatera bonus counter
    document.querySelectorAll(".bonus__counter").forEach((counter) => {
        const bonusIndex = counter.getAttribute("bonusIndex");
        if (bonusIndex) {
            counter.innerHTML = clicker.bonuses[bonusIndex].quantity;
        }
    });

    window.requestAnimationFrame(runClicker);
}

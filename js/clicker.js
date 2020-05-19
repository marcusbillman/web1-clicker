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
    clicker.clickValue = 1;
    clicker.timer = 0;
    clicker.activeBonuses = [];
    clicker.bonuses = [
        {
            name: "Afterglow",
            type: "interval",
            value: 1,
            interval: 5,
            price: 20,
            priceMultiplier: 1.1,
            unlocked: true,
            quantity: 0,
        },
        {
            name: "Radiance",
            type: "interval",
            value: 1,
            interval: 1,
            price: 100,
            priceMultiplier: 1.3,
            unlocked: false,
            unlockCondition: {
                name: "Afterglow",
                quantity: 10,
            },
            quantity: 0,
        },
        {
            name: "Luminosity",
            type: "click",
            value: 1,
            price: 1000,
            priceMultiplier: 1.3,
            unlocked: false,
            unlockCondition: {
                name: "Radiance",
                quantity: 10,
            },
            quantity: 0,
        },
    ];

    clicker.update = function () {
        clicker.timer++;

        let perSecond = 0;
        let perClick = 1;

        // gå igenom spelets bonusar och aktivera dem
        for (let bonusInstance of clicker.activeBonuses) {
            const bonusMaster = clicker.bonuses.find(
                (e) => e.name == bonusInstance.name
            );

            if (bonusMaster.type == "interval") {
                bonusInstance.update(clicker.timer);
                perSecond +=
                    bonusInstance.value / (bonusInstance.interval / 60);
            }

            if (bonusMaster.type == "click") {
                perClick += bonusMaster.value;
            }
            clicker.clickValue = perClick;
        }

        clicker.bonuses.forEach((bonus) => {
            if (bonus.unlockCondition) {
                const requiredBonus = clicker.bonuses.find(
                    (e) => e.name == bonus.unlockCondition.name
                );
                if (requiredBonus.quantity >= bonus.unlockCondition.quantity) {
                    bonus.unlocked = true;
                }
            }
            bonus.element.querySelector(
                ".bonus__title"
            ).innerHTML = bonus.unlocked ? bonus.name : "???";
            bonus.element.querySelector(
                ".bonus__specs"
            ).innerHTML = bonus.unlocked
                ? "+" +
                  bonus.value +
                  " neon / " +
                  (bonus.type == "click" ? "click" : bonus.interval + " s")
                : "???";
            bonus.element.querySelector(
                ".bonus__price"
            ).innerHTML = bonus.unlocked ? bonus.price + " neon" : "???";
        });

        document.querySelectorAll(".bonus__buy").forEach((button) => {
            const bonusIndex = button.getAttribute("bonusIndex");
            if (bonusIndex) {
                button.disabled =
                    clicker.score < clicker.bonuses[bonusIndex].price ||
                    !clicker.bonuses[bonusIndex].unlocked;
            }
        });

        document.querySelector(".plus-button").textContent =
            "+" + clicker.clickValue;

        // uppdaterar score texten
        scoreCounter.innerHTML = clicker.score;

        document.title = clicker.score + " • Neon Clicker";

        // uppdatera score/second
        scorePerSecond.textContent =
            Math.round(perSecond * 10) / 10 + " neon/s";

        // uppdatera bonus counter
        document.querySelectorAll(".bonus__counter").forEach((counter) => {
            const bonusIndex = counter.getAttribute("bonusIndex");
            if (bonusIndex) {
                counter.innerHTML = clicker.bonuses[bonusIndex].quantity;
            }
        });
    };

    clicker.click = function () {
        clicker.score += clicker.clickValue;
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
            clicker.score += this.value;
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
                "+" + bonus.value + " neon / " + bonus.interval + " s";
            bonus.element.querySelector(".bonus__price").innerHTML =
                bonus.price + " neon";
            bonus.element
                .querySelector(".bonus__buy")
                .setAttribute("bonusIndex", clicker.bonuses.indexOf(bonus));
            bonus.element
                .querySelector(".material-icons")
                .addEventListener("animationend", () => {
                    bonus.element
                        .querySelector(".material-icons")
                        .classList.remove("wiggle");
                });
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
                    bonus.price = Math.round(
                        bonus.price * bonus.priceMultiplier
                    );
                    button
                        .querySelector(".material-icons")
                        .classList.add("wiggle");
                },
                false
            );
        });

        window.requestAnimationFrame(runClicker);
    },
    false
);

let deltaUpdate = 0;
let lastTime = new Date().getTime();

/*
 * runClicker är vår requestAnimationFrame metod
 * som webbläsaren försöker köra med 60 fps
 * så allt som sker i denna funktion försöker
 * webbläsaren köra 60 ggr i sekunden
 */
function runClicker() {
    //window.requestAnimationFrame(runClicker);

    let currentTime = new Date().getTime();
    deltaUpdate += (currentTime - lastTime) / (1000 / 60);
    lastTime = currentTime;

    while (deltaUpdate >= 1) {
        deltaUpdate--;
        clicker.update();
    }

    window.requestAnimationFrame(runClicker);
}

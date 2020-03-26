/* Clicker spelobjektet
 * score är spelets score
 * timer är den timer som räknas upp av requestanimframe
 * den är per frame och används av bonus
 * activebonusar är en array för att hålla koll på vilka bonusar vi har
 * 
 * update körs av requestanimationframe
 * click(värde) körs för att uppdatera score
 */
const Clicker = function() {
    const clicker = {};
    clicker.score = 0;
    clicker.timer = 0;
    clicker.activeBonuses = [];

    clicker.update = function () {
        clicker.timer++;
    }

    clicker.click = function (val) {
        clicker.score += val;
    }

    return clicker;
}

/* Bonus objekt, skapas för varje aktiv bonus
 * duration är antalet intervaller som bonusen ska gälla
 * value är hur mycket score ska öka med
 * intervallen är hur många frames ska löpa mellan att score uppdateas
 * 
 * update kallas i requestanimationframe
 */
const Bonus = function (duration, value, interval) {
    const bonus = {};
    bonus.duration = duration;
    bonus.value = value;
    bonus.interval = interval;

    bonus.update = function (timer) {
        if(timer % this.interval === 0) {
            this.duration--;
            clicker.click(this.value);
        }
    }
    return bonus;
}

// Initiera spelets objekt
let clicker = Clicker();
let score;

// Vänta på att sidan ska laddas 
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');

    // Hämta html element
    let clickerButton = document.querySelector("#clicker");
    let bonusButton = document.querySelector("#bonus");
    score = document.querySelector("#score"); // score element

    // eventlisteners för knappar med tillhörande funktioner
    clickerButton.addEventListener('click', (e) => {
        // vid click öka score med 1
        clicker.click(1);
        console.log(clicker.score);
    }, false);

    bonusButton.addEventListener('click', (e) => {
        // vid click skapa och lägg till denna bonus
        clicker.activeBonuses.push(Bonus(10, 2, 60));
    },false);

    window.requestAnimationFrame(runClicker);

}, false);

/*
 * runClicker är vår requestAnimationFrame metod
 * som webbläsaren försöker köra med 60 fps
 * så allt som sker i denna funktion försöker
 * webbläsaren köra 60 ggr i sekunden
 */
function runClicker() {
    clicker.update(); // uppdatera spelet

    // gå igenom spelets bonusar och aktivera dem
    for (let bonus of clicker.activeBonuses) {
        bonus.update(clicker.timer);

        // om en bonus löpt ut, ta bort den från arrayen
        if (bonus.duration <= 0) {
            clicker.activeBonuses.splice(clicker.activeBonuses.indexOf(x => x === bonus), 1);
        }
    }

    // uppdaterar score texten
    score.textContent = "Score: " + clicker.score;

    window.requestAnimationFrame(runClicker);
}
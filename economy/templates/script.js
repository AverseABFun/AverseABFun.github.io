"use strict";

function log(...data) {
    console.log(...data)
    document.getElementById("log").innerHTML += data+"<br>"
}

window.onerror = log;

var money = 50;

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code'
});

function getMoneyText(money) {
    return USDollar.format(money).replace("USD", "").trim();
}

class Investment {
    constructor(name, id, onclick, isAvailable, price, moneyPerSecond, share, costPerMin, shouldAutoUnlock) {
        this.name = name;
        this.id = id;
        this.onclick = onclick;
        this.isAvailable = isAvailable;
        this.price = price;
        this.moneyPerSecond = moneyPerSecond;
        this.share = share;
        this.costPerMin = costPerMin;
        this.shouldAutoUnlock = shouldAutoUnlock;

        document.getElementById(id).addEventListener("click", onclick);
    }

    _canPayFor() {
        return money >= this.price;
    }

    canPayFor() {
        var p = this._canPayFor();
        //this.disabled = p;
        return p;
    }

    getMoneyPerSecond() {
        return this.moneyPerSecond * this.share;
    }

    /**
     * @param {boolean} value
     */
    set isAvailable(value) {
        this._available = value;
        if (value) {
            document.getElementById(this.id).classList.remove('invisible')
        } else {
            document.getElementById(this.id).classList.add('invisible')
        }
    }

    get isAvailable() {
        return this._available;
    }

    /**
     * @param {boolean} value
     */
    set disabled(value) {
        if (value) {
            document.getElementById(this.id).setAttribute("disabled", "")
        } else {
            document.getElementById(this.id).removeAttribute("disabled")
        }
    }
    get disabled() {
        return document.getElementById(this.id).hasAttribute("disabled")
    }
}

function lemonadeInvest() {
    if (!availableInvestments["lemonade-stand"].canPayFor()) {
        return;
    }
    money -= availableInvestments["lemonade-stand"].price;
    boughtInvestments.push(availableInvestments["lemonade-stand"]);

    availableInvestments["lemonade-stand"].isAvailable = false;
    availableInvestments["lemonade-stand-work"].isAvailable = true;
    availableInvestments["lemonade-stand-worker"].isAvailable = true;
}

var lastWorked = 0;

function lemonadeWork() {
    if (Date.now()-lastWorked < 1000) {
        return;
    }
    money += 1.00;
    lastWorked = Date.now();
}

function lemonadeWorkerInvest() {
    if (!availableInvestments["lemonade-stand-worker"].canPayFor()) {
        return;
    }
    money -= availableInvestments["lemonade-stand-worker"].price;
    boughtInvestments.push(availableInvestments["lemonade-stand-worker"]);
    availableInvestments["lemonade-stand-worker"].isAvailable = false
}

var startedBakeSale = 0;
function bakeSale() {
    if (!availableInvestments["host-bake-sale"].canPayFor()) {
        availableInvestments["host-bake-sale"].disabled = true;
        return;
    }
    if (Date.now()-startedBakeSale < 30000) {
        availableInvestments["host-bake-sale"].disabled = true;
        return;
    }
    startedBakeSale = Date.now();
    money -= availableInvestments["host-bake-sale"].price;
    boughtInvestments.push(Object.assign(Object.create(Object.getPrototypeOf(availableInvestments["host-bake-sale"])), availableInvestments["host-bake-sale"]));
}

var boughtInvestments = []

var availableInvestments = {
    "lemonade-stand": new Investment("Lemonade Stand", "lemonade-stand", lemonadeInvest, true, 20, 0, 0, 0, false),
    "lemonade-stand-work": new Investment("Work at the Lemonade Stand", "lemonade-stand-work", lemonadeWork, false, 0, 1, 0, false),
    "lemonade-stand-worker": new Investment("Lemonade Stand Worker", "lemonade-stand-worker", lemonadeWorkerInvest, false, 40, 1, 1, 0.18083333333, false),
    "host-bake-sale": new Investment("Host a Bake Sale", "host-bake-sale", bakeSale, false, 60, 3, 1, 0, true)
}

var i = 0
setInterval(() => {
    if (Date.now()-lastWorked < 1000) {
        availableInvestments["lemonade-stand-work"].disabled = true;
    } else {
        availableInvestments["lemonade-stand-work"].disabled = false;
    }
    if (Date.now()-startedBakeSale < 30000 || boughtInvestments.includes(availableInvestments["host-bake-sale"])) {
        availableInvestments["host-bake-sale"].disabled = true;
    } else if (boughtInvestments.includes(availableInvestments["host-bake-sale"])) {
        delete boughtInvestments[boughtInvestments.indexOf(availableInvestments["host-bake-sale"])];
        availableInvestments["host-bake-sale"].disabled = false;
    }
    for (const key of Object.keys(availableInvestments)) {
        const value = availableInvestments[key];
        if (value.canPayFor() && !value.isAvailable && value.shouldAutoUnlock) {
            value.isAvailable = true;
        }
    }
    for (const element of boughtInvestments) {
        if (i%10==0) {
            money += element.moneyPerSecond;
        }
        if (i%(10*60) == 0) {
            money -= element.costPerMin;
        }
    }
    document.getElementById('money').innerHTML = getMoneyText(money);
    i++;
}, 100);
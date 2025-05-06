import ActualizeDataDOM from "./ActualizeDataDOM.js";

class ActualizeHomePage extends ActualizeDataDOM {
  constructor() {
    super();
    this._perfoDataCont = document.getElementById("performance-data-container");
    this._perfoContainer = document.getElementById("performance-container");
    this._perfoTitle = document.getElementById("performance-title");
    this._instructionsContainer = document.getElementById(
      "instructions-container"
    );
    this._seeMorePerfo = document.getElementById("see-more-performance");

    this._walletTable = document.getElementById("wallet-table");
    this._ordersTable = document.getElementById("orders-table");
    this._tbodyWallet = document.querySelector("#wallet-table tbody");
    this._tbodyOrders = document.querySelector("#orders-table tbody");

    this._form.addEventListener("submit", this.submitOrderFinish.bind(this));
  }

  submitOrderFinish() {
    event.preventDefault();
    if (this.isEmpty() || !this.actualizeModalToSell()) {
      return;
    }

    this.isOnWallet();
    this.actualizeHomePage();
    location.reload();
  }

  actualizeHomePage() {
    this.actualizeDataPerformance();
    this.actualizeWalletHome();
    this.actualizeOrderHome();
  }

  clearWalletHomePage() {
    this.actualizeHomePage();
  }

  actualizeDataPerformance() {
    this._instructionsContainer.classList.add("hidden");
    if (this._wallet.total[0].value === 0) {
      this._perfoContainer.classList.add("hidden");
      this._instructionsContainer.classList.remove("hidden");
      this._seeMorePerfo.classList.add("hidden");
      this._perfoTitle.textContent = "INSTRUCTIONS";
    }
    this._perfoDataCont.innerHTML = "";
    const fragment = document.createDocumentFragment();
    this.actualValueWallet();

    Object.keys(this._wallet).forEach((category) => {
      if (
        !Array.isArray(this._wallet[category]) ||
        this._wallet[category].length === 0
      ) {
        return;
      }
      const div = document.createElement("div");
      const h3 = document.createElement("h3");
      const pCost = document.createElement("p");
      const pValue = document.createElement("p");
      const pProfit = document.createElement("p");
      const pPercentage = document.createElement("p");

      h3.classList.add("text-center", "font-medium", "tracking-wider");
      h3.textContent = `${category.toUpperCase()}`;

      let cost = this._wallet[category][this._wallet[category].length - 1].cost;
      let value =
        this._wallet[category][this._wallet[category].length - 1].value;
      let profit = value - cost;

      if (category === "others" && this._currencies.others.length >= 1) {
        const existCurrencie = this.searchSymbolJSON(
          this._orders[this._orders.length - 1].ticker
        );
        if (existCurrencie) {
          existCurrencie.price = this._orders[this._orders.length - 1].price;
        }

        cost = this._wallet[category][this._wallet[category].length - 1].cost;
        value = this._wallet[category][this._wallet[category].length - 1].value;
        profit = value - cost;
      }

      pCost.textContent = `Cost: $${this.formatNumber(cost)}`;
      pValue.textContent = `Value: $${this.formatNumber(value)}`;
      pProfit.textContent = `P & L: $${this.formatNumber(profit)}`;
      pProfit.classList.add(
        profit > 0
          ? "text-green-500"
          : profit < 0
          ? "text-red-500"
          : "text-black"
      );

      pPercentage.textContent = `P & L: ${this.formatNumber(
        (profit / cost) * 100
      )} %`;
      pPercentage.classList.add(
        profit > 0
          ? "text-green-500"
          : profit < 0
          ? "text-red-500"
          : "text-black"
      );

      div.append(h3, pCost, pValue, pProfit, pPercentage);
      fragment.appendChild(div);
    });

    this._perfoDataCont.appendChild(fragment);
  }

  actualizeNewHomePageWallet() {
    this._tbodyWallet.innerHTML = "";
    const tr = document.createElement("tr");
    tr.classList.add(":w-20", "*:h16", "*:px-4", "*:py-2", "*:font-medium");
    const th = document.createElement("th");
    th.textContent = "You don't have any investments at this time";
    th.setAttribute("colspan", "8");
    tr.appendChild(th);
    this._tbodyWallet.classList.remove("*:hover:bg-sky-200");
    this._tbodyWallet.appendChild(tr);

    return;
  }

  actualizeWalletHome() {
    if (
      Object.keys(this._wallet).every((key) => this._wallet[key].length === 1)
    ) {
      this.actualizeNewHomePageWallet();
      return;
    }

    const top3Wallet = this.getTop3Items(this._wallet);
    this._tbodyWallet.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      if (i >= top3Wallet.length) break;
      if (top3Wallet[i].units === 0) {
        this.actualizeNewHomePageWallet();
        break;
      }
      const tr = document.createElement("tr");
      tr.classList.add("*:px-4", "*:py-2");
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.classList.add("font-medium");
      th.textContent = top3Wallet[i].symbol;
      const tdName = document.createElement("td");
      const tdUnits = document.createElement("td");
      const tdPrice = document.createElement("td");
      const tdValue = document.createElement("td");
      const tdProfit = document.createElement("td");
      const tdProfitPer = document.createElement("td");
      tdName.classList.add("hidden", "md:table-cell");
      tdValue.classList.add("hidden", "sm:table-cell");
      tdProfit.classList.add("hidden", "sm:table-cell", "font-semibold");
      tdProfitPer.classList.add("font-semibold");
      tdName.textContent = top3Wallet[i].name;
      tdUnits.textContent = this.formatNumber(top3Wallet[i].units);
      tdPrice.textContent = "$" + this.formatNumber(top3Wallet[i].total);
      let profit =
        this.actualValue(top3Wallet[i].units, top3Wallet[i].symbol) -
        top3Wallet[i].total;
      tdValue.textContent =
        "$" +
        this.formatNumber(
          this.actualValue(top3Wallet[i].units, top3Wallet[i].symbol)
        );
      if (this.actualValue(top3Wallet[i].units, top3Wallet[i].symbol) === 0) {
        tdValue.textContent = this.formatNumber(top3Wallet[i].total);
        profit = 0;
        tdProfitPer.textContent = "-";
      } else {
        tdProfitPer.textContent = this.formatNumber(
          (profit / top3Wallet[i].total) * 100
        );
      }
      tdProfit.textContent = this.formatNumber(profit);
      tdProfit.classList.add(profit >= 0 ? "text-green-500" : "text-red-500");

      tdProfitPer.classList.add(
        profit >= 0 ? "text-green-500" : "text-red-500"
      );

      tr.append(th, tdName, tdUnits, tdPrice, tdValue, tdProfit, tdProfitPer);
      this._tbodyWallet.appendChild(tr);
    }
  }

  actualizeNewHomePageOrders() {
    this._tbodyOrders.innerHTML = "";
    const tr = document.createElement("tr");
    tr.classList.add(":w-20", "*:h16", "*:px-4", "*:py-2", "*:font-medium");
    const th = document.createElement("th");
    th.textContent = "You don't have any investments at this time";
    th.setAttribute("colspan", "8");
    tr.appendChild(th);
    this._tbodyOrders.classList.remove("*:hover:bg-sky-200");
    this._tbodyOrders.appendChild(tr);

    return;
  }

  actualizeOrderHome() {
    if (this._orders.length === 0) {
      this.actualizeNewHomePageOrders();
      return;
    }
    const top3Orders = this.getTop3Items(this._orders);
    this._tbodyOrders.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      if (i >= top3Orders.length) break;
      const tr = document.createElement("tr");
      tr.classList.add("*:px-4", "*:py-2");
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.classList.add("font-medium");
      th.textContent = top3Orders[i].ticker;
      const tdType = document.createElement("td");
      const tdDate = document.createElement("td");
      const tdUnits = document.createElement("td");
      const tdPrice = document.createElement("td");
      const tdValue = document.createElement("td");
      tdValue.classList.add("hidden", "sm:table-cell");
      tdType.textContent = top3Orders[i].type;
      tdDate.textContent = top3Orders[i].date;
      tdUnits.textContent = this.formatNumber(top3Orders[i].units);
      tdPrice.textContent = "$" + this.formatNumber(top3Orders[i].price);
      tdValue.textContent =
        "$" + this.formatNumber(top3Orders[i].units * top3Orders[i].price);

      tr.append(th, tdType, tdDate, tdUnits, tdPrice, tdValue);
      this._tbodyOrders.appendChild(tr);
    }
  }
}

export default ActualizeHomePage;

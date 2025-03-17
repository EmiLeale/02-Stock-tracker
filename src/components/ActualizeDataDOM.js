import ActualizeWallet from "./ActualizeWallet.js";

class ActualizeDataDOM extends ActualizeWallet {
  constructor() {
    super();
    this._perfoDataCont = document.getElementById("performance-data-container");
    this._walletTable = document.getElementById("wallet-table");
    this.waitForWalletUpdate().then(() => {
      this.actualizeDataPerformance();
      this.actualizeWalletHome();
    });
  }

  async waitForWalletUpdate() {
    while (!this._currencies) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  formatNumber(num) {
    if (isNaN(num) || num === undefined || num === null || num === 0) {
      return ` -`;
    }

    num = parseFloat(num.toString().replace(/,/g, ""));

    let formattedNumber = num.toFixed(2);

    formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (formattedNumber.endsWith(".00")) {
      formattedNumber = formattedNumber.slice(0, -3);
    }

    if (formattedNumber[0] === "-") {
      return formattedNumber.slice(1);
    }

    return formattedNumber;
  }

  getTop3Items(obj) {
    this._allItems = [];
    Object.keys(obj).forEach((category) => {
      obj[category].forEach((item) => {
        if (item.total !== undefined) {
          this._allItems.push(item);
        }
      });
    });
    this._allItems.sort((a, b) => b.total - a.total);
    return this._allItems;
  }

  actualizeDataPerformance() {
    this._perfoDataCont.innerHTML = "";
    const fragment = document.createDocumentFragment();

    Object.keys(this._wallet).forEach((category) => {
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

      pCost.textContent = `Total Cost: $${this.formatNumber(cost)}`;
      pValue.textContent = `Actual Value: $${this.formatNumber(value)}`;
      pProfit.textContent = `P & L: $${this.formatNumber(profit)}`;
      pProfit.classList.add(profit >= 0 ? "text-green-500" : "text-red-500");

      pPercentage.textContent = `P & L: ${this.formatNumber(
        (profit / cost) * 100
      )} %`;
      pPercentage.classList.add(
        profit >= 0 ? "text-green-500" : "text-red-500"
      );

      div.append(h3, pCost, pValue, pProfit, pPercentage);
      fragment.appendChild(div);
    });

    this._perfoDataCont.appendChild(fragment);
  }

  actualizeWalletHome() {
    const top3Wallet = this.getTop3Items(this._wallet);
    console.log(top3Wallet);
    const fragment = document.createDocumentFragment();

    const tbody = document.createElement("tbody");
    tbody.classList.add(
      "bg-sky-100",
      "*:even:bg-sky-50",
      "divide-y",
      "divide-sky-950",
      "*:hover:bg-sky-200",
      "*:font-light",
      "*:transition-all"
    );

    for (let i = 0; i < 3; i++) {
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
      tdName.classList.add("hidden", "sm:table-cell");
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
      tdProfit.textContent = "$" + this.formatNumber(profit);
      tdProfit.classList.add(profit >= 0 ? "text-green-500" : "text-red-500");

      tdProfitPer.textContent = this.formatNumber(
        ((this.actualValue(top3Wallet[i].units, top3Wallet[i].symbol) -
          top3Wallet[i].total) /
          top3Wallet[i].total) *
          100
      );
      tdProfitPer.classList.add(
        profit >= 0 ? "text-green-500" : "text-red-500"
      );

      tr.append(th, tdName, tdUnits, tdPrice, tdValue, tdProfit, tdProfitPer);
      tbody.appendChild(tr);
    }

    fragment.appendChild(tbody);
    this._walletTable.appendChild(fragment);
  }

  actualValue(units, ticker) {
    let value = 0;
    Object.keys(this._currencies).forEach((category) => {
      this._currencies[category].forEach((item) => {
        if (item.symbol === ticker) {
          value = units * item.price;
        }
      });
    });
    return value;
  }
}

export default ActualizeDataDOM;

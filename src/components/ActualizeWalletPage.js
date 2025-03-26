import ActualizeDataDOM from "./ActualizeDataDOM.js";

class ActualizeWalletPage extends ActualizeDataDOM {
  constructor() {
    super();
    // this._perfoDataCont = document.getElementById("performance-data-container");
    this._walletTable = document.getElementById("wallet-table");
    // this._ordersTable = document.getElementById("orders-table");
    this._tbodyWallet = document.querySelector("#wallet-table tbody");
    // this._tbodyOrders = document.querySelector("#orders-table tbody");
    this.waitForWalletUpdate().then(() => {
      this.actualizeListWallet();
      this._clearWalletBtn.addEventListener(
        "click",
        this.actualizeListWallet.bind(this)
      );
    });
    this._form.addEventListener("submit", this.submitOrderFinish.bind(this));
  }

  submitOrderFinish() {
    event.preventDefault();
    if (this.isEmpty()) {
      return;
    }

    this.isOnWallet();
    this.actualizeListWallet();
  }

  actualizeListWallet() {
    if (
      Object.keys(this._wallet).every((key) => this._wallet[key].length === 1)
    ) {
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

    this._tbodyWallet.innerHTML = "";
    this._newWallet = this.orderItems(this._wallet);
    for (let i = 0; i < this._newWallet.length; i++) {
      if (i >= this._newWallet.length) break;
      const tr = document.createElement("tr");
      tr.classList.add("*:px-4", "*:py-2");
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.classList.add("font-medium");
      th.textContent = this._newWallet[i].symbol;
      const tdName = document.createElement("td");
      const tdCategory = document.createElement("td");
      const tdUnits = document.createElement("td");
      const tdPrice = document.createElement("td");
      const tdValue = document.createElement("td");
      const tdProfit = document.createElement("td");
      const tdProfitPer = document.createElement("td");
      tdName.classList.add("hidden", "md:table-cell");
      tdCategory.classList.add("hidden", "md:table-cell");
      tdValue.classList.add("hidden", "sm:table-cell");
      tdProfit.classList.add("hidden", "sm:table-cell", "font-semibold");
      tdProfitPer.classList.add("font-semibold");
      tdName.textContent = this._newWallet[i].name;
      tdCategory.textContent =
        this._newWallet[i].category.slice(0, 1).toUpperCase() +
        this._newWallet[i].category.slice(1);
      tdUnits.textContent = this.formatNumber(this._newWallet[i].units);
      tdPrice.textContent = "$" + this.formatNumber(this._newWallet[i].total);
      let profit =
        this.actualValue(this._newWallet[i].units, this._newWallet[i].symbol) -
        this._newWallet[i].total;
      tdValue.textContent =
        "$" +
        this.formatNumber(
          this.actualValue(this._newWallet[i].units, this._newWallet[i].symbol)
        );
      tdProfit.textContent = "$" + this.formatNumber(profit);
      tdProfit.classList.add(profit >= 0 ? "text-green-500" : "text-red-500");

      tdProfitPer.textContent =
        this.formatNumber(
          ((this.actualValue(
            this._newWallet[i].units,
            this._newWallet[i].symbol
          ) -
            this._newWallet[i].total) /
            this._newWallet[i].total) *
            100
        ) + " %";
      tdProfitPer.classList.add(
        profit >= 0 ? "text-green-500" : "text-red-500"
      );
      tr.append(
        th,
        tdName,
        tdCategory,
        tdUnits,
        tdPrice,
        tdValue,
        tdProfit,
        tdProfitPer
      );
      this._tbodyWallet.appendChild(tr);
    }
  }

  // METODO PARA ORDENAR CON EL FILTRO!!!!!!!!!
}

export default ActualizeWalletPage;

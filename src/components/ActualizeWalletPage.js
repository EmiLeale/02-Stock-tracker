import ActualizeDataDOM from "./ActualizeDataDOM.js";

class ActualizeWalletPage extends ActualizeDataDOM {
  constructor() {
    super();
    this._currentOrder = null;
    this._filterWallet = document.getElementById("filter-wallet");
    this._lessFilter = document.getElementById("filter-less");
    this._greaterFilter = document.getElementById("filter-greater");
    this._walletTable = document.getElementById("wallet-table");
    this._tbodyWallet = document.querySelector("#wallet-table tbody");
    this.waitForWalletUpdate().then(() => {
      this.actualizeListWallet();
      this._clearWalletBtn.addEventListener(
        "click",
        this.actualizeWalletPage.bind(this)
      );
    });
    this._form.addEventListener("submit", this.submitOrderFinish.bind(this));
    this._filterWallet.addEventListener("click", this.clickFilter.bind(this));
  }

  submitOrderFinish() {
    event.preventDefault();
    if (this.isEmpty()) {
      return;
    }

    this.isOnWallet();
    this.actualizeListWallet();
  }

  actualizeWalletPage() {
    if (this._clear === false) {
      return;
    }
    this.actualizeListWallet();
  }

  actualizeListWallet(arr, order) {
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
    this._newWallet = arr || this.orderItems(this._wallet);
    this._currentOrder = order || "Total Cost";
    for (let i = 0; i < this._newWallet.length; i++) {
      if (i >= this._newWallet.length) break;
      if (this._newWallet[i].units === 0) break;
      const tr = document.createElement("tr");
      tr.classList.add("*:px-4", "*:py-2");
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.classList.add("font-light");
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
      tdProfit.classList.add("hidden", "sm:table-cell", "font-medium");
      tdProfitPer.classList.add("font-medium");
      tdName.textContent = this._newWallet[i].name;
      tdCategory.textContent =
        this._newWallet[i].category.slice(0, 1).toUpperCase() +
        this._newWallet[i].category.slice(1);
      tdUnits.textContent = this.formatNumber(this._newWallet[i].units);
      tdPrice.textContent = "$" + this.formatNumber(this._newWallet[i].total);

      let cost = this.actualValue(
        this._newWallet[i].units,
        this._newWallet[i].symbol
      );
      let value = this._newWallet[i].total;
      let profit = cost - value;

      if (this._newWallet[i].category === "others") {
        profit = 0;
      }

      tdValue.textContent =
        "$" +
        this.formatNumber(
          this.actualValue(this._newWallet[i].units, this._newWallet[i].symbol)
        );

      tdProfit.textContent = "$" + this.formatNumber(profit);
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

      tdProfit.classList.add(profit >= 0 ? "text-green-500" : "text-red-500");
      tdProfitPer.classList.add(
        profit >= 0 ? "text-green-500" : "text-red-500"
      );

      if (
        this.formatNumber(
          this.actualValue(this._newWallet[i].units, this._newWallet[i].symbol)
        ) === " -"
      ) {
        tdProfit.textContent = "$ -";
        tdProfitPer.textContent = "% -";
      }

      this._currentOrder === "Ticker" &&
        th.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Name" &&
        tdName.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Category" &&
        tdCategory.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Total Cost" &&
        tdPrice.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Actual Value" &&
        tdValue.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "P / L" &&
        tdProfit.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "P / L %" &&
        tdProfitPer.classList.add("bg-sky-200", "font-semibold");

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

  clickFilter() {
    event.preventDefault();
    const order = event.target.textContent;
    const idFilter = event.target.parentElement.parentElement;

    this._newWallet.forEach((item) => {
      const profit = this.actualValue(item.units, item.symbol) - item.total;
      const profitPer =
        ((this.actualValue(item.units, item.symbol) - item.total) /
          item.total) *
        100;
      item.profit = profit;
      item.profitPer = profitPer;
      item.value = item.profit + item.total;
    });

    if (idFilter === this._lessFilter) {
      switch (order) {
        case "Ticker":
          this._newWallet.sort((a, b) => a.symbol.localeCompare(b.symbol));
          break;
        case "Name":
          this._newWallet.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Category":
          this._newWallet.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case "Total Cost":
          this._newWallet.sort((a, b) => a.total - b.total);
          break;
        case "Actual Value":
          this._newWallet.sort((a, b) => a.value - b.value);
          break;
        case "P / L":
          this._newWallet.sort((a, b) => a.profit - b.profit);
          break;
        case "P / L %":
          this._newWallet.sort((a, b) => a.profitPer - b.profitPer);
          break;
      }
    } else if (idFilter === this._greaterFilter) {
      switch (order) {
        case "Ticker":
          this._newWallet.sort((a, b) => b.symbol.localeCompare(a.symbol));
          break;
        case "Name":
          this._newWallet.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "Category":
          this._newWallet.sort((a, b) => b.category.localeCompare(a.category));
          break;
        case "Total Cost":
          this._newWallet.sort((a, b) => b.total - a.total);
          break;
        case "Actual Value":
          this._newWallet.sort((a, b) => b.value - a.value);
          break;
        case "P / L":
          this._newWallet.sort((a, b) => b.profit - a.profit);
          break;
        case "P / L %":
          this._newWallet.sort((a, b) => b.profitPer - a.profitPer);
          break;
      }
    } else {
      return;
    }

    this.actualizeListWallet(this._newWallet, order);
  }
}

export default ActualizeWalletPage;

import ActualizeDataDOM from "./ActualizeDataDOM.js";

class ActualizeOrdersPage extends ActualizeDataDOM {
  constructor() {
    super();
    this._currentOrder = null;
    this._filterWallet = document.getElementById("filter-orders");
    this._lessFilter = document.getElementById("filter-less");
    this._greaterFilter = document.getElementById("filter-greater");
    this._ordersTable = document.getElementById("orders-buy-table");
    this._tbodyOrders = document.querySelector("#orders-buy-table tbody");
    this._tbodyOrdersSell = document.querySelector("#orders-sell-table tbody");
    this.waitForWalletUpdate().then(() => {
      this.actualizeListOrders();
      this._clearWalletBtn.addEventListener(
        "click",
        this.actualizeListOrders.bind(this)
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
    this.actualizeListOrders();
  }

  emptyTables() {
    this._tbodyOrders.innerHTML = "";
    this._tbodyOrdersSell.innerHTML = "";
    for (let i = 0; i < 2; i++) {
      const tr = document.createElement("tr");
      tr.classList.add(
        ":w-20",
        "*:h16",
        "*:px-4",
        "*:py-2",
        "*:font-medium",
        "*:bg-sky-200"
      );
      const th = document.createElement("th");
      th.textContent = "You don't have any investments at this time";
      th.setAttribute("colspan", "8");
      tr.appendChild(th);
      if (i === 0) {
        this._tbodyOrders.classList.remove("*:hover:bg-sky-200");
        this._tbodyOrders.appendChild(tr);
      } else {
        this._tbodyOrdersSell.classList.remove("*:hover:bg-sky-200");
        this._tbodyOrdersSell.appendChild(tr);
      }
    }
  }

  actualizeListOrders(arr, order) {
    let contSell = 0;
    let contBuy = 0;

    if (
      Object.keys(this._orders).every((key) => this._orders[key].length === 1)
    ) {
      this.emptyTables();
      return;
    }

    if (contSell === 0) {
      this._tbodyOrders.innerHTML = "";
      this._tbodyOrdersSell.innerHTML = "";
      for (let i = 0; i < 2; i++) {
        const tr = document.createElement("tr");
        tr.classList.add(
          ":w-20",
          "*:h16",
          "*:px-4",
          "*:py-2",
          "*:font-medium",
          "*:bg-sky-200"
        );
        const th = document.createElement("th");
        th.textContent = "You don't have any investments at this time";
        th.setAttribute("colspan", "8");
        tr.appendChild(th);
        if (i === 0) {
          this._tbodyOrders.classList.remove("*:hover:bg-sky-200");
          this._tbodyOrders.appendChild(tr);
        } else {
          this._tbodyOrdersSell.classList.remove("*:hover:bg-sky-200");
          this._tbodyOrdersSell.appendChild(tr);
        }
      }
    }

    this._tbodyOrders.innerHTML = "";
    this._tbodyOrdersSell.innerHTML = "";
    this._newOrders = arr || this.orderOrders(this._orders);
    this._currentOrder = order || "Total";

    for (let i = 0; i < this._newOrders.length; i++) {
      if (i >= this._newOrders.length) break;
      if (this._newOrders[i].type === "Buy") contBuy++;
      if (this._newOrders[i].type === "Sell") contSell++;
      const tr = document.createElement("tr");
      tr.classList.add("*:px-4", "*:py-2");
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.classList.add("font-light");
      th.textContent = this._newOrders[i].ticker;
      const tdDate = document.createElement("td");
      const tdCategory = document.createElement("td");
      const tdUnits = document.createElement("td");
      const tdPrice = document.createElement("td");
      const tdTotal = document.createElement("td");
      tdDate.classList.add("hidden", "md:table-cell");
      tdCategory.classList.add("hidden", "md:table-cell");
      tdTotal.classList.add("hidden", "sm:table-cell");
      tdDate.textContent = this._newOrders[i].date;
      tdCategory.textContent =
        this._newOrders[i].category.slice(0, 1).toUpperCase() +
        this._newOrders[i].category.slice(1);
      tdUnits.textContent = this.formatNumber(this._newOrders[i].units);
      tdPrice.textContent = "$" + this.formatNumber(this._newOrders[i].price);
      tdTotal.textContent = "$" + this.formatNumber(this._newOrders[i].total);

      if (contSell === 1) tr.classList.add("bg-sky-100");
      if (contBuy === 1) tr.classList.add("bg-sky-100");

      this._currentOrder === "Ticker" &&
        th.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Date" &&
        tdDate.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Total" &&
        tdTotal.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Unit Price" &&
        tdPrice.classList.add("bg-sky-200", "font-semibold");
      this._currentOrder === "Category" &&
        tdCategory.classList.add("bg-sky-200", "font-semibold");

      if (this._newOrders[i].type === "Buy") {
        tr.append(th, tdDate, tdCategory, tdUnits, tdPrice, tdTotal);
        this._tbodyOrders.appendChild(tr);
      } else {
        const tdCost = document.createElement("td");
        const tdPL = document.createElement("td");
        tdCost.classList.add("hidden", "md:table-cell");
        tdPL.classList.add("hidden", "md:table-cell");

        let profit = this.midPrice(
          this._newOrders[i].ticker,
          this._newOrders[i].units
        );
        tdCost.textContent = "$" + this.formatNumber(profit);
        tdPL.textContent =
          this.formatNumber(
            ((this._newOrders[i].total - profit) / this._newOrders[i].total) *
              100
          ) + "%";

        tr.append(
          th,
          tdDate,
          tdCategory,
          tdUnits,
          tdPrice,
          tdTotal,
          tdCost,
          tdPL
        );
        this._tbodyOrdersSell.appendChild(tr);
      }
    }
  }

  clickFilter() {
    event.preventDefault();
    const order = event.target.textContent;
    const idFilter = event.target.parentElement.parentElement;

    if (idFilter === this._lessFilter) {
      switch (order) {
        case "Ticker":
          this._newOrders.sort((a, b) => a.ticker.localeCompare(b.ticker));
          break;
        case "Date":
          this._newOrders.sort((a, b) => b.date.localeCompare(a.date));
          break;
        case "Category":
          this._newOrders.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case "Total":
          this._newOrders.sort((a, b) => a.total - b.total);
          break;
        case "Unit Price":
          this._newOrders.sort((a, b) => a.price - b.price);
          break;
        case "Type":
          this._newOrders.sort((a, b) => a.type.localeCompare(b.type));
          break;
      }
    } else if (idFilter === this._greaterFilter) {
      switch (order) {
        case "Ticker":
          this._newOrders.sort((a, b) => b.ticker.localeCompare(a.ticker));
          break;
        case "Date":
          this._newOrders.sort((a, b) => a.date.localeCompare(b.date));
          break;
        case "Category":
          this._newOrders.sort((a, b) => b.category.localeCompare(a.category));
          break;
        case "Total":
          this._newOrders.sort((a, b) => b.total - a.total);
          break;
        case "Unit Price":
          this._newOrders.sort((a, b) => b.price - a.price);
          break;
        case "Type":
          this._newOrders.sort((a, b) => b.type.localeCompare(a.type));
          break;
      }
    } else {
      return;
    }
    this.actualizeListOrders(this._newOrders, order);
  }
}

export default ActualizeOrdersPage;

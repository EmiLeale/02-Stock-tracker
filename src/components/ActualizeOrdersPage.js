import ActualizeDataDOM from "./ActualizeDataDOM.js";

class ActualizeOrdersPage extends ActualizeDataDOM {
  constructor() {
    super();
    this._currentOrder = null;
    this._editMode = null;
    this._filterWallet = document.getElementById("filter-orders");
    this._lessFilter = document.getElementById("filter-less");
    this._greaterFilter = document.getElementById("filter-greater");
    this._ordersTable = document.getElementById("orders-buy-table");
    this._tbodyOrders = document.querySelector("#orders-buy-table tbody");
    this._tbodyOrdersSell = document.querySelector("#orders-sell-table tbody");

    this._form.addEventListener("submit", this.submitOrderFinish.bind(this));
    this._filterWallet.addEventListener("click", this.clickFilter.bind(this));
  }

  actualizeOrdersPage() {
    if (this._clear === false) {
      return;
    }
    this.actualizeListOrders();
  }

  deleteOrder() {
    this._editMode = true;
    this._deleteMode = true;
    this._idOrderDelete = parseInt(event.srcElement.id.replace("delete-", ""));

    const alert = window.confirm(
      "Are you sure you want to delete this order? If you delete the order, your wallet will be updated."
    );
    if (!alert) {
      return;
    }
    const deleteOrder = this._orders[this._idOrderDelete];

    this._orders.splice(this._idOrderDelete, 1);

    localStorage.setItem("orders", JSON.stringify(this._orders));

    this.actualizeEditMode(
      deleteOrder,
      deleteOrder.category,
      this._editMode,
      this._deleteMode
    );

    this._editMode = false;
    this._deleteMode = false;

    location.reload();
  }

  editOrder(event) {
    this._editMode = true;
    this._idOrder = parseInt(event.srcElement.id.replace("edit-", ""));
    if (this._idOrder === NaN) {
      return;
    }

    this.openOrderModal();

    this._type.value = this._orders[this._idOrder].type;
    this._date.value =
      this._orders[this._idOrder].date.slice(6, 12) +
      "-" +
      this._orders[this._idOrder].date.slice(3, 5) +
      "-" +
      this._orders[this._idOrder].date.slice(0, 2);
    this._units.value = this._orders[this._idOrder].units;
    this._price.value = this._orders[this._idOrder].price;
    this._total.innerText =
      "$" + this.formatNumber(this._orders[this._idOrder].total);
    this._note.value = this._orders[this._idOrder].note;

    this.sellSelected();

    if (this._type.value === "Sell") {
      this._gp.textContent =
        "$ " + this.formatNumber(this._orders[this._idOrder].cost);
      this._profit.textContent =
        this.limitNumber(this._orders[this._idOrder].pl) + " %";
    }

    this._ticker.value = this._orders[this._idOrder].ticker;
  }

  submitOrderFinish() {
    event.preventDefault();

    if (this._editMode) {
      const editOrder = this._orders[this._idOrder];

      this._orders.splice(this._idOrder, 1);

      this.actualizeEditMode(editOrder, editOrder.category, this._editMode);

      this._editMode = false;
    }

    if (this.isEmpty() || !this.actualizeModalToSell()) {
      return;
    }

    this.isOnWallet();
    this.actualizeListOrders();

    location.reload();
  }

  emptyTableBuy() {
    this._tbodyOrders.innerHTML = "";
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
    this._tbodyOrders.classList.remove("*:hover:bg-sky-200");
    this._tbodyOrders.appendChild(tr);
  }

  emptyTableSell() {
    this._tbodyOrdersSell.innerHTML = "";
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
    this._tbodyOrdersSell.classList.remove("*:hover:bg-sky-200");
    this._tbodyOrdersSell.appendChild(tr);
  }

  actualizeListOrders(arr, order) {
    let contSell = 0;
    let contBuy = 0;

    if (
      Object.keys(this._orders).every((key) => this._orders[key].length === 1)
    ) {
      this.emptyTableBuy();
      this.emptyTableSell();
      return;
    }

    this._tbodyOrders.innerHTML = "";
    this._tbodyOrdersSell.innerHTML = "";
    this._orders = arr || this.orderOrders(this._orders);
    this._currentOrder = order || "Total";

    for (let i = 0; i < this._orders.length; i++) {
      if (i >= this._orders.length) break;
      if (this._orders[i].type === "Buy") contBuy++;
      if (this._orders[i].type === "Sell") contSell++;
      const tr = document.createElement("tr");
      tr.classList.add("*:px-4", "*:py-2");
      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.classList.add("font-light", "flex", "justify-between");
      th.innerHTML =
        this._orders[i].ticker +
        `<div class="flex items-center"><button id="edit-${i}" class="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen pointer-events-none"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg></button><button id="delete-${i}" class="cursor-pointer justify-self-end"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2 pointer-events-none"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button></div>`;
      const tdDate = document.createElement("td");
      const tdCategory = document.createElement("td");
      const tdUnits = document.createElement("td");
      const tdPrice = document.createElement("td");
      const tdTotal = document.createElement("td");
      tdDate.textContent = this._orders[i].date;
      tdCategory.textContent =
        this._orders[i].category.slice(0, 1).toUpperCase() +
        this._orders[i].category.slice(1);
      tdUnits.textContent = this.formatNumber(this._orders[i].units);
      tdPrice.textContent = "$" + this.formatNumber(this._orders[i].price);
      tdTotal.textContent = "$" + this.formatNumber(this._orders[i].total);

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

      if (this._orders[i].type === "Buy") {
        this._currentOrder === "Cost" &&
          tdTotal.classList.add("bg-sky-200", "font-semibold");
        this._currentOrder === "P / L" &&
          tdTotal.classList.add("bg-sky-200", "font-semibold");
        tr.append(th, tdDate, tdCategory, tdUnits, tdPrice, tdTotal);
        this._tbodyOrders.appendChild(tr);
      } else {
        const tdCost = document.createElement("td");
        const tdPL = document.createElement("td");
        tdCost.classList.add("hidden", "md:table-cell");
        tdPL.classList.add("hidden", "md:table-cell", "font-medium");

        this._currentOrder === "Cost" &&
          tdCost.classList.add("bg-sky-200", "font-semibold");
        this._currentOrder === "P / L" &&
          tdPL.classList.add("bg-sky-200", "font-semibold");

        let cost = this._orders[i].cost;
        let pl = this._orders[i].pl;

        if (cost === undefined || pl === undefined) {
          cost = this.midPrice(this._orders[i].ticker, this._orders[i].units);
          pl = ((this._orders[i].total - cost) / this._orders[i].total) * 100;

          this._orders[i].cost = cost;
          this._orders[i].pl = pl;
        }

        tdCost.textContent = "$" + this.formatNumber(cost);
        tdPL.textContent = this.formatNumber(pl) + "%";

        tdPL.classList.add(pl >= 0 ? "text-green-500" : "text-red-500");

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

    if (contSell === 0) this.emptyTableSell();
    if (contBuy === 0) this.emptyTableBuy();
  }

  clickFilter() {
    event.preventDefault();
    const order = event.target.textContent;
    const idFilter = event.target.parentElement.parentElement;

    if (idFilter === this._lessFilter) {
      switch (order) {
        case "Ticker":
          this._orders.sort((a, b) => a.ticker.localeCompare(b.ticker));
          break;
        case "Date":
          this._orders.sort((a, b) => b.date.localeCompare(a.date));
          break;
        case "Category":
          this._orders.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case "Total":
          this._orders.sort((a, b) => a.total - b.total);
          break;
        case "Unit Price":
          this._orders.sort((a, b) => a.price - b.price);
          break;
        case "Type":
          this._orders.sort((a, b) => a.type.localeCompare(b.type));
          break;
        case "Cost":
          this._orders.sort((a, b) => a.cost - b.cost);
          break;
        case "P / L":
          this._orders.sort((a, b) => a.pl - b.pl);
          break;
      }
    } else if (idFilter === this._greaterFilter) {
      switch (order) {
        case "Ticker":
          this._orders.sort((a, b) => b.ticker.localeCompare(a.ticker));
          break;
        case "Date":
          this._orders.sort((a, b) => a.date.localeCompare(b.date));
          break;
        case "Category":
          this._orders.sort((a, b) => b.category.localeCompare(a.category));
          break;
        case "Total":
          this._orders.sort((a, b) => b.total - a.total);
          break;
        case "Unit Price":
          this._orders.sort((a, b) => b.price - a.price);
          break;
        case "Type":
          this._orders.sort((a, b) => b.type.localeCompare(a.type));
          break;
        case "Cost":
          this._orders.sort((a, b) => b.cost - a.cost);
          break;
        case "P / L":
          this._orders.sort((a, b) => b.pl - a.pl);
          break;
      }
    } else {
      return;
    }
    this.actualizeListOrders(this._orders, order);
  }
}

export default ActualizeOrdersPage;

class OrderModal {
  constructor() {
    this._addOrderBtn = document.getElementById("add-order");
    this._clearWalletBtn = document.getElementById("clear-wallet");

    // Add order form
    this._form = document.getElementById("order-form");
    this._cancel = document.getElementById("order-cancel");
    this._type = document.getElementById("order-type");
    this._date = document.getElementById("order-date");
    this._ticker = document.getElementById("order-ticker");
    this._units = document.getElementById("order-units");
    this._price = document.getElementById("order-price");
    this._total = document.getElementById("order-total");
    this._gp = document.getElementById("order-gp");
    this._note = document.getElementById("order-note");
    this._profit = document.getElementById("order-profit");
    this._submit = document.getElementById("order-submit");

    // New currencie form
    this._newCurrencieForm = document.getElementById("new-currencie-form");
    this._newCurrencieName = document.getElementById("new-currencie-name");
    this._newCurrencieSubmit = document.getElementById("new-currencie-submit");
    this._adviceNewCurrencie = document.getElementById("advice-new-currencie");

    this.addEventListeners();
  }

  addEventListeners() {
    this._addOrderBtn.addEventListener("click", this.openOrderModal.bind(this));
    this._cancel.addEventListener("click", this.closeModal.bind(this));
    this._clearWalletBtn.addEventListener("click", this.clearWallet.bind(this));
    window.addEventListener("click", this.outsideClick.bind(this));
  }

  clearWallet() {
    const alert = window.confirm(
      "You're about to clean out your entire investment portfolio. Are you sure?"
    );
    if (!alert) {
      return;
    }

    this._orders = [];
    localStorage.setItem("orders", JSON.stringify(this._orders));

    this._wallet = {
      crypto: [],
      stocks: [],
      forex: [],
      index: [],
      others: [],
      total: [],
    };
    this.actualValueWallet();
    localStorage.setItem("wallet", JSON.stringify(this._wallet));

    return true;
  }

  cleanModal() {
    this._type.value = "Select an operation";
    this._date.value = "";
    this._ticker.value = "";
    this._units.value = "";
    this._price.value = "";
    this._total.innerText = "Total";
    this._gp.classList.add("hidden");
    this._profit.classList.add("hidden");
    this._profit.classList.remove("flex");
    this._gp.classList.remove("flex");
    this._gp.textContent = "G / P";
    this._profit.textContent = "Profit (%)";
    this._note.value = "";
    this._form.classList.remove("grid-rows-8");
  }

  isAllEmpty() {
    if (
      !this._units.value &&
      !this._price.value &&
      !this._date.value &&
      !this._ticker.value &&
      this._type.value === "Select an operation"
    ) {
      return true;
    }
  }
  isEmpty() {
    if (
      !this._units.value ||
      !this._price.value ||
      !this._date.value ||
      !this._ticker.value ||
      this._type.value === "Select an operation" ||
      this._units.value === "0" ||
      this._price.value === "0"
    ) {
      window.alert("Please, fill all form to submit.");
      return true;
    }
  }

  closeModal() {
    event.preventDefault();
    if (this.isAllEmpty()) {
    } else {
      const alert = window.confirm("Are you sure?");
      if (!alert) {
        return;
      }
    }
    this._newCurrencieForm.classList.add("hidden");
    this._newCurrencieName.value = "";
    this.openOrderModal();
    this.cleanModal();
  }

  openOrderModal() {
    this._form.classList.add("z-10");
    this._form.classList.toggle("hidden");
    this._form.classList.toggle("grid");
    this._form.classList.add("opacity-100");
  }

  outsideClick(e) {
    if (
      this._form.classList.contains("grid") &&
      this.isAllEmpty() &&
      e.target === document.body
    ) {
      this.closeModal();
    }
  }
}

export default OrderModal;

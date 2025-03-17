class OrderModal {
  constructor() {
    this._addOrderBtn = document.getElementById("add-order");
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
    this.addEventListeners();
  }

  addEventListeners() {
    this._addOrderBtn.addEventListener("click", this.openOrderModal.bind(this));
    this._cancel.addEventListener("click", this.closeModal.bind(this));
    window.addEventListener("click", this.outsideClick.bind(this));
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
    this._note.value = "";
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
      !this._price.value
      // ||
      // !this._date.value ||
      // !this._ticker.value ||
      // this._type.value === "Select an operation"
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
    this.openOrderModal();
    this.cleanModal();
  }

  openOrderModal() {
    this._form.classList.toggle("hidden");
    this._form.classList.toggle("grid");
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

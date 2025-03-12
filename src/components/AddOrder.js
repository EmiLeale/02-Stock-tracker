import OrderModal from "./OrderModal.js";

class AddOrder extends OrderModal {
  constructor() {
    super();
    this._orders = [
      {
        type: "Buy",
        date: "10/03/2025",
        ticker: "BTC",
        units: 3,
        price: 62000,
        note: "BTC was cheap",
      },
      {
        type: "Buy",
        date: "10/03/2025",
        ticker: "AAPL",
        units: 3,
        price: 62000,
        note: "The best investment of all times",
      },
    ];
    this.addEventListener();
    localStorage.setItem("orders", JSON.stringify(this._orders));
  }

  addEventListener() {
    this._form.addEventListener("submit", this.submitOrder.bind(this));
    this._price.addEventListener("input", this.actualizeTotal.bind(this));
    this._units.addEventListener("input", this.actualizeTotal.bind(this));
    this._type.addEventListener("change", this.sellSelected.bind(this));
  }

  sellSelected() {
    if (this._type.value === "Sell") {
      this._gp.classList.toggle("hidden");
      this._profit.classList.toggle("hidden");
      this._profit.classList.toggle("flex");
      this._gp.classList.toggle("flex");
      this._form.classList.toggle("grid-rows-8");
    } else {
      this._gp.classList.add("hidden");
      this._profit.classList.add("hidden");
      this._profit.classList.remove("flex");
      this._gp.classList.remove("flex");
      this._form.classList.remove("grid-rows-8");
    }
  }

  limitNumber(number) {
    return Number.isInteger(number) ? number : parseFloat(number.toFixed(3));
  }

  actualizeTotal() {
    if (this._units.value !== "" && this._price.value !== "") {
      const totalCalculate = this._units.value * this._price.value;
      const limitTotal = this.limitNumber(totalCalculate);
      this._total.textContent = `$${limitTotal}`;
    }
  }

  submitOrder() {
    event.preventDefault();
    const formData = new FormData(this._form);
    const formDataObj = {
      type: formData.get("order-type"),
      date: formData.get("order-date"),
      ticker: formData.get("order-ticker").toUpperCase(),
      units: Number(formData.get("order-units")),
      price: Number(formData.get("order-price")),
      note: formData.get("order-note"),
    };
    formDataObj.total = formDataObj.price * formDataObj.units;

    if (this.isEmpty()) {
      return;
    }

    this._orders.push(formDataObj);
    localStorage.setItem("orders", JSON.stringify(this._orders));

    this.cleanModal();
  }
}

export default AddOrder;

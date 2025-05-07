import OrderModal from "./OrderModal.js";

class AddOrder extends OrderModal {
  constructor() {
    super();
    this._orders = [];
    this.addEventListener();
  }

  addEventListener() {
    this._ticker.addEventListener("input", () => {
      this._newCurrencieForm.classList.add("hidden");
      if (this._ticker.value !== "" && this._type.value === "Sell") {
        this._units.disabled = false;
      } else if (this._type.value === "Sell" && this._ticker.value === "") {
        this._units.disabled = true;
        this._units.value = "";
      }
    });
  }

  sellSelected() {
    if (this._type.value === "Sell") {
      this._gp.classList.remove("hidden");
      this._profit.classList.remove("hidden");
      this._profit.classList.add("flex");
      this._gp.classList.add("flex");
      this._form.classList.add("grid-rows-8");
      if (!this._ticker.value) {
        this._units.disabled = true;
        this._units.value = "";
      }
      return true;
    } else if (this._type.value === "Buy") {
      this._units.disabled = false;
      this._units.value = "";
      this._units.setAttribute("max", Infinity);
      this._ticker.value = "";
      this._gp.classList.add("hidden");
      this._profit.classList.add("hidden");
      this._profit.classList.remove("flex");
      this._gp.classList.remove("flex");
      this._form.classList.remove("grid-rows-8");
      return false;
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

    return formattedNumber;
  }

  formatDate(date) {
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    date = `${day}/${month}/${year}`;
    return date;
  }

  submitOrder() {
    event.preventDefault();

    const formData = new FormData(this._form);
    const formDataObj = {
      type: formData.get("order-type"),
      date: this.formatDate(formData.get("order-date")),
      ticker: formData.get("order-ticker").toUpperCase(),
      units: Number(formData.get("order-units")),
      price: Number(formData.get("order-price")),
      note: formData.get("order-note"),
    };

    formDataObj.total = formDataObj.price * formDataObj.units;

    this._orders.push(formDataObj);
    localStorage.setItem("orders", JSON.stringify(this._orders));

    this.cleanModal();
    this.openOrderModal();
    return true;
  }
}

export default AddOrder;

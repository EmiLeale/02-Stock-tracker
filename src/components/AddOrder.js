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
        price: 61000,
        note: "BTC was cheap",
      },
      {
        type: "Buy",
        date: "10/03/2025",
        ticker: "ETH",
        units: 2,
        price: 1500,
        note: "BTC was cheap",
      },
      {
        type: "Buy",
        date: "10/03/2025",
        ticker: "AAPL",
        units: 1,
        price: 115,
        note: "The best investment of all times",
      },
      {
        type: "Buy",
        date: "10/03/2025",
        ticker: "SPY",
        units: 1,
        price: 470,
        note: "Investment for wallet stability",
      },
      {
        type: "Buy",
        date: "10/03/2025",
        ticker: "EUR/USD",
        units: 1100,
        price: 0.96,
        note: "I needed USD",
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
    this._ticker.addEventListener("change", this.newCurrencie.bind(this));
    this._ticker.addEventListener("input", () => {
      this._newCurrencieForm.classList.add("hidden");
    });
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

  formatDate(date) {
    const year = date.slice(0, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    date = `${day}/${month}/${year}`;
    return date;
  }

  // tickerEventChange() {
  //   this._ticker.addEventListener("change", this.newCurrencie);
  // }

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
    if (this.isEmpty()) {
      return;
    }

    this._orders.push(formDataObj);
    localStorage.setItem("orders", JSON.stringify(this._orders));

    this.cleanModal();
    return true;
  }
}

export default AddOrder;

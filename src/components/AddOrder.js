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
    this._ticker.addEventListener("input", () => {
      this._newCurrencieForm.classList.add("hidden");
    });
  }

  sellSelected() {
    if (this._type.value === "Sell") {
      this._gp.classList.remove("hidden");
      this._profit.classList.remove("hidden");
      this._profit.classList.add("flex");
      this._gp.classList.add("flex");
      this._form.classList.add("grid-rows-8");
      return true;
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

    // if (formattedNumber[0] === "-") {
    //   return formattedNumber.slice(1);
    // }

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

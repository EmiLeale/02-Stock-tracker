import OrderModal from "./OrderModal.js";

class AddOrder extends OrderModal {
  constructor() {
    super();
    this._orders = [
      {
        type: "Buy",
        date: "12/03/2025",
        ticker: "BTC",
        units: 3,
        price: 61000,
        note: "BTC was cheap",
      },
      {
        type: "Buy",
        date: "18/03/2025",
        ticker: "ETH",
        units: 2,
        price: 1500,
        note: "ETH was cheap",
      },
      {
        type: "Buy",
        date: "18/03/2025",
        ticker: "ETH",
        units: 1,
        price: 1300,
        note: "ETH was cheap",
      },
      {
        type: "Sell",
        date: "01/04/2025",
        ticker: "ETH",
        units: 1,
        price: 1500,
        note: "I needed the money",
      },
      {
        type: "Buy",
        date: "17/09/2024",
        ticker: "SPY",
        units: 1,
        price: 470,
        note: "Investment for wallet stability",
      },
      {
        type: "Buy",
        date: "25/05/2023",
        ticker: "EUR/USD",
        units: 1100,
        price: 0.96,
        note: "I needed USD",
      },
      {
        type: "Buy",
        date: "10/02/2025",
        ticker: "AAPL",
        units: 2,
        price: 100,
        note: "The best investment of all times",
      },
    ];
    // localStorage.setItem("orders", JSON.stringify(this._orders)); // Delete for save the above orders in localStorage
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

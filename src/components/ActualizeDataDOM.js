import ActualizeWallet from "./ActualizeWallet.js";

class ActualizeDataDOM extends ActualizeWallet {
  constructor() {
    super();
  }

  async waitForWalletUpdate() {
    while (!this._currencies) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log(this._currencies);
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

    if (formattedNumber[0] === "-") {
      return formattedNumber.slice(1);
    }

    return formattedNumber;
  }

  getTop3Items(obj) {
    this._allItems = [];
    if (Array.isArray(obj)) {
      this._allItems = obj.filter(
        (item) => item.units * item.price !== undefined
      );
      this._allItems.sort((a, b) => b.units * b.price - a.units * a.price);
    } else {
      Object.keys(obj).forEach((category) => {
        if (Array.isArray(obj[category])) {
          obj[category].forEach((item) => {
            if (item.total !== undefined) {
              this._allItems.push(item);
            }
          });
        }
      });
      this._allItems.sort((a, b) => b.total - a.total);
    }

    return this._allItems.slice(0, 3);
  }

  actualValue(units, ticker) {
    let value = 0;
    Object.keys(this._currencies).forEach((category) => {
      this._currencies[category].forEach((item) => {
        if (item.symbol === ticker) {
          value = units * item.price;
        }
      });
    });
    return value;
  }
}

export default ActualizeDataDOM;

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

  orderItems(obj) {
    this._allItems = [];

    Object.keys(obj).forEach((category) => {
      if (Array.isArray(obj[category])) {
        obj[category].forEach((item) => {
          item.category = category;
          if (item.total !== undefined) {
            this._allItems.push(item);
          }
        });
      }
    });
    if (Array.isArray(this._allItems)) {
      this._allItems = this._allItems.filter(
        (item) => item.units * item.price !== undefined
      );
    }
    this._allItems.sort((a, b) => b.total - a.total);
    return this._allItems;
  }

  orderOrders(arr) {
    this._allItems = [];

    if (
      Array.isArray(arr) &&
      typeof this._currencies === "object" &&
      this._currencies !== null
    ) {
      arr.forEach((item) => {
        let foundCategory = null;
        for (const category in this._currencies) {
          if (
            this._currencies.hasOwnProperty(category) &&
            Array.isArray(this._currencies[category])
          ) {
            if (
              this._currencies[category].some(
                (dbItem) => dbItem.symbol === item.ticker
              )
            ) {
              foundCategory = category;
              break;
            }
          }
        }

        if (foundCategory) {
          item.category = foundCategory;
          item.total = item.price * item.units;
          this._allItems.push(item);
        } else {
          item.category = "others";
          item.total = item.price * item.units;
          this._allItems.push(item);
        }
      });
    }
    this._allItems.sort((a, b) => b.total - a.total);
    return this._allItems;
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

import CurrencyService from "./CurrencyService.js";
import AddOrder from "./AddOrder.js";

class ActualizeWallet extends AddOrder {
  constructor() {
    super();
    this._wallet = {
      crypto: [
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: 62000,
          units: 3,
          total: 186000,
        },
      ],
      stocks: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 115,
          units: 1,
          total: 115,
        },
      ],
      forex: [
        {
          symbol: "EUR/USD",
          name: "Euro Dolar",
          price: 1,
          units: 150,
          total: 150,
        },
      ],
      index: [
        {
          symbol: "SPX",
          name: "S&P 500",
          price: 4700,
          units: 1,
          total: 4700,
        },
      ],
      others: [],
    };
    localStorage.setItem("wallet", JSON.stringify(this._wallet));
    this.loadCurrencies();
    this.actualize();
  }

  async loadCurrencies() {
    this._currencies = await CurrencyService.getCurrencies();
    console.log(this._currencies);
  }

  actualize() {
    this._form.addEventListener("submit", this.isOnWallet.bind(this));
  }

  isOnWallet() {
    const lastOrder = this._orders[this._orders.length - 1];

    this.verifySymbol(lastOrder);
  }

  verifySymbol(lastOrder) {
    for (const crypto of this._wallet.crypto) {
      if (crypto.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "crypto");
        return true;
      }
    }

    for (const stock of this._wallet.stocks) {
      if (stock.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "stocks");
        return true;
      }
    }

    for (const index of this._wallet.index) {
      if (index.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "index");
        return true;
      }
    }

    for (const forex of this._wallet.forex) {
      if (forex.symbol === lastOrder.ticker) {
        this.actualizingItem(lastOrder, "forex");
        return true;
      }
    }

    this.addNewItem(lastOrder);
    return false;
  }

  actualizingItem(lastOrder, type) {
    const index = this._wallet[type].findIndex(
      (item) => item.symbol === lastOrder.ticker
    );

    if (index !== -1) {
      this._wallet[type][index].units += lastOrder.units;
      this._wallet[type][index].total += lastOrder.total;
      this._wallet[type][index].price =
        this._wallet[type][index].total / this._wallet[type][index].units;

      localStorage.setItem("wallet", JSON.stringify(this._wallet));
    }
  }

  addNewItem(lastOrder) {
    let foundElement = null;

    for (const type in this._currencies) {
      if (Array.isArray(this._currencies[type])) {
        foundElement = this._currencies[type].find(
          (element) => element.symbol === lastOrder.ticker
        );
        if (foundElement) {
          break;
        }
      }
    }

    if (foundElement) {
      const newItem = {
        symbol: lastOrder.ticker,
        name: foundElement.name,
        units: lastOrder.units,
        price: lastOrder.price,
        total: lastOrder.units * lastOrder.price,
      };
      for (const type in this._currencies) {
        if (
          Array.isArray(this._currencies[type]) &&
          this._currencies[type].some(
            (element) => element.symbol === lastOrder.ticker
          )
        ) {
          this._wallet[type].push(newItem);
          localStorage.setItem("wallet", JSON.stringify(this._wallet));
          break;
        }
      }
    } else {
      const newItem = {
        symbol: lastOrder.ticker,
        name: lastOrder.ticker,
        units: lastOrder.units,
        price: lastOrder.price,
        total: lastOrder.units * lastOrder.price,
      };
      this._wallet["others"].push(newItem);
      localStorage.setItem("wallet", JSON.stringify(this._wallet));
    }
  }

  // addOrderToEmptyWallet(order) {
  //   this._wallet.push(order); NO ES UN ARRAY
  //   localStorage.setItem("wallet", JSON.stringify(this._wallet));
  // }
}

export default ActualizeWallet;

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
          price: 61000,
          units: 3,
          total: 183000,
        },
        {
          symbol: "ETH",
          name: "Etherum",
          price: 1500,
          units: 2,
          total: 3000,
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
          price: 0.96,
          units: 1100,
          total: 1145,
        },
      ],
      index: [
        {
          symbol: "SPY",
          name: "S&P 500",
          price: 470,
          units: 1,
          total: 470,
        },
      ],
      others: [],
      total: [],
    };
    localStorage.setItem("wallet", JSON.stringify(this._wallet));
    this.loadCurrencies();
    this.actualize();
  }

  async loadCurrencies() {
    this._currencies = await CurrencyService.getCurrencies();
    if (this._currencies) {
      this.actualValueWallet();
    } else {
      console.error("Error: The data could not be loaded.");
    }
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

  actualValueWallet() {
    this._totalValue = 0;
    this._totalCost = 0;
    Object.keys(this._wallet).forEach((category) => {
      this._wallet[category] = this._wallet[category].filter(
        (item) => !(item.value !== undefined && item.cost !== undefined)
      );

      this._value = 0;
      this._cost = 0;

      this._wallet[category].forEach((element) => {
        this._currencies[category].forEach((asset) => {
          if (element.symbol === asset.symbol) {
            this._cost += element.total;
            let value = element.units * asset.price;
            this._value += value;
          }
        });
      });

      this._wallet[category].push({
        value: this._value,
        cost: this._cost,
      });

      this._totalCost += this._cost;
      this._totalValue += this._value;
    });
    this._wallet.total = [
      {
        value: this._totalCost,
        cost: this._totalValue,
      },
    ];
    localStorage.setItem("wallet", JSON.stringify(this._wallet));
  }
  // addOrderToEmptyWallet(order) {
  //   this._wallet.push(order); NO ES UN ARRAY
  //   localStorage.setItem("wallet", JSON.stringify(this._wallet));
  // }
}

export default ActualizeWallet;

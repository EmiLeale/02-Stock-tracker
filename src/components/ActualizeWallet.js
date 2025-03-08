import AddOrder from "./AddOrder.js";

class ActualizeWallet extends AddOrder {
  constructor() {
    super();
    this.wallet = [];
  }

  isOrderOnWallet() {
    console.log(this._orders);
  }

  // En este componente, queremos chequear que la orden que se agrego
}

export default ActualizeWallet;

// actualizeWallet(obj) {
//     if (!this._wallet || this._wallet.length === 0) {
//       console.log(this._wallet, this._orders);
//     }
//     this._wallet.forEach((curr) => {
//       if (curr.ticker !== obj.ticker) {
//         const newCurrency = {
//           ticker: obj.ticker,
//           units: obj.total, //NUNCA ENTRA ACA
//         };
//         this._wallet.push(newCurrency);
//         console.log("HOLAA");
//       }
//     });
//     console.log("Wallet: " + this._wallet);
//   }

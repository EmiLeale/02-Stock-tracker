import ActualizeDataDOM from "./ActualizeDataDOM.js";

class ActualizeWalletPage extends ActualizeDataDOM {
  constructor() {
    super();
    this._perfoDataCont = document.getElementById("performance-data-container");
    this._walletTable = document.getElementById("wallet-table");
    this._ordersTable = document.getElementById("orders-table");
    this._tbodyWallet = document.querySelector("#wallet-table tbody");
    this._tbodyOrders = document.querySelector("#orders-table tbody");
    this.waitForWalletUpdate().then(() => {
      this.ActualizeWalletPage();
      this._clearWalletBtn.addEventListener(
        "click",
        this.clearWalletHomePage.bind(this)
      );
    });
    this._submit.addEventListener("click", this.ActualizeWalletPage.bind(this));
  }

  ActualizeWalletPage() {
    // this.actualizeDataPerformance();
    // this.actualizeWalletHome();
    // this.actualizeOrderHome();
  }

  clearWalletHomePage() {
    this.ActualizeWalletPage();
  }
}

export default ActualizeWalletPage;

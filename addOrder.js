const addOrderBtn = document.getElementById("add-order");
const form = document.getElementById("order-form");
const type = document.getElementById("order-type");
const date = document.getElementById("order-date");
const ticker = document.getElementById("order-ticker");
const units = document.getElementById("order-units");
const price = document.getElementById("order-price");
const total = document.getElementById("order-total");
const gp = document.getElementById("order-gp");
const profit = document.getElementById("order-profit");
const submit = document.getElementById("order-submit");
const cancel = document.getElementById("order-cancel");

const orders = [];
let wallet = [];

// window.alert("Are you sure?"); // ALERT FOR YES OR NO

function sellSelected() {
  if (type.value === "Sell") {
    gp.classList.toggle("hidden");
    profit.classList.toggle("hidden");
    profit.classList.toggle("flex");
    gp.classList.toggle("flex");
  } else {
    gp.classList.add("hidden");
    profit.classList.add("hidden");
    profit.classList.remove("flex");
    gp.classList.remove("flex");
  }
}
function cleanModal() {
  type.value = "Select an operation";
  date.value = "";
  ticker.value = "";
  units.value = "";
  price.value = "";
  total.innerText = "Total";
}
function isEmpty(obj) {
  if (
    // obj.date === "" ||
    // obj.ticker === "" ||
    // obj.type === null ||
    // obj.type === "" ||
    obj.units === 0 ||
    obj.price === 0
  ) {
    window.alert("Please, fill all form to submit.");
    return true;
  }
}
function openOrderModal() {
  form.classList.toggle("hidden");
  form.classList.toggle("grid");
}
function limitNumber(number) {
  return Number.isInteger(number) ? number : parseFloat(number.toFixed(3));
}
function actualizeTotal() {
  if (units.value && price.value !== "") {
    const totalCalculate = units.value * price.value;
    const limitTotal = limitNumber(totalCalculate);
    total.textContent = `$${limitTotal}`;
  }
}
function closeModal() {
  event.preventDefault();
  const alert = window.confirm("Are you sure?");
  if (!alert) {
    return;
  }
  openOrderModal();
  cleanModal();
}

function actualizeWallet(obj) {
  wallet.forEach((curr) => {
    if (curr.ticker !== obj.ticker) {
      const newCurrency = {
        ticker: obj.ticker,
        units: obj.total, //NUNCA ENTRA ACA
      };
      wallet.push(newCurrency);
      console.log("HOLAA");
    }
  });
  console.log("Wallet: " + wallet);
}

function submitOrder() {
  event.preventDefault();
  const formData = new FormData(this);
  const formDataObj = {
    type: formData.get("order-type"),
    date: formData.get("order-date"),
    ticker: formData.get("order-ticker"),
    units: Number(formData.get("order-units")),
    price: Number(formData.get("order-price")),
  };
  formDataObj.total = formDataObj.price * formDataObj.units;

  if (isEmpty(formDataObj)) {
    return;
  }
  orders.push(formDataObj);
  actualizeWallet(formDataObj);

  cleanModal();
}

addOrderBtn.addEventListener("click", openOrderModal);
cancel.addEventListener("click", closeModal);
form.addEventListener("submit", submitOrder);
price.addEventListener("input", actualizeTotal);
units.addEventListener("input", actualizeTotal);
type.addEventListener("change", sellSelected);

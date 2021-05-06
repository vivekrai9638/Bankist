'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

//================ Data ===============//
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    [200, '2019-11-18T21:31:17.178Z'],
    [455.23, '2019-12-23T07:42:02.383Z'],
    [-306.5, '2020-01-28T09:15:04.904Z'],
    [25000, '2020-04-01T10:17:24.185Z'],
    [-642.21, '2020-05-08T14:11:59.604Z'],
    [-133.9, '2020-07-26T17:01:17.194Z'],
    [79.97, '2020-08-01T10:51:36.790Z'],
    [1300, '2020-07-28T23:36:17.929Z'],
  ],
  interestRate: 1.2, // %
  pin: 1111,

  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    [5000, '2021-05-01T13:15:33.035Z'],
    [3400, '2021-04-30T09:48:16.867Z'],
    [-150, '2021-05-03T06:04:23.907Z'],
    [-790, '2020-01-25T14:18:46.235Z'],
    [-3210, '2020-02-05T16:33:06.386Z'],
    [-1000, '2020-04-10T14:43:26.374Z'],
    [8500, '2020-06-25T18:49:59.371Z'],
    [-30, '2021-05-04T12:01:20.894Z'],
  ],
  interestRate: 1.5,
  pin: 2222,

  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Shailza Bansal',
  movements: [
    [5000, '2021-05-01T13:15:33.035Z'],
    [400, '2021-04-30T09:48:16.867Z'],
    [-150, '2020-05-03T06:04:23.907Z'],
    [-290, '2020-08-25T14:18:46.235Z'],
    [3210, '2020-02-05T16:33:06.386Z'],
    [-1000, '2021-04-10T14:43:26.374Z'],
    [500, '2020-06-25T18:49:59.371Z'],
    [-320, '2019-05-04T12:01:20.894Z'],
  ],
  interestRate: 1.4,
  pin: 3333,

  currency: 'INR',
  locale: 'hi-IN',
};

const account4 = {
  owner: 'Vivek Rai',
  movements: [
    [8000, '2021-05-01T13:15:33.035Z'],
    [400, '2021-04-30T09:48:16.867Z'],
    [150, '2021-05-03T06:04:23.907Z'],
    [-290, '2021-04-25T14:18:46.235Z'],
    [-3210, '2020-02-05T16:33:06.386Z'],
    [1000, '2021-04-10T14:43:26.374Z'],
    [-500, '2020-06-25T18:49:59.371Z'],
    [2320, '2021-05-04T12:01:20.894Z'],
  ],
  interestRate: 1.7,
  pin: 4444,

  currency: 'INR',
  locale: 'hi-IN',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const loginPanel = document.querySelector('.login');
const logoutPanel = document.querySelector('.logout');
const banner = document.querySelector('.banner');

///////////////// ======FUNCTIONS========  /////////////////////////

// ================= Movements Display ==================//

const displayMovements = function (acc, sort = false) {
  // To clear the movements
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort(([a], [b]) => a - b)
    : acc.movements;

  movs.forEach(function ([mov, movDate], i) {
    const str = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${str}">${i + 1} ${str}</div>
    <div class="movements__date">${dateUpdate(movDate)}</div>
    <div class="movements__value">${curFormat(mov)}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// ================= Username Creation ==================//

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

// ================= Total Balance Display ==================//

const calcBalanceDisplay = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, [cur]) {
    return acc + cur;
  }, 0);
  labelBalance.innerHTML = curFormat(acc.balance);
};

// ================= Summary Display ==================//

const calcSummaryDisplay = function (acnt) {
  labelSumIn.textContent = curFormat(
    acnt.movements.reduce((acc, [mov]) => (mov > 0 ? acc + mov : acc), 0)
  );

  labelSumOut.textContent = curFormat(
    Math.abs(
      acnt.movements.reduce((acc, [mov]) => (mov < 0 ? acc + mov : acc), 0)
    )
  );

  labelSumInterest.textContent = curFormat(
    acnt.movements
      .filter(([deposit]) => deposit > 0)
      .map(([deposit]) => (deposit * acnt.interestRate) / 100)
      .filter(int => int >= 1)
      .reduce((acc, int) => acc + int, 0)
  );
};

// ================= Updated UI Display ==================//

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcBalanceDisplay(acc);

  //Display SUmmary
  calcSummaryDisplay(acc);
};

// ================= Date==================//
let now = new Date();
const dateUpdate = function (date) {
  const datePassed = function (movDate) {
    return Math.round((now - new Date(movDate)) / (1000 * 24 * 60 * 60));
  };

  const daysPassed = datePassed(date);

  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed === 0) return 'Today';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // if(new Date(date))

  return new Intl.DateTimeFormat(currentAcc.locale).format(new Date(date));
};

//==================== Currency ==================//

const curFormat = function (curr) {
  return new Intl.NumberFormat(currentAcc.locale, {
    style: 'currency',
    currency: currentAcc.currency,
  }).format(curr);
};

//==================== Timer ==================//

const logOutTimer = function () {
  let sec = 15;

  const tick = function () {
    labelTimer.textContent = `${String(Math.trunc(sec / 60)).padStart(
      2,
      0
    )}:${String(sec % 60).padStart(2, 0)}`;

    if (sec === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      loginPanel.style.transform = 'translateX(0%)';
      logoutPanel.style.transform = 'translateX(200%)';
      banner.style.transform = 'translateX(0%)';
      banner.style = 'transition-delay: .5s';
    }

    sec--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////// ====== Event Listeners ======= //////////////

//==================== Login Event =================//

let currentAcc, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  loginPanel.style.transform = 'translateX(200%)';
  logoutPanel.style.transform = 'translateX(0%)';
  banner.style.transform = 'translateX(500%)';

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (+inputLoginPin.value === currentAcc.pin) {
    //Display UI Message and UI

    labelWelcome.textContent = `Welcome Back ${
      currentAcc.owner.split(' ')[0]
    }!`;
  }
  containerApp.style.opacity = 100;

  updateUI(currentAcc);

  // clear inputs
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  labelDate.textContent = new Intl.DateTimeFormat(currentAcc.locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(now);

  // clear Timer
  clearInterval(timer);

  //call Timer
  timer = logOutTimer();
});

//===================== Transfer Event  ====================//

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  // clear inputs
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAcc.balance >= amount &&
    receiverAcc.username !== currentAcc.username
  ) {
    currentAcc.movements.push([-amount, now.toISOString()]);
    receiverAcc.movements.push([amount, now.toISOString()]);

    updateUI(currentAcc);
  }

  // clear Timer
  clearInterval(timer);

  //call Timer
  timer = logOutTimer();
});

//===================== Request Loan Event  ====================//

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmt = inputLoanAmount.value;

  // clear inputs
  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  if (loanAmt > 0 && currentAcc.movements.some(([mov]) => mov >= loanAmt * 0.1))
    setTimeout(function () {
      currentAcc.movements.push([+loanAmt, now.toISOString()]);
      updateUI(currentAcc);
    }, 2000);

  // clear Timer
  clearInterval(timer);

  //call Timer
  timer = logOutTimer();
});

//===================== Sort Event  ====================//

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAcc, !sorted);

  sorted = !sorted;

  // clear Timer
  clearInterval(timer);

  //call Timer
  timer = logOutTimer();
});

//===================== Account close Event  ====================//

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAcc.username === inputCloseUsername.value &&
    currentAcc.pin === +inputClosePin.value
  ) {
    const i = accounts.findIndex(acc => acc === currentAcc);
    accounts.splice(i, 1);
  }

  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';

  loginPanel.style.transform = 'translateX(0%)';
  logoutPanel.style.transform = 'translateX(200%)';
  banner.style.transform = 'translateX(0%)';
  banner.style = 'transition-delay: .5s';
});

//===================== Logout Event  ====================//

logoutPanel.addEventListener('click', function (e) {
  e.preventDefault();

  loginPanel.style.transform = 'translateX(0%)';
  logoutPanel.style.transform = 'translateX(200%)';
  banner.style.transform = 'translateX(0%)';
  banner.style = 'transition-delay: .5s';

  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
});

const app = document.getElementById("adminApp");

// چک ورود
if (!localStorage.getItem("admin")) {
    showLogin();
} else {
    showPanel();
}

// ===== لاگین =====
function showLogin() {
    app.innerHTML = `
    <div class="center">
        <h2>👑 ورود ادمین</h2>
        <input id="pass" placeholder="رمز">
        <br>
        <button onclick="login()">ورود</button>
    </div>
    `;
}

function login() {
    let pass = document.getElementById("pass").value;

    if (pass === "1234") {
        localStorage.setItem("admin", true);
        showPanel();
    } else {
        alert("رمز اشتباه");
    }
}

// ===== پنل =====
function showPanel() {
    app.innerHTML = `
    <div class="nav">
        <button onclick="showOrders()">📦 سفارش‌ها</button>
        <button onclick="showBalance()">💰 مدیریت موجودی</button>
        <button onclick="showServices()">🧩 سرویس‌ها</button>
        <button onclick="logout()">🚪 خروج</button>
    </div>
    <div id="page"></div>
    `;
    showOrders();
}

// ===== سفارش‌ها =====
function showOrders() {
    let orders = JSON.parse(localStorage.getItem("orders") || "[]");

    let html = `<div class="card"><h3>سفارش‌ها</h3>`;
    orders.forEach((o, i) => {
        html += `
        <p>
        سرویس: ${o.service} | تعداد: ${o.quantity}
        <button onclick="deleteOrder(${i})">❌</button>
        </p>
        `;
    });
    html += `</div>`;

    document.getElementById("page").innerHTML = html;
}

function deleteOrder(i) {
    let orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.splice(i, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    showOrders();
}

// ===== مدیریت موجودی =====
function showBalance() {
    document.getElementById("page").innerHTML = `
    <div class="card">
        <h3>افزایش موجودی</h3>
        <input id="amount" placeholder="مبلغ">
        <br>
        <button onclick="addBalance()">اضافه کن</button>
    </div>
    `;
}

function addBalance() {
    let amount = parseInt(document.getElementById("amount").value);
    let balance = parseInt(localStorage.getItem("balance") || 0);

    balance += amount;
    localStorage.setItem("balance", balance);

    alert("اضافه شد");
}

// ===== سرویس‌ها =====
function showServices() {
    document.getElementById("page").innerHTML = `
    <div class="card">
        <h3>اضافه کردن سرویس</h3>
        <input id="name" placeholder="نام سرویس">
        <button onclick="addService()">ثبت</button>
    </div>
    `;
}

function addService() {
    let name = document.getElementById("name").value;
    let services = JSON.parse(localStorage.getItem("services") || "[]");

    services.push(name);
    localStorage.setItem("services", JSON.stringify(services));

    alert("اضافه شد");
}

// ===== خروج =====
function logout() {
    localStorage.removeItem("admin");
    location.reload();
}
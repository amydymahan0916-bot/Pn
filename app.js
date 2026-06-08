const app = document.getElementById("app");

// شروع
if (!localStorage.getItem("user")) {
    showLogin();
} else {
    showDashboard();
}

// ===== لاگین =====
function showLogin() {
    app.innerHTML = `
    <div class="center">
        <h2>🔐 ورود</h2>
        <input id="username" placeholder="نام کاربری">
        <br>
        <button onclick="login()">ورود</button>
    </div>
    `;
}

function login() {
    let username = document.getElementById("username").value;

    if (!username) {
        return alert("نام کاربری رو وارد کن");
    }

    localStorage.setItem("user", username);

    // اگر موجودی نبود، مقدار اولیه بده
    if (!localStorage.getItem("balance")) {
        localStorage.setItem("balance", 100000);
    }

    showDashboard();
}

// ===== داشبورد =====
function showDashboard() {
    app.innerHTML = `
    <div class="nav">
        <button onclick="showHome()">🏠</button>
        <button onclick="showOrder()">🛒</button>
        <button onclick="showOrders()">📦</button>
        <button onclick="logout()">🚪</button>
    </div>
    <div id="page"></div>
    `;
    showHome();
}

// ===== خانه =====
function showHome() {
    let user = localStorage.getItem("user");
    let balance = localStorage.getItem("balance");

    document.getElementById("page").innerHTML = `
    <div class="card">
        <h3>👤 ${user}</h3>
        <p>💰 موجودی: ${balance}</p>
    </div>
    `;
}

// ===== ثبت سفارش =====
function showOrder() {
    let services = JSON.parse(localStorage.getItem("services") || "[]");

    if (services.length === 0) {
        document.getElementById("page").innerHTML = `
        <div class="card">
            <h3>❌ هیچ سرویسی وجود ندارد</h3>
            <p>اول از ادمین سرویس اضافه کن</p>
        </div>
        `;
        return;
    }

    let options = "";
    services.forEach((s, i) => {
        options += `<option value="${i}">${s}</option>`;
    });

    document.getElementById("page").innerHTML = `
    <div class="card">
        <h3>ثبت سفارش</h3>

        <select id="service">
            ${options}
        </select>

        <input id="link" placeholder="لینک">
        <input id="quantity" placeholder="تعداد">

        <br>
        <button onclick="sendOrder()">🚀 ثبت</button>
    </div>
    `;
}

// ===== ارسال سفارش =====
function sendOrder() {
    let service = document.getElementById("service").value;
    let link = document.getElementById("link").value;
    let quantity = document.getElementById("quantity").value;

    if (!link || !quantity) {
        return alert("همه فیلدها رو پر کن");
    }

    let balance = parseInt(localStorage.getItem("balance"));

    // قیمت فرضی
    let price = 1000;

    if (balance < price) {
        return alert("موجودی کافی نیست");
    }

    // ارسال به API
    fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            service,
            link,
            quantity
        })
    })
    .then(() => {
        // کم کردن موجودی
        balance -= price;
        localStorage.setItem("balance", balance);

        // ذخیره سفارش
        let orders = JSON.parse(localStorage.getItem("orders") || "[]");

        orders.push({
            service,
            link,
            quantity,
            status: "در حال انجام"
        });

        localStorage.setItem("orders", JSON.stringify(orders));

        alert("✅ سفارش ثبت شد");

        showOrders();
    })
    .catch(() => {
        alert("❌ خطا در اتصال به سرور");
    });
}

// ===== لیست سفارش‌ها =====
function showOrders() {
    let orders = JSON.parse(localStorage.getItem("orders") || "[]");

    if (orders.length === 0) {
        document.getElementById("page").innerHTML = `
        <div class="card">
            <h3>هیچ سفارشی نیست</h3>
        </div>
        `;
        return;
    }

    let services = JSON.parse(localStorage.getItem("services") || "[]");

    let html = `<div class="card"><h3>📦 سفارش‌ها</h3>`;

    orders.forEach(o => {
        let serviceName = services[o.service] || "نامشخص";

        html += `
        <p>
        🧩 ${serviceName} <br>
        🔗 ${o.link} <br>
        🔢 ${o.quantity} <br>
        ⏳ ${o.status}
        </p>
        <hr>
        `;
    });

    html += `</div>`;

    document.getElementById("page").innerHTML = html;
}

// ===== خروج =====
function logout() {
    localStorage.clear();
    location.reload();
}
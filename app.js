const app = document.getElementById("app");

// شروع
if (!localStorage.getItem("user")) {
    loginPage();
} else {
    dashboard();
}

// ===== لاگین =====
function loginPage(){
    app.innerHTML = `
    <div class="card">
        <h2>🔐 ورود</h2>
        <input id="user" placeholder="نام کاربری">
        <button class="btn" onclick="login()">ورود</button>
    </div>
    `;
}

function login(){
    let u = document.getElementById("user").value;
    if(!u) return alert("نام بزن");

    localStorage.setItem("user", u);
    localStorage.setItem("balance", 50000);
    dashboard();
}

// ===== داشبورد =====
function dashboard(){
    app.innerHTML = `
    <div id="page"></div>

    <div class="nav">
        <button onclick="home()">🏠</button>
        <button onclick="orderPage()">➕</button>
        <button onclick="ordersPage()">📦</button>
        <button onclick="logout()">🚪</button>
    </div>
    `;
    home();
}

// ===== خانه =====
function home(){
    let user = localStorage.getItem("user");
    let balance = localStorage.getItem("balance");

    document.getElementById("page").innerHTML = `
    <div class="card">
        <h3>👤 ${user}</h3>
        <p>💰 موجودی: ${balance}</p>
    </div>
    `;
}

// ===== سفارش =====
function orderPage(){
    let services = JSON.parse(localStorage.getItem("services")||"[]");

    if(services.length === 0){
        document.getElementById("page").innerHTML = `
        <div class="card">
        ❌ سرویسی نیست (ادمین اضافه کن)
        </div>`;
        return;
    }

    let options="";
    services.forEach((s,i)=>{
        options += `<option value="${i}">${s}</option>`;
    });

    document.getElementById("page").innerHTML = `
    <div class="card">
        <h3>ثبت سفارش</h3>

        <select id="service">${options}</select>
        <input id="link" placeholder="لینک">
        <input id="qty" placeholder="تعداد">

        <button class="btn" onclick="sendOrder()">ثبت 🚀</button>
    </div>
    `;
}

// ===== ارسال =====
function sendOrder(){
    let s = document.getElementById("service").value;
    let link = document.getElementById("link").value;
    let qty = document.getElementById("qty").value;

    if(!link || !qty) return alert("پر کن");

    let balance = parseInt(localStorage.getItem("balance"));

    if(balance < 1000) return alert("پولت کمه");

    balance -= 1000;
    localStorage.setItem("balance", balance);

    let orders = JSON.parse(localStorage.getItem("orders")||"[]");

    orders.push({
        service:s,
        link,
        qty,
        status:"درحال انجام"
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("ثبت شد 😈");
    ordersPage();
}

// ===== لیست =====
function ordersPage(){
    let orders = JSON.parse(localStorage.getItem("orders")||"[]");
    let services = JSON.parse(localStorage.getItem("services")||"[]");

    let html = `<div class="card"><h3>سفارشات</h3>`;

    orders.forEach(o=>{
        html += `
        <div class="order">
        🧩 ${services[o.service]||"?"}<br>
        🔗 ${o.link}<br>
        🔢 ${o.qty}<br>
        ⏳ ${o.status}
        </div>
        `;
    });

    html += "</div>";

    document.getElementById("page").innerHTML = html;
}

// ===== خروج =====
function logout(){
    localStorage.clear();
    location.reload();
}

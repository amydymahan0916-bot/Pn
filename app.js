const app = document.getElementById("app");

// ===== دیتای سرویس (مثل بتافالور) =====
let services = [
    {id:1, name:"فالوور اینستاگرام", price:50, min:100, max:10000},
    {id:2, name:"لایک اینستاگرام", price:30, min:50, max:5000},
    {id:3, name:"ویو استوری", price:20, min:100, max:20000}
];

// ===== شروع =====
if(!localStorage.getItem("user")){
    login();
}else{
    dashboard();
}

// ===== لاگین =====
function login(){
    app.innerHTML = `
    <div class="card">
        <h2>ورود</h2>
        <input id="u" placeholder="نام کاربری">
        <button class="btn" onclick="doLogin()">ورود</button>
    </div>
    `;
}

function doLogin(){
    let u = document.getElementById("u").value;
    if(!u) return alert("نام بزن");

    localStorage.setItem("user",u);
    localStorage.setItem("balance",100000);
    dashboard();
}

// ===== داشبورد =====
function dashboard(){
    let user = localStorage.getItem("user");
    let balance = localStorage.getItem("balance");

    app.innerHTML = `
    <div class="header">
        <span>${user}</span>
        <span>💰 ${balance}</span>
    </div>

    <div id="page"></div>

    <div class="header">
        <button onclick="home()">خانه</button>
        <button onclick="order()">سفارش</button>
        <button onclick="orders()">سفارشات</button>
        <button onclick="logout()">خروج</button>
    </div>
    `;

    home();
}

// ===== خانه =====
function home(){
    document.getElementById("page").innerHTML = `
    <div class="card">
        خوش اومدی 😈
    </div>
    `;
}

// ===== ثبت سفارش =====
function order(){
    let options="";
    services.forEach(s=>{
        options += `<option value="${s.id}">${s.name}</option>`;
    });

    document.getElementById("page").innerHTML = `
    <div class="card">
        <h3>ثبت سفارش</h3>

        <select id="service" onchange="updatePrice()">
            ${options}
        </select>

        <input id="qty" placeholder="تعداد" oninput="calc()">
        <input id="link" placeholder="لینک">

        <p id="info"></p>
        <p id="total"></p>

        <button class="btn" onclick="send()">ثبت سفارش</button>
    </div>
    `;

    updatePrice();
}

// ===== نمایش قیمت =====
function updatePrice(){
    let id = document.getElementById("service").value;
    let s = services.find(x=>x.id==id);

    document.getElementById("info").innerText =
    `قیمت: ${s.price} | حداقل: ${s.min} | حداکثر: ${s.max}`;

    calc();
}

// ===== محاسبه =====
function calc(){
    let id = document.getElementById("service").value;
    let qty = document.getElementById("qty").value;

    let s = services.find(x=>x.id==id);

    let total = qty * s.price;

    document.getElementById("total").innerText =
    "هزینه: " + total;
}

// ===== ثبت =====
function send(){
    let id = document.getElementById("service").value;
    let qty = parseInt(document.getElementById("qty").value);
    let link = document.getElementById("link").value;

    let s = services.find(x=>x.id==id);

    if(qty < s.min || qty > s.max){
        return alert("مقدار مجاز نیست");
    }

    let total = qty * s.price;
    let balance = parseInt(localStorage.getItem("balance"));

    if(balance < total){
        return alert("موجودی کافی نیست");
    }

    balance -= total;
    localStorage.setItem("balance",balance);

    let orders = JSON.parse(localStorage.getItem("orders")||"[]");

    orders.push({
        name:s.name,
        qty,
        total,
        status:"در حال انجام"
    });

    localStorage.setItem("orders",JSON.stringify(orders));

    alert("ثبت شد 😈");
    orders();
}

// ===== لیست سفارش =====
function orders(){
    let orders = JSON.parse(localStorage.getItem("orders")||"[]");

    let html = `<div class="card"><h3>سفارشات</h3>`;

    orders.forEach(o=>{
        html += `
        <div class="order">
        ${o.name}<br>
        تعداد: ${o.qty}<br>
        هزینه: ${o.total}<br>
        وضعیت: ${o.status}
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

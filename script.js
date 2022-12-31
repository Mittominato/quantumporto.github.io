const semuacrypto = document.querySelector(".semuacrypto");
const semuaaset = document.querySelector(".semuaaset");
const search = document.querySelector("#search");
const btnSearch = document.querySelector(".btnsearch");
const popupData = document.querySelector("#popupdata");
const close = document.querySelector(".close");
const send = document.querySelector(".send");
const jumlah = document.querySelector("#jumlah")
const price = document.querySelector("#price")
const nameCoin = document.querySelector(".namecoin");
const addAset = document.querySelector(".addaset");
const contentApp = document.querySelector("#contentapp");
const cryptocurrency = document.querySelector("#cryptocurrency");
const closeListCoin = document.querySelector(".closelistcoin");
const balance = document.querySelector(".balance");
const halamanAwal = document.querySelector("#halamanawal");
const buat = document.querySelector(".buat");
const loading = document.querySelector("#loading");
const nama = document.querySelector("#nama");
const username = document.querySelector(".username");
const persenToDay = document.querySelector(".persentoday");
const persenAllTime = document.querySelector(".persenalltime");
const modal = document.querySelector(".modal");
let crypto = [];
let aset = [];
let aset2 = [];
let totalBalance = [];
let persen24h = [];
let saldoAwal = []; 

////get local Storage
let data = JSON.parse(localStorage.getItem("data"));
if(data == null){
    data = [];
}
let namaAkun = JSON.parse(localStorage.getItem("namaAkun"));
//Username
if(namaAkun == null) {
    buat.addEventListener("click", () => {
    createUsername();
})
}else {
    halamanAwal.classList.add("hidden")
    username.textContent = namaAkun;
}

//Mulai Fetch
fetchAPI(pushAset,tampilkanAset)
fetchAPI(pushCrypto,tampilkanCrypto)


//Event
send.addEventListener("click", () => {
closePopup();
sendDataToArray(nameCoin.textContent, jumlah.value, price.value);
tampilkanAset();
})

close.addEventListener("click", () => {
    closePopup();
})

addAset.addEventListener("click", () => {
    contentApp.classList.add("hidden");
    cryptocurrency.classList.remove("hidden");
    doneAddCrypto();
})

closeListCoin.addEventListener("click", () => {
    closeList();
})


//Kumpulan Function
async function fetchAPI(funcPush,funcShowData) {
    await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`)
.then(response => response.json())
.then(response => {
    response.forEach(r => {
        funcPush(r);
    })
})
.finally(() => {
    funcShowData();
})
}

function closeList() {
    contentApp.classList.remove("hidden")
    cryptocurrency.classList.add("hidden")
}

function createUsername() {
    buat.classList.add("animate-bounce")
    setTimeout(() => {
        halamanAwal.classList.add("hidden")
        loading.classList.remove("hidden")
    },2000)
    setTimeout(() => {
        loading.classList.add("hidden")
    },5000)
    namaAkun = nama.value;
    localStorage.setItem("namaAkun", JSON.stringify(namaAkun));
    username.textContent = namaAkun;
}

function tampilkanCrypto() {
    semuacrypto.innerHTML = crypto.join("");
    warnaPersen();
    buttonSearch();
    asetClick();
    doneAddCrypto();
}

function buttonSearch() {
    btnSearch.addEventListener("click", () => {
        [...document.querySelectorAll(".cryptodata")].forEach(a => {
            a.classList.add("hidden")
            if (a.firstChild.nextElementSibling.firstChild.textContent === search.value.toUpperCase()) {
                a.classList.remove("hidden")
            } else if (search.value == "") {
                a.classList.remove("hidden")
            }
        })
        doneAddCrypto();
    });
}

function warnaPersen() {
    [...document.querySelectorAll(".percen")].forEach(p => {
if([...p.textContent][0] == "-"){
    p.classList.replace("text-slate-400", "text-red-500")
}else {
    p.classList.replace("text-slate-400", "text-green-500")
}
    });
}

function pushCrypto(r) {
    crypto.push(`<div class="cryptodata flex flex-wrap items-center w-full text-white h-16 justify-between pl-4 pr-6 hover:bg-gray-800 font-mono"><div class="flex items-center"><div class="images w-12 h-12 rounded-full mr-2.5 p-2 overflow-hidden"><img class="w-full h-full" src="${r.image}" alt="" /></div><div class="flex flex-col"><p class="text-sm font-bold">${r.name}</p><p class="text-[.75rem] font-bold">$ ${fixedNol(r.current_price.toFixed(9))}</p></div></div><div class="flex flex-col items-end"><p class="text-sm font-bold">${r.symbol.toUpperCase()}</p><p class="percen text-[.75rem] font-semibold text-slate-400">${r.price_change_percentage_24h.toFixed(2)}%</p></div></div>`)
}

function fixedNol(nilai1) {
    let nilai = nilai1.toString()
    let indexN = [...nilai].indexOf(".");
    if([...nilai][indexN-1] != "0"){
        return parseFloat(nilai).toFixed(2);
    }else {
        return parseFloat(nilai).toFixed(9);
    }
}

function asetClick() {
    [...document.querySelectorAll(".cryptodata")].forEach(aset => {
        aset.addEventListener("click",
            () => {
                let priceValue = aset.firstChild.firstChild.nextElementSibling.firstChild.nextElementSibling.textContent
                nameCoin.textContent = aset.firstChild.firstChild.nextElementSibling.firstChild.textContent
                price.value = [...priceValue].splice(2, priceValue.length-1).join("")
                popupData.classList.remove("hidden")
                
            })
    })
}

function sendDataToArray(namacoin, jumlahcoin, hargacoin) {
    
    data.push({
        nama: namacoin,
        jumlah: jumlahcoin,
        harga: hargacoin,
        balance : jumlahcoin*hargacoin
    })
    saveOnLocal();
}

function closePopup() {
    popupData.classList.add("hidden")
}

function saveOnLocal() {
localStorage.setItem("data", JSON.stringify(data))
}

function pushAset(r) {
    aset.push(`<div class="aset flex items-center w-full h-16 justify-between pl-3 pr-5 font-mono"><div class="flex items-center"><div class="images w-12 h-12 rounded-full mr-2.5 p-2"><img class="w-full h-full" src="${r.image}" alt="" /></div><div class="flex flex-col"><p class="text-sm font-bold">${r.name}</p><div class="flex"><span class="text-[.75rem] font-bold text-slate-400">$${r.current_price.toFixed(2)} </span><span class="percen text-[.75rem] font-bold text-slate-400 ml-1">${r.price_change_percentage_24h.toFixed(2)}</span></div></div></div><div class="flex flex-col items-end"><p class="text-sm font-bold">0</p><p class="text-[.75rem] font-semibold text-slate-400">$0</p></div></div>`)
}

function tampilkanAset() {
    semuaaset.innerHTML = aset.join("");
    warnaPersen();
    if(data.length == 0) {
        semuaaset.innerHTML = `<p class="text-md text-white text-center italic mt-16">Tidak ada aset yang di tambahkan</p>`;
    }
    seleksiAset();
}

function doneAddCrypto() {
    [...document.querySelectorAll(".cryptodata")].forEach(c => {
    data.forEach(data => {
        if(data.nama == c.firstChild.firstChild.nextElementSibling.firstChild.textContent) {
            c.classList.add("hidden")
            c.classList.add("bg-red-800")
            c.onclick = () => {
                popupData.classList.add("hidden")
            }
        }
    })
})
}

function seleksiAset() {
    [...document.querySelectorAll(".aset")].forEach(aset => {
    aset.classList.add("hidden")
    data.forEach(data => {
        if(data.nama == aset.firstChild.firstChild.nextElementSibling.firstChild.textContent) {
            aset.classList.remove("hidden")
            persen24h.push(parseFloat(aset.firstChild.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.textContent))
        }
    })
})
dataAset();
}

function addDot(numString) {
  var result = "";
  for (var i = numString.length - 1; i >= 0; i--) {
    result = numString[i] + result;
    if ((numString.length - i) % 3 == 0 && i != 0) {
      result = "," + result;
    }
  }
  return result;
}

function dataAset() {
    [...document.querySelectorAll(".aset")].forEach(aset => {
    data.forEach(data => {
        if(data.nama == aset.firstChild.firstChild.nextElementSibling.firstChild.textContent) {
            aset.firstChild.nextElementSibling.firstChild.textContent = data.jumlah;
            
            let index = [...aset.firstChild.firstChild.nextElementSibling.firstChild.nextElementSibling.textContent].indexOf(" ")
            
            let pricex = `${data.jumlah * [...aset.firstChild.firstChild.nextElementSibling.firstChild.nextElementSibling.textContent].splice(1,index).join("")}`;
            
            aset.firstChild.nextElementSibling.firstChild.nextElementSibling.textContent = `$${Math.round([...pricex].join(""))}`;
            
            totalBalance.push(parseFloat(pricex))
            
        }
    })
})
jumlahkan();
}

function jumlahkan() {
    let balanceusd = totalBalance.reduce((a,b) => a+b)
    balance.textContent = `USD $${addDot(balanceusd.toFixed(0))}`;
    hitungSaldoAwal();
    persenToDay.textContent = `${persen24h.reduce((a,b) => a+b).toFixed(2)}%`;
    persenoneday();
    persenAllTime.textContent = `${(eval(balanceusd-saldoAwal.reduce((a,b) => a+b))/(saldoAwal.reduce((a,b) => a+b)/100)).toFixed(2)}%`;
    persenall();
    modal.textContent = `$${saldoAwal.reduce((a,b) => a+b).toFixed(2)}`;
    loseOrProfit(balanceusd);
    saldoAwal = [];
    totalBalance = [];
    persen24h = [];
}

function persenoneday() {
    if([...persenToDay.textContent][0] == "-"){
        persenToDay.classList.add("bg-red-500")
    }else {
        persenToDay.classList.add("bg-green-500")
    }
}

function persenall() {
    if([...persenAllTime.textContent][0] == "-"){
        persenAllTime.classList.add("bg-red-500")
    }else {
        persenAllTime.classList.add("bg-green-500")
    }
}

function loseOrProfit(balance) {
    if(saldoAwal.reduce((a,b) => a+b) > balance){
        modal.classList.replace("text-green-500", "text-red-500");
    }
}

function hitungSaldoAwal() {
    data.forEach(d => {
        saldoAwal.push(d.balance)
    })
}
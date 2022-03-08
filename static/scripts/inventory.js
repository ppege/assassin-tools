window.getCookie = function(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
};

let inventoryCode = $("#codeInput").val();
let itemSize = 2;

function addToInventory(name1, mode) {
  let name = name1.toUpperCase().replace(/ /g,"_");
  let panel = $("#inventory-row");
  let knife = $(`#inventory-row #${name}`);
  if (knife.length !== 0) {
    let amount = knife.attr("amount");
    knife.attr("amount", parseInt(amount)+1);
    $(`#inventory-row #${name}_amount`).html(parseInt(amount)+1);
    saveInventory(mode);
    return;
  }
  panel.append(
    `<div amount=1 data-tooltip="${name1}" onclick="handleClick('${name}')" id="${name}" class="tile card knife is-child has-tooltip-right is-${itemSize}"><button style="display:none" class="button show_on_hover">Add to trade</button><img height=100% width=100% src="images/${name}.png"><p class="has-text-centered" id="${name}_amount"></p></div>`
  );
  if (mode !== "load") {
    saveInventory(mode);
    updateStats();
  }
}

function addDetails(data) {
  let ids = getIds('inventory-row');
  data.forEach((item, i) => {
    $(`#inventory-row #${ids[i]}`).attr('data-tooltip', `${item['NAME']}\n${item['DEMAND']}\nWorth ${item['EXOTICVALUE']} T1 exotics`)
  })
}

function handleClick(name) {
  if ($("#clickModeSelect").find(":selected").text() === "Delete") {
    removeFromInventory(name);
  } else {
    addItem(name, "left");
  }
}

function removeFromInventory(name1, mode) {
  let name = name1.replace(/ /g,"_");
  let knife = $(`#inventory-row #${name}`);
  if (knife.attr("amount") !== "1") {
    let amount = knife.attr("amount");
    knife.attr("amount", parseInt(amount)-1);
    if (parseInt(amount)-1 === 1){
      $(`#inventory-row #${name}_amount`).empty();
      saveInventory(mode);
      return;
    }
    $(`#inventory-row #${name}_amount`).html(parseInt(amount)-1);
    saveInventory(mode);
    return;
  }
  knife.remove();
  updateStats();
  saveInventory(mode);
}

function updateStats() {
  if ($("#invStats").length === 0) {
    $("#statRow").html(
      `
        <div id="invStats" class="card">
          <header class="card-header has-background-danger">
            <p class="card-header-title">
              Inventory Stats
            </p>
          </header>
          <div class="card-content">
            <div id="invStatContent" class="content"></div>
          </div>
        </div>
      `
    );
  }
  if ($("#inventory-row").html() === "") {
    $("#invStatContent").empty();
    return;
  }
  getInventoryValues()
  .then(data => {
    addDetails(data);
    let Value = 0;
    let DemandInfo = [0, 0];
    let ItemCount = 0;
    data.forEach((item) => {
      Value += item['EXOTICVALUE'];
      DemandInfo[0] += parseInt(item['DEMANDNUMBER']);
      DemandInfo[1]++;
      ItemCount++;
    });
    let AverageDemand = DemandInfo[0] / DemandInfo[1];
    $("#invStatContent").html(
      `
      <div class="table-container">
        <table class="table" id="invStatTable">
          <thead>
            <tr>
              <th>Exotic Value</th>
              <th>Average demand</th>
              <th>Item count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>${Value.toFixed(3)}</th>
              <th>${AverageDemand} stars</th>
              <th>${ItemCount}</th>
            </tr>
          </tbody>
        </table>
      </div>
      `
    );
  })
  .catch(err => {
    console.log(err);
  });
}

function getInventoryValues() {
  return new Promise(function(resolve, reject) {

    let ids = getIds('inventory-row');
    
    let names = ids.join(",");
  
    fetch('https://api.nangurepo.com/v2/assassin?name=' + names)
    .then(response => response.json())
    .then(data => {
        if (names.includes(",")) {
          resolve(data);
        } else {
          resolve([data[0]]);
        }
    })
    .catch(err => {
      reject(err);
    });
  })
  
}

function loadInventory() {
  let code = $("#codeInput").val();
  fetch('https://api.nangurepo.com/v2/assassin?code=' + code)
  .then(response => response.json())
  .then(data => {
    $("#inventory-row").empty();
    data.forEach(item => {
      addToInventory(item, "load")
    })
    updateStats();
  })
}

function saveInventory(mode) {
  if (mode === "load") { return; }
  let code = $("#codeInput").val();
  let ids = getIds('inventory-row');
  let names = ids.join(",");

  fetch('https://api.nangurepo.com/v2/assassin?code=' + code + "&name=" + names);
}

function warn(message) {
  $("#invwarning").html(message);
  setTimeout(function() {
    $("#invwarning").empty();
  }, 3000)
}

$("#codeInput").change(function() {
  let $input = $(this);
  if ($input.val().length >= 3) {
    loadInventory();
  } else {
    warn("Code must be at least 3 characters long.");
  }
  localStorage.setItem('code', $("#codeInput").val());
  inventoryCode = $input.val();
})

$("#itemSizeSelect").change(function() {
  let sizeSelected = $("#itemSizeSelect").find(":selected").text()
  if (sizeSelected === "Large") {
    itemSize = 2;
  } else {
    itemSize = 1;
  }
  localStorage.setItem("itemSize", sizeSelected);
  loadInventory();
})

$("#clickModeSelect").change(function() {
  localStorage.setItem("clickMode", $("#clickModeSelect").find(":selected").text())
})

if (localStorage.getItem('code') !== null) {
  $("#codeInput").val(localStorage.getItem('code'));
}
if (localStorage.getItem('itemSize') !== null) {
  $("#itemSizeSelect").val(localStorage.getItem('itemSize')).change();
}
if (localStorage.getItem('clickMode') !== null) {
  $("#clickModeSelect").val(localStorage.getItem('clickMode'));
}
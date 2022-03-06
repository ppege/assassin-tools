window.getCookie = function(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
};

autosave = localStorage.getItem("autosave") || false;

$('#autosave').click(function() {
  if(!autosave) {
    $("#saveInventory").prop( "disabled", true );
    $("#loadInventory").prop( "disabled", true );
    $("#codeInput").prop( "disabled", true );
    $('#autosave').html("Auto: on");
    $('#autosave').removeClass("is-danger");
    $('#autosave').addClass("is-success");
    autosave = true;
  } else {
    $("#saveInventory").prop( "disabled", false );
    $("#loadInventory").prop( "disabled", false );
    $("#codeInput").prop( "disabled", false );
    $('#autosave').html("Auto: off");
    $('#autosave').addClass("is-danger");
    $('#autosave').removeClass("is-success");
    autosave = false;
  };
});

function addToInventory(name1, mode) {
  let name = name1.toUpperCase().replace(/ /g,"_");
  let panel = $("#inventory-row");
  let knife = $(`#inventory-row #${name}`);
  if (knife.length !== 0) {
    let amount = knife.attr("amount");
    knife.attr("amount", parseInt(amount)+1);
    $(`#inventory-row #${name}_amount`).html(parseInt(amount)+1);
    if (autosave && mode !== "load") {
      saveInventory();
    }
    return;
  }
  panel.append(
    `<div amount=1 data-tooltip="${name1}" onclick="handleClick('${name}')" id="${name}" class="tile card knife is-child has-tooltip-bottom is-2"><button style="display:none" class="button show_on_hover">Add to trade</button><img height=128 width=128 src="images/${name}.png"><p class="has-text-centered" id="${name}_amount"></p></div>`
  );
  if (autosave && mode !== "load") {
    saveInventory();
    updateStats();
  }
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
      if (autosave) {
        saveInventory();
      }
      return;
    }
    $(`#inventory-row #${name}_amount`).html(parseInt(amount)-1);
    if (autosave) {
      saveInventory();
    }
    return;
  }
  knife.remove();
  updateStats();
  if (autosave) {
    saveInventory();
  }
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
  };
  if ($("#inventory-row").html() === "") {
    $("#invStatContent").empty();
    return;
  };
  getInventoryValues()
  .then(data => {
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
        <table class="table" id="invStatTable">
          <tr>
            <th>Exotic Value</th>
            <th>${Value.toFixed(3)}</th>
          </tr>
          <tr>
            <th>Average demand</th>
            <th>${AverageDemand} stars</th>
          </tr>
          <tr>
            <th>Item count</th>
            <th>${ItemCount}</th>
          </tr>
        </table>
      `
    );
  })
  .catch(err => {
    console.log(err);
  });
}

function getInventoryValues() {
  return new Promise(function(resolve, reject) {

    var ids = $('#inventory-row').children().map(function(){
      return $(this).attr('id');
      }).get();
    
    ids.forEach(function(id) {
      let amount = $(`#inventory-row #${id}`).attr("amount");
      if (amount !== "1") {
        for (var i = 1; i < amount; i++) {
          ids.push(id);
        }
      }
    })
    
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
    if (data === "failure") {
      $("#invwarning").html("No inventory found with code '" + code + "'");
      setTimeout(function() {
        $("#invwarning").empty();
      }, 5000)
      return;
    }
    $("#inventory-row").empty();
    data.forEach(item => {
      addToInventory(item, "load")
    })
    updateStats();
  })
}

function saveInventory() {
  let code = $("#codeInput").val();
  var ids = $('#inventoryContainer').children().children().map(function(){
    return $(this).attr('id');
    }).get();
  
  ids.forEach(function(id) {
    let amount = $(`#inventory-row #${id}`).attr("amount");
    if (amount !== "1") {
      for (var i = 1; i < amount; i++) {
        ids.push(id);
      }
    }
  })
  let names = ids.join(",");

  fetch('https://api.nangurepo.com/v2/assassin?code=' + code + "&name=" + names);
}

if (window.getCookie('we-love-cookies') === "1") {
  $("#loadInventory").click(function() {
    localStorage.setItem('code', $("#codeInput").val());
  });
  $("#autosave").click(function() {
    localStorage.setItem('auto', autosave);
  });
};

if (localStorage.getItem('code') !== null) {
  $("#codeInput").val(localStorage.getItem('code'));
  loadInventory();
}

if (localStorage.getItem('auto') !== null && localStorage.getItem('auto') == "true") {
  $("#autosave").click();
}
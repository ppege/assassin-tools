$("#clearTrade").click(function() {
  $("#left, #right, #statContent").empty()
})

function addItem(name1, side) {
  let name = name1.toUpperCase().replace(/ /g,"_");
  let panel = $("#" + side);
  if ($(`#${side} #${name}`).length !== 0) {
    let amount = $(`#${side} #${name}`).attr("amount");
    $(`#${side} #${name}`).attr("amount", parseInt(amount)+1);
    $(`#${side} #${name}_amount`).html(parseInt(amount)+1);
    updateResult(side);
    return;
  }
  if (panel.children().length >= 6) {
    $("#warningtext").html("Max. 6 items per offer! Don't get scammed.");
    setTimeout(function() {
      $("#warningtext").empty();
    }, 5000)
    return;
  }
  panel.append(
    `<div amount=1 data-tooltip="${name1}" onclick="removeItem('${name}', '${side}')" id="${name}" class="tile knife is-child has-tooltip-bottom is-2"><button style="display:none" class="button show_on_hover">Add to trade</button><img height=128 width=128 src="images/${name}.png"><p class="has-text-centered" id="${name}_amount"></p></div>`
  );
  if (panel.children().length >= 6 && side === "inventory-row") {
    $("#inventoryContainer").append(
      `<div id="inventory-row" class="tile is-ancestor"></div>`
    );
  }
  updateResult(side);
}
  
function removeItem(name1, side) {
  let name = name1.replace(/ /g,"_");
  if ($(`#${side} #${name}`).attr("amount") !== "1") {
    let amount = $(`#${side} #${name}`).attr("amount");
    $(`#${side} #${name}`).attr("amount", parseInt(amount)-1);
    if (parseInt(amount)-1 === 1){
      $(`#${side} #${name}_amount`).empty();
      updateResult(side);
      return;
    }
    $(`#${side} #${name}_amount`).html(parseInt(amount)-1);
    updateResult(side);
    return;
  }
  $(`#${side} #${name}`).remove();
  updateResult(side);
}

function updateResult(side) {
  if (side === "inventory-row") {
    return;
  }
  if ($("#tradeStats").length === 0) {
    $("#warningtext").after(
      `
      <div class="columns is-mobile is-multiline is-centered">
        <div class="column is-half">
          <div id="tradeStats" class="card">
            <header class="card-header has-background-danger">
              <p class="card-header-title">
                Trade Stats
              </p>
            </header>
            <div class="card-content">
              <div id="statContent" class="content"></div>
            </div>
          </div>
        </div>
      </div>
      `
    );
  };
  if ($("#left").html() === "" || $("#right").html() === "") {
    $("#statContent").empty();
    return;
  };
  Promise.all([getValues('left'), getValues('right')])
  .then(data => {
    let leftValue = 0;
    let leftValueW = "NO!";
    let leftDemandInfo = [0, 0];
    let leftDemandW = "NO!";
    let rightValue = 0;
    let rightDemandInfo = [0, 0];
    data[0].forEach((item) => {
      leftValue += item['EXOTICVALUE'];
      leftDemandInfo[0] += parseInt(item['DEMANDNUMBER']);
      leftDemandInfo[1]++;
    });
    data[1].forEach((item) => {
      rightValue += item['EXOTICVALUE'];
      rightDemandInfo[0] += parseInt(item['DEMANDNUMBER']);
      rightDemandInfo[1]++;
    });
    var leftAverageDemand = leftDemandInfo[0]/leftDemandInfo[1];
    var rightAverageDemand = rightDemandInfo[0]/rightDemandInfo[1];
    if (leftValue < rightValue) {
      leftValueW = "YES!";
    };
    if (leftAverageDemand < rightAverageDemand) {
      leftDemandW = "YES!";
    };
    if (leftValue == rightValue) {
      leftValueW = "EVEN!";
    };
    if (leftAverageDemand == rightAverageDemand) {
      leftDemandW = "EVEN!";
    };
    $("#statContent").html(
      `
        <table class="table" id="stattable">
          <tr>
            <th></th>
            <th>YOUR OFFER</th>
            <th>THEIR OFFER</th>
            <th>W FOR YOU?</th>
          </tr>
          <tr>
            <th>Exotic Value</th>
            <th>${leftValue.toFixed(3)}</th>
            <th>${rightValue.toFixed(3)}</th>
            <th>${leftValueW}</th>
          </tr>
          <tr>
            <th>Average demand</th>
            <th>${leftAverageDemand.toFixed(3)} stars</th>
            <th>${rightAverageDemand.toFixed(3)} stars</th>
            <th>${leftDemandW}</th>
          </tr>
        </table>
      `
    );
  })
  .catch(err => {
    console.log(err);
  });
}

function getValues(side) {
  return new Promise(function(resolve, reject) {

    var ids = $('#' + side).children().map(function(){
      return $(this).attr('id');
      }).get();
    
    ids.forEach(function(id) {
      let amount = $(`#${side} #${id}`).attr("amount");
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
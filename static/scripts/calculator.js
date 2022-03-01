function addItem(name1, side) {
  let name = name1.toUpperCase().replace(/ /g,"_");
  let panel = $("#" + side);
  if (panel.children().length === 6) {
    $("#warningtext").html("Max. 6 items per offer! Don't get scammed.");
    setTimeout(function() {
      $("#warningtext").empty();
    }, 5000)
    return;
  }
  if ($(`#${side} #${name}`).length !== 0) {
    let amount = $(`#${side} #${name}`).attr("amount");
    $(`#${side} #${name}`).attr("amount", parseInt(amount)+1);
    $(`#${side} #${name}_amount`).html(parseInt(amount)+1);
    updateResult();
    return;
  }
  panel.append(
    `<div amount=1 data-tooltip="${name1}" onclick="removeItem('${name}', '${side}')" id="${name}" class="tile is-child has-tooltip-bottom is-2"><img height=128 width=128 src="images/${name}.png"><p class="has-text-centered" id="${name}_amount"></p></div>`
  );
  updateResult();
}
  
function removeItem(name1, side) {
  let name = name1.replace(/ /g,"_");
  if ($(`#${side} #${name}`).attr("amount") !== "1") {
    let amount = $(`#${side} #${name}`).attr("amount");
    $(`#${side} #${name}`).attr("amount", parseInt(amount)-1);
    if (parseInt(amount)-1 === 1){
      $(`#${side} #${name}_amount`).empty();
      updateResult();
      return;
    }
    $(`#${side} #${name}_amount`).html(parseInt(amount)-1);
    updateResult();
    return;
  }
  $(`#${side} #${name}`).remove();
  updateResult();
}

function updateResult() {
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
  }
  Promise.all([getValues('left'), getValues('right')])
  .then(data => {
    let leftValue = 0;
    let leftValueW = "NO!";
    let leftDemandInfo = [0, 0];
    let leftDemandW = "NO!";
    let rightValue = 0;
    let rightDemandInfo = [0, 0];
    try {
      data[0].forEach((item) => {
        leftValue += parseInt(item['VALUE']);
        leftDemandInfo[0] += parseInt(item['DEMANDNUMBER']);
        leftDemandInfo[1]++;
      });
      data[1].forEach((item) => {
        rightValue += parseInt(item['VALUE'])
        rightDemandInfo[0] += parseInt(item['DEMANDNUMBER']);
        rightDemandInfo[1]++;
      });
      var leftAverageDemand = leftDemandInfo[0]/leftDemandInfo[1];
      var rightAverageDemand = rightDemandInfo[0]/rightDemandInfo[1];
      if (leftValue < rightValue) {
        leftValueW= "YES!";
      };
      if (leftAverageDemand < rightAverageDemand) {
        leftDemandW = "YES!";
      };
      if (leftValue == rightValue) {
        leftValueW= "EVEN!";
      };
      if (leftAverageDemand == rightAverageDemand) {
        leftDemandW = "EVEN!";
      };
    } catch {
      $("#statContent").empty();
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
            <th>Value</th>
            <th>${leftValue}</th>
            <th>${rightValue}</th>
            <th>${leftValueW}</th>
          </tr>
          <tr>
            <th>Average demand</th>
            <th>${leftAverageDemand} stars</th>
            <th>${rightAverageDemand} stars</th>
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

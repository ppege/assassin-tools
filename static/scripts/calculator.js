function addItem(name1, side) {
  let name = name1.replace(/ /g,"_");
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
    return;
  }
  panel.append(
    `<div amount=1 data-tooltip="${name}" onclick="removeItem('${name}', '${side}')" id="${name}" class="tile is-child has-tooltip-bottom is-2"><img height=128 width=128 src="images/${name}.png"><p class="has-text-centered" id="${name}_amount"></p></div>`
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
      return;
    }
    $(`#${side} #${name}_amount`).html(parseInt(amount)-1);
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
          <div class="card">
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
    )
  }
  
}
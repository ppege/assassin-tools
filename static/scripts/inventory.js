function addToInventory(name1) {
  let name = name1.toUpperCase().replace(/ /g,"_");
  let panel = $("#inventory-row");
  let knife = $(`#inventory-row #${name}`);
  if (knife.length !== 0) {
    let amount = knife.attr("amount");
    knife.attr("amount", parseInt(amount)+1);
    $(`#inventory-row #${name}_amount`).html(parseInt(amount)+1);
    return;
  }
  panel.append(
    `<div amount=1 data-tooltip="${name1}" onclick="removeFromInventory('${name}')" id="${name}" class="tile card knife is-child has-tooltip-bottom is-1"><button style="display:none" class="button show_on_hover">Add to trade</button><img height=128 width=128 src="images/${name}.png"><p class="has-text-centered" id="${name}_amount"></p></div>`
  );
}

function removeFromInventory(name1) {
  let name = name1.replace(/ /g,"_");
  let knife = $(`#inventory-row #${name}`);
  if (knife.attr("amount") !== "1") {
    let amount = knife.attr("amount");
    knife.attr("amount", parseInt(amount)-1);
    if (parseInt(amount)-1 === 1){
      $(`#inventory-row #${name}_amount`).empty();
      return;
    }
    $(`#inventory-row #${name}_amount`).html(parseInt(amount)-1);
    return;
  }
  knife.remove();
}

function loadInventory() {
  let code = $("#codeInput").val();
  fetch('https://api.nangurepo.com/v2/assassin?read&code=' + code)
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
      addToInventory(item, "inventory-row")
    })
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

  fetch('https://api.nangurepo.com/v2/assassin?write&code=' + code + "&name=" + names);
}
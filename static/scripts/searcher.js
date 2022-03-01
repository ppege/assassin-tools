//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 300;  //time in ms, 5 seconds for example
var $input = $('#knifeInput');

//on keyup, start the countdown
$input.on('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
  clearTimeout(typingTimer);
});

function doneTyping() {
    $('#valuetable').find('tr:gt(0)').remove();
    let input = $('#knifeInput').val();
    fetch('https://api.nangurepo.com/v2/assassin?name=' + input)
    .then(response => response.json())
    .then(data => {
        data.forEach(function(knife) {
            $('#valuetable tr:last').after(
                `<tr><th><img width=96 height=96 src="images/${knife['NAME'].replace(/ /g,"_")}.png"></th><th>${knife['NAME']}</th><th>${knife['DEMAND']}</th><th>${knife['VALUE']}</th><th>${knife['OBTAIN']}</th><th>${knife['ORIGIN']}</th><th><button class="button" onclick="addItem('${knife['NAME']}', 'left')">LEFT</button><button class="button" onclick="addItem('${knife['NAME']}', 'right')">RIGHT</button></th></tr>`
            );
        })
    });
}

function addItem(name, side) {
  let panel = $("#" + side)
  if (panel.children().length === 6) {
    return;
  }
  panel.append(
    `<div data-tooltip="${name}" onclick="removeItem('${name.replace(/ /g,"_")}', '${side}')" id="${name.replace(/ /g,"_")}" class="tile is-child has-tooltip-bottom is-2"><img height=128 width=128 src="images/${name.replace(/ /g,"_")}.png"></div>`
  )
}

function removeItem(name, side) {
  $("#" + side + " #" + name + ":first").remove()
}
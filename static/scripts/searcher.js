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
    fetch('https://viggoscrape.nangurepo.com/api/v2/assassin?name=' + input)
    .then(response => response.json())
    .then(data => {
        data.forEach(function(knife) {
            $('#valuetable tr:last').after(
                `<tr><th>${knife['NAME']}</th><th>${knife['DEMAND']}</th><th>${knife['VALUE']}</th><th>${knife['OBTAIN']}</th><th>${knife['ORIGIN']}</th></tr>`
            );
        })
    });
}

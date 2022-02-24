$("#knifeInput").on('input', function() {
    fetch('values.json')
    .then(response => {
        return response.json();
    })
    .then(values => {
        let input = $("#knifeInput").val();
        var knife = {
            "DEMAND": "INVALID",
            "VALUE": 0,
            "OBTAIN": "INVALID",
            "ORIGIN": "INVALID"
        }
        try {
            var knife = values[input.toUpperCase()];
        } catch {}
        $("#name").text(input.toUpperCase());
        $("#demand").text(knife["DEMAND"]);
        $("#value").text(knife["VALUE"]);
        $("#obtain").text(knife["OBTAIN"]);
        $("#origin").text(knife["ORIGIN"]);
    });
})
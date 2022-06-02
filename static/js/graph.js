var myChart;

$( document ).ready(function() {
    user_name = $('.user-name').text().slice(1,2);
    $('.user-letter').text(user_name.toUpperCase());
    // Load Currency Names
    fetch('https://api.frankfurter.app/currencies')
        .then((data) => data.json())
        .then((data) => {
            $.each(data, function(index, value) {
                var datacode = JSON.stringify(value.code);
                $("#graph-base-currency-selector").append("<option class='currency-option' value='"+ index + "'><span>" + value + "</span></option>");
                $("#graph-convert-currency-selector").append("<option class='currency-option' value='"+ index + "'><span>" + value + "</span></option>");
                $('#graph-base-currency-selector option[value="USD"]').attr("selected",true);
                $('#graph-convert-currency-selector option[value="NZD"]').attr("selected",true);
            });

            let currency1 = $('#graph-base-currency-selector option:selected').attr("value");
            let currency2 = $('#graph-convert-currency-selector option:selected').attr("value");

            getGraphData(currency1, currency2);
    });
});

function getGraphData(baseCurrency, convertCurrency){
    fetch(`https://api.frankfurter.app/2020-01-01..?from=${baseCurrency}`)
        .then((data) => data.json())
        .then((data) => {
            var graphData = [];
            var graphLabels = [];
            for(let i = 0; i < Object.keys(data.rates).length; i++) {
                graphData.push(Object.values(data.rates)[i][convertCurrency]);
                graphLabels.push(Object.keys(data.rates)[i]);
            }
            displayGraph(graphLabels, graphData, convertCurrency);
    });
}

function displayGraph(graphLabels, graphData, currency){
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: graphLabels,
            datasets: [{
                label: currency + ' Value',
                data: graphData,
                backgroundColor: [
                    'rgba(0, 174, 255, 0.69)'

                ],
                borderColor: [
                    'rgba(0, 174, 255, 0.69)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                        beginAtZero: false
                    }
                },
                x: {
                    ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                    }
                }
            }
        }
    });
    loaded();
}

$('#graph-base-currency-selector').on('change', function() {  
    var newGraphData = [];
    var newGraphLabels = [];
    let currency1 = $('#graph-base-currency-selector option:selected').attr("value");
    let currency2 = $('#graph-convert-currency-selector option:selected').attr("value");
    
    fetch(`https://api.frankfurter.app/2020-01-01..?from=${currency1}`)
    .then((data) => data.json())
    .then((data) => {
        for(let i = 0; i < Object.keys(data.rates).length; i++) {
            newGraphData.push(Object.values(data.rates)[i][currency2]);
            newGraphLabels.push(Object.keys(data.rates)[i]);
        }
        myChart.destroy();
        displayGraph(newGraphLabels, newGraphData, currency2);
    });
});

$('#graph-convert-currency-selector').on('change', function() {  
    var newGraphData = [];
    var newGraphLabels = [];
    let currency1 = $('#graph-base-currency-selector option:selected').attr("value");
    let currency2 = $('#graph-convert-currency-selector option:selected').attr("value");
        
    fetch(`https://api.frankfurter.app/2020-01-01..?from=${currency1}`)
    .then((data) => data.json())
    .then((data) => {
        for(let i = 0; i < Object.keys(data.rates).length; i++) {
            newGraphData.push(Object.values(data.rates)[i][currency2]);
            newGraphLabels.push(Object.keys(data.rates)[i]);
        }
        myChart.destroy();
        displayGraph(newGraphLabels, newGraphData, currency2);
    });
});

function setDate(days){
    var date = new Date();
    date.setDate(date.getDate() - days);

    var formattedDate;

    if((date.getMonth()+1) > 0 && (date.getMonth()+1) < 10 && date.getDate() > 0 && date.getDate() < 10) {
        formattedDate = date.getFullYear()+'-0'+(date.getMonth()+1)+'-0'+date.getDate();
    } else if(date.getDate() > 0 && date.getDate() < 10) {
        formattedDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-0'+date.getDate();
    } else if ((date.getMonth()+1) > 0 && (date.getMonth()+1) < 10){
        formattedDate = date.getFullYear()+'-0'+(date.getMonth()+1)+'-'+date.getDate();
    } else {
        formattedDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }
    setGraphDate(formattedDate);
}

function setGraphDate(date){
    var newGraphData = [];
    var newGraphLabels = [];
    let currency1 = $('#graph-base-currency-selector option:selected').attr("value");
    let currency2 = $('#graph-convert-currency-selector option:selected').attr("value");
        
    fetch(`https://api.frankfurter.app/${date}..?from=${currency1}`)
    .then((data) => data.json())
    .then((data) => {
        for(let i = 0; i < Object.keys(data.rates).length; i++) {
            newGraphData.push(Object.values(data.rates)[i][currency2]);
            newGraphLabels.push(Object.keys(data.rates)[i]);
        }
        myChart.destroy();
        displayGraph(newGraphLabels, newGraphData, currency2);
    });

}

function switchCurrency(){
    var currency1 = $('#graph-base-currency-selector option:selected').attr("value");
    var currency2 = $('#graph-convert-currency-selector option:selected').attr("value");

    $('#graph-base-currency-selector').val(currency2).change();
    $('#graph-convert-currency-selector').val(currency1).change();

}
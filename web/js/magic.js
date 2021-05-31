jQuery( document ).ready(function() {
    // Create a client instance
    client = new Paho.MQTT.Client("broker.hivemq.com", 8000,"Kelompok0_WebIface");
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
        useSSL: false,
        userName: "public",
        password: "public",
        onSuccess:onConnect,
        onFailure:doFail
    }
    // connect the client
    client.connect(options);
    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("Connected!");
        client.subscribe("undiknas/ti/kelompok0/relay");
        client.subscribe("undiknas/ti/kelompok0/relay/state");
        client.subscribe("undiknas/ti/kelompok0/sensor/suhu");
        client.subscribe("undiknas/ti/+/chatroom");
        /*message = new Paho.MQTT.Message("Hello CloudMQTT");
        message.destinationName = "/cloudmqtt";
        client.send(message);*/
    }
    function doFail(e){
        console.log(e);
    }
    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }
    // called when a message arrives
    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
        if(message.destinationName == "undiknas/ti/kelompok0/sensor/suhu"){
            addData(myChart, parseFloat(message.payloadString));
            
            
            //konversi ke Fahrenheit
            var celcius = parseFloat(message.payloadString);
            var fahrenheit = (celcius * 9/5) + 32;
            
            $('#data-suhu').html("Suhu lingkungan tercatat: " + celcius.toFixed(2) + " °C" + " atau " + fahrenheit.toFixed(2) + "°F");
        }
        else if(message.destinationName == "undiknas/ti/kelompok0/relay/state"){
            var state = (message.payloadString == "0") ? "OFF" : "ON";
            $('#fan-state').html("Current State: " + state); 
        }
    }
    
    $('#fan-on').click(function(){
        var message = new Paho.MQTT.Message("on");
        message.destinationName = "undiknas/ti/kelompok0/relay";
        client.send(message);
    });
    
    $('#fan-off').click(function(){
        var message = new Paho.MQTT.Message("off");
        message.destinationName = "undiknas/ti/kelompok0/relay";
        client.send(message);
    });
    
    function addData(chart, data) {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        chart.data.labels.push(dateTime);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
    
    
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        data: [],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false,
      }
    }
    });
});
window.onload = function () {
  var conn;
  var msg = document.getElementById("msg");
  var log = document.getElementById("log");
  
  function appendLog(item) {
    var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
    log.appendChild(item);
    if (doScroll) {
        log.scrollTop = log.scrollHeight - log.clientHeight;
    }
  }
  
  function addNewMessage(msg) {
    var item = document.createElement("div")
    item.innerHTML = msg;
    appendLog(item);
  }
  
  document.getElementById("btn").onclick = (e) => {
    e.preventDefault()
    if(msg.value && conn) {
      addNewMessage(`Client: ${msg.value}`)
    
      conn.send(msg.value);
      msg.value = "";
    }
    
  };
  
  if (window["WebSocket"]) {
      conn = new WebSocket("ws://localhost:8080/ws");
      conn.onclose = function (evt) {
          addNewMessage("<b>Connection closed.</b>")
      };
  
      conn.onmessage = function (evt) {
          addNewMessage(evt.data)

          if(evt.data === "Server: ping (per 10s)") {
            let msg = "Client: pong (respond)"
             addNewMessage(msg)
             conn.send(msg)
         }
      };
  } else {
      var item = document.createElement("div");
      item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
      appendLog(item);
  }
}

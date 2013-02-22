var socketId;
var dataFromRead = "";

chrome.socket.create('tcp', {}, function onSocketCreate(createInfo) {
  socketId = createInfo.socketId;
  chrome.socket.connect(socketId, '10.0.0.30', 6667, onConnected);
});
console.log("onConnected is done. ReadForever is next");

function onConnected() {
  readForever();
  console.log(socketId);
  read();
  write('PASS none\r\n');
  write('NICK OptimistBot\r\n');
  write('USER USER 0 * :Real Name\r\n', function() {
    //wait for a sign that we're registered before joining.
    //Welcome to the Internet Relay Network -RPL_WELCOME via IRC RFCs
    //socket.listen is not  an option for client side connections. let's try reading until we get what we want
    var welcomeMsg="";
    var dateread = new Date();
    console.log(dateread+": Wrote after USER/r/n");
    
  write('JOIN #realtestchannel\r\n');
  
})//end write
}

function write(s, f) {
  chrome.socket.write(socketId, str2ab(s), function(good) {console.log('write was ', good); if (f) f();});
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*1); // 1 byte for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function read() {
  chrome.socket.read(socketId, null, function(readInfo) {
    if (readInfo.resultCode > 0) {
      var dateread = new Date();
      console.log(dateread + ab2str(readInfo.data));
      dataFromRead+=dateread.getTime()+ab2str(readInfo.data)+"/r/n";
    }
  });
}//end read
function readForever(readInfo){
  
  if(readInfo!==undefined)
  {
    var dateread = new Date();
    console.log(dateread + ab2str(readInfo.data));
    dataFromRead+=dateread.getTime()+ab2str(readInfo.data)+"/r/n";
  }
  
  chrome.socket.read(socketId, null, this.readForever.bind(this));

}//end readForever

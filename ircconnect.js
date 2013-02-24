var socketId;
var dataFromRead = "";
var serverConnect = "10.0.1.28";
var ircPort = 6667;
var serverName;
var channelName ="#realtestchannel";

var userName;
chrome.storage.local.get('userName', function(results)
{
  userName = results.userName || 'OptimistBot';

  chrome.socket.create('tcp', {}, function onSocketCreate(createInfo)
  {
    socketId = createInfo.socketId;
    chrome.socket.connect(socketId, serverConnect, ircPort, onConnected);
  }); // end socket.create
}); // end get userName from storage


function onConnected()
{
  document.getElementById('connectionStatus').textContent = "connected!";
  readForever();
  console.log(socketId);
  read();
  write('PASS none');
  write('NICK ' + userName);
  write('USER USER 0 * :Real Name', function()
  {
    //wait for a sign that we're registered before joining.
    //Welcome to the Internet Relay Network -RPL_WELCOME via IRC RFCs
    //socket.listen is not  an option for client side connections. let's try reading until we get what we want
    var welcomeMsg="";
    var dateRead = new Date();
    console.log(dateRead+": Wrote after USER\r\n");

    //write('JOIN #realtestchannel\r\n');
  })//end write
} // end onConnected

function onDisconnected()
{
  document.getElementById('connectionStatus').textContent = "disconnected :(";
  chrome.socket.disconnect(socketId);
} // end onDisconnected

function write(s, f) {
  s+="\r\n";
  console.log(s);
  chrome.socket.write(socketId, str2ab(s), function(good) {console.log('write was ', good); if (f) f();});
}

function str2ab(str)
{
  var buf = new ArrayBuffer(str.length*1); // 1 byte for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++)
  {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf)
{
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function read()
{
  chrome.socket.read(socketId, null, function(readInfo) {
    if (readInfo.resultCode > 0) {
      var dateRead = new Date();
      console.log(dateRead + ab2str(readInfo.data));
      dataFromRead+=dateRead.getTime()+ab2str(readInfo.data)+"/r/n";
    }
  });

}//end read

function readForever(readInfo)
{
  if(readInfo!==undefined && readInfo.resultCode <= 0)
  {
    // we've been disconnected, dang.
    onDisconnected();
    return;
  }
  if (readInfo !== undefined)
  {
    var dateRead = new Date();
    var serverMsg = ab2str(readInfo.data);
    console.log(dateRead + ab2str(readInfo.data));
    dataFromRead+=dateRead.getTime()+ab2str(readInfo.data)+"/r/n";
    //if trigger matches data, do stuff here.

    //get server name
    if(!serverName)
    {
      serverName = serverMsg.substring(1,serverMsg.search(' '));
    }
    //if we get the welcome msg, join channel
    if (serverMsg.search("001 " + userName + " :")!=-1)
    {
      console.log(serverMsg.search("001 " + userName + " :"));
      write('JOIN '+channelName);
    }
    //if PING, PONG
    if(serverMsg.search("PING :")===0) //todo, only do this if its from server. not said in privmsg or channel.
    {
      if(serverName)
      {
        write('PONG :'+serverName);
      }
    }

    //if MSG, respond

    //if channel message =5 and last date spoken is >5 minutes ago, say something
    //if msg !stfu x, be silent for x minutes.
  }

  chrome.socket.read(socketId, null, readForever); //On Peter's advice changing this to just call itself
}//end readForever



function setUserName(newUserName, optionalCallback)
{
  chrome.storage.local.set({userName: newUserName}, optionalCallback);
} // end setUserName



var socketId;
var dataFromRead = "";
var serverConnect = "10.0.1.28";
var ircPort = 6667;
var serverName;
var channelName ="#realtestchannel";
var timeOfLastChanMsg = new Date();
timeOfLastChanMsg.setTime(1); //initialize the time to 1. 
var silentTimeMin=.5;


//OptimistBot Sayings
var goodVibes = ["Great job team!","Wow! I can't believe how much headway we're making!",
"That's a great point! Let's explore this perspective with bit more dicussion. ",
"Keep up the great work team! This discussion is fascinating!",
"This is very encouraging. We are reaching our goals by talking things out.",
"All of these are great ideas! Let's keep going and get everyone's contribution.",
"Congratulations team! Great work so far!",
"Thanks for mentioning that. That's a perspective I've never thought about before.",
"All right! Fantastic point!",
"Just wanted to throw in my two cents- you're all doing a dynamite job here!",
"That's one thing I love about this channel- the truly diverse ideas being discussed. Great job!",
"I like that. Let's brainstorm some more on this idea.",
];

chrome.socket.create('tcp', {}, function onSocketCreate(createInfo) {
  socketId = createInfo.socketId;
  chrome.socket.connect(socketId, serverConnect, ircPort, onConnected);
});
//console.log("onConnected is done. ReadForever is next");

function onConnected()
{
  readForever();
  console.log(socketId);
  read();
  write('PASS none');
  write('NICK OptimistBot');
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
}

function write(s, f) 
{
  s+="\r\n";
  console.log(s);

  //Make sure we're not spamming the channel. If this is going to the channel, check to see how often we're sending. 

  if (s.search("PRIVMSG "+channelName)>-1)
   {
    //should we write this?
    var dateObj = new Date();
    if (dateObj.getTime()-timeOfLastChanMsg.getTime()>silentTimeMin*60000)
    {
      chrome.socket.write(socketId, str2ab(s), function(good) {console.log('write was ', good); if (f) f();});
      timeOfLastChanMsg.setTime(dateObj.getTime());
    }
    else
    {
      console.log("You don't get to write because you messaged the channel already. dateObj.getTime: ")
      console.log(dateObj.getTime());
      console.log("Time of timeOfLastChanMsg")
      console.log(timeOfLastChanMsg.getTime());
      console.log(dateObj.getTime()-timeOfLastChanMsg.getTime())
      console.log(dateObj.getTime()-timeOfLastChanMsg.getTime()<silentTimeMin*60000)
    }
  }
  else
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
  if(readInfo!==undefined && readInfo.resultCode>0)
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
    if (serverMsg.search("001 OptimistBot :")!=-1)
    {
      console.log(serverMsg.search("001 OptimistBot :"));
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
  chrome.socket.read(socketId, null, readForever); 
}//end readForever
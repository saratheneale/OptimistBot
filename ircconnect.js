function main(){

  bot = new IRCClient();
  bot.setUserName("OptimistBot");
  bot.goodVibes = ["Great job team!", "$channelName is like a synergy machine with all these great contributions!",
"Wow! I can't believe how much headway we're making!",
"That's a great point, $user! Let's explore this perspective with bit more discussion. ",
"Keep up the great work team! This discussion is fascinating!",
"This is very encouraging, $user. We are reaching our goals by talking things out.",
"All of these are great ideas! Let's grab everyone's contributions.",
"Congratulations team! Great work so far!",
"Thanks for mentioning that, $user. That's a perspective I've never thought about before.",
"All right! Fantastic point, $user!",
"Just wanted to throw in my two cents- you're all doing a dynamite job here!",
"That's one thing I love about this channel- the truly diverse ideas being discussed. Great job everyone!",
"$user, I like that. Let's all brainstorm some more on this idea.",
"Don't stop there, $user! Why not keep developing this idea?"
];


bot.connectToServer(6667,"wright.freenode.net");

// takes a message arguement. Message is populated with 
//  username sent to, msgSender,
//arg is populated with the message contents.
bot.onMessage=function(message,arg){

if(message.username===this.channelName)
{
  //Bot will respond once in a while to a channel message, 1/25 times
  //Bot will respond if someone says his name
  var ranNum = Math.random();
  if(ranNum<.04 || arg.search(bot.userName)!==-1){
    var strRandomGoodVibe = this.getRandomGoodVibe(message.msgSender); 
    this.write("PRIVMSG " + this.channelName + " :"+strRandomGoodVibe);
  } 
} else{
  var messagingUser = message.prefix.slice(1, message.prefix.search("!"));
  this.write("PRIVMSG " + messagingUser + " :I LIKE RAINBOWS!?"); 
}
}//end onMessage function

//onReady is called when there is a connection to the 
//IRC server and the nickname is populated. Most users probably 
//want to join a channel at this point.
bot.onReady = function(){
if(bot.connected)
{
  bot.join('#realtestchannel');
}
}//end onReady function
//pingResp is called when the IRC server sends you a PING message.
//Most users will want to pong at this point.
bot.pingResp = function(){
  if(bot.connected)
    this.pong();
}//end pingResponse
}//end main function


var timeOfLastChanMsg = new Date();
timeOfLastChanMsg.setTime(1); //initialize the time to 1. 
var silentTimeMin=.1;




  /*var inputElement = document.getElementById('typing');
  inputElement.addEventListener('keydown', function (event)
  {
    // if the user pushed the enter key while typing a message (13 is enter):
    if (event.keyCode === 13)
    {
      var message = inputElement.value;
      inputElement.value = "";
      write("PRIVMSG " + channelName + " :" + message);
    }
  })*/

if(window.chrome.socket)
{
  debugger;
  main();

}

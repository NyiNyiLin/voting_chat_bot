var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);
      }else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {

  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    /*switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
        engToEngTranslate(senderID, messageText);
        //engToMyanTranslate(senderID, messageText);
    }*/

    //send back the text message
    sendTextMessage(senderID, messageText);
    sendGenericMessage(senderID, messageText);

  } else if (messageAttachments) {
    sendTextMessage(senderID, "attachment message receive");
  }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  if(payload == "1"){
    sendTextMessage(senderID, "You voted for Kaung Khant Thu");
  }else if(payload == "2"){
    sendTextMessage(senderID, "You voted for Myat Min Htun");
  }else{
    sendTextMessage(senderID, "Something wrong, Please vote again");
  }

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  //sendTextMessage(senderID, "Postback called");
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Kaung Khant Thu",
            subtitle: "1st Batch King",
            item_url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/21768474_496643367362147_925709046333701615_n.jpg?oh=0b3a2dbe3b260b8be5d654ff63c9215b&oe=5AD284D2",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/kaungkhant.thu.94064?ref=br_rs",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "1",
            }],
          }, {
            title: "Myat Min Htun",
            subtitle: "2nd Batch King",
            item_url: "https://www.facebook.com/myatmin.htun.97",
            image_url: "https://scontent.fbkk8-1.fna.fbcdn.net/v/t1.0-1/p160x160/16427559_678701558998991_5278417030596624174_n.jpg?oh=a9b0ce5eb2d38cd2dd1526c72d395422&oe=5AD6626F",
            buttons: [{
              type: "web_url",
              url: "https://www.facebook.com/myatmin.htun.97",
              title: "Facebook"
            }, {
              type: "postback",
              title: "Vote",
              payload: "2",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

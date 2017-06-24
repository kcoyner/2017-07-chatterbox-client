// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages'
};

$(document).ready(function() {
  $('#clear').on('click', function(event) {
    app.clearMessages();
  });
  app.handleSubmit();
});

// init method
app.init = function() {
  app.fetch();
};

// send method
app.send = function(message) {

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      window.location.reload(true);
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

// fetch method
app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: where = {
      "order": "-createdAt",
      "limit": "25"
    },
    contentType: 'application/json',
    success: function(data) {
      console.log(data);
      app.renderDropDown(data);
      app.renderMessage(data);
    },
    error: function() {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });
};

// sanitize method
app.sanitize = function(str) {

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return String(str).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
    return entityMap[s];
  });
};

// clearMessages method
app.clearMessages = function() {
  $('#chats').children().remove();
};

// renderMessage method
app.renderMessage = function(message) {
  if (Array.isArray(message.results)) {
    for (var i = 0; i < message.results.length; i++) {
      $('#chats').append('<div class="chat">' +
          '<div class="username">' + app.sanitize(message.results[i].username) + '</div>' +
          '<div id="message">' + app.sanitize(message.results[i].text) + '</div>' +
      '</div>');
    }
  } else {
    $('#chats').append('<div class="chat">' +
        '<div class="username">' + app.sanitize(message.username) + '</div>' +
        '<div id="message">' + app.sanitize(message.text) + '</div>' +
    '</div>');
    app.send(message);
  }


};

app.handleSubmit = function() {
  $('#send').on("submit", function(e) {
    e.preventDefault(); // cancel the actual submit
    var username = app.sanitize(window.location.search.replace("?username=", ''));
    var text = app.sanitize($('#message').val());
    var rooms;
    // check to see if id=room is empty
    if ($('#room').val()) {
      rooms = app.sanitize($('#room').val());
    }
    else {
      rooms = $( "select#roomSelect option:checked" ).val();
    }

    //var rooms = app.sanitize($('#rooms').val());
    console.log(text);
    console.log(rooms);

    var message = {
      username: username,
      text: text,
      roomname: rooms
    };
    console.log(message);
    app.renderMessage(message);
    // app.init();
  });
};

app.renderRoom = function(roomName) {

  $('#roomSelect').append('<option>' + roomName + '</option>');

  console.log();
};

app.renderDropDown = function(data) {
  var roomArray = {};
  for (var i = 0; i < data.results.length; i++) {
    if (!roomArray[data.results[i].roomname]) {
      roomArray[data.results[i].roomname] = data.results[i].roomname;
      //$('#roomSelect').append('<option>' + roomArray[data.results[i].roomname] + '</option>');
      app.renderRoom(data.results[i].roomname);
    }
  }
  console.log(roomArray);
};
app.init();


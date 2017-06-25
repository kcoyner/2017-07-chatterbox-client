// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  friends: []
};

$(document).ready(function() {
  $('#clear').on('click', function(event) {
    app.clearMessages();
  });
  app.handleSubmit();
  app.handleUsernameClick();
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
      'order': '-createdAt',
      'limit': '15'
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
  var cssClass = '';
  if (Array.isArray(message.results)) {
    for (var i = 0; i < message.results.length; i++) {
      // bold all messages from friends
      if (app.friends[message.results[i].username]) {
        cssClass = 'class=bold';
      }
      $('#chats').append('<div class="chat">' +
        '<div class="username"><span class="userClicked">' + app.sanitize(message.results[i].username) + '</span></div>' +
        '<div id="message" ' + cssClass + '>' + app.sanitize(message.results[i].text) + '</div>' +
        '<div id="timestamp">' + moment(message.results[i].createdAt).format('MMM Do HH:MM a') + '</div>' +
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
  $('#send').on('submit', function(e) {
    e.preventDefault(); // cancel the actual submit
    var username = app.sanitize(window.location.search.replace('?username=', ''));
    var text = app.sanitize($('#message').val());
    var rooms;
    if ($('#room').val()) {
      rooms = app.sanitize($('#room').val());
    } else {
      rooms = $('select#roomSelect option:checked').val();
    }

    var message = {
      username: username,
      text: text,
      roomname: rooms
    };
    app.renderMessage(message);
  });
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append('<option>' + roomName + '</option>');
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
};

app.handleUsernameClick = function() {
  $(document.body).on('click', 'span.userClicked', function() {
    $('#friendList').append('<div id="friend">' + $(this).text() + '</div>');
    $(this).parent().siblings().css('font-weight', 'bold');
    app.friends.push($(this).text());
  });
};

console.log(app.friends);
app.init();

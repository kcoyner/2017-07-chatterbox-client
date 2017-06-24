// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages'
};

$(document).ready(function() {
  $('#clear').on('click', function(event) {
    app.clearMessages();
  });

  $('#submitForm').on("submit",function(e) {
    e.preventDefault(); // cancel the actual submit
    var username = app.sanitize(window.location.search.replace("?username=", ''));
    var text = app.sanitize($('#text').val());
    var rooms = app.sanitize($('#rooms').val());

    var message = {
      username: username,
      text: text,
      roomname: rooms
    };
    console.log(message)
    app.renderMessage(message);
    // app.init();
  });

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
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
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
    data: where={"order":"-createdAt","limit":"151"},
    contentType: 'application/json',
    success: function (data) {
    console.log(data);
      for (var i = 0; i < data.results.length; i++) {
        $('#chats').append('<div class="chat">' +
                            '<div class="username">' + app.sanitize(data.results[i].username) + '</div>' +
                            '<div class="text">' + app.sanitize(data.results[i].text) + '</div>' +
                            '<div class="text">' + app.sanitize(data.results[i].createdAt) + '</div>' +
                          '</div>');
      }
    },
    error: function () {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message');
    }
  });
};

// sanitize method
app.sanitize = function (str) {

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

  return String(str).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
    return entityMap[s];
  });
}

// clearMessages method
app.clearMessages = function() {
  $('#chats').children().remove();
};

// renderMessage method
app.renderMessage = function(message) {
  //$('#chats').append(response);
  app.send(message);
};

app.handleSubmit = function() {

}
app.init();








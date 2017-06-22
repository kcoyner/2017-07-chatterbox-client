// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages'
};

$(document).ready(function(){
  $("#clear").on('click', function(event){
    app.clearMessages();
  });
});

// init method
app.init = function() {
  app.fetch();
};


// send method
app.send = function(message) {

  // var message = {
  //   username: 'Mel Brooks',
  //   text: 'It\'s good to be the king',
  //   roomname: 'lobby'
  // };


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
}

// fetch method
app.fetch = function() {
  $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
      // console.log('chatterbox: Message received', data);
      for (var i = 0 ; i < data.results.length; i++) {
        $('#chats').append('<div class="chat">' +
                              '<div class="username">' + data.results[i].username + '</div>' +
                              '<div class="text">' + data.results[i].text + '</div>' +
                            '</div>');
      }
  },
  error: function () {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to get message');
  }
});

}

app.clearMessages = function() {
  $('#chats').children().remove();
}

app.renderMessage = function(message) {
  //$('#chats').append(response);
  app.send(message);
}

app.init();








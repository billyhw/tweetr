/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.

$( document ).ready( function () {

  loadTweets();

  $( "form" ).on( "submit", function( event ) {
    event.preventDefault();
    var text = $("textarea").val();

    if (text === null || text === "") {
      $("span#check").text("Please enter a message.")
      return
    } else if (text.length > 140) {
      $("span#check").text("The tweet must be less than 140 characters long.")
      return
    }
    if ( $("span#check").val() === "" ) {
      $("span#check").empty();
    }

    $.ajax({
      url: '/tweets',
      data: $( this ).serialize(),
      method: 'POST',
      dataType: 'text',
      }).done(function (data) {
          $("textarea").val("");
          loadTweets()
        })
    });

  function loadTweets() {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
      dataType: 'json',
      success: function (tweets) {
        renderTweets(tweets);
      }
    });
  };

  function createTweetElement(tweetData) {

    var $tweet = $("<section>").addClass("old-tweet");
    $tweet.append("<article>");

    $tweet.children("article").append("<header>")
    $tweet.find("header").html(`<img src="${tweetData.user.avatars.small}" width="50" height="50")>
                     <span class="user-name"> ${tweetData.user.name} </span>
                     <span class="user-handler"> ${tweetData.user.handle} </span> `);

    $tweet.children("article").append("<div>");
    $tweet.find("div").addClass("body");
    $tweet.find("div").text(tweetData.content.text);

    const daysAgo =  Math.floor( ( Date.now() - tweetData.created_at )/1000/60/60/24 )

    $tweet.children("article").append("<footer>");
    $tweet.find("footer").html(`${daysAgo} days ago`);
    $tweet.find("footer").append("<span class='little-buttons'>");
    $tweet.find("span.little-buttons").html('<img src="https://vanillicon.com/1.png" alt="like", width = "20" height="20"> <img src="https://vanillicon.com/1.png" alt="retweet" width = "20" height="20"> <img src="https://vanillicon.com/1.png" alt="flag" width = "20" height="20"> ');

    return $tweet

  };

  $("section.form").click((ev) => {
    event.preventDefault();
    $.ajax({
      url: '/tweets',
      data: $(this),
      method: 'POST',
      dataType: 'text'
    });

  })

  function renderTweets(tweets) {
    // loops through tweets
      // calls createTweetElement for each tweet
      // takes return value and appends it to the tweets container
      var $tweetsContainer = $('.tweets-container');
      var $html = $('<div></div>');
      for (var i = tweets.length-1; i >= 0; i--) {
        $html.append(createTweetElement(tweets[i]));
      }
      $tweetsContainer.html($html);
  };
  $('nav button').on("click", function (event) {
    event.preventDefault();
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').slideUp();
    }
    else {
      $('.new-tweet').slideDown();
      $('textarea').focus()
    }
  })
});
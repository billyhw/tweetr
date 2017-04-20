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
    console.log(text)

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
      // success: function (data) {
      //   console.log('Success post');
      //   $("textarea").val("");
      //   $(".old-tweet").empty()
      // }
      }).done(function (data) {
          console.log('done posting');
          $("textarea").val("");
          // $(".old-tweet").empty()
          loadTweets() //$('main-container').trigger('reload', loadTweets) // call this outside .ajax
        })
    });

  $("main-container").on('reload', function( event ) {
    console.log("main triggered")
    loadTweets();
  })

  function loadTweets() {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
      dataType: 'json',
      success: function (tweets) {
        console.log('Success load');
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
    $tweet.find("footer").html(`${daysAgo} days ago <span class="little-buttons"></span>`);
    $tweet.find("footer").append("<span>");
    $tweet.children("footer").find("span").addClass("little-buttons")
    $tweet.find("span.little-buttons").html('<img src="https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png" width = "20" height="20"> <img src="https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png" width = "20" height="20"> <img src="https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png" width = "20" height="20">');

    return $tweet

  };

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
      // tweets.forEach((tweet) => {
      //   mainContainer.append(createTweetElement(tweet));
      // });
  };

  $('nav button').on("click", function (event) {
    if ($('.new-tweet').is(':visible')) { //attr('style') === 'display: none;') {
      $('.new-tweet').slideUp();
    }
    else {
      $('.new-tweet').slideDown();
      $('textarea').focus()
    }
  })

});
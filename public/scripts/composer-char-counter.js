$( document ).ready(() => {
  $(".tweet-text").on( "keyup", function() {
    var count = 140 - $(this).val().length;
    if (count < 0) {
      $(this).siblings('.counter').css('color', 'red');
    }
    else {
      $(this).siblings('.counter').css('color', 'black');
    }
    $(this).siblings('.counter').text(count);
  });
});


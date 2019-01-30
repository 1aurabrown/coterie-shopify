import $ from 'jquery';

// Email Submit


module.exports = function onSignupSubmit($containerEl, selector, options = {}) {
  var $container;
  if ($containerEl.hasClass('email-capture')){
    $container = $containerEl;
  } else {
    $container = $('.email-capture', $containerEl);
  }
  if (!($container.length > 0)) { return; }
  $container.on('submit', selector, function(e){
    e.preventDefault();
    var $el = $(e.target);
    var $container = $(e.delegateTarget);
    $container.attr('data-state', '');
    var data = $el.serialize();
    var $email = $("input[type='email']", $el);
    var $submit = $("input[type='submit'], button[type='submit']", $el);

    if (!$email[0].checkValidity()) {
      $('.error-feedback', $container).text('Please check your email address');
      $container.attr('data-state', 'error');
      return;
    }

    $email.prop('disabled', true);
    $submit.prop('disabled', true);
    return $.ajax({
      type: "GET",
      url: $el.attr("action").replace('/post', '/post-json'),
      data: data,
      cache: false,
      dataType: "jsonp",
      jsonp: "c",
      contentType: "application/json; charset=utf-8",
      error: function(error) {
        $email.prop('disabled', false);
        $submit.prop('disabled', false);

        $('.error-feedback', $container).text('An internal error has occured');

        $container.attr('data-state', 'error');
      },
      success: function(data) {

        if ((data.result === "success") ||
          (data.msg && data.msg.indexOf("already subscribed") >= 0) ||
          (data.msg && data.msg.indexOf("too many recent signup requests") >= 0)
        ) {
          setTimeout(function() {
            $container.attr('data-state', 'success');
          }, 1000);
          if (options.success) {
            if (options.reenableOnSuccess) {
              $email.prop('disabled', false);
              $submit.prop('disabled', false);
            }
            options.success();
          }
        } else {
          $container.attr('data-state', 'error');
          $email.prop('disabled', false);
          $submit.prop('disabled', false);
          if (options.error) {
            options.error();
          }
        }
      },
      error: options.error
    });
  });
}

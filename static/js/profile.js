$( document ).ready(function() {
    user_name = $('.user-name').text().slice(1,2);
    $('.user-letter').text(user_name.toUpperCase());

    $(".date").each(function(index, el) {
        var v = $(this).text();
        $(this).text(v.slice(0, 16))
    });

    $(".rate").each(function(index, el) {
        var v = $(this).text();
        $(this).text(v.slice(0, 7))
    });
});
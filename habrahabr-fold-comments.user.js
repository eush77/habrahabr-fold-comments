// ==UserScript==
// @name       Habrahabr: Fold Comments
// @version    0.1
// @include    http://habrahabr.ru/*/blog/*
// @include    http://habrahabr.ru/post/*
// ==/UserScript==

var comments = $('#comments');

// Styling.

var css = function(selector, properties) {
    return [selector].concat('{', properties, '}').join('');
};

!function injectStylesheet() {
    $('<style>').html(css('.fold', [
        'display: block;',
        'float: left;',
        'margin-top: 3px;',
        'margin-left: 6px;',
        'font-size: 14px;',
        'cursor: pointer;'
    ]) + css('.fold::after', [
        'content: "\\229e";'
    ]) + css('.fold.close::after', [
        'content: "\\229f";'
    ])).appendTo('head');
}();

// Basic folding.

var toggleFold = function(commentItem, state) {
    $(commentItem).children('.comment_body')
        .find('.info .fold').toggleClass('close', state) // Toggle icon.
        .end().children('.message').toggle(state) // Toggle message.
        .end().end().children('.reply_comments').toggle(state); // Toggle comment subtree.
};

!function addFoldingButtons() {
    var foldButton = (function() {
        var a = $('<a class="fold">');
        a.click(function() {
            toggleFold($(this).closest('.comment_item')[0]);
        });
        return a;
    }());
    $('.comment_body .info .clear', comments).each(function() {
        $(this).before(foldButton.clone(true));
    });
}();

// Autofold based on comment rating.

var score = function(commentBody) {
    return +$('.score', commentBody).text().replace('\u2013', '-');
};

var siftComments = function(threshold) {
    $('.comment_body', comments).each(function() {
        if (threshold <= score(this)) {
            console.log('Above threshold!');
            $(this).parentsUntil(comments, '.comment_item').each(function() {
                return toggleFold(this, true);
            });
        }
        else {
            toggleFold($(this).parent()[0], false);
        }
    });
};

siftComments(1);

(function () {
    $.fn.BallyMaxMin = function (currentIDValue) {
        var currendtID = $('#' + currentIDValue),
		w = currendtID.width();
        h = currendtID.height();
        pos = currendtID.position(),
        scrollPostion = $('body').scrollTop(),
        getElement = currendtID.children().detach();
        $("html, body").animate({ scrollTop: 0 }, 500);
        getElement.appendTo('section').addClass('positionElement').css({ left: pos.left + 'px', top: pos.top + 'px', width: w + 'px', height: h + 'px' }).animate({
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            'background':'yellow'
        }, 1000, function () {
            $(this).find('.max').hide();
            $(this).append('<span class="min" title="Close"></span>').off().on("click",".min", function () {
                getElement.appendTo(currendtID).animate({
                    width: w + 'px',
                    height: h + 'px',
                    top: pos.top + 5 + 'px',
                    left: pos.left + 5 + 'px'
                }, 1000, function () {
                    $(this).removeClass('positionElement').find('.min').remove();
                    $(this).find('.max').show();
                    $(this).removeAttr('style');
                });
                $('body').removeClass('overflow').animate({ scrollTop: scrollPostion }, 500);
                currendtID = '';
            });
        });
        $('body').addClass('overflow');
    }

})(jQuery);
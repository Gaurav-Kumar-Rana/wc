(function ($) {
    var CarouselMethods = {
        init: function (options) {
            var _bindEle = '<div class="carousel carousel-slider center" data-indicators="true" style="height:100%;">';
            var defaults = {
                data: []
            };
            options = $.extend(defaults, options);

            return this.each(function () {

                function injectControl() {
                    $('.carousel.carousel-slider').carousel({ full_width: true });
                }
                function injectAutoPlay() {
                    $('.carousel').carousel('next');
                }



                $.each(options.data, function (key, value) {
                    _bindEle += '<div class="carousel-item" href="#' + key + '!">' +
                                        '<h2 class="lebel" title="' + value.listHead + '">' + value.listHead + '</h2>';
                    $.each(value.listBody, function (key1, value1) {
                        _bindEle += '<p class="description">' +
                                            '<span class="count" title="' + value1.listCount + '">' + value1.listCount + '</span>' +
                                            '<span class="text" title="' + value1.listBodyTxt + '">' + value1.listBodyTxt + '</span>' +
                                        '</p>';
                    });
                    _bindEle += '</div>';
                });
                _bindEle += '</div>';

                $(this).append(_bindEle);
                injectControl();
                _auto = setInterval(function () { injectAutoPlay(); }, 10000);

                $(this).find('.carousel.carousel-slider').mouseenter(function () {
                    clearInterval(_auto);
                });

                $(this).find('.carousel.carousel-slider').mouseleave(function () {
                    _auto = setInterval(function () { injectAutoPlay() }, 10000);
                });

            });

        },
        reBindData: function (JasonData) {
            $(this).empty();
            var _bindEle = '<div class="carousel carousel-slider center" data-indicators="true" style="height:100%;">';
            $.each(JasonData, function (key, value) {
                _bindEle += '<div class="carousel-item" href="#' + key + '!">' +
                                    '<h2 class="lebel">' + value.listHead + '</h2>';
                $.each(value.listBody, function (key1, value1) {
                    _bindEle += '<p class="description">' +
                                        '<span class="count">' + value1.listCount + '</span>' +
                                        '<span class="text">' + value1.listBodyTxt + '</span>' +
                                    '</p>';
                });
                _bindEle += '</div>';
            });
            _bindEle += '</div>';
            $(this).append(_bindEle);
            $(this).find('.carousel.carousel-slider').carousel({ full_width: true });
        }
    }

    $.fn.CustumCarousel = function (methodOrOptions) {
        if (CarouselMethods[methodOrOptions]) {
            return CarouselMethods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return CarouselMethods.init.apply(this, arguments);

        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.Carousel');
        }
    }
}(jQuery));
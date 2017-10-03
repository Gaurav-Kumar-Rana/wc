(function ($) {
    $.fn.advsearchslider = function (options) {

        var defaults = {
            sliderOpen: false,
            callback: function () { }
        };

        return this.each(function () {

            _options = $.extend({}, defaults, options);
            _searchhead = $(this);
            _searchbody = $("#" + _searchhead.attr('data-rel'));
            _addmorebtn = $("#" + _searchhead.parent().find('.filterBtn').attr('id'));
            _addmorebody = $("#" + _addmorebtn.attr('data-addmore'));

            _openSearchPanel = function () {
                _searchhead.addClass('opened');
                _searchhead.find(".up-arrow").addClass('down-arrow');
                _addmorebtn.removeClass('hide');
                _searchbody.removeClass('closed');
                _options.callback();
            };

            _closeSearchPanel = function () {
                _searchhead.find(".up-arrow").removeClass('down-arrow');
                _addmorebtn.addClass('hide');
                _searchhead.removeClass('opened');
                // _searchbody.addClass('closed');
                _searchbody.addClass('closed');
                _closeAddMoreField();
            };

            _openAddMoreField = function () {
                _addmorebtn.addClass('opened');
                _addmorebody.removeClass('hide');

            };

            _closeAddMoreField = function () {
                _addmorebtn.removeClass('opened');
                _addmorebody.addClass('hide');

            };

            _loadControl = function () {
                _searchhead.unbind('click.' + _searchhead.attr('id'));

                _searchhead.bind('click.' + _searchhead.attr('id'), function (e) {

                    // If origin is clicked and menu is open, close menu
                    if (_searchhead.hasClass('opened')) {
                        _closeSearchPanel();
                        $(document).unbind('click.' + _searchbody.attr('id') + ' touchstart.' + _searchbody.attr('id'));
                    }
                    else {
                        _openSearchPanel();

                        _addmorebtn.unbind('click.' + _addmorebtn.attr('id'));

                        _addmorebtn.bind('click.' + _addmorebtn.attr('id'), function () {

                            if (!_addmorebtn.hasClass('opened')) {

                                _openAddMoreField();

                            } else {

                                _closeAddMoreField();

                            }
                        });
                    }
                    // If menu open, add click close handler to document
                    if (!_searchbody.hasClass('closed')) {
                        $(document).bind('click.' + _searchbody.attr('id') + ' touchstart.' + _searchbody.attr('id'), function (e) {
                            if (
                                !_searchbody.is(e.target) &&
                                !(_searchbody.find(e.target).length) &&
                                !_searchhead.is(e.target) &&
                                !(_searchhead.find(e.target).length) &&
                                !_addmorebtn.is(e.target) &&
                                !(_addmorebtn.is(e.target).length) &&
                                !_addmorebody.is(e.target) &&
                                !(_addmorebody.find(e.target).length)
                                ) {
                                _closeSearchPanel();
                                $(document).unbind('click.' + _searchbody.attr('id') + ' touchstart.' + _searchbody.attr('id'));
                            }
                        });
                    }
                });
            }


            if (_options.sliderOpen) {
                _loadControl();
                _searchhead.click();
                _addmorebtn.click();
            }
            else {
                _loadControl();
                //_addmorebtn.click();
            }
        });
    };
}(jQuery));
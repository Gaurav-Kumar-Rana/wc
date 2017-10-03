(function ($) {
    $.fn.EditableList = function (option) {
        return this.each(function () {
            var DataArray = {
                isEdtitable: true,
                sortable: false,
                editableListKeydown: null
            };

            var _defaults = $.extend(DataArray, option);

            //_defaults.DataString = _defaults.DataString.reverse();

            var _parentEl = $(this).addClass('BallyEditList');

            var orederElement = _defaults.sortable ? 'ol' : 'ul';

            var _preVal = [];

            _parentEl.empty();

            $('<' + orederElement + ' />', {}).addClass('scroll').appendTo(_parentEl);

            $('<input />', {
                'id': _defaults.HiddenId,
                'type': 'hidden'
            }).appendTo(_parentEl);

            if (_defaults.DataString.length > 0) {
                var _preVal = [];
                if (_defaults.sortable) { _preVal = _defaults.DataString.reverse(); } else { _preVal = _defaults.DataString; }
                $.each(_preVal, function (i, v) {

                    $('<li />', {}).append('<input type="text" value="' + v + '" />').append('<button class="removeList"><span class="icon-cross" title="Delete">X</span></button>').prependTo(_parentEl.find(orederElement));

                });
                _parentEl.find(orederElement).find('input').attr('readonly', _defaults.isEdtitable ? false : true);

            }

            if (_defaults.DataString.length > 0) {
                var _preVal = [];
                var _preVal1 = [];
                if (_defaults.sortable) { _preVal = _defaults.DataString.reverse(); } else { _preVal = _defaults.DataString; }
                for (var x = _defaults.DataString.length - 1; x > -1 ; x--) {

                    //_preVal.push(_defaults.DataString[x]);

                    _preVal1.push(_preVal[(_preVal.length - 1) - x]);

                }

                $(_parentEl).find('#' + _defaults.HiddenId).val(_preVal1.join('~'));

                _preVal = [];
            }


            if (_defaults.isEdtitable) {
                $('<div />', {
                    'id': 'addListHolder'
                }).addClass('addField').prependTo(_parentEl);

                $('<input />', {
                    'type': 'text',
                    'id': 'AddList'
                }).attr('placeholder', 'Add New Value').appendTo(_parentEl.find('.addField'));

                $('<button />', {
                    'id': 'AddListBtn'
                }).append('<span class="icon-plus">+</span>').addClass('listAdd').on('click', function () {

                    var _v = $(this).closest('.addField').find('input').val();

                    if (_v != "") {
                        if (
                            $(_parentEl).find('#' + _defaults.HiddenId).val().split('~')[0] != "" &&
                            $(_parentEl).find('#' + _defaults.HiddenId).val().toLowerCase().split('~').indexOf(_v.toLowerCase()) > -1) {
                            _defaults.loadError();
                            return false;
                        }

                        $(_parentEl).find('#editablelist-error').remove();

                        $('<li />', {}).append('<input type="text" value="' + _v + '" />').append('<button class="removeList"><span class="icon-cross" title="Delete">X</span></button>').css('display', 'none').prependTo(_parentEl.find(orederElement));

                        var _stroedString = $(_parentEl).find('#' + _defaults.HiddenId).val().split('~');

                        if (_stroedString[0] == "") {
                            _stroedString = []
                        }

                        _stroedString.push(_v);

                        $(this).closest('.addField').find('input').val("");

                        $(_parentEl).find('#' + _defaults.HiddenId).val(_stroedString.join('~'));

                        setTimeout(function () {
                            $(_parentEl).find('li:first').fadeIn().find('.removeList').on('click', function (e) {

                                var _inputIndex = $(this).parent().index();

                                var _stroedString = $(_parentEl).find('#' + _defaults.HiddenId).val().split('~');

                                _stroedString.splice((($(this).closest(orederElement).find('li').length - 1) - _inputIndex), 1);

                                $(_parentEl).find('#' + _defaults.HiddenId).val(_stroedString.join('~'));

                                $(this).parent().remove();
                            });
                        }, 150);
                    }

                }).appendTo(_parentEl.find('.addField'));




                $(_parentEl).find('button.removeList').on('click', function (e) {

                    var _inputIndex = $(this).parent().index();

                    var _stroedString = $(_parentEl).find('#' + _defaults.HiddenId).val().split('~');

                    _stroedString.splice((($(this).closest(orederElement).find('li').length - 1) - _inputIndex), 1);

                    $(_parentEl).find('#' + _defaults.HiddenId).val(_stroedString.join('~'));

                    $(this).parent().remove();

                });

                $(_parentEl).find('.addField input').keydown(function (e) {

                    if (_defaults.editableListKeydown !== null) {
                        _defaults.editableListKeydown(e);
                    }
                    if (e.which == 13 && this.value.length != 0) {

                        if (
                            $(_parentEl).find('#' + _defaults.HiddenId).val().split('~')[0] != "" &&
                            $(_parentEl).find('#' + _defaults.HiddenId).val().toLowerCase().split('~').indexOf(this.value.toLowerCase()) > -1) {
                            _defaults.loadError();
                            return false;
                        }

                        $(_parentEl).find('#editablelist-error').remove();

                        $('<li />', {}).append('<input type="text" value="' + this.value + '" />').append('<button class="removeList"><span class="icon-cross">X</span></button>').css('display', 'none').prependTo(_parentEl.find(orederElement));
                        var _stroedString = $(_parentEl).find('#' + _defaults.HiddenId).val().split('~');
                        if (_stroedString[0] == "") {
                            _stroedString = []
                        }
                        _stroedString.push(this.value);
                        this.value = "";
                        $(_parentEl).find('#' + _defaults.HiddenId).val(_stroedString.join('~'));
                        setTimeout(function () {

                            //Remove list on click of remove button
                            $(_parentEl).find('li:first').fadeIn().find('.removeList').on('click', function (e) {

                                var _inputIndex = $(this).parent().index();

                                var _stroedString = $(_parentEl).find('#' + _defaults.HiddenId).val().split('~');

                                _stroedString.splice((($(this).closest(orederElement).find('li').length - 1) - _inputIndex), 1);

                                $(_parentEl).find('#' + _defaults.HiddenId).val(_stroedString.join('~'));

                                $(this).parent().remove();

                            });


                            //Remove created list after deleting whole text
                            $(_parentEl).find('li input').blur(function (e) {
                                var _inputIndex = $(this).parent().index();
                                var _oldString = $(_parentEl).find('#' + _defaults.HiddenId).val().split('~');
                                var _stroedString = $(_parentEl).find('#' + _defaults.HiddenId).val().toLowerCase().split('~');

                                if (this.value.length == 0) {
                                    _stroedString.splice((($(this).closest(orederElement).find('li').length - 1) - _inputIndex), 1);
                                    $(_parentEl).find('#' + _defaults.HiddenId).val(_stroedString.join('~'));
                                    $(this).parent().remove();
                                }
                                else {
                                    _stroedString[($(_parentEl).find('li').length - 1) - _inputIndex] = "";

                                    if (_stroedString.indexOf(this.value.toLowerCase()) > -1) {
                                        $(this).focus();
                                        _defaults.loadError();
                                        return false;
                                    } else {
                                        $(_parentEl).find('#editablelist-error').remove();
                                        _oldString[($(_parentEl).find('li').length - 1) - _inputIndex] = $(this).val();
                                        $(_parentEl).find('#' + _defaults.HiddenId).val(_oldString.join('~'));
                                    }
                                }
                            });

                        }, 150);
                    } else if ($(_parentEl).find('#' + _defaults.HiddenId).val().split('~')[0] != "" && $(_parentEl).find('#' + _defaults.HiddenId).val().split('~').indexOf(this.value) > -1) {
                        $(_parentEl).find('#editablelist-error').remove();
                    }
                });

                //Added to remove the error message on blur of text-box.
                $(_parentEl).find('.addField input').blur(function (e) {
                    $(_parentEl).find('#editablelist-error').remove();
                });

                //Remove created list after deleting whole text
                $(_parentEl).find('li input').blur(function (e) {
                    var _inputIndex = $(this).parent().index();
                    var _oldString = $(_parentEl).find('#' + _defaults.HiddenId).val().split('~');
                    var _stroedString = $(_parentEl).find('#' + _defaults.HiddenId).val().toLowerCase().split('~');

                    if (this.value.length == 0) {
                        _stroedString.splice((($(this).closest(orederElement).find('li').length - 1) - _inputIndex), 1);
                        $(_parentEl).find('#' + _defaults.HiddenId).val(_stroedString.join('~'));
                        $(this).parent().remove();
                    }
                    else {
                        _stroedString[($(_parentEl).find('li').length - 1) - _inputIndex] = "";

                        if (_stroedString.indexOf(this.value.toLowerCase()) > -1) {
                            $(this).focus();
                            _defaults.loadError();
                            return false;
                        } else {
                            $(_parentEl).find('#editablelist-error').remove();
                            _oldString[($(_parentEl).find('li').length - 1) - _inputIndex] = $(this).val();
                            $(_parentEl).find('#' + _defaults.HiddenId).val(_oldString.join('~'));
                        }
                    }
                });
            }

            _defaults.loadError = function () {
                $(_parentEl).find('#editablelist-error').remove();

                $('<label />', { id: 'editablelist-error', text: 'Enumeration value already exist' }).css({
                    position: 'absolute',
                    color: 'red',
                    'text-align': 'left',
                    width: '100%',
                    'padding-top': '2px',
                    'top': '40px'
                }).appendTo($(_parentEl));
                //Made hidden to remove auto fade out effect.
                //setTimeout(function () {
                //    $(_parentEl).find('#editablelist-error').fadeOut(500, function () {
                //        $(this).remove();
                //    })
                //}, 2000);
            }


            /*sortable start*/
            if (_defaults.sortable) {
                $(_parentEl).find(orederElement).sortable({
                    axis: "y",
                    cursor: 'move',
                    placeholder: "ui-state-highlight",
                    start: function () {
                        $(this).data('preventBehaviour', true);
                        console.log('sortable start');
                    },
                    stop: function () {

                        var _preVal = [];
                        $.each($(this).closest(orederElement).find('li'), function (i, li) {
                            _preVal.push($(li).find('input').val());
                        });
                        //_preVal = _preVal.reverse()
                        $(_parentEl).find('#' + _defaults.HiddenId).val(_preVal.join('~'));
                        _preVal = [];
                    }
                });

                $(_parentEl).find(orederElement + ' :input').on('mousedown', function (e) {
                    var mdown = document.createEvent("MouseEvents");
                    mdown.initMouseEvent("mousedown", true, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
                    $(this).closest('li')[0].dispatchEvent(mdown);
                })



                $(_parentEl).find(orederElement + ' li').prepend('<span class="icon-OLSort"></span>');
            }
            /*sortable end*/

            if (option.noButton)
                $("button.removeList").css('display', 'none');

        });

    };
})(jQuery);
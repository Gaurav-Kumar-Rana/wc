;
(function ($) {

    $.fn.BallyCheckBoxList = function (options) {
        return this.each(function () {
            var _default = {
                getSelected: null,
                defaultSelection: []
            },
        defaults = $.extend(_default, options),
        _el = $(this);
            _el.empty();
            _el.addClass('checkboxdropdown');

            $('<div class="search-field"></div>').append('<div class="search"><input  type="search" placeholder="Search" name="search"/><span class="SearchClear"><span class="icon-plus"></span></span></div>').appendTo(_el).find('input[type = "Search"]').on('keyup', function () {
                var _Search = $(this).val().toLowerCase();
                _el.find('.ListHolder li').each(function () {
                    var _EleSeach = $(this).text().toLowerCase();

                    (_EleSeach.indexOf(_Search) !== -1) ? $(this).show() : $(this).hide();

                });

                //New Start--
                if ($(this).val().length != 0) {
                    $(this).next('.SearchClear').css("visibility", "visible");
                } else {
                    $(this).next('.SearchClear').css("visibility", "hidden");
                }

                $(".SearchClear").on('click', function () {
                    $(this).css("visibility", "hidden");
                    $(this).prev('input[type=search]').val("");
                    _el.find('.ListHolder>li').each(function () {
                        $(this).show();
                    });
                });
            });

            $('<div class="selectAllBallytreeCheckbox"></div>')
                .append('<div class="left"><label>' +
                                '<input id="SelectAll" name="SelectAll" type="checkbox" />' +
                                '<span>Select All</span>' +
                                '</label></div>')
                .append('<div class="right">' +
                                '<span id="ExpandAll" class="listControlIcons icon-ExpandView ExpandAll" title="Expand All"></span>' +
                                '<span id="CollapseAll" class="listControlIcons icon-SlideIcon CollapseAll" title="Collapse All"></span>' +
                          '</div>')
                .appendTo(_el);

            _el.find('.ExpandAll').on('click', function () {
                expandAll(_el);
            })

            _el.find('.CollapseAll').on('click', function () {
                collapseAll(_el);
            });

            if (defaults.checkbox) {
                _el.find('.selectAllBallytreeCheckbox .left').show();
            }
            else {
                _el.find('.selectAllBallytreeCheckbox .left').hide();
            }

            _el.find('#SelectAll').on('change', function () {

                if ($(this).prop("checked") == true) {
                    SelectAll(_el);
                    SetValueMemberId(_el, defaults)
                }
                else {
                    DeSelectAll(_el);
                    SetValueMemberId(_el, defaults)
                }

                //_el.find('.ListHolder').find("input:checkbox").prop('checked', $(this).prop("checked"));
                //CheckSelectAll(_el);
            });


            //New End--     

            $("<ul />", {}).addClass('ListHolder').appendTo(_el);
            if (defaults.hiddenId) {
                $('<input />', {
                    type: 'hidden'
                }).attr('id', defaults.hiddenId).appendTo(_el);
                _el.append('<input type="hidden" id="' + defaults.hiddenId + '"')
            }
            if (defaults.list.length == 0) {
                _el.find('.ListHolder').append('<li><label><span>No Data Found</span></label></li>')
            }

            $.each(defaults.list, function (i, info) {

                $('<li><label><span title = "' + info.label + '">' + info.label + '</span></label></li>').data('valuememberid', defaults.valuememberid ? info[defaults.valuememberid] : i).addClass('list' + i).appendTo(_el.find('.ListHolder'));

                var _lilabel = $(_el).find('.list' + i + ' label');
                if (defaults.checkbox) {
                    var _checked = false, _ds = defaults.defaultSelection;
                    if (_ds.indexOf(info[defaults.valuememberid]) > -1) {
                        _checked = true;
                    }
                    _lilabel.prepend('<input type ="checkbox" name="CheckboxName"/>').find('input[type="checkbox"]').attr('checked', _checked).on('change', function () {
                        if ($(this).is(':checked') && $(this).closest('li').hasClass('expanded')) {
                            $(this).closest('li').addClass('selected');
                        } else {
                            $(this).closest('li').removeClass('selected');
                        }
                        SetValueMemberId(_el, defaults)
                        if (defaults.getSelected != null) {
                            defaults.getSelected($(this).closest('li').data('valuememberid'));
                        }
                        CheckSelectAll(_el);
                    });
                }

                if (info.informations) {

                    if (!defaults.checkbox) {
                        //$(_el).find('ul li:first').addClass('selected');
                    }


                    _lilabel.append('<i class="up-arrow"></i>').on('click', function (e) {

                        if (!defaults.checkbox) {
                            $(this).closest('ul').find('li').removeClass('selected')
                            $(this).closest('li').addClass('selected')
                            if (defaults.getSelected != null) {
                                defaults.getSelected($(this).closest('li').data('valuememberid'));
                            }
                            $('input#' + defaults.hiddenId + '[type="hidden"]').val($(this).closest('li').data('valuememberid'));

                        }

                    }).find('i').on('click', function (e) {
                        if (e.toElement.localName == 'i') {
                            e.preventDefault();
                            $(this).closest('li').find('i').toggleClass('down-arrow');
                            $(this).closest('li').toggleClass('expanded').find('.listInfo' + i).slideToggle();

                            if (!$(this).closest('li').hasClass('expanded')) {
                                //$(this).closest('li').removeClass('selected');
                            } else {
                                if ($(this).closest('li').find('input').is(':checked'))
                                    $(this).closest('li').addClass('selected');


                                var licount = $(this).closest('li').index();
                                var litoalheight;
                                litoalheight = 0;

                                for (i = 0; i < licount; i++) {
                                    var liheight = $('.ListHolder>li').eq(i).height();
                                    var litoalheight = litoalheight + liheight;

                                }

                                var scrolltopposition = litoalheight;
                                setTimeout(function () {
                                    $(".listControls").stop().animate({ scrollTop: scrolltopposition }, 500);
                                }, 150);



                            }
                            return false;
                        }

                    });
                }

                if (info.informations) {
                    $('<ul />', {}).addClass('listInfo' + i).appendTo(_el.find('li.list' + i));
                    $.each(info.informations, function (_ind, li) {
                        var _temp = (_ind == "desc" ? "" : "<label>" + _ind + "</label>") + "<label>" + li + "</label>";
                        $('<li />', {}).html(_temp).appendTo(_el.find('ul.listInfo' + i));
                    });
                }

                CheckSelectAll(_el);
            });
        });
    };

    this.expandAll = function (checkboxListId) {
        if (!$(checkboxListId).find('i.up-arrow').hasClass('down-arrow')) {
            $(checkboxListId).find('i.up-arrow').addClass('down-arrow');
            $(checkboxListId).find('ul.ListHolder > li').addClass('expanded').find('ul').slideDown();
        }
    }
    this.collapseAll = function (checkboxListId) {
        if ($(checkboxListId).find('i.up-arrow').hasClass('down-arrow')) {
            $(checkboxListId).find('i.up-arrow').removeClass('down-arrow');
            $(checkboxListId).find('ul.ListHolder > li').removeClass('expanded').find('ul').slideUp();
        }
    }

    this.CheckSelectAll = function (checkboxListId) {
        if ($(checkboxListId).find('.ListHolder').find("input:checkbox").length == $(checkboxListId).find('.ListHolder').find("input:checkbox:checked").length) {

            $(checkboxListId).find('#SelectAll').attr('checked', true);

        } else {

            $(checkboxListId).find('#SelectAll').attr('checked', false);

        }
    }

    this.SelectAll = function (checkboxListId) {
        $('.ListHolder').find("input:checkbox").prop("checked", true)
    }

    this.DeSelectAll = function (checkboxListId) {
        $('.ListHolder').find("input:checkbox").prop("checked", false)
    }

    this.SetValueMemberId = function (checkboxListId, defaults) {
        var _allChkbox = checkboxListId.find('input[type="checkbox"]');
        var _arr = [];
        $.each(_allChkbox, function (j, cbox) {
            if ($(cbox).is(':checked') && $(cbox).attr('id') != "SelectAll") {
                _arr.push($(cbox).closest('li').data('valuememberid'));
            }

        });
        $('input#' + defaults.hiddenId + '[type="hidden"]').val(_arr.join());
    }

})(jQuery);
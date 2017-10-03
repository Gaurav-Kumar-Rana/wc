/*!bally-shuttlelist-static-li
--Controls- Bally Web control library.
* Depends:
jQuery 1.9+
*/
(function ($) {

    // $(document).ready(function () {
    //
    // setTimeout(function () {
    // if (hiddenSelectedValues.length > 0)
    // _ballyShuttle_this.set_values(hiddenSelectedValues);
    // Refresh();
    // }, 500);
    //
    //
    // });

    $.fn.longClick = function (callback, timeout) {
        var timer;
        timeout = timeout || 500;
        $(this).mousedown(function () {
            timer = setTimeout(function () { callback(); }, timeout);
            return false;
        });
        $(document).mouseup(function () {
            clearTimeout(timer);
            return false;
        });

    };

    function IsDisabled(ItemValue, Ctrl) {
        var found = $.inArray(ItemValue.toString(), Ctrl._static_target_list) > -1;
        if (found)
            return true;
        else
            return false;
    }

    function Refresh(_ballyShuttle_this, options) {

        var targetlist = [];
        if (_ballyShuttle_this != undefined) {

            var ID = _ballyShuttle_this.attr('id');

            var AvList = ID + "-bally-shuttlelist-availablelist";
            var SelList = ID + "-bally-shuttlelist-selectedlist";

            var AvLi = ID + "-bally-shuttlelist-availablelist li";
            var SeLi = ID + "-bally-shuttlelist-selectedlist li";


            /* Clear the ul li elements */
            if ($('#' + AvList) != null)
                $('#' + AvList).remove();

            if ($('#' + SelList) != null)
                $('#' + SelList).remove();


            if (options.height == undefined || options.height == "") {
                options.height = 200;
            }

            _ballyShuttle_this.find('.selector-available div').append('<ul class="bally-shuttlelist-ul" id=' + AvList + ' name=' + AvList + ' style="height : ' + options.height + 'px "></ul>');
            if (options.HeaderTitle.length > 1) {
                _ballyShuttle_this.find("#selectedHeading").empty().addClass("shuttle-header");
                _ballyShuttle_this.find("#availableHeading").empty().addClass("shuttle-header");

                var BoxWidth = (($("#test-bally-shuttlelist-availablelist").width() - 17) / options.HeaderTitle.length);
                for (i = 0; i < options.HeaderTitle.length; i++) {
                    var replacing_ = options.HeaderTitle[i];
                    replacing_ = replacing_.replace("_", " ");
                    _ballyShuttle_this.find('#availableHeading').append('<span class="" style="display: inline-block;width: ' + BoxWidth + 'px;">' + replacing_ + '</span>');
                    _ballyShuttle_this.find("#selectedHeading").append('<span class="" style="display: inline-block;width: ' + BoxWidth + 'px;">' + replacing_ + '</span>');


                }
            }

            _ballyShuttle_this.find('.remaining option').each(function () {
                var appendText = "";
                for (j = 0; j < options.HeaderTitle.length; j++) {

                    appendText = appendText + '<span style="width: ' + BoxWidth + 'px; display: inline-block;text-align: center; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" title="' + $(this).attr(options.HeaderTitle[j]) + '">' + $(this).attr(options.HeaderTitle[j]) + '</span>'
                }


                $('#' + AvList).append('<li class="' + (options.DisableAll ? 'bally-shuttlelist-Disable-li' : 'bally-shuttlelist-li') + '" data-value="' + $(this).val() + '">' + appendText + '</li>');

            });
            _ballyShuttle_this.find('.remaining').css('display', 'none');

            _ballyShuttle_this.find('.selector-chosen div').append('<ul class="bally-shuttlelist-ul" id=' + SelList + ' name="bally-shuttlelist-selectedlist" style="height : ' + options.height + 'px "></ul>');
            _ballyShuttle_this.find('.target option').each(function () {
                //if it in _static_target_list then  bind different class
                targetlist.push(this);
                targetlist.sort(function (a, b) {
                    var alc = a.innerHTML.toLowerCase(), blc = b.innerHTML.toLowerCase();
                    return alc > blc ? 1 : alc < blc ? -1 : 0;
                });

                //var found = $.inArray($(this).val(), _ballyShuttle_this._static_target_list) > -1;
                //var appendSelectedText = "";

                //for (j = 0; j < options.HeaderTitle.length; j++) {

                //    appendSelectedText = appendSelectedText + '<span style="width: ' + BoxWidth + 'px; display: inline-block;text-align: center;">' + $(this).attr(options.HeaderTitle[j]) + '</span>'
                //}

                //if (found)
                //    _ballyShuttle_this.find('#' + SelList).append('<li class="bally-shuttlelist-Disable-li"  data-value="' + $(this).val() + '">' + appendSelectedText + '</li>');
                //else
                //    _ballyShuttle_this.find('#' + SelList).append('<li class="' + (options.DisableAll ? 'bally-shuttlelist-Disable-li' : 'bally-shuttlelist-li') + '"  data-value="' + $(this).val() + '">' + appendSelectedText + '</li>');
            });
            for (var i = 0 ; i < targetlist.length; i++) {
                var found = $.inArray($(targetlist[i]).val(), _ballyShuttle_this._static_target_list) > -1;
                var appendSelectedText = "";

                for (j = 0; j < options.HeaderTitle.length; j++) {

                    appendSelectedText = appendSelectedText + '<span style="width: ' + BoxWidth + 'px; display: inline-block;text-align: center;">' + $(targetlist[i]).attr(options.HeaderTitle[j]) + '</span>'
                }

                if (found)
                    _ballyShuttle_this.find('#' + SelList).append('<li class="bally-shuttlelist-Disable-li"  data-value="' + $(targetlist[i]).val() + '">' + appendSelectedText + '</li>');
                else
                    _ballyShuttle_this.find('#' + SelList).append('<li class="' + (options.DisableAll ? 'bally-shuttlelist-Disable-li' : 'bally-shuttlelist-li') + '"  data-value="' + $(targetlist[i]).val() + '">' + appendSelectedText + '</li>');
            }
            _ballyShuttle_this.find('.target').css('display', 'none');

            $('#' + AvLi).click(function () {
                if ($(this).hasClass('bally-shuttlelist-Disable-li'))
                    return;

                if ($(this).hasClass('bally-shuttlelist-selectedliitem')) {
                    $(this).removeClass('bally-shuttlelist-selectedliitem');
                    SelavailableItems.splice($.inArray($(this).data('value'), SelavailableItems), 1);
                }
                else {
                    $(this).addClass('bally-shuttlelist-selectedliitem');
                    SelavailableItems.push($(this).data('value'));
                }

                // the add button enabling and disabling done here

                if ($("#" + _ballyShuttle_this.attr("id")).find(".selector-available .bally-shuttlelist-selectedliitem").length > 0) {

                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-add").removeClass("disabled");

                }
                else {
                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-add").addClass("disabled");
                }

                if ($("#" + _ballyShuttle_this.attr("id")).find(".selector-available .bally-shuttlelist-li").length > 0) {

                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-chooseall").removeClass("disabled");
                }
                else {
                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-chooseall").addClass("disabled");
                }
            });


            $('#' + SeLi).click(function () {
                if ($(this).hasClass('bally-shuttlelist-Disable-li'))
                    return;

                if ($(this).hasClass('bally-shuttlelist-selectedliitem')) {
                    $(this).removeClass('bally-shuttlelist-selectedliitem');
                    SelselectedItems.splice($.inArray($(this).data('value'), SelselectedItems), 1);
                }
                else {
                    $(this).addClass('bally-shuttlelist-selectedliitem');
                    SelselectedItems.push($(this).data('value'));
                }

                // the remove button enabling and disabling done here
                if ($("#" + _ballyShuttle_this.attr("id")).find(".selector-chosen .bally-shuttlelist-selectedliitem").length > 0) {
                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-remove").removeClass("disabled");
                }
                else {
                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-remove").addClass("disabled");
                }

                if ($("#" + _ballyShuttle_this.attr("id")).find(".selector-chosen .bally-shuttlelist-li").length > 0) {
                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-clearall").removeClass("disabled");
                }
                else {
                    $("#" + _ballyShuttle_this.attr("id")).find(".selector-clearall").addClass("disabled");
                }


            });

            $('#' + AvLi).dblclick(function () {
                if (!$(this).hasClass('bally-shuttlelist-Disable-li')) {
                    //_ballyShuttle_this.$filter_input_available.val('');
                    _ballyShuttle_this.move_elems([$(this).data('value')], false, true);
                }
                Refresh(_ballyShuttle_this, options);
                setTimeout(function () {
                    $("#" + ID).find('.available-count').text(": " + $("#" + ID).find(".available-head").find('.bally-shuttlelist-ul li').length);
                    $("#" + ID).find('.selected-count').text(": " + $("#" + ID).find(".selected-head").find('.bally-shuttlelist-ul li').length);
                }, 200);
            });

            $('#' + SeLi).dblclick(function () {
                if (!$(this).hasClass('bally-shuttlelist-Disable-li')) {
                    //If not in the Static Array
                    if (!IsDisabled($(this).data('value'), _ballyShuttle_this)) {
                        _ballyShuttle_this.move_elems([$(this).data('value')], true, false);
                    }
                    Refresh(_ballyShuttle_this, options);
                    setTimeout(function () {
                        $("#" + ID).find('.available-count').text(": " + $("#" + ID).find(".available-head").find('.bally-shuttlelist-ul li').length);
                        $("#" + ID).find('.selected-count').text(": " + $("#" + ID).find(".selected-head").find('.bally-shuttlelist-ul li').length);
                    }, 200);
                }
            });


            // the default disabled for the add and remove
            $("#" + _ballyShuttle_this.attr("id")).find(".selector-add").addClass("disabled");
            $("#" + _ballyShuttle_this.attr("id")).find(".selector-remove").addClass("disabled");

            //to check the condition if the addall and remove all should be enabled or disabled
            if ($("#" + _ballyShuttle_this.attr("id")).find(".selector-available .bally-shuttlelist-li").length < 1) {
                $("#" + _ballyShuttle_this.attr("id")).find(".selector-chooseall").addClass("disabled");
            }
            else {
                $("#" + _ballyShuttle_this.attr("id")).find(".selector-chooseall").removeClass("disabled");
            }


            if ($("#" + _ballyShuttle_this.attr("id")).find(".selector-chosen .bally-shuttlelist-li").length < 1) {
                $("#" + _ballyShuttle_this.attr("id")).find(".selector-clearall").addClass("disabled");

            }
            else {
                $("#" + _ballyShuttle_this.attr("id")).find(".selector-clearall").removeClass("disabled");
            }


            setTimeout(function () {
                $("#" + ID).find('.available-count').text(": " + $("#" + ID).find(".available-head").find('.bally-shuttlelist-ul li').length);
                $("#" + ID).find('.selected-count').text(": " + $("#" + ID).find(".selected-head").find('.bally-shuttlelist-ul li').length);
            }, 200);

        }
    }
    var SelavailableItems = [];
    var SelselectedItems = [];
    var SelectedItemsorder = [];
    var hiddenSelectedValues = [];
    var _ballyShuttle_this;
    var HeaderTitle = [];
    var keyTitle = [];
    var flagon = true; // selectedOptionsSearchFilterValue condition checking

    $.fn.BallyShuttlelist = function (options) {
        $(this).empty();
        SelavailableItems = [];
        SelselectedItems = [];
        SelectedItemsorder = [];
        hiddenSelectedValues = [];
        _ballyShuttle_this;
        options['HeaderTitle'] = [];
        options['keyTitle'] = [];
        HeaderTitle = [];
        keyTitle = [];
        var Ctrl = $(this).attr('id');
        var settings = $.extend({}, $.fn.BallyShuttlelist.defaults, options);
        /* #=============================================================================== */
        /* # Expose public functions */
        /* #=============================================================================== */
        this.populate = function (input) { Ctrl.populate(input); };
        //New Funtion to reload the data.
        this.Reload = function (input) {
            Ctrl.reload(input);
        }
        this.set_values = function (values) { Ctrl.set_values(values); };
        this.get_values = function () { return Ctrl.get_values(); };
        this.DisplayColumn = function (obj) {
            Ctrl.DisplayColumn(obj);
        };
        this.show = function (isshow) {
            if (isshow)
                $(this).show();
            else
                $(this).hide();
        }

        this.enable = function (isenable) {
            if (isenable) {
                $(this).find('.shuttle-overlay').remove();
            }
            else {
                $("<div class='shuttle-overlay' />").css({
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: 0,
                    zIndex: 1000000,  // to be on the safe side
                }).appendTo($(this).css("position", "relative"));
            }
        }

        return this.each(function () {
            Ctrl = $(this);
            /* #=============================================================================== */
            /* # Add widget markup */
            /* #=============================================================================== */
            Ctrl.append($.fn.BallyShuttlelist.defaults.template);
            if (options.Issearch) {

                if (options.TitleText[0] == null || options.TitleText[0] == undefined) {
                    options.TitleText[0] = ['Available'];
                }
                if (options.TitleText[1] == null || options.TitleText[1] == undefined) {
                    options.TitleText[1] = ['Selected'];
                }
                Ctrl.find(".available-head").prepend('<h4>' + options.TitleText[0] + '<span class="available-count"></span></h4><span class="search"><input type="search" class="bally-textbox-filter available-filter" placeholder="Search"/><span class="SearchClear" style="visibility: hidden;"><span class="icon-plus"></span></span></span>');
                Ctrl.find(".selected-head").prepend('<h4>' + options.TitleText[1] + '<span class="selected-count"></span></h4><span class="search"><input type="search" class="bally-textbox-filter selected-filter" placeholder="Search"/><span class="SearchClear" style="visibility: hidden;"><span class="icon-plus"></span></span></span>');

            }
            else {
                Ctrl.find(".available-head").prepend('<span class="bally-textbox-filter" style="display:none"></span>');
                Ctrl.find(".selected-head").prepend('<span class="bally-textbox-filter" style="display:none"></span>');
            }

            //Ctrl.append('<input type="hidden" id="' + settings.HiddenID + '" />');
            Ctrl.addClass("ballyshuttle-container");
            /* #=============================================================================== */
            /* # Initialize internal variables */
            /* #=============================================================================== */
            Ctrl.$filter_input_available = Ctrl.find('.available-filter');
            Ctrl.$filter_input_selected = Ctrl.find('.selected-filter');
            Ctrl.$remaining_select = Ctrl.find('select.remaining');
            Ctrl.$target_select = Ctrl.find('select.target');
            Ctrl.$add_btn = Ctrl.find('.selector-add');
            Ctrl.$remove_btn = Ctrl.find('.selector-remove');
            Ctrl.$choose_all_btn = Ctrl.find('.selector-chooseall');
            Ctrl.$clear_all_btn = Ctrl.find('.selector-clearall');
            Ctrl._remaining_list = [];
            Ctrl._target_list = [];
            Ctrl._static_target_list = new Array();
            /* #=============================================================================== */
            /* # Apply settings */
            /* #=============================================================================== */
            /* target_id */
            if (settings.target_id != '') Ctrl.$target_select.attr('id', settings.target_id);
            /* height */
            Ctrl.find('select.filtered').css('height', settings.height);
            /* #=============================================================================== */
            /* # Wire internal events */
            /* #=============================================================================== */
            Ctrl.$add_btn.click(function () {
                if ($(this).hasClass("disabled")) {
                    return;
                };
                //Ctrl.$filter_input_available.val('');
                Ctrl.move_elems(SelavailableItems, false, true);
                Refresh(Ctrl, options);
                SelavailableItems = [];
                SelselectedItems = [];
                setTimeout(function () {
                    Ctrl.find('.available-count').text(": " + Ctrl.find(".available-head").find('.bally-shuttlelist-ul li').length);
                    Ctrl.find('.selected-count').text(": " + Ctrl.find(".selected-head").find('.bally-shuttlelist-ul li').length);
                }, 200);
            });
            Ctrl.$remove_btn.click(function () {
                if ($(this).hasClass("disabled")) {
                    return;
                };
                //for (var i = 0; i < SelselectedItems.length ; i++) {
                //    objv = SelselectedItems[i];
                //    if (!IsDisabled(objv, Ctrl)) {
                //        Ctrl.move_elems([objv], true, false);
                //    }
                //}
                //Ctrl.$filter_input_selected.val('');
                Ctrl.move_elems(SelselectedItems, true, false);
                Refresh(Ctrl, options);
                SelavailableItems = [];
                SelselectedItems = [];
                setTimeout(function () {
                    Ctrl.find('.available-count').text(": " + Ctrl.find(".available-head").find('.bally-shuttlelist-ul li').length);
                    Ctrl.find('.selected-count').text(": " + Ctrl.find(".selected-head").find('.bally-shuttlelist-ul li').length);
                }, 200);
            });
            Ctrl.$choose_all_btn.click(function () {
                if ($(this).hasClass("disabled")) {
                    return;
                };
                Ctrl.$filter_input_available.val('');
                Ctrl.move_all(false, true);
                Refresh(Ctrl, options);
                setTimeout(function () {
                    Ctrl.find('.available-count').text(": " + Ctrl.find(".available-head").find('.bally-shuttlelist-ul li').length);
                    Ctrl.find('.selected-count').text(": " + Ctrl.find(".selected-head").find('.bally-shuttlelist-ul li').length);
                }, 200);
            });
            Ctrl.$clear_all_btn.click(function () {
                if ($(this).hasClass("disabled")) {
                    return;
                };
                //var ee = Ctrl._target_list;
                //if(!IsDisabled(objv,Ctrl))
                //	 {
                //	 Ctrl.move_elems([$(this).val()], true, false);
                //	 }
                Ctrl.$filter_input_selected.val('');
                Ctrl.move_all(true, false);
                Refresh(Ctrl, options);
                setTimeout(function () {
                    Ctrl.find('.available-count').text(": " + Ctrl.find(".available-head").find('.bally-shuttlelist-ul li').length);
                    Ctrl.find('.selected-count').text(": " + Ctrl.find(".selected-head").find('.bally-shuttlelist-ul li').length);
                }, 200);
            });
            Ctrl.$filter_input_available.keyup(function () {
                Ctrl.update_lists(true);
                Refresh(Ctrl, options);
                if ($(this).val().length != 0) {
                    $(this).parent().find('.SearchClear').css({ "visibility": "visible" })
                } else {
                    $(this).parent().find('.SearchClear').css({ "visibility": "hidden" })
                }

                setTimeout(function () {
                    Ctrl.find('.available-count').text(": " + Ctrl.find(".available-head").find('.bally-shuttlelist-ul li').length);
                    Ctrl.find('.selected-count').text(": " + Ctrl.find(".selected-head").find('.bally-shuttlelist-ul li').length);
                }, 200);

            });
            Ctrl.$filter_input_selected.keyup(function () {

                // selectedOptionsSearchFilterValue conditon checking 
                if (!settings.selectedOptionsSearchFilterValue) {
                    flagon = false;
                }


                Ctrl.update_lists(true);
                Refresh(Ctrl, options);
                if ($(this).val().length != 0) {
                    $(this).parent().find('.SearchClear').css({ "visibility": "visible" })
                } else {
                    $(this).parent().find('.SearchClear').css({ "visibility": "hidden" })
                }

                setTimeout(function () {
                    Ctrl.find('.available-count').text(": " + Ctrl.find(".available-head").find('.bally-shuttlelist-ul li').length);
                    Ctrl.find('.selected-count').text(": " + Ctrl.find(".selected-head").find('.bally-shuttlelist-ul li').length);
                }, 200);
            });
            Ctrl.$filter_input_selected.parent().find('.SearchClear').on('click', function () {
                Ctrl.$filter_input_selected.val('');
                Ctrl.update_lists(true);
                Refresh(Ctrl, options);
                $(this).css({ "visibility": "hidden" });
            });
            Ctrl.$filter_input_available.parent().find('.SearchClear').on('click', function () {
                Ctrl.$filter_input_available.val('');
                Ctrl.update_lists(true);
                Refresh(Ctrl, options);
                $(this).css({ "visibility": "hidden" });
            });
            /* #=============================================================================== */
            /* # Implement public functions */
            /* #=============================================================================== */
            Ctrl.DisplayColumn = function (obj) {
                $.each(obj[0], function (key, value) {
                    HeaderTitle.push(key);
                    keyTitle.push(value);
                });
                options.HeaderTitle = HeaderTitle;// COPYING FROM THE ARRAY TO OBJECT
            }
            Ctrl.populate = function (input) {
                // input: [{value:_, content:_}]
                Ctrl.$filter_input_available.val('');
                Ctrl.$filter_input_selected.val('');
                if (input.length == 0) {
                    Ctrl._remaining_list = [];
                    Ctrl._target_list = [];
                }
                for (var i = 0 ; i < input.length; i++) {
                    var e = input[i];
                    var headingName = {};
                    headingName["value"] = e[[options.ValueMemberId]];
                    headingName["text"] = e[keyTitle[2]];
                    for (x = 0; x < options.HeaderTitle.length; x++) {
                        headingName[[options.HeaderTitle[x]]] = e[keyTitle[x]];
                    }
                    Ctrl._remaining_list.push([headingName, true]);
                    Ctrl._target_list.push([headingName, false]);
                    //To add the Disabled Items
                    if (e.disabled == true) {
                        Ctrl._static_target_list.push(e[[options.ValueMemberId]]);
                        Ctrl.set_values([e[[options.ValueMemberId]]]);
                        //SelselectedItems.push($(this).val());
                    }
                }
                Ctrl.update_lists(true);
                Refresh(Ctrl, options);
            };

            Ctrl.reload = function (input) {
                Ctrl._remaining_list = [];
                Ctrl._target_list = [];
                Ctrl.populate(input);
            };
            Ctrl.set_values = function (values) {
                Ctrl.move_elems(values, false, true);
                Refresh(Ctrl, options);
            };
            Ctrl.get_values = function () {
                return Ctrl.get_internal(Ctrl.$target_select);
            };
            /* #=============================================================================== */
            /* # Implement private functions */
            /* #=============================================================================== */
            Ctrl.get_internal = function (selector) {
                var res = [];
                selector.find('option').each(function () {
                    res.push($(this).val());
                })
                return res;
            };
            Ctrl.to_dict = function (list) {
                var res = {};
                for (var i = 0 ; i < list.length ; i++) res[list[i]] = true;
                return res;
            }
            Ctrl.update_lists = function (force_hilite_off) {
                var old;
                if (!force_hilite_off) {
                    old = [Ctrl.to_dict(Ctrl.get_internal(Ctrl.$remaining_select)),
                           Ctrl.to_dict(Ctrl.get_internal(Ctrl.$target_select))];
                }
                Ctrl.$remaining_select.empty();
                Ctrl.$target_select.empty();
                var lists = [Ctrl._remaining_list, Ctrl._target_list];
                var source = [Ctrl.$remaining_select, Ctrl.$target_select];
                for (var i = 0 ; i < lists.length ; i++) {
                    for (var j = 0; j < lists[i].length ; j++) {
                        var e = lists[i][j];
                        if (e[1]) { //if selected
                            var selected = '';
                            if (!force_hilite_off && settings.hilite_selection && !old[i].hasOwnProperty(e[0][options.ValueMemberId])) {
                                selected = 'selected="selected"';
                            }
                            var appendText = "";
                            var labeltext = "";
                            for (x = 0; x < options.HeaderTitle.length; x++) {

                                appendText = appendText + options.HeaderTitle[x] + "=" + " \" " + e[0][options.HeaderTitle[x]] + " \"  ";
                                labeltext = labeltext + e[0][options.HeaderTitle[x]]
                            }
                            source[i].append('<option class="test" ' + selected + 'value=' + e[0].value + ' ' + appendText + '>' + labeltext + '</option>');
                        }
                    }
                }
                //Selection Order Change -  Venkat
                if (settings.Isorderchange) {
                    $(SelectedItemsorder).each(function () {
                        if (jQuery.inArray(this, Ctrl._target_list)) {
                            var source = Ctrl.$target_select.find('option[value="' + this + '"]').remove();
                            Ctrl.$target_select.prepend(source);
                        }
                    });
                }

                Ctrl.$target_select.find('option').each(function () {
                    var inner = Ctrl.$filter_input_selected.val().toLowerCase();
                    var outer = $(this).html().toLowerCase();
                    if (outer.indexOf(inner) == -1) {
                        $(this).remove();
                    }
                })

                Ctrl.$remaining_select.find('option').each(function () {
                    var inner = Ctrl.$filter_input_available.val().toLowerCase();
                    var outer = $(this).html().toLowerCase();
                    if (outer.indexOf(inner) == -1) {
                        $(this).remove();
                    }
                })


                // selectedOptionsSearchFilterValue condition checking flagon variable

                if (settings.HiddenID != '' && flagon) {
                    hiddenSelectedValues = $('#' + settings.HiddenID).val();
                    $('#' + settings.HiddenID).val(Ctrl.get_internal(Ctrl.$target_select));
                    $('#' + settings.HiddenID).val(Ctrl.get_internal(Ctrl.$target_select)).trigger('change');
                }
                flagon = true;
            };
            //Selection Changes - Venkat
            Ctrl.move_elems = function (values, b1, b2) {
                if (settings.Isorderchange) {
                    if (b2) {
                        //Add selected Value
                        SelectedItemsorder.push(values);
                    }
                    else {
                        //Remove selected Value
                        if (SelectedItemsorder.length != 0)
                            SelectedItemsorder.pop(values);
                    }
                }
                for (var i = 0; i < values.length ; i++) {
                    val = values[i];
                    for (var j = 0; j < Ctrl._remaining_list.length ; j++) {
                        var e = Ctrl._remaining_list[j];
                        if (e[0].value == val) {
                            e[1] = b1;
                            Ctrl._target_list[j][1] = b2;
                        }
                    }
                }
                Ctrl.update_lists(false);
            };
            Ctrl.move_all = function (b1, b2) {
                for (var i = 0 ; i < Ctrl._remaining_list.length; i++) {
                    if (!IsDisabled(Ctrl._remaining_list[i][0].value, Ctrl)) {
                        Ctrl._remaining_list[i][1] = b1;
                        Ctrl._target_list[i][1] = b2;
                    }
                }
                Ctrl.update_lists(false);
            };
            Ctrl.data('ballyshuttlelist', Ctrl);
            var extraheight = Ctrl.find('#bally-shuttlelist-buttons').height() / 2;
            Ctrl.find('.selector-chooser').css('margin-top', Ctrl.find('.bally-shuttlelist').height() / 2 - extraheight);
            setTimeout(function () {
                Ctrl.find('.available-count').text(": " + Ctrl.find(".available-head").find('.bally-shuttlelist-ul li').length);
                Ctrl.find('.selected-count').text(": " + Ctrl.find(".selected-head").find('.bally-shuttlelist-ul li').length);
            }, 200);

            return Ctrl;
        });
    };

    $.fn.BallyShuttlelist.defaults = {
        'template':
             '<div class="bally-shuttlelist">\
		<ul>\
            <li class="selector-available">\
                <div class="available-head">\
                     <select multiple="multiple" class="filtered remaining">\
                     </select>\
                     <span id="availableHeading" ></span>\
                </div>\
            </li>\
            <li class="selector-chooser">\
                 <div align="center" id="bally-shuttlelist-buttons">\
                            <a href="#" class="selector-add"></a>\
                            <a href="#" class="selector-chooseall"></a>\
                            <a href="#" class="selector-remove"></a>\
                            <a href="#" class="selector-clearall"></a>\
				 </div>\
            </li>\
            <li class="selector-chosen">\
                 <div class="selected-head">\
                    <span id="selectedHeading"></span>\
                   <select multiple="multiple" class="filtered target">\
                   </select>\
                </div>\
            </li>\
        </ul>\
    </div>',
        'height': '10em',
        'hilite_selection': true,
        'target_id': '',
        'HiddenID': '',
        'Issearch': false,
        'Isorderchange': false,
        'selectedOptionsFilterValue': true
    }
})(jQuery);
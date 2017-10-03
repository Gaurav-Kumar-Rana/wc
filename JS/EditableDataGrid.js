/*!
 * jQuery Bally Editable DataGrid plugin Version-2
 * author: RajeshPerumal(rajesh.perumal@scientificgames.com)
 */
;
(function ($, window, document, undefined) {
    //plugin defaults
    var clearIconclass = '.clear-Icon .bottom-appmenu';
    var pluginName = 'BallyEditableDataGrid',
        defaults = {
            comboChangeEvent: function (control, selectedValue) { },
            afterRowChange: function () { },
            getSelected: function () { },
            onUpdate: function () { },
            onRowSelection: function () { },
            onDoubleClickRowSelection: function () { },
            onActionClick: function () { },
            autoColumnWidth: false,
            pagination: false,
            filter: false,
            disablevent: false,
            defaultGroup: "",
            _tempRawdata: [],
            _selectedArr: [],
            lang: 'en-US',
            columnSwap: false,
            clearAction: false,
            autoInitiatNav:true,
            ipTemp: {
                checkbox: '<span class="bally-checkbox"><label><input type="checkbox"/><span></span></label></span>',
                text: '<input type="search" class="bally-textbox"/><span class="SearchClear" style="visibility: hidden;"><span class="icon-plus">X</span></span>',
                number: '<input type="text" data-type="number" class="bally-textbox"/><span class="SearchClear" style="visibility: hidden;"><span class="icon-plus"></span></span>',
                label: '<label"/>',
                password: '<input type="password" data-type="password" class="bally-textbox"/><span class="SearchClear" style="visibility: hidden;"><span class="icon-plus"></span></span>',
                switchbox: '<div class="bally-switch-control">' +
                    '<div class="slider bally-pre sliderSwitch" id=""></div>' +
                    '</div>',
                combobox: '<div class=""><select></select></div>',
                radio: '<label class="bally-radio"><input type="radio"><span></span></label>',
                status: '<label class="bally-status-label"></label>',
                action: '<span></span>',
                image: '<img class="gridImg" src="" alt="" /><span></span>'
            },
            btnGroup: '<ul class="btn-group btn-group-disabled">' +
                '<li class="up"></li>' +
                '<li class="down"></li>' +
                '</ul>'
        };
    //plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        /*if (options.data.url !== null) {
            this.init();
        }*/
        this.init();
    }
    Plugin.prototype = {
        init: function () {
            var that = this,
                config = that.options;
            //config.lang = controlHelper.cultureInfo;
            $(that.element).empty();
            tableInfo = '<p class="tableInfo"><span class="totalNumRow">Total Rows : 0</span><span class="totalSelRow">Selected Rows : 0</span><span class="totalFilteredRow">Filtered Rows : 0</span></p>';
            externalScrol = '<div class="tblScrollBind"><div class="tblScrollBody"></div></div>';
            $(that.element).addClass('bally-editabledatagrid').append(tableInfo + '<table><thead></thead><tbody></tbody><tfoot></tfoot></table>');

            config.start = 0;
            if (config.pagination) {
                config.end = config.pagesize - 1;
            } else {
                config.end = config.data.url.length;
            }

            //--
            if (config.groupBy && config.groupBy !== "") {
                config._avilGroups = [];
                $.each(config.data.url, function (i, list) {
                    if (config._avilGroups.indexOf(list[config.groupBy]) === -1) {
                        config._avilGroups.push(list[config.groupBy]);
                    }
                });

                if (config.pagination) {
                    config.end = config.pagesize - 1;
                } else {
                    config.end = config._avilGroups.length;
                }
            }
            //--

            if (config.hiddenId) {
                if (!$("input#" + config.hiddenId)[0]) {
                    $("<input />", {
                        'id': config.hiddenId,
                        'value': config.defaultselection,
                        'type': 'hidden'
                    }).appendTo($(that.element).parent());
                    config.defaultselection = $("input#" + config.hiddenId).val().split(",");
                } else {
                    config.defaultselection = $("input#" + config.hiddenId).val().split(",");
                }
            } else {
                $("<input />", {
                    'id': $(that.element).attr('id') + '-hidden',
                    'value': config.defaultselection,
                    'type': 'hidden'
                }).appendTo($(that.element).parent());
                config.hiddenId = $(that.element).attr('id') + '-hidden';
                config.defaultselection = $("input#" + config.hiddenId).val().split(",");
            }

            if ($('input#' + config.hiddenId).val() === "") {
                config.defaultselection = "";
                config._selectedArr = [];
            }

            that._createHeader();
            if (config.filter) {
                that._filter();
            }

            that._createBody();

            if (config.sumRowAt === 'top' && config.sumRow && config.sumRow.length !== 0) {
                that._appendColumnSumRow();
            }

            that._inputlength();
            if (config.footer) {
                that._createFooter();
            }
            if (config.pagination && config.footer) {
                //$('<tr />', {
                //    'class': 'pagination'
                //}).appendTo($(that.element).find('tfoot')).append($('<td />', {
                //    'colspan': $(that.element).find('thead th').length
                //}));
                $(that.element).closest('.grid-holder').find('.pagination').remove();
                $(that.element).closest('.grid-holder').append('<div class="pagination" style="height:26px; margin-top:-42px; float:right;"></div>')
                that._pagination();
                //config._selectedArr = [];
            }



            if (config.clearAction && config.footer) {
                debugger;
                _dataRel = $(that.element).attr('id');
                $(that.element).parent().find('[data-rel= ' + _dataRel + ']').remove();
                var clearIconthtml = '<div class="clear-icon" data-rel= ' + _dataRel + '></div>';
                $(clearIconthtml).appendTo('.clearAction').off().on('click', function (event, obj) {
                    $(that.element).find('.SearchClear').css("visibility", "hidden");
                    $(that.element).find('.bally-textbox').val("");
                    $(that.element).find('tbody tr td').attr('data-filtered', 'positive');
                    $(that.element).find('tbody p').remove();
                    $(that.element).find('tbody tr').show();
                    that.getTotalNumFilteredRow(0);
                    $(clearIconclass).addClass('disabled');
                    //When remove filter, checking all the selected rows during filter is equal to total available rows or not.
                    if ($(that.element).find('table tbody tr.selected:not([style="display: none;"])').length == $(that.element).find('table tbody tr:not([style="display: none;"])').length) {
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', true);
                    } else {
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                    }
                });
            }



            that._setSize($(that.element).find('table'));
            var that = this;

            $(window).resize(function () {
                that._setSize($(that.element).find('table'));
            });

            //AM Application Specific on click of toggle button maximize toggle button
            $(that.element).closest('body').find('.tgl-menu-btn, #FullViewToggle').on('click', function () {
                setTimeout(function () {
                    that._setSize($(that.element).find('table'));
                }, 200);

            });

            if (config.disablevent) {
                $(this.element).find('input,select').prop('disabled', true);
                $(this.element).find('table tr').not('.bally-editabledatagrid-grow').unbind('click');
            }
            this.getTotalNumRow();
            this.getTotalNumSelectedRow();

            //KeyBoar Navigation and External scroll bind

            //$(that.element).find('.bally-textbox').focus(function () {
            //    //if ($(that.element).find('table tbody tr.selected').length != 0) {
            //    //    _startRow = $(that.element).find('table tbody tr.selected').attr('id');
            //    //}
            //    //else if ($(that.element).find('table tbody tr.hovered').length != 0) {
            //    //    _startRow = $(that.element).find('table tbody tr.hovered').attr('id');
            //    //}
            //    //else if ($(that.element).find('table tbody tr.hovered').length == 0 && $(that.element).find('table tbody tr.selected').length == 0) {
            //    //    _startRow = $(that.element).find('table tbody tr:first-child').attr('id');
            //    //}

            //    //that._navigateThroughKeyBoard(_startRow);
            //});
            if (config.autoInitiatNav) {
                setTimeout(function () {
                    that.activateNav();
                }, 500);
            } else {
                $(that.element).find('.bally-textbox').focus(function () {
                    that.activateNav();
                });
            }
        },
        //New Funtion to clear the search box
        _appendColumnSumRow: function () {
            var that = this, config = that.options, _h = $(that.element).find('thead tr:first th').length, _td = $(that.element).find('tbody tr:first td');
            $('<tr />', {}).addClass('columnSumRow').appendTo($(that.element).find('thead'));
            if (config.selectBox) {
                _h = _h - 1;
            }
            for (var i = 0; i < _h; i++) {
                if (i === 0 && config.selectBox) {
                    $('<th />', {}).addClass('selectbox').appendTo($(that.element).find('thead tr.columnSumRow'));
                }
                $('<th />', { text: config.sumRow[0][config.columns[i].field] }).css({ 'text-align': $(_td[i]).css('text-align') }).appendTo($(that.element).find('thead tr.columnSumRow'));
            };
        },
        _filter: function () {
            var that = this,
                config = that.options;
            var _thead = $(that.element).find('thead');
            $('<tr />', {
                'class': 'filterbox'
            }).appendTo(_thead);
            $.each(config.columns, function (i, c) {
                if (config.selectBox && i == 0) {
                    $(_thead).find('tr.filterbox').append('<th class="selectbox"></th>');
                }
                $("<th />", {}).data('filterBy', c.field).appendTo($(_thead).find('tr.filterbox')).append(c.filter == undefined ? config.ipTemp.text : '').find('input').attr('placeholder', 'Search').bind('keyup', function (e) {
                    if ($(this).val().length != 0) {
                        $(this).next('.SearchClear').css("visibility", "visible").off().on('click', function (e) {
                            $(this).css("visibility", "hidden");
                            $(this).closest('th').find('input[type="search"]').val("");
                            that._doFilter($(this).closest('th').find('input[type="search"]'), $(this).parent().index(), e);

                            //When remove filter, checking all the selected rows during filter is equal to total available rows or not
                            if ($(that.element).find('table tbody tr.selected:not([style="display: none;"])').length == $(that.element).find('table tbody tr:not([style="display: none;"])').length) {
                                $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', true);
                            } else {
                                $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                            }

                            //Calculating the length of text which don't have null value.
                            _vEmptyTextBox = $(that.element).find(".bally-textbox").filter(function () {
                                return $.trim($(this).val()) != '';
                            }).length;
                            if (!_vEmptyTextBox) {
                                $(clearIconclass).addClass('disabled');
                            }
                        });
                        //If text available in the filter field then remove the disabled class from clear icon.
                        $(clearIconclass).removeClass('disabled');
                    } else {
                        $(this).next('.SearchClear').css("visibility", "hidden");
                        //Calculating the length of text which don't have null value.
                        _vEmptyTextBox = $(that.element).find(".bally-textbox").filter(function () {
                            return $.trim($(this).val()) != '';
                        }).length;
                        if (!_vEmptyTextBox) {
                            $(clearIconclass).addClass('disabled');
                        }
                    }

                    that._doFilter(this, $(this).parent().index(), e);
                    //When remove filter, checking all the selected rows during filter is equal to total available rows or not
                    if ($(that.element).find('table tbody tr.selected:not([style="display: none;"])').length == $(that.element).find('table tbody tr:not([style="display: none;"])').length) {
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', true);
                    } else {
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                    }
                });


            });
        },
        _doFilter: function (term, cellIndex, event) {
            var rows = $(this.element).find('tbody tr:not(.noRecords)');
            var filter = $(term).val().toLowerCase();
            var noneCount = 0;
            var rowCount = 0;//New to rearrange the sno. on filter.
            rows.each(function () {
                var row = $(this);
                var cell = $(row.children('td')[cellIndex]);
                if (filter) {

                    if (cell.text().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {

                        cell.attr('data-filtered', 'positive');
                    } else {

                        cell.attr('data-filtered', 'negative');
                    }

                    if (row.find("td[data-filtered=negative]").size() > 0) {

                        row.hide();
                        noneCount += 1;
                    } else {

                        if (row.find("td[data-filtered=positive]").size() > 0) {
                            rowCount += 1;//New to rearrange the sno. on filter.
                            row.show();

                            /*Temporarily hide this project*/
                            /*if (row.find('td:first-child').hasClass('selectbox')) {
                                row.find('td:nth-child(2)').text(rowCount);//New to rearrange the sno. on filter
                            } else {
                                row.find('td:first-child').text(rowCount);//New to rearrange the sno. on filter
                            }*/
                            //$(clearIconclass).removeClass('disabled');
                        }
                    }
                } else {

                    cell.attr('data-filtered', 'positive');
                    if (row.find("td[data-filtered=negative]").size() > 0) {

                        row.hide();
                        noneCount += 1;
                    } else {
                        if (row.find("td[data-filtered=positive]").size() > 0) {
                            rowCount += 1;//New to rearrange the sno. on filter.
                            row.show();

                            /*Temporarily hide this project*/
                            /*if (row.find('td:first-child').hasClass('selectbox')) {
                                row.find('td:nth-child(2)').text(rowCount);//New to rearrange the sno. on filter
                            } else {
                                row.find('td:first-child').text(rowCount);//New to rearrange the sno. on filter
                            }*/
                            //$(clearIconclass).removeClass('disabled');

                        }
                    }
                }
            });
            if (rows.length === noneCount) {

                $(rows).parent().find('p').remove();
                $('<p />', {
                    text: 'No Records Found',
                    'title': 'No Records Found'
                }).addClass('noRecords').appendTo($(rows).parent());
                //$(clearIconclass).removeClass('disabled');

            }
            else {
                $(rows).parent().find('p').remove();
                //$(clearIconclass).addClass('disabled');
                //if (noneCount != 0) {
                //    $(clearIconclass).removeClass('disabled');
                //}
                //else {
                //    $(clearIconclass).addClass('disabled');
                //}

            }
            this.getTotalNumFilteredRow(noneCount);
            return false;
        },
        _pagination: function () {
            var that = this,
                config = that.options;
            config._paginationSize = that._totalPage() > 10 ? 10 : that._totalPage();
            if (config.pagination && (config.pagesize || config.pagesize !== "") && that._totalPage() > 1) {
                $('<div />', {
                    'class': 'pagi-buttongroup'
                }).appendTo($(that.element).closest('.grid-holder').find('.pagination'));
                $('<div />', {
                    text: '<<',
                    'class': 'pagi-button disabled',
                    'id': 'first'
                }).appendTo($(that.element).closest('.grid-holder').find('.pagination div.pagi-buttongroup')).bind('click', function () {
                    that._fetchList(this, config);
                });
                $('<div />', {
                    text: '<',
                    'class': 'pagi-button disabled',
                    'id': 'prev'
                }).appendTo($(that.element).closest('.grid-holder').find('.pagination div.pagi-buttongroup')).bind('click', function () {
                    that._fetchList(this, config);
                });

                $('<div />', {
                    'class': 'pagi-holder'
                }).appendTo($(that.element).closest('.grid-holder').find('.pagination div.pagi-buttongroup'));
                config._paginationSize ? config.activePageList = config._paginationSize : config.activePageList = that._totalPage();
                that._loadPageThumb($(that.element).closest('.grid-holder').find('.pagi-holder'), 0, config.activePageList, that._totalPage());

                $('<div />', {
                    text: '>',
                    'class': 'pagi-button',
                    'id': 'next'
                }).appendTo($(that.element).closest('.grid-holder').find('.pagination div.pagi-buttongroup')).bind('click', function () {
                    that._fetchList(this, config);
                });
                $('<div />', {
                    text: '>>',
                    'class': 'pagi-button',
                    'id': 'last'
                }).appendTo($(that.element).closest('.grid-holder').find('.pagination div.pagi-buttongroup')).bind('click', function () {
                    that._fetchList(this, config);
                });
            }
        },
        _totalPage: function () {
            if (this.options.groupBy && this.options.groupBy !== "") {
                return Math.ceil(this.options._avilGroups.length / this.options.pagesize);
            } else {
                return Math.ceil(this.options.data.url.length / this.options.pagesize);
            }
        },
        _loadPageThumb: function (apndTo, f, t, total) {
            var that = this,
                config = that.options,
                _avilPagesize = null;
            if (config.groupBy && config.groupBy !== "") {
                _avilPagesize = Math.ceil(config._avilGroups.length / config.pagesize);
            } else {
                _avilPagesize = Math.ceil(config.data.url.length / config.pagesize);
            }
            if (t > _avilPagesize) {
                t = _avilPagesize;
            }
            apndTo.find('div').remove();
            //var _diff=(t-f)<10?10:(t-f);
            if (config.pagination && f >= (t - f)) {
                $('<div />', {
                    text: (f - config._paginationSize + 1) + '-' + ((f - config._paginationSize) + config._paginationSize),
                    'class': 'bally-datagrid-pagiMore'
                }).data('pagiMore', {
                    from: f - config._paginationSize,
                    to: (f - config._paginationSize) + config._paginationSize
                }).appendTo(apndTo).bind('click', function () {
                    var loadFT = $(this).data('pagiMore');
                    that._loadPageThumb($(that.element).closest('.grid-holder').find('.pagi-holder'), loadFT.from, loadFT.to, that._totalPage());
                    $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                    config.start = (loadFT.from * 10) + 1;
                    config.end = (config.start + 10) - 1;
                    that._fetchList(this, config);
                });
            }
            for (var i = f; i < t; i++) {
                $('<div />', {
                    text: i + 1
                }).addClass(i % config._paginationSize == 0 ? 'page' + (i + 1) + ' active' : 'page' + (i + 1)).appendTo(apndTo).bind('click', function () {
                    that._fetchList(this, config);
                });
            }

            if (config.pagination && t < that._totalPage()) {
                $('<div />', {
                    text: (t + 1) + '-' + (t + (t - f) > that._totalPage() ? that._totalPage() : t + (t - f)),
                    'class': 'bally-datagrid-pagiMore'
                }).data('pagiMore', {
                    from: t,
                    to: t + (t - f) > that._totalPage() ? that._totalPage() : t + (t - f)
                }).appendTo(apndTo).bind('click', function () {
                    var loadFT = $(this).data('pagiMore');
                    that._loadPageThumb($(that.element).closest('.grid-holder').find('.pagi-holder'), loadFT.from, loadFT.to, that._totalPage());
                    $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                    config.start = (loadFT.from * 10);
                    config.end = (config.start + 10) - 1;
                    that._fetchList(this, config);
                });
            }

        },
        _fetchList: function (activelist, config) {
            if (!$(activelist).hasClass('active')) {
                var currentPage = parseInt($(activelist).parent().find('div.active').text()),
                    totalPage = this._totalPage(),
                    sibleSize = config.pagesize;
                this._loadPageList(activelist, currentPage, totalPage, sibleSize);
            }
            if (config.disablevent) {
                $(this.element).find('input,select').prop('disabled', true);
                $(this.element).find('table tr').not('.bally-editabledatagrid-grow').unbind('click');
            }
            $(this.element).find('table tbody').animate({ scrollTop: 0, scrollLeft: 0 }, 100);
            $(this.element).animate({ scrollLeft: 0 }, 100);
        },
        _loadPageList: function (className, currentPage, totalPage, sibleSize) {
            var that = this,
                config = that.options;
            switch ($(className).attr('id')) {
                case 'first':
                    if (totalPage >= currentPage && currentPage != 1) {
                        $(that.element).closest('.grid-holder').find('div.pagi-holder div').removeClass('active');
                        config.start = 0;
                        $(that.element).closest('.grid-holder').find('div.pagi-holder div.page1').addClass('active');

                        config.end = config.start + sibleSize - 1;

                        //console.log(config.start + '-GOFIRST-' + config.end);
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                        $(that.element).find('tbody tr').remove();
                        that._createBody();
                        that._columnSum();
                        that._setSize($(that.element).find('table'));
                        that._loadPageThumb($(that.element).find('.pagi-holder'), 0, config.activePageList, that._totalPage());

                        $(that.element).find('div.pagination #first,div.pagination #prev').addClass('disabled');
                        $(that.element).find('div.pagination #next,div.pagination #last').removeClass('disabled');

                    }
                    break;
                case 'prev':
                    if (totalPage >= currentPage && currentPage != 1) {

                        currentPage -= 1
                        config.start = (currentPage * sibleSize) - sibleSize;
                        config.end = config.start + sibleSize - 1;

                        //console.log(config.start + '-PREV-' + config.end);
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                        $(that.element).find('tbody tr').remove();
                        that._createBody();
                        that._columnSum();
                        that._setSize($(that.element).find('table'));
                        if (currentPage % config._paginationSize == 0) {
                            that._loadPageThumb($(that.element).find('.pagi-holder'), (currentPage - config._paginationSize), currentPage, that._totalPage());
                        }

                        $(that.element).closest('.grid-holder').find('div.pagi-holder div').removeClass('active');
                        $(that.element).closest('.grid-holder').find('div.pagi-holder div.page' + currentPage).addClass('active');
                        if (currentPage == 1) {
                            $(that.element).find('div.pagination #first,div.pagination #prev').addClass('disabled');
                            $(that.element).find('div.pagination #next,div.pagination #last').removeClass('disabled');
                        }
                    }
                    break;
                case 'last':
                    if (totalPage > currentPage) {

                        config.start = (totalPage * sibleSize) - sibleSize;
                        config.end = totalPage * sibleSize;

                        //console.log(config.start + '-GOLAST-' + config.end);
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                        $(that.element).find('tbody tr').remove();
                        that._createBody();
                        that._columnSum();
                        that._setSize($(that.element).find('table')); /*that._loadPageThumb($('.pagi-holder'),(totalPage-(config._paginationSize>totalPage?totalPage:config._paginationSize)),totalPage,that._totalPage());*/
                        that._loadPageThumb($(that.element).find('.pagi-holder'), ((totalPage % config._paginationSize !== 0 ? totalPage - (totalPage % config._paginationSize) + config._paginationSize : totalPage) - (config._paginationSize > totalPage ? totalPage : config._paginationSize)), totalPage, that._totalPage())

                        $(that.element).closest('.grid-holder').find('div.pagi-holder div').removeClass('active');
                        $(that.element).closest('.grid-holder').find('div.pagi-holder div.page' + totalPage).addClass('active');

                        $(that.element).find('div.pagination #next,div.pagination #last').addClass('disabled');
                        $(that.element).find('div.pagination #first,div.pagination #prev').removeClass('disabled');

                    }
                    break;
                case 'next':
                    if (totalPage > currentPage) {
                        $(that.element).closest('.grid-holder').find('div.pagi-holder div').removeClass('active');

                        currentPage += 1;
                        $(that.element).closest('.grid-holder').find('div.pagi-holder div.page' + currentPage).addClass('active');
                        config.start = (currentPage * sibleSize) - sibleSize;
                        config.end = config.start + sibleSize - 1;

                        //console.log(config.start + '-NEXT-' + config.end);
                        $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                        $(that.element).find('tbody tr').remove();
                        that._createBody();
                        that._columnSum();
                        that._setSize($(that.element).find('table'));
                        if (currentPage % config._paginationSize == 1) {
                            that._loadPageThumb($(that.element).find('.pagi-holder'), (currentPage - 1), (currentPage + config._paginationSize - 1), that._totalPage());
                        }
                        if (totalPage == currentPage) {
                            $(that.element).find('div.pagination #next,div.pagination #last').addClass('disabled');
                            $(that.element).find('div.pagination #first,div.pagination #prev').removeClass('disabled');
                        }

                    }
                    break;
                default:
                    $(that.element).closest('.grid-holder').find('div.pagi-holder div').removeClass('active');

                    if (!$(className).hasClass('bally-datagrid-pagiMore')) {
                        $(className).addClass('active');
                    } else {
                        if ($(that.element).closest('.grid-holder').find('div.pagi-holder div:eq(0)').hasClass('bally-datagrid-pagiMore')) {
                            $(that.element).closest('.grid-holder').find('div.pagi-holder div:eq(1)').addClass('active');
                        } else {
                            $(that.element).closest('.grid-holder').find('div.pagi-holder div:eq(0)').addClass('active');
                        }
                    }
                    config.start = ((parseInt($(className).text())) * sibleSize) - sibleSize;
                    config.end = config.start + sibleSize - 1;
                    //console.log(config.start + '-JUMB-' + config.end);
                    $(that.element).find("th input[type='checkbox'].selectallrow").prop('checked', false);
                    $(that.element).find('tbody tr').remove();
                    that._createBody();
                    that._columnSum();
                    that._setSize($(that.element).find('table'));
                    if ((parseInt($(className).text())) == 1) {
                        $(that.element).find('div.pagination #first,div.pagination #prev').addClass('disabled');
                        $(that.element).find('div.pagination #next,div.pagination #last').removeClass('disabled');
                    } else if (that.options.data.url.length <= ((parseInt($(className).text())) * that.options.pagesize)) {
                        $(that.element).find('div.pagination #next,div.pagination #last').addClass('disabled');
                        $(that.element).find('div.pagination #first,div.pagination #prev').removeClass('disabled');
                    } else {
                        $(that.element).find('div.pagination #next,div.pagination #last, div.pagination #first,div.pagination #prev').removeClass('disabled');
                    }
                    break;
            }
        },
        _createHeader: function () {
            var that = this,
                config = that.options;
            var myFunc = function (event) {
                event.stopPropagation();
                // execute a bunch of action to preform
            }
            $(that.element).find('thead').append('<tr></tr>');
            if (config.selectBox) {

                $(that.element).find('thead tr').append('<th class="selectbox">' + config.ipTemp['checkbox'] + '</th>').find('input').addClass('selectallrow').bind('change', function () {

                    if ($(this).prop('checked')) {
                        $(that.element).find('thead tr:first-child th').not('.selectbox').addClass('eventOff').css('pointer-events', 'none');
                    }
                    else {
                        $(that.element).find('thead tr:first-child th').not('.selectbox').removeClass('eventOff').css('pointer-events', 'auto');
                    }
                    that._bindrowselection(this);

                    that.getTotalNumSelectedRow();
                });
            }
            $.each(config.columns, function (i, c) {
                $('<th />', {
                    text: c.title ? c.title : c.field
                }).prop('title', c.title ? c.title : c.field).addClass(c.sort ? 'cursorPoint' : '').data('sort', c.sort ? true : false).data('sorttype', c.sort ? c.sorttype : '').bind('click', function (e) {
                    if (c.sort && that.options.data.url.length > 0) {
                        /*status.sort(function(a,b) {
							return a.val - b.val;
						});
						var d=config.data.url;
						d.sort(function(a,b) {
							return a[c.field] - b[c.field];
						});*/
                        $(that.element).find('p.noRecords').remove();
                        that._doSort(this, c.field);
                    }
                }).appendTo($(that.element).find('thead tr'));
            });
            if (config.columnSwap) {
                $(that.element).find('thead tr:first').find('th').not('.selectbox').hover(function () {
                    var _cellIndex = $(this).index();
                    $(this).append('<button title="Move Left" data-swap="left" class="columnswap swapleft"></button><button title="Move Right" data-swap="right" class="columnswap swapright"></button>');

                    if ((config.selectBox && _cellIndex == 1) || (!config.selectBox && _cellIndex == 0)) {
                        $(this).find('.swapleft').hide();
                    }

                    if (_cellIndex == ($(that.element).find('tr:first th').length - 1)) {
                        $(this).find('.swapright').hide();
                    }

                    $(this).find('.columnswap').on('click', function (e) {
                        var currentScroll = $(that.element).scrollLeft();
                        that._swapColumn($(this).data('swap'), $(this).closest('th').index());
                        $(that.element).scrollLeft(currentScroll);
                        return false;
                    });
                }, function () {
                    $(this).find('.columnswap').remove();
                });
            }
        },
        _swapColumn: function (direction, currentindex) {
            var rows = $('tr', $(this.element).find('table')), cols, _from = currentindex, _to = (direction == 'right' ? (currentindex + 1) : (currentindex - 1));
            /*rows.each(function(){
				cols=$(this).children('th,td');
				if(direction=='right')
					cols.eq(_from).detach().insertAfter(cols.eq(_to));
				else
					cols.eq(_from).detach().insertBefore(cols.eq(_to));
			});*/
            /*Extending _underscore*/
            _.mixin({
                moveobj: function (array, fromindex, toindex) {
                    array.splice(toindex, 0, array.splice(fromindex, 1)[0]);
                    return array;
                }
            });
            /*End*/
            var sortedObj = _(this.options.columns).moveobj(this.options.selectBox ? (_from - 1) : _from, this.options.selectBox ? (_to - 1) : _to);
            this.updatecolumns(sortedObj);
            //this._setSize();
        },
        _doSort: function (el, sortby) {

            $(el).parent().parent().find('tr').eq(1).find('[type="search"]').val('');
            $(el).parent().parent().find('tr').eq(1).find('.SearchClear').css({ 'visibility': 'hidden' });

            var hasSort = $(el).data('sortEnabled'),
                sorttype = $(el).data('sorttype'),
                d = this.options.data.url,
                config = this.options;
            if (!hasSort) {
                $(el).closest('tr').find('th').removeClass('sort-decend').removeClass('sort-ascend');
                $(el).addClass('sort-ascend');
                if (sorttype === "number") {
                    d.sort(function (a, b) {
                        if (sortby.toUpperCase() === 'DATE' || sortby.toUpperCase() === 'DATE1' || sortby.toUpperCase() === 'DATETIME' || sortby.toUpperCase() === 'DATETIME1' || sortby.toUpperCase() === 'TIME' || sortby.toUpperCase() === 'TIME1') {
                            //return new Date(a[sortby]) > new Date(b[sortby]);
                            return ((new Date(a[sortby]) * 1000) - (new Date(b[sortby]) * 1000));
                        } else {
                            return a[sortby] - b[sortby];
                        }
                    });
                } else {
                    d.sort(function (a, b) {
                        //if (a[sortby] === b[sortby]) {
                        //    return 0;
                        //}
                        //return a[sortby] > b[sortby] ? 1 : -1;
                        if (a[sortby] == null)
                            a[sortby] = "";
                        if (b[sortby] == null)
                            b[sortby] = "";
                        if (typeof (a[sortby]) == 'object') {
                            return a[sortby][0].toUpperCase().localeCompare(b[sortby][0].toUpperCase());
                        }
                        else {
                            return a[sortby].toUpperCase().localeCompare(b[sortby].toUpperCase());
                        }
                    });

                }
                $(el).parent().find('th').data('sortEnabled', false);
                $(el).data('sortEnabled', true);
            } else {
                //$(el).closest('tr').find('th').removeClass('sort-ascend');
                //$(el).addClass('sort-decend');
                if ($(el).hasClass('sort-ascend')) {
                    $(el).closest('tr').find('th').removeClass('sort-ascend');
                    $(el).addClass('sort-decend');
                } else {
                    $(el).closest('tr').find('th').removeClass('sort-decend');
                    $(el).addClass('sort-ascend');
                }
                d.reverse();
            }

            $(this.element).find('tbody tr').remove();
            if (this.options.pagination) {
                var _currentpage = parseInt($(this.element).find('div.pagi-holder div.active').text());
                if (!isNaN(_currentpage)) {
                    this.options.start = (_currentpage * this.options.pagesize) - this.options.pagesize;
                    this.options.end = this.options.start + this.options.pagesize;
                }
            }

            if (config.groupBy && config.groupBy !== "") {
                config._avilGroups = [];
                $.each(config.data.url, function (i, list) {
                    if (config._avilGroups.indexOf(list[config.groupBy]) === -1) {
                        config._avilGroups.push(list[config.groupBy]);
                    }
                });
            }
            //config.end = config.start + config.pagesize;
            //config.start = config.end - (config.start + 1);
            if (config.pagination) {
                config.end -= 1
            } else {
                config.start = 0;
            }

            if (isNaN(parseInt($(this.element).find('div.pagi-holder div.active').text())) && config.pagination) {
                config.end = config.start;
                config.start = 0;
            }

            //config.end -= 1;
            //if (!config.pagination) {
            //    config.start = config.end - config.start;
            //}
            this._createBody();
            this._columnSum();
            this._setSize($(this.element).find('table'));
        },
        _createBody: function () {
            var that = this,
                config = that.options;
            //Math.round(+new Date(d['Date'])/1000);
            if (!config.ValueMemberId || config.ValueMemberId === "") {
                config.ValueMemberId = "dummyID";
            }
            if (!config.groupBy || config.groupBy === "") {
                $.each(config.data.url, function (di, d) {

                    if (config.ValueMemberId === "dummyID") {
                        d["dummyID"] = di;
                    }

                    if (di >= config.start && di <= config.end) {
                        $('<tr />', {
                            id: 'row' + d[config.ValueMemberId]
                        }).data('rowid', d[config.ValueMemberId]).appendTo($(that.element).find('tbody'));

                        if (config.status) {
                            if (d[config.status.field] === config.status.value) {
                                $(that.element).find('table tr#' + 'row' + d[config.ValueMemberId]).addClass('highlight');
                            }
                        }

                        $.each(config.columns, function (i, c) {
                            var hasEditor = false;
                            var isDateTimeField = false;
                            if (c.editor && c.editor.type && c.editor.type !== "")
                                hasEditor = true;
                            if (config.selectBox && i == 0) {
                                $(that.element).find('tbody tr#row' + d[config.ValueMemberId]).append('<td class="selectbox">' + config.ipTemp['checkbox'] + '</td>').find('input').addClass('selectrow').bind('change', function () {
                                    if ($(that.element).find('tbody tr input:checked').length > 0) {
                                        $(that.element).find('thead tr:first-child th').not('.selectbox').addClass('eventOff').css('pointer-events', 'none');
                                    }
                                    else {
                                        $(that.element).find('thead tr:first-child th').not('.selectbox').removeClass('eventOff').css('pointer-events', 'auto');
                                    }
                                    that._bindrowselection(this);
                                });
                            }
                            if (c.field.toUpperCase() == "DATE" || c.field.toUpperCase() == "DATETIME" || c.field.toUpperCase() == "DATETIME1" || c.field.toUpperCase() == "TIME")
                                isDateTimeField = true;
                            /*('title', c.field.toUpperCase() === "STATUS" ? d[c.field][1] : isDateTimeField ? that._ts(d[c.field], c.field.toUpperCase(), c.format) : d[c.field])*/
                            $('<td />', {
                                html: !hasEditor ? (isDateTimeField ? that._ts(d[c.field], c.field.toUpperCase(), c.format) : that._globalizeNumber(d[c.field], c)) : that._traceIP(c, d, d[c.field], d[config.ValueMemberId]),
                                //'html': !hasEditor? that._globalizeNumber(config.data.url[i][c.field], c) : (!hasEditor ? that._globalizeNumber(config.data.url[i][c.field], c) : that._traceIP(c,d,d[c.field],d[config.ValueMemberId])),
                                'align': c.align ? c.align : 'left'
                            }).css('text-align', c.align ? c.align : 'left').prop('title', c.editor ? '' : d[c.field]).data('column', c.field).data('formula', !c.formula ? '' : c.formula).data('decimalLength', !!!c.editor ? '' : (c.editor.decimalLength ? c.editor.decimalLength : '')).data('integerLength', !!!c.editor ? '' : (c.editor.integerLength ? c.editor.integerLength : '')).appendTo($(that.element).find('tbody tr#row' + d[config.ValueMemberId]));
                        });
                        config.start = di;
                    }
                });
                if (config.start === config.end && config.pagination) {
                    config.end = config.start + config.pagesize;
                }
            } else {
                var _data = config.data.url;
                $.each(config._avilGroups, function (i, g) {
                    if (i >= config.start && i <= config.end) {
                        var _g = _data.filter(function (list) {
                            return list[config.groupBy] === config._avilGroups[i]
                        });
                        $('<tr />', {
                            id: 'group' + i,
                            'class': 'groupTitle'
                        }).appendTo($(that.element).find('tbody')).append($("<td />", {
                            text: g,
                            "colspan": $(that.element).find('table thead tr th').length
                        })).bind('click', function () {
                            var _activeGroup = $(this).attr('id');
                            $(this).find('td').toggleClass('down');
                            $(this).parent().find('tr.' + _activeGroup).toggleClass('grouper');
                        }).find('td').addClass('groupTitle').addClass(i === 0 ? 'down' : '');

                        //Coldata
                        $.each(config.data.url, function (di, d) {
                            if (config.ValueMemberId === "dummyID") {
                                d["dummyID"] = di;
                            }
                            if (d[config.groupBy] == g) {
                                $('<tr />', {
                                    id: 'row' + d[config.ValueMemberId]
                                }).data('rowid', d[config.ValueMemberId]).addClass(i == 0 ? 'group' + i : 'grouper group' + i).appendTo($(that.element).find('tbody'));
                                $.each(config.columns, function (i, c) {
                                    var hasEditor = false;
                                    if (c.editor && c.editor.type && c.editor.type !== "")
                                        hasEditor = true;
                                    if (config.selectBox && i == 0) {
                                        $(that.element).find('tbody tr#row' + d[config.ValueMemberId]).append('<td class="selectbox">' + config.ipTemp['checkbox'] + '</td>').find('input').addClass('selectrow').bind('change', function () {
                                            that._bindrowselection(this);
                                        });
                                    }
                                    $('<td />', {
                                        html: !hasEditor ? d[c.field] : that._traceIP(c, d, d[c.field], d[config.ValueMemberId]),
                                        //'html': !hasEditor? that._globalizeNumber(config.data.url[i][c.field], c) : (!hasEditor ? that._globalizeNumber(config.data.url[i][c.field], c) : that._traceIP(c,d,d[c.field],d[config.ValueMemberId])),
                                        'align': c.align ? c.align : 'left'
                                    }).css('text-align', c.align ? c.align : 'left').prop('title', c.field.toUpperCase() === 'STATUS' ? d[c.field][1] : d[c.field]).data('column', c.field).data('formula', !c.formula ? '' : c.formula).data('decimalLength', !!!c.editor ? '' : (c.editor.decimalLength ? c.editor.decimalLength : '')).data('integerLength', !!!c.editor ? '' : (c.editor.integerLength ? c.editor.integerLength : '')).appendTo($(that.element).find('tbody tr#row' + d[config.ValueMemberId]));
                                });
                            }
                        });
                        //End
                    }
                });
                if (config.start === config.end && config.pagination) {
                    config.end = config.start + config.pagesize;
                }
            }

            if (!config.selectBox) {
                $(that.element).find('tbody tr').not('tr.groupTitle').bind('click', function (e) {

                    if (e.target.localName == "td") {

                        var hasSelection = $(this).find('td').hasClass('bally-selected-row');
                        $(that.element).find('tbody tr td').not('.bally-diabled-row').removeClass('bally-selected-row').parent().removeClass('selected');
                        $(this).find('td').toggleClass('bally-selected-row').parent().toggleClass('selected');
                        $('input#' + config.hiddenId).val($(this).data("rowid"));


                        var selectedrid = $(this).find('td').closest('tbody').find('tr.selected').data('rowid');
                        var _rowdata = _.filter(config.data.url, function (rv) { return rv[config.ValueMemberId] == selectedrid });

                        config.onRowSelection($(this).find('td').closest('tbody').find('tr.selected').data('rowid'), _rowdata, $(this).find('td').closest('tbody').find('tr.selected input.selectrow').prop('checked'));
                    }
                    //Show the total numbar of row selected.
                    setTimeout(function () {
                        that.getTotalNumSelectedRow();
                    }, 100);

                    //Initiate KeyBoard Navigation.
                    //_startRow = $(this).attr('id');
                    //that._navigateThroughKeyBoard(_startRow);
                });
            }
            //New Double Click Bind to single select row datagrid
            if (!config.selectBox) {
                $(that.element).find('tbody tr').not('tr.groupTitle').bind('dblclick', function (e) {
                    var selectedrid = $(this).find('td').closest('tbody').find('tr.selected').data('rowid');
                    var _rowdata = _.filter(config.data.url, function (rv) { return rv[config.ValueMemberId] == selectedrid });
                    config.onDoubleClickRowSelection($(this).find('td').closest('tbody').find('tr.selected').data('rowid'), _rowdata, $(this).find('td').closest('tbody').find('tr.selected input.selectrow').prop('checked'));
                });
            }
            //New Multi Row selection on single click of row.
            if (config.selectBox) {
                $(that.element).find('tbody tr').not('tr.groupTitle').bind('click', function (e) {
                    if (e.target.localName == "td") {

                        var hasSelection = $(this).find('td').hasClass('bally-selected-row');

                        //$(this).find('td').toggleClass('bally-selected-row').parent().toggleClass('selected');
                        if (hasSelection) {
                            $(this).find('input[type="checkbox"].selectrow').prop('checked', false);
                        } else {
                            $(this).find('input[type="checkbox"].selectrow').prop('checked', true);
                        }
                        that._bindrowselection($(this).find('input[type="checkbox"].selectrow'));
                    }
                    //Show the total numbar of row selected.
                    setTimeout(function () {
                        that.getTotalNumSelectedRow();
                    }, 100);

                    //Initiate KeyBoard Navigation.
                    //_startRow = $(this).attr('id');
                    //that._navigateThroughKeyBoard(_startRow);
                });
            }

            if (config.defaultselection && config.defaultselection !== "") {
                if (config.selectBox) {
                    $.each(config.defaultselection, function (i, v) {
                        $(that.element).find('tbody tr#row' + v + " td").addClass('bally-selected-row').find('input[type="checkbox"].selectrow').prop('checked', true);
                    });
                } else {
                    $(that.element).find('tbody tr#row' + config.defaultselection[0] + " td").addClass('bally-selected-row');
                    $(that.element).find('tbody tr#row' + config.defaultselection[0]).addClass('selected');
                }
            }

            if (config.selectBox && config._selectedArr && config._selectedArr.length !== 0) {
                var _trAll = $(that.element).find('tbody tr');
                var _checked = 0;
                $.each(_trAll, function (i, row) {
                    var rowid = $(row).data('rowid');
                    var rowIndex = config._selectedArr.indexOf(rowid);
                    if (rowIndex !== -1) {
                        $(row).find('input[type="checkbox"].selectrow').prop('checked', true);
                        $(row).find('td').addClass('bally-selected-row');
                        _checked += 1;
                    }
                });
                if (_trAll.length === _checked) {
                    $(that.element).find('input[type="checkbox"].selectallrow').prop('checked', true);
                }
            }
            if (config.disabled && config.disabled !== "") {
                $.each(config.disabled, function (i, v) {
                    $(that.element).find('tbody tr#row' + v + " td").addClass('bally-diabled-row').find('input,select').prop('disabled', true);
                    $(that.element).find('tbody tr#row' + v + " td").addClass('bally-diabled-row').find('select').closest('div').addClass('bally-combobox-disabled');
                    if (config.selectBox) {
                        $(that.element).find('tbody tr#row' + v + " td").addClass('bally-selected-row').find('input[type="checkbox"].selectrow').addClass('bally-disabled-checkbox');
                    }
                });
            }
        },
        _ts: function (tsv, type, format) {
            var d = new Date(tsv);
            //t.format('dd/mm/yyyy hh:MM')
            if (type == "DATE") {
                return Globalize.format(d, 'd');
            } else if (type == "DATETIME" || type == "DATETIME1") {
                var _d = Globalize.format(d, 'd'),
                    _t = Globalize.format(d, 't');
                return _d + " " + _t;
            } else {
                return Globalize.format(d, 't')
            }
        },
        _createFooter: function () {
            var that = this;
            var hascolsum = _.where(that.options.columns, { columnsum: true });
            if (hascolsum.length > 0) {
                $('<tr />', {
                    'id': 'columnsum'
                }).css('display', that.options.footer ? 'block' : 'none').appendTo($(this.element).find('table tfoot'));
                $.each(this.options.columns, function (i, n) {
                    if (that.options.selectBox && i === 0) {
                        $('<td />', {}).appendTo($(that.element).find('table tfoot tr#columnsum'));
                    }
                    $('<td />', {
                        'text': !!!n.foottext ? "" : n.foottext,
                        'align': !!!n.align ? 'center' : n.align
                    }).data('column', n.field).appendTo($(that.element).find('table tfoot tr#columnsum'));
                });
                that._columnSum();
            }
        },
        _columnSum: function () {
            var opt = this;
            $.each(opt.options.columns, function (i, c) {
                if (opt.options.selectBox) {
                    i += 1;
                }
                if (c.columnsum) {
                    var picProperty = $(opt.element).find('table tfoot td').eq(i),
                        sumVal = 0;

                    //--
                    var _currentData = [];

                    var activeRowToAppend = $(opt.element).find('tbody tr').length;

                    s = opt.options.start - (activeRowToAppend < opt.options.pagesize ? activeRowToAppend : opt.options.pagesize) + 1,
                    e = s + (activeRowToAppend < opt.options.pagesize ? activeRowToAppend : opt.options.pagesize) - 1;

                    if (!opt.options.groupBy || opt.options.groupBy === "") {
                        $.each(opt.options.data.url, function (di, d) {
                            if (di >= s && di <= e) {
                                _currentData.push(d);
                            }
                        });
                    } else {
                        var _activeGroup = $(opt.element).find('tbody tr.groupTitle');
                        $.each(_activeGroup, function (i, r) {
                            var _g = $(r).find('td').text();
                            var _l = opt.options.data.url.filter(function (list) {
                                return list[opt.options.groupBy] === _g
                            })
                            $.each(_l, function (j, rd) {
                                _currentData.push(rd);
                            });
                        });
                    }
                    //--

                    $.each(_currentData, function (itx, item) {
                        sumVal += parseFloat(item[c.field]);
                    });
                    //picProperty.text(opt._globalizeNumber(sumVal.toFixed(!!!c.editor ? '' : (c.editor.decimalLength ? c.editor.decimalLength : '')), c));
                    picProperty.text(opt._globalizeNumber(sumVal, c));
                    sumVal = 0;
                }
            });
            //$.each($(this.element).find('table tfoot tr td'), function (i, c) {});
        },
        _globalizeNumber: function (value, obj) {

            var currency = obj.currency;
            var that = this,
                config = that.options;
            if (config.lang && config.lang !== "" && currency) {

                if (!Globalize.cultures[config.lang]) {
                    config.lang = "en-US"
                }

                var num;
                try {
                    num = Globalize.parseFloat(value);
                } catch (e) {
                    num = parseFloat(value);
                }

                var sym;
                if (Globalize.cultures[config.lang]) {
                    sym = Globalize.cultures[config.lang]['numberFormat']['currency'].symbol
                } else {
                    sym = Globalize.cultures['default']['numberFormat']['currency'].symbol;
                    config.lang = Globalize.cultures['default'];
                }

                $.each($(that.element).find('table th'), function (i, v) {
                    if (($(v).data('columnField') === obj.field) && !$(v).find('span').hasClass('symbol')) {
                        var hasText = $(v).text();
                        return $(v).html(hasText + '<span class="symbol">(' + sym + ')</span>');
                    }
                });
                //Globalize.culture(config.lang);
                //var _pattVal = Globalize.format(num, 'c');
                var _pattVal = Globalize.format(num, 'n2');
                _pattVal = _pattVal.replace(Globalize.cultures[config.lang]['numberFormat']['currency'].symbol, '');
                var _dotOperator = Globalize.cultures[config.lang]['numberFormat']['.'],
                    _commaOperator = Globalize.cultures[config.lang]['numberFormat'][','];

                if (_pattVal.indexOf(_dotOperator) > -1) {
                    _p = _pattVal.split(_dotOperator);
                    if (_p[1].length === 1) {
                        _p[1] += '0'
                    } else if (_p[1] > 2) {
                        _p[1] = _p[1].substr(0, 2);
                    }
                    return _p[0] + '' + _dotOperator + '' + _p[1];
                } else {
                    return isNaN(_pattVal) ? (_pattVal + '' + _dotOperator + '00') : value;
                }
            } else {
                return value;
            }
        },
        _traceIP: function (c, d, v, rid) {
            var that = this,
                config = that.options,
                editor = c.editor,
                temp = config.ipTemp,
                wrap = $(temp[editor.type]),
                isCheck;
            switch (editor.type) {
                case 'label':
                    if (v === 'NA')
                        return v;
                    else {
                        /*return (parseFloat(v)).FormatNumber();*/
                        if (!isNaN(parseFloat(v))) {
                            return that._globalizeNumber(v, c);
                        } else {
                            return v;
                        }
                    }
                case 'number':
                    //var disbaledVal = !d[editor.disable] ? (typeof (editor.disable) === "boolean" ? (!editor.isEditable ? false : true) : false) : d[editor.disable];
                    var disbaledVal = !editor.isEditable ? true : (!d[editor.disable] ? (typeof (editor.disable) === "boolean" ? editor.disable : false) : d[editor.disable]);
                    $(wrap).prop('readOnly', editor.isEditable ? false : true).prop('disabled', disbaledVal);
                    wrap.bind('keyup change', function (e) {
                        that._bindinput(this, that, c, rid, e);
                    });
                    if (v === 'NA')
                        return v
                    else
                        return wrap.val(parseFloat(v).toFixed(editor.decimalLength ? editor.decimalLength : ''));
                case 'text':
                    //var disbaledVal = !d[editor.disable] ? (typeof (editor.disable) === "boolean" ? (editor.isEditable ? false : true) : false) : d[editor.disable];
                    var disbaledVal = !editor.isEditable ? true : (!d[editor.disable] ? (typeof (editor.disable) === "boolean" ? editor.disable : false) : d[editor.disable]);
                    $(wrap).prop('maxlength', editor.maxlength).prop('readOnly', editor.isEditable ? false : true).prop('disabled', disbaledVal);
                    wrap.bind('keyup change', function (e) {
                        that._bindinput(this, that, c, rid, e);
                    });
                    return wrap.val(v);
                case 'password':
                    //var disbaledVal = !d[editor.disable] ? (typeof (editor.disable) === "boolean" ? (!editor.isEditable ? false : true) : false) : d[editor.disable];
                    var disbaledVal = !editor.isEditable ? true : (!d[editor.disable] ? (typeof (editor.disable) === "boolean" ? editor.disable : false) : d[editor.disable]);
                    $(wrap).prop('maxlength', editor.maxlength).prop('readOnly', editor.isEditable ? false : true).prop('disabled', disbaledVal);
                    wrap.bind('keyup change', function (e) {
                        that._bindinput(this, that, c, rid, e);
                    });
                    return wrap.val(v);
                case 'combobox':
                    var cid = "cbId" + new Date().getTime();
                    wrap.attr('id', cid).find('select').addClass(cid);

                    var _comboProperties = c.editor;

                    if (c.editor.propertyield && c.editor.propertyield !== "") {
                        _comboProperties = d[c.editor.propertyield];
                    }

                    //-----------------------------------------
                    $.each(_comboProperties.group, function (index, value) {
                        $('<option />', {
                            'html': value.label
                        }).prop('value', value.value).appendTo($(wrap).find('select.' + cid));
                    });
                    $(wrap).find('select.' + cid).combobox({
                        ComboHiddenID: cid + 'comboboxHiddenID',
                        iseditable: false,
                        placeholder: _comboProperties.displaytext ? _comboProperties.displaytext : '',
                        iscomborestunknownvalue: true,
                        selected: function (event, control) {
                            //control.item.label
                            $(wrap).data('selectedValue', control.item.label);
                            if (control.item.label) {
                                that._bindinput(wrap, that, c, rid);
                            }
                            if (that.options.comboChangeEvent != null && typeof (control.item.label) != 'undefined')
                                that.options.comboChangeEvent(this, control.item.label);
                        }
                    });
                    if (_comboProperties.defaultSelection && _comboProperties.defaultSelection !== "") {
                        $(wrap).find('select.' + cid + ' option').removeAttr("selected");
                        $(wrap).find('select.' + cid + ' option[value="' + _comboProperties.defaultSelection + '"]').attr("selected", "selected");
                        $(wrap).find('select.' + cid).combobox("refresh");
                    }
                    //--------------------------------

                    /*$(wrap).ballyComboBox({
                        HiddenID: "field",
                        width: "100%",
                        disable: that.options.disablevent ? true : (editor.disable ? d[editor.disable] : false),
                        DisplayText: editor.displaytext ? editor.displaytext : '',
                        SelecttedValue: v !== "" ? v : '',
                        Dataset: editor.group,
                        onchange: function (value, text) {
                            $(wrap).data('selectedValue', value);
                            that._bindinput(wrap, that, c, rid);
                        }
                    });*/
                    return wrap;
                case 'checkbox':
                    isCheck = (editor.options.on.toLowerCase() === v.toString().toLowerCase() ? true : false);
                    if (editor.status) {
                        wrap.append('<span class="statuslabel">' + editor.status[v] + '</span>');
                    }
                    wrap.find('input').prop('checked', isCheck).prop('readOnly', editor.isEditable ? false : true).prop('disabled', !d[
					editor.disable] ? false : d[editor.disable]).bind('change', function (e) {
					    that._bindinput(this, that, c, rid, e);
					});
                    return wrap;
                case 'radio':
                    isCheck = (editor.options.on.toLowerCase() === v.toLowerCase() ? true : false);
                    wrap.find('input').prop('checked', isCheck).bind('click', function (e) {
                        that._bindinput(this, that, c, rid, e);
                    });
                    return wrap;
                case 'switchbox':
                    return config.ipTemp[c.editor.type];
                case 'status':
                    if (v[0] !== "") {
                        wrap.html(v[1]).addClass(typeof (v[0]) == "boolean" ? (v[0] ? 'bally-status-label-true' : 'bally-status-label-false') : (v[0].toLowerCase() == "true" ? 'bally-status-label-true' : 'bally-status-label-false'));
                    }
                    return wrap;
                case 'action':
                    if (config.ActionBarButtons.length > 0) {
                        $.each(config.ActionBarButtons, function (i, b) {
                            $(wrap[0]).append('<button class="' + b[1] + '">' + b[0] + '</button>');
                        });
                        wrap.find('button').bind('click', function (e) {
                            that._bindinput(this, that, c, rid, e);
                        });
                        return wrap;
                    }
                case 'image':
                    var _extn = '.png'
                    if (editor.isBase64) {
                        _extn = "";
                        editor.imagepath = "";
                    }
                    $(wrap[0]).prop('width', editor.width ? editor.width : 25).prop('height', editor.height ? editor.height : 25).prop('src', editor.imagepath + '' + v + '' + _extn).prop('alt', editor.isBase64 ? '' : v);
                    //$(wrap[1]).html(v);
                    return wrap;
            }
        },
        _applyformula: function (that, activeRow, rowdata) {
            var cols = that.options.columns;
            $.each(cols, function (i, c) {
                if (c.formula) {
                    var currentNode = c.field;
                    //--
                    var formulaEXP = c.formula,
                        arithOPE = formulaEXP.replace(/[^-()\d/*+.]/g, '');
                    //--
                    var performWith = formulaEXP.split(arithOPE);

                    var pVal1 = rowdata[performWith[0]],
                        pVal2 = rowdata[performWith[1]],
                        newVal;
                    if ($.isNumeric(pVal1) && $.isNumeric(pVal2)) {
                        switch (arithOPE) {
                            case "+":
                                newVal = parseInt(pVal1) + parseInt(pVal2);
                                break;
                            case "-":
                                newVal = parseInt(pVal1) - parseInt(pVal2);
                                break;
                            case "*":
                                newVal = parseInt(pVal1) * parseInt(pVal2);
                                break;
                            case "/":
                                if (pVal1 === 0 && pVal2 > 0) {
                                    newVal = 0;
                                } else {
                                    newVal = parseInt(pVal1) / parseInt(pVal2);
                                }
                                break;
                        }
                        rowdata[currentNode] = newVal;
                        var _td = $(activeRow).find('td').not('td.selectbox')
                        $.each(_td, function (i, td) {
                            if ($(td).data('column') === currentNode) {
                                var _child = $(td).children();
                                if (_child.length > 0) {
                                    $(td).find('input').val(newVal)
                                } else {
                                    $(td).html(newVal)
                                }
                            }
                        });
                        that._columnSum();
                        that._updateDom(rowdata, activeRow);
                    }
                    //--
                }
            });
            //Check negative values
            $.each(rowdata, function (i, v) {
                if (v < 0) {
                    $(activeRow).addClass('alertClass');
                    return false;
                } else {
                    $(activeRow).removeClass('alertClass');
                }
            });
        },
        _bindinput: function (s, o, c, rid, ev) {
            var d = o.options.data.url,
                isCheck, activeEl, editor = c.editor;
            o.hasControl = !editor.controlto ? false : editor.controlto;
            var _d = d.filter(function (list) {
                return list[o.options.ValueMemberId] === rid
            });
            var _property = $(s).closest('td').data('column');
            var _activeRow = $(s).closest('tr');
            switch (editor.type) {
                case 'number':
                case 'text':
                case 'password':
                    o.userIP = $(s).val();
                    if (_d.length > 0) {
                        o._updateRawdata(_property, o.userIP, rid, o, _activeRow, editor.type);
                        var col = this.options.columns;
                        var hasformula = col.filter(function (column) {
                            return column['formula'] && column['formula'] !== ""
                        });
                        if (hasformula.length > 0) {
                            o._applyformula(o, _activeRow, _d[0]);
                        }
                    }
                    return false;
                case 'checkbox':
                case 'radio':
                    activeEl = $(s).parent().find("input[type='checkbox']");
                    isCheck = activeEl.is(":checked");
                    isCheck ? o.userIP = editor.options.on : o.userIP = editor.options.off;

                    if (editor.status) {
                        $(s).closest('span').find('.statuslabel').html(editor.status[isCheck ? 1 : 0]);
                    }
                    if (_d.length > 0) {
                        o._updateRawdata(_property, o.userIP, rid, o, _activeRow);
                        o._updateDom(_d[0], _activeRow);
                    }

                    if (o.hasControl) {
                        o._updateRawdata(o.hasControl, o.userIP, rid, o, _activeRow);
                        o._updateDom(_d[0], _activeRow);
                    }

                    return false;
                case 'combobox':
                    activeEl = $(s).find('select');
                    if (_d.length > 0) {
                        o.userIP = $(s).data('selectedValue');
                        if (editor.label === o.userIP) {
                            o.userIP = null;
                        }
                        var type = editor.type;
                        o._updateRawdata(_property, o.userIP, rid, o, _activeRow, type);
                    }
                    return false;
                case 'switchbox':
                    activeEl = $(s);
                    isCheck = activeEl.hasClass("checked");
                    isCheck ? o.userIP = editor.options.on : o.userIP = editor.options.off;
                    if (_d.length > 0) {
                        o._updateRawdata(_property, o.userIP, rid, o, _activeRow);

                    }
                    return false;
                case 'action':
                    o.options.onActionClick(_activeRow, rid, $(s).text());
                    return false;
            }
        },
        _updateRawdata: function (property, newVal, rowId, obj, activeRow, type) {
            var rawdata = obj.options.data.url;
            rawdata = rawdata.filter(function (list) {
                return list[obj.options.ValueMemberId] === rowId
            });
            rawdata[0][property] = parseFloat(newVal);
            if (isNaN(rawdata[0][property]) || type === "combobox" || type === "text" || type === "password") {
                rawdata[0][property] = newVal;
            }
            obj.options.afterRowChange(obj, rawdata, rowId, property, newVal, activeRow);
            obj.dataModified = true;
            obj._columnSum();
        },
        _updateDom: function (rowdata, activeRow) {
            var _widthHistory = [];
            $.each($(activeRow).find('td').not('.selectbox'), function (_index, _td) {
                _widthHistory.push($(_td).css('width'));
            });
            $(activeRow).find('td').not('.selectbox').remove();
            var that = this,
                config = that.options;
            var hasrowselect = false;
            if ($(activeRow).find('td input.selectrow').is(":checked")) {
                hasrowselect = true;
            }
            $.each(config.columns, function (i, c) {
                var hasEditor = false;
                if (c.editor && c.editor.type && c.editor.type !== "") {
                    hasEditor = true;
                }
                /*!hasEditor ? ( isDateTimeField ? that._ts(d[c.field], c.field.toUpperCase(), c.format) : that._globalizeNumber(d[c.field], c)) : that._traceIP(c, d, d[c.field], d[config.ValueMemberId])*/
                $('<td />', {
                    //html: !hasEditor ? rowdata[c.field] : that._traceIP(c, rowdata, rowdata[c.field], rowdata[config.ValueMemberId]),
                    html: !hasEditor ? (!c.currency ? rowdata[c.field] : that._globalizeNumber(rowdata[c.field], c)) : that._traceIP(c, rowdata, rowdata[c.field], rowdata[config.ValueMemberId]),
                    'align': c.align ? c.align : 'left'
                }).css('width', _widthHistory[i]).css('text-align', c.align ? c.align : 'left').data('column', c.field).addClass(hasrowselect ? 'bally-selected-row' : '').appendTo($(that.element).find('tbody tr#row' + rowdata[config.ValueMemberId]));
            });

        },
        _bindrowselection: function (self) {

            if ($(self).hasClass('selectrow')) {
                if ($(self).is(":checked")) {
                    $(self).closest('tr').addClass('selected');
                    $(self).closest('tr').find('td').addClass('bally-selected-row');
                    //--
                    if (this.options._selectedArr) {
                        this.options._selectedArr.push($(self).closest('tr').data('rowid'));
                    }
                    //--
                } else {
                    $(self).closest('tr').removeClass('selected');
                    $(self).closest('tr').find('td').removeClass('bally-selected-row');
                    //--
                    if (this.options._selectedArr) {
                        this.options._selectedArr.splice(this.options._selectedArr.indexOf($(self).closest('tr').data('rowid')), 1);
                    }
                    //--
                }

                var all = true,
                    _rip = $(this.element).find("table tbody tr:not([style='display: none;']) td input[type='checkbox'].selectrow").not('.bally-disabled-checkbox');
                var ms = $(this.element).find("table thead tr th input[type='checkbox'].selectallrow");
                $.each(_rip, function () {
                    if (this.checked === false) {
                        return all = false;
                    }
                });
                all ? ms.prop('checked', true) : ms.prop('checked', false);

            } else {
                if ($(self).is(":checked")) {

                    $(this.element).find("table tbody tr:not([style='display: none;']) td input[type='checkbox'].selectrow").not('.bally-disabled-checkbox').prop('checked', true).closest('tr:not([style="display: none;"])').addClass('selected').find('td').addClass('bally-selected-row');
                    //--
                    if (this.options._selectedArr) {
                        var _r = $(this.element).find("table tbody tr:not([style='display: none;'])");
                        var that = this;
                        $.each(_r, function (i, r) {
                            var _ID = $(r).data('rowid');
                            if (that.options._selectedArr.indexOf(_ID) === -1) {
                                that.options._selectedArr.push(_ID);
                            }
                        });
                    }
                    //console.log(that.options._selectedArr);
                    //--
                } else {
                    $(this.element).find("table tbody tr:not([style='display: none;']) td input[type='checkbox'].selectrow").prop('checked', false).closest('tr').removeClass('selected').find('td').removeClass('bally-selected-row');
                    //--
                    if (this.options._selectedArr) {
                        var _r = $(this.element).find("table tbody tr");
                        var that = this;
                        $.each(_r, function (i, r) {
                            var _ID = $(r).data('rowid');
                            if (that.options._selectedArr.indexOf(_ID) > -1) {
                                //array.splice(index, 1);
                                that.options._selectedArr.splice(that.options._selectedArr.indexOf(_ID), 1);
                            }
                        });
                    }
                    //console.log(that.options._selectedArr);
                    //--
                }
            }
            var _arr = [],
                _selected = $(this.element).find("table tbody tr td input[type='checkbox'].selectrow").filter(function (i, ip) {
                    return $(ip).is(":checked") === true
                });
            $.each(_selected, function (i, ip) {
                _arr.push($(ip).closest('tr').data('rowid'));
            });
            $('input#' + this.options.hiddenId).val(_arr.join(','));

            var _rowdata = [], _self = this;
            $.each(_arr, function (i, rid) {
                var _ro = _.filter(_self.options.data.url, function (rv) { return rv[_self.options.ValueMemberId] == rid });
                _rowdata.push(_ro[0]);
            });
            //rowid,rowdata,selected,rowids

            this.options.onRowSelection($(self).closest('tr').data('rowid'), _rowdata, $(self).prop('checked'), _arr.join(','));
            //if (_rowdata.length > 1) {
            //    $('.clear-Icon .bottom-appmenu').removeClass('disabled');
            //}
            //else {
            //    $('.clear-Icon .bottom-appmenu').addClass('disabled');
            //}
        },
        _inputlength: function () {
            this.dataModified = false;
            var that = this;
            $("input[data-type='number']").bind('keypress', function (evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                /*if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }*/
                if (charCode !== 46 && charCode !== 8 && charCode !== 37 && charCode !== 39 && charCode !== 0 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                if (charCode === 46) {
                    if ($(this).val().indexOf('.') > -1) {
                        return false;
                    }
                }
                //Decimal workaround
                var valuedecimal = $(this).parent().data('decimalLength'),
                    valueint = $(this).parent().data('integerLength');

                if (valuedecimal === "" && charCode === 46) {
                    return false
                }

                var hasFloatVal = $(this).val().indexOf('.') > -1 ? true : false,
                    newval = $(this).val().split('.');

                var startSellectedPos = $(this)[0].selectionStart;
                var endSelectedPos = $(this)[0].selectionEnd;

                if (charCode !== 37 && charCode !== 39) {
                    if (valueint) {
                        if (newval[0].length > valueint - 1) {
                            if (valueint && valueint !== "") {
                                if (!hasFloatVal) {
                                    if (newval[0].length >= valueint && charCode != 8 && charCode != 0 && charCode !== 46 && window.getSelection() == "") {
                                        return false
                                    }
                                } else {
                                    if (startSellectedPos === endSelectedPos && !hasFloatVal) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }

                    if (valuedecimal) {
                        if (newval[0].length > valueint - 1) {
                            if (valuedecimal && valuedecimal !== "") {
                                if (hasFloatVal) {
                                    if (startSellectedPos === endSelectedPos) {
                                        if (newval[1].length >= valuedecimal && charCode != 8 && charCode != 0 && window.getSelection() == "") {
                                            return false
                                        }
                                    }
                                }
                            }
                        } else {
                            if (startSellectedPos > newval[0].length && (endSelectedPos - startSellectedPos) !== parseInt(valuedecimal)) {
                                if (newval[1].length > valuedecimal - 1 && charCode !== 8) {
                                    return false
                                }
                            }
                        }
                    }
                }
                return true;
            }).bind('focusout', function () {
                if (that.dataModified) {
                    that.dataModified = false;
                }
            });
        },
        _setSize: function (table) {
            var that = this,
                config = that.options,
                _filter = config.filter,
                _selectBox = config.selectBox,
                _tblNodes = $(that.element).find('table').children(),
                _celPadding = parseInt($(_tblNodes[0]).find('tr:first th').css('padding-left')) + parseInt($(_tblNodes[0]).find('tr:first th').css('padding-right')) + parseInt($(_tblNodes[0]).find('tr:first th').css('border-width').split(' ')['1']),
                _colspan = _selectBox ? $(_tblNodes[0]).find('tr:first th').length - 1 : $(_tblNodes[0]).find('tr:first th').length,
                _pW = $(that.element).width(),
                _pH = $(table).parent().height(),//(config.footer ? 46 : 0)
                _headHeight = config.filter ? 65 : 32,
                _footHeight = config.pagination ? 50 : $(_tblNodes[2]).height(),
                _minCellWdith = 100,//Default cell MinWidth
                _hasScroll = false,
                _scrollWidth = 10,
                _tblLRTBborder = 2,
                _selectBoxSize = 20,
                _tableInfoHeight = 35,//Added for Table info paragraph.
                _tblSize = 0;
            //Getting header cell min text size as default
            var _thContentLengthArr = [];
            var _thMaxWidth = $.each($(_tblNodes[0]).find('tr:first th'), function (i, _th) {
                var $elem = $(_th),
                    _html = $elem.html();
                $('<span />', {
                    'id': 'thContentSize'
                }).html(_html).hide().appendTo(_th);
                $('#thContentSize').find('button').remove();
                _thContentLengthArr.push(parseInt($('#thContentSize').width()) + 21 + 10); //textlength+sorticonsize+buffer
                $(_th).find('#thContentSize').remove();
            });
            _minCellWdith = (_.min(_thContentLengthArr) > _minCellWdith ? _.min(_thContentLengthArr) : _minCellWdith);
            //$(that.element).find('table td,table th').css({
            //    "min-width": _minCellWdith+"px !important"
            //});
            //End

            //Calculating total fixed width in columns
            var _customCell = _.filter(config.columns, function (colObj) { return colObj.width; }),
           _customCellize = 0;
            if (_customCell.length > 0) {
                _customCellize = _.reduce(_customCell, function (memo, o) { return memo + (o.width > _minCellWdith ? o.width : _minCellWdith); }, 0)
            }
            //End

            //Seeting Max width to tBody
            $(_tblNodes[1]).css({
                'max-height': (_pH - (_headHeight + _footHeight + _tableInfoHeight)) - _tblLRTBborder
            });
            //End

            //Checking scroll avilability in tBody
            var _bodyHeight = ($(_tblNodes[1]).find('td').height() + _celPadding) * $(_tblNodes[1]).find('tr').length;
            if (_bodyHeight > (_pH - (_headHeight + _footHeight))) {
                _hasScroll = true;
            }
            //End

            //Equalized cell width
            if (!_selectBox) {
                cellWidth = Math.floor(((_pW + (_celPadding * _customCell.length)) - (_hasScroll ? _scrollWidth : 0) - (_celPadding * $(table).find('tr:first th').length) - _customCellize) / (_colspan - _customCell.length));
            } else {
                cellWidth = Math.floor(((_pW + (_celPadding * _customCell.length)) - (_hasScroll ? _scrollWidth : 0) - (_celPadding * $(table).find('tr:first th').length) - _selectBoxSize - _customCellize) / (_colspan - _customCell.length));
            }
            //End

            cellWidth = (cellWidth < _minCellWdith ? _minCellWdith : cellWidth);

            //tHead Sizing
            $.each($(_tblNodes[0]).find('tr'), function (i, _tr) {
                $.each($(_tr).find('th'), function (j, _th) {
                    var _col = config.columns;
                    var hasbox = $(_th).hasClass('selectbox');
                    if (!hasbox) {
                        var _flag = _selectBox ? 1 : 0;
                        if (_customCellize == 0) {
                            $(_th).width(cellWidth);
                        } else {
                            if (_col[j - _flag]) {
                                if (_col[j - _flag].width) {
                                    $(_th).addClass('definedWidth').width(_col[j - _flag].width > _minCellWdith ? (_col[j - _flag].width - _celPadding) : (_minCellWdith - _celPadding));
                                } else {
                                    $(_th).width(cellWidth);
                                }
                            }
                        }
                    } else {
                        $(_th).width(_selectBoxSize);
                    }
                    if ($(_tr).find('th').length === (j + 1)) {
                        if (_hasScroll) {
                            $(_th).width(cellWidth + _scrollWidth - 1);
                        } else {
                            $(_th).width(cellWidth - 1);
                        }
                    }
                    if (i == 0) {
                        var _actualCellWidth = $(_th).width() + parseInt($(_th).css('padding-left')) + parseInt($(_th).css('padding-right')) + parseInt($(_th).css('border-width').split(' ')['1']);
                        _tblSize += _actualCellWidth;
                    }
                    //if ($(_th).hasClass('cursorPoint')) {
                    //    $(_th).css({
                    //        'padding-right':'30px'
                    //    });
                    //}

                });

                if (i == 0) {
                    $(that.element).find('table').width(_tblSize);
                    if (config.data.url.length == 0) {
                        $(that.element).find('table td#noRecordsTd').width(_tblSize - 1);
                    }
                    _tblSize = 0;
                }
            });
            //End


            //tBody Sizing
            if (config.data.url.length > 0) {
                $.each($(_tblNodes[1]).find('tr'), function (i, _tr) {
                    $.each($(_tr).find('td'), function (j, _td) {
                        var _col = config.columns;
                        var hasbox = $(_td).hasClass('selectbox');
                        if (!hasbox) {
                            var _flag = _selectBox ? 1 : 0;
                            if (_customCellize == 0) {
                                $(_td).width(cellWidth);
                            } else {
                                if (_col[j - _flag]) {
                                    if (_col[j - _flag].width) {
                                        $(_td).addClass('definedWidth').width(_col[j - _flag].width > _minCellWdith ? (_col[j - _flag].width - _celPadding) : (_minCellWdith - _celPadding));
                                    } else {
                                        $(_td).width(cellWidth);
                                    }
                                }
                            }
                        } else {
                            $(_td).width(_selectBoxSize);
                        }
                        if ($(_tr).find('td').length === (j + 1)) {
                            $(_td).width(cellWidth - 1);
                        }
                    });
                });
                //if (config.groupBy && config.groupBy !== "") {
                //    $(_tblNodes[1]).find('tr.groupTitle').find('td').width(((cellWidth - _cellPad) * colspan) + 35);
                //}
            } else {
                $(_tblNodes[1]).empty();
                $('<tr />', {}).addClass('noRecords').append($('<td />', {
                    text: 'No Records Found',
                    'id': 'noRecordsTd',
                    'colspan': $(that.element).find('thead th').length,
                    'title': 'No Records Found'
                }).css('width', $(that.element).width() - 2)).appendTo($(_tblNodes[1]));
            }
            //tBody End
            //PopupSpecific
            //if (!config._rendered) {

            /*praba hide this line*/
            setTimeout(function () {
                //that._setSize($(that.element).find('table'));
                //config._rendered = true;

            }, 100);
            //}
            //Bind Vertical Scroll bar
            that.extenalScrollBind();
        },

        //New Row Click - Gaurav Kumar rana
        _rowClick: function (selectedRowId) {
            //alert(selectedRowId);
            var that = this;
            config = that.options;
            _selectedRowId = '#' + selectedRowId;
            if (!config.selectBox) {
                var hasSelection = $(_selectedRowId).find('td').hasClass('bally-selected-row');
                $(that.element).find('tbody tr td').not('.bally-diabled-row').removeClass('bally-selected-row').parent().removeClass('selected');
                $(_selectedRowId).find('td').toggleClass('bally-selected-row').parent().toggleClass('selected');
                $('input#' + config.hiddenId).val($(_selectedRowId).data("rowid"));

                var selectedrid = $(_selectedRowId).data('rowid');
                var _rowdata = _.filter(config.data.url, function (rv) { return rv[config.ValueMemberId] == selectedrid });
                config.onRowSelection($(that.element).find('tbody tr.selected').data('rowid'), _rowdata, $(that.element).find('tbody tr.selected input.selectrow').prop('checked'));
                setTimeout(function () {
                    that.getTotalNumSelectedRow();
                }, 100);
            }
            if (config.selectBox) {
                var hasSelection = $(_selectedRowId).find('td').hasClass('bally-selected-row');

                $(_selectedRowId).find('td').toggleClass('bally-selected-row').parent().toggleClass('selected');
                if (hasSelection) {
                    $(_selectedRowId).find('input[type="checkbox"].selectrow').prop('checked', false);
                } else {
                    $(_selectedRowId).find('input[type="checkbox"].selectrow').prop('checked', true);
                }
                that._bindrowselection($(_selectedRowId).find('input[type="checkbox"].selectrow'));
                setTimeout(function () {
                    that.getTotalNumSelectedRow();
                }, 100);
            }
        },

        //New KeyBoard Navigation - Gaurav Kumar Rana - Start
        _navigateThroughKeyBoard: function (_startRow) {

            var that = this,
            _currentRow = _startRow;
            _KEY_TAB = 9;
            _KEY_SPACE = 32;
            _KEY_END = 35;
            _KEY_HOME = 36;
            _KEY_LEFT = 37;
            _KEY_UP = 38;
            _KEY_RIGHT = 39;
            _KEY_DOWN = 40;
            _KEY_PAGEUP = 33;
            _KEY_PAGEDOWN = 34;
            _newScrollPos = 0;
            _newScrollLeftPos = 0;
            _containerHeight = 0;
            _animFlag = 0;
            _inFocus = false;

            $(document).find('table').attr('tabindex', '-1');
            $(that.element).find('table').attr('tabindex', '0');

            if (config.autoInitiatNav) {
                $(that.element).find('table tr:nth-child(2) th .bally-textbox').eq(0).focus();
            }



            $(that.element).off().keydown(function (e) {

                _presserKey = e.which;

                switch (_presserKey) {
                    case _KEY_DOWN:
                        e.preventDefault();

                        _dom = $('#' + _currentRow).nextUntil('tr:not([style="display: none;"])');
                        _len = _dom.length;
                        if (_len != 0) {
                            _currentRow = _dom.eq(_len - 1).attr('id');
                        }
                        _nextRow = $('#' + _currentRow).next().attr('id');




                        //if ($(that.element).find('table tbody tr td').find('input[type="search"]').attr('value') != '') {

                        //    _dom = $('#' + _currentRow).nextUntil('tr:not([style="display: none;"])');
                        //    _len = _dom.length;
                        //    if (_len != 0) {
                        //        _currentRow = _dom.eq(_len - 1).attr('id');
                        //    }
                        //    _nextRow = $('#' + _currentRow).next().attr('id');
                        //    //console.log(_currentRow);

                        //} else {
                        //    _nextRow = $('#' + _currentRow).next().attr('id');
                        //}

                        if (typeof _nextRow !== "undefined") {

                            _currentRow = _nextRow;
                            $(that.element).find('table tbody tr:not([style="display: none;"])').removeClass('hovered');
                            $('#' + _currentRow).addClass('hovered');

                            _hoveredTop = $('#' + _currentRow).position().top;
                            _bodyHeight = $(that.element).find('table tbody').height();

                            if (_hoveredTop > (_bodyHeight - 32)) {
                                _currentScrollPos = $(that.element).find('table tbody').scrollTop();
                                _newScrollPos = _currentScrollPos + $('#' + _currentRow).height();
                                $(that.element).find('table tbody').scrollTop(_newScrollPos);
                            } else {
                                //$(that.element).find('table tbody').scrollTop(0);
                            }
                        }
                        break;
                    case _KEY_UP:
                        e.preventDefault();

                        //_priviousRow = $('#' + _currentRow).prev().attr('id');


                        //if ($(that.element).find('table tbody tr td').find('input[type="search"]').attr('value') != '') {

                        //    _dom = $('#' + _currentRow).prevUntil('tr:not([style="display: none;"])');
                        //    _len = _dom.length;

                        //    if (_len != 0) {
                        //        _currentRow = _dom.eq(_len - 1).attr('id');
                        //    }

                        //    _priviousRow = $('#' + _currentRow).prev().attr('id');

                        //} else {
                        //    _priviousRow = $('#' + _currentRow).prev().attr('id');
                        //}

                        _dom = $('#' + _currentRow).prevUntil('tr:not([style="display: none;"])');
                        _len = _dom.length;
                        if (_len != 0) {
                            _currentRow = _dom.eq(_len - 1).attr('id');
                        }
                        _priviousRow = $('#' + _currentRow).prev().attr('id');

                        if (typeof _priviousRow !== "undefined") {
                            _currentRow = _priviousRow;

                            $(that.element).find('table tbody tr').removeClass('hovered');
                            $('#' + _currentRow).addClass('hovered');

                            _hoveredTop = $('#' + _currentRow).position().top;
                            _bodyHeight = $(that.element).find('table tbody').height();
                            _rowHeight = $('#' + _currentRow).height();
                            if (_hoveredTop < (_rowHeight - 32)) {
                                _currentScrollPos = $(that.element).find('table tbody').scrollTop();
                                _newScrollPos = _currentScrollPos - $('#' + _currentRow).height();
                                $(that.element).find('table tbody').scrollTop(_newScrollPos);
                            } else {
                                //$(that.element).find('table tbody').prop('scrollHeight');
                            }
                        }
                        break;
                    case _KEY_HOME:
                        //e.preventDefault();
                        $(that.element).find('table tbody').animate({ scrollTop: 0 }, 100);
                        _currentRow = $(that.element).find('table tbody tr:not([style="display: none;"])').eq(0).attr('id');
                        $(that.element).find('table tbody tr').removeClass('hovered');
                        $('#' + _currentRow).addClass('hovered');
                        break;
                    case _KEY_LEFT:
                        //e.preventDefault();
                        _newScrollLeftPos = $(that.element).scrollLeft() - 40;
                        $(that.element).scrollLeft(_newScrollLeftPos);
                        break;
                    case _KEY_RIGHT:
                        //e.preventDefault();
                        _newScrollLeftPos = $(that.element).scrollLeft() + 40;
                        $(that.element).scrollLeft(_newScrollLeftPos);
                        break;
                    case _KEY_END:
                        //e.preventDefault();
                        _scrollHeight = $(that.element).find('table tbody').prop('scrollHeight');
                        if (_animFlag == 0) {
                            _animFlag = 1;
                            $(that.element).find('table tbody').animate({ scrollTop: _scrollHeight }, 100, function () { _animFlag = 0; });
                        }
                        _totalrow = $(that.element).find('table tbody tr:not([style="display: none;"])');
                        _currentRow = _totalrow.eq(_totalrow.length - 1).attr('id');
                        $(that.element).find('table tbody tr').removeClass('hovered');
                        $('#' + _currentRow).addClass('hovered');
                        break;
                    case _KEY_SPACE:

                        if (e.ctrlKey) {
                            e.preventDefault();
                            that._rowClick(_currentRow);
                        };
                        break;
                    case _KEY_TAB:
                        setTimeout(function () {
                            that.scrollLeftMove()
                        }, 10);
                        break;
                    case _KEY_PAGEUP:
                        _bodyHeight = $(that.element).find('table tbody').height();
                        _currentScrollPos = $(that.element).find('table tbody').scrollTop();
                        _newScrollPos = _currentScrollPos - _bodyHeight;
                        $(that.element).find('table tbody').scrollTop(_newScrollPos);
                        break;
                    case _KEY_PAGEDOWN:
                        _bodyHeight = $(that.element).find('table tbody').height();
                        _currentScrollPos = $(that.element).find('table tbody').scrollTop();
                        _newScrollPos = _currentScrollPos + _bodyHeight;
                        $(that.element).find('table tbody').scrollTop(_newScrollPos);
                        break;

                    default:
                        //console.log('Pressed key is = ' + _presserKey);
                        break;
                }
            });

            $(that.element).find('table tr td').hover(function () {
                $(that.element).find('table tr').removeClass('hovered');
                $(this).parent().addClass('hovered');
                _currentRow = $(this).parent().attr('id');
            });

            $(document).bind('click.' + $(that.element).attr('id') + ' touchstart.' + $(that.element).attr('id'), function (e) {
                if (!$(that.element).parent().is(e.target) && !($(that.element).parent().find(e.target).length)) {
                    $(that.element).find('table').attr('tabindex', '-1');
                    $(document).unbind('click.' + $(that.element).attr('id') + ' touchstart.' + $(that.element).attr('id'));
                }
            });
        },
        //New KeyBoard Navigation - Gaurav Kumar Rana - End

        reload: function () {
            $(this.element).empty();
            if (this.options.data.url !== null) {
                this.init();
            }
        },
        setdataset: function (dataurl) {
            this.options.data.url = dataurl;
            this.reload();
        },
        updatecolumns: function (newCol) {
            this.options.columns = newCol;
            this.reload();
        },
        exportdata: function (filename) {
            var that = this,
               config = that.options;
            var bodydata;
            bodydata = '';
            var headerdata;
            headerdata = '';
            var rowdata;
            rowdata = ''
            //data = '<table><thead></thead><tbody></tbody><tfoot></tfoot></table>';
            $.each(config.columns, function (i, c) {
                if (c.title)
                { rowdata = rowdata + c.title + ","; }
                else
                { rowdata = rowdata + c.field + ","; }
            });
            headerdata = rowdata + "\n";
            $.each(config.data.url, function (di, d) {
                rowdata = '';
                $.each(config.columns, function (i, c) {
                    if (c.field.toUpperCase() == "DATE" || c.field.toUpperCase() == "DATETIME" || c.field.toUpperCase() == "DATETIME1" || c.field.toUpperCase() == "TIME") {
                        rowdata = rowdata + that._ts(d[c.field], c.field.toUpperCase(), c.format) + ",";
                    }
                    else if (d[c.field] == undefined)
                        rowdata = rowdata + ",";
                    else if (('' + d[c.field]).indexOf(",") >= 0)
                        rowdata = rowdata + '"' + d[c.field] + '",';
                    else if (c.field.toUpperCase() == "BARCODE" || c.field.toUpperCase() == "VOUCHER" || c.field.toUpperCase() == "TICKET")
                        rowdata = rowdata + "'" + ("" + d[c.field]).trim() + "',";
                    else
                        rowdata = rowdata + d[c.field] + ",";
                });
                rowdata = rowdata + '\n';
                bodydata = bodydata + rowdata;
            });
            data = headerdata + bodydata;
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);

            var link = document.createElement("a");
            link.setAttribute("href", csvData);
            link.setAttribute("download", filename + ".csv");
            link.click();
        },
        changeValueMemberId: function (newId) {
            this.options.ValueMemberId = newId;
            this.options.defaultselection = "";
            $(this.element).parent().find('input#' + this.options.hiddenId).val('');

        },
        getHiddenColumnData: function (dataRow) {
            var dataurl = this.options.data.url;
            var keyFieldName = this.options.ValueMemberId;
            var itemFound = $.grep(dataurl, function (item) {
                return (item[keyFieldName] === dataRow.keyVal)
            });
            if (itemFound && itemFound.length > 0)
                dataRow.HiddenColVal = itemFound[0][dataRow.HiddenCol];
        },

        //New Enhancement - Gaurav Kumar Rana  - Start
        extenalScrollBind: function () {
            var that = this;
            config = that.options;
            if (
                $(that.element).width() < $(that.element).prop('scrollWidth') &&
                $(that.element).find('table tbody').height() < $(that.element).find('table tbody').prop('scrollHeight')
                ) {

                if ($(that.element).parent().find('.tblScrollBind').length == 0) {
                    $(that.element).parent().append(externalScrol);
                }
                else {
                    $(that.element).parent().find('.tblScrollBind').remove();
                    $(that.element).parent().append(externalScrol);
                }
                $(that.element).parent().find('.tblScrollBind').css(
                    {
                        'top': $(that.element).find('table tbody').position().top,
                        'right': $(that.element).position().left,
                        'height': $(that.element).find('table tbody').height(),
                        'display': 'block'
                    });
                $(that.element).parent().find('.tblScrollBind .tblScrollBody').css(
                    {
                        'height': $(that.element).find('table tbody').prop('scrollHeight')
                    }
                );
                $(that.element).parent().find('.tblScrollBind').bind('scroll', function () {
                    _scrllPos = $(this).scrollTop();
                    $(that.element).find('table tbody').scrollTop(_scrllPos);
                });

                $(that.element).find('table tbody').scroll(function () {
                    _scrllPos1 = $(this).scrollTop();
                    $(that.element).parent().find('.tblScrollBind').scrollTop(_scrllPos1);
                });

                $(that.element).find('table tbody').on('mousewheel', function (event) {

                    var deltaX = event.originalEvent.wheelDeltaX;
                    var deltaY = event.originalEvent.wheelDeltaY;
                    _scrllPos1 = $(this).scrollTop();
                    var scrolledUp = deltaY < 0;
                    var scrolledDown = deltaY > 0;
                    if (scrolledUp) {
                        _scrllPos1 = _scrllPos1 + 100;
                        $(that.element).parent().find('.tblScrollBind').scrollTop(_scrllPos1);
                    }
                    if (scrolledDown) {
                        _scrllPos1 = _scrllPos1 - 100;
                        $(that.element).parent().find('.tblScrollBind').scrollTop(_scrllPos1);
                    }
                });
            } else {
                $(that.element).parent().find('.tblScrollBind').remove();
            }
        },
        scrollLeftMove: function () {
            var that = this;
            if ($(that.element).scrollLeft() == ($(that.element).prop('scrollWidth') - $(that.element).width())) {
                $(that.element).parent().find('.tblScrollBind').hide();
            } else {
                $(that.element).parent().find('.tblScrollBind').show();
            }
        },
        getTotalNumRow: function () {
            $(this.element).find('.totalNumRow').text('Total Rows : ' + $(this.element).find('table tbody tr:not(.noRecords)').length);
        },
        getTotalNumSelectedRow: function () {
            $(this.element).find('.totalSelRow').text('Selected Rows : ' + $(this.element).find('table tbody tr.selected').length);
        },
        getTotalNumFilteredRow: function (_filterNum) {
            _totalRow = $(this.element).find('table tbody tr:not(.noRecords)').length;
            _filteredrow = _totalRow - _filterNum;
            if (_totalRow == _filteredrow) {
                $(this.element).find('.totalFilteredRow').text('Filtered Rows : ' + _filterNum);
            } else {
                $(this.element).find('.totalFilteredRow').text('Filtered Rows : ' + _filteredrow);
            }
        },
        clearRowSelection: function (ListOfRowsId) {
            var that = this;
            if (ListOfRowsId !== undefined) {
                // argument passed and not undefined
                var ListOfRowsId = ListOfRowsId.split(',');
                $.each(ListOfRowsId, function (i, row) {
                    //console.log(row);
                    _row = 'row' + row;
                    that._rowClick(_row);
                });

            } else {
                // argument not passed or undefined
                var ListOfRowsId = $(this.element).parent().find('input#' + this.options.hiddenId).val();
                if (ListOfRowsId != '') {
                    ListOfRowsId = ListOfRowsId.split(',');
                    $.each(ListOfRowsId, function (i, row) {
                        //console.log(row);
                        _row = 'row' + row;
                        that._rowClick(_row);
                    });
                }
            }

        },
        activateNav: function () {
            if ($(this.element).find('table tbody tr.selected').length != 0) {
                _startRow = $(this.element).find('table tbody tr.selected').attr('id');
            }
            else if ($(this.element).find('table tbody tr.hovered').length != 0) {
                _startRow = $(this.element).find('table tbody tr.hovered').attr('id');
            }
            else if ($(this.element).find('table tbody tr.hovered').length == 0 && $(this.element).find('table tbody tr.selected').length == 0) {
                _startRow = $(this.element).find('table tbody tr:first-child').attr('id');
                $('#' + _startRow).addClass('hovered');
            }

            this._navigateThroughKeyBoard(_startRow);
        }
        //New Enhancement - Gaurav Kumar Rana  - End
    };
    // for multiple instantiations
    //jQuery Bally Editable DataGrid plugin Version-2
    //author: @RajeshPerumal
    $.fn[pluginName] = function (options) {
        if (typeof options === "string") {
            /*var args = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var plugin = $.data(this, 'plugin_' + pluginName);
                plugin[options].apply(plugin, args);
            });*/
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var plugin = $.data(this, 'plugin_' + pluginName);
                if (plugin[options]) {
                    plugin[options].apply(plugin, args);
                } else {
                    plugin['options'][options] = args[0];
                }
            });
        } else {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, window, document);
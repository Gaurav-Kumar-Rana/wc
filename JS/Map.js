;
(function ($, window, document, undefined) {
    //plugin defaults
    var pluginName = 'MapControl',
    defaults = {};

    // plugin constructor
    function Plugin(element, options) {

        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }


    Plugin.prototype = {
        init: function () {
            $('#ListContainer').empty();

            $('<ul></ul>').addClass('ListItem').appendTo('#ListContainer');

            var that = this;
            config = that.options;
            var _cityData = [], _countryCodeData = [], _stateCodeData = [], _ploatPoint = {}, _plotArea = {};
            //var fillColor = config.fillColor;
            _cityData = config.data.CityData;
            _stateCodeData = config.data.stateCode;
            _countryCodeData = config.data.countrycode;


            //List of Cities

            $.each(_cityData, function (key, value) {

                $('<li>', {
                    text: value.CityName
                }).attr('rel', value.id).addClass('lidata').prepend('<label id = "lbllist' + key + '">' + value.label + '</label>').appendTo('.ListItem');
            });

            //Highlight City
            $.each(_cityData, function (key, value) {

                _plot = {};
                _plot.latitude = eval(value.lat);
                _plot.longitude = eval(value.lon);
                _plot.tooltip = {
                    content: "<span><lable style='font-weight:600'>" + value.label + " </lable>" + value.CityName + "</span>"
                };
                _ploatPoint[value.id] = _plot;
            });

            //Highlight Area
            $.each(_stateCodeData, function (key, value) {

                _area = {};
                _area.attrs = { fill: 'rgb(0, 172, 172)' },
                _area.attrsHover = { fill: 'rgb(38, 166, 154)' }
                _plotArea[value] = _area;
            });
            //console.log(_plotArea);

            $(".mapcontainer").mapael({
                map: {
                    name: _countryCodeData,
                    defaultArea: {
                        attrs: {
                            fill: "rgb(241, 241, 241)",
                            stroke: "rgb(255, 255, 255)"
                        },
                        attrsHover: {
                            fill: "rgb(38, 166, 154)",
                            cursor: "pointer"
                        },
                        eventHandlers: {
                            click: function (e, id, mapElem, textElem) {
                                var newData = {
                                    'areas': {}
                                };
                                if (mapElem.originalAttrs.fill == "rgb(241, 241, 241)") {
                                    newData.areas[id] = {
                                        attrs: {
                                            fill: "rgb(38, 166, 154)"
                                        }
                                    };
                                } else {
                                    newData.areas[id] = {
                                        attrs: {
                                            fill: "rgb(241, 241, 241)"
                                        }
                                    };
                                }
                                $(".mapcontainer").trigger('update', [{ mapOptions: newData }]);
                            }
                        }
                    },
                    defaultPlot: {
                        type: "svg",
                        path: "M 7.5,0 C 2.48,0 0,3.5 0,7.81 0,12.12 7.5,22 7.5,22 7.5,22 15,12.13 15,7.81 15,3.49 12.52,0 7.5,0 Z",
                        width: 15,
                        height: 22,
                        attrs: {
                            fill: "#787878",
                            transform: "r0"
                        },
                        attrsHover: {
                            fill: "#ef5336",
                            transform: "...r0s2"
                        }
                    },
                    zoom: {
                        enabled: true,
                        maxLevel: 20
                    }
                },
                plots: _ploatPoint,
                areas: _plotArea,
            });

            $('.ListItem li').hover(function (e) {

                $(this).addClass('active');
                var _Ele = $(this).attr('rel');

                var plot = $('svg [data-id="' + _Ele + '"]');
                e = $.Event('mouseover');
                e.pageX = parseInt(plot.position().left);
                e.pageY = parseInt(plot.position().top);
                plot.trigger(e);


            }, function () {

                $(this).removeClass('active');
                var _Ele = $(this).attr('rel');

                $('svg [data-id="' + _Ele + '"]').trigger('mouseout');
            });

            _wid = $('#Mapcontainer').width();
            _hei = $('#Mapcontainer').height();
            if (_wid < _hei) {
                _wid = _wid;
                _hei = _wid * 0.8;
                _mar = ($('#Mapcontainer').width() - _wid) / 2;
                $('#Mapcontainer svg').css({ 'height': _hei, 'width': _wid, 'margin-left': _mar });
            } else if (_wid > _hei) {
                _wid = _wid;
                _hei = _hei * 0.96;
                $('#Mapcontainer svg').css({ 'height': _hei, 'width': _wid });
            }


        },

        colorChange: function (fillcolor) {
            //$(this.element).empty();
            //this.options.fillColor = fillcolor;
            //this.init();
        },
        loaddata: function (_data) {
            this.options.data = _data;
            this.init();
        },
        reload: function () {
            this.init();
        }
    }

    // for multiple instantiations and plugin invoker
    $.fn[pluginName] = function (options) {

        if (typeof options === "string") {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var plugin = $.data(this, 'plugin_' + pluginName);
                plugin[options].apply(plugin, args);
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
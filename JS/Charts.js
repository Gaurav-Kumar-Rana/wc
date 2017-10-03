;
(function ($, window, document, undefined) {
    //plugin defaults
    var pluginName = 'ChartControl',
    defaults = {};

    // plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
        this.barclick();
    }
    var arr = [];
    var plot;
    // Get the size of the container of the plot
    var barwidth = 0;

    Plugin.prototype = {
        init: function () {
            var xaxisCat = []; var yaxisCat = []; arr = [];
            var onlyMonth = 0;
            var that = this;
            var config = that.options.data;
            var Yaxis = config.maxCount;
            var numberOfDaysToAdd = config.numberOfDays;




            $.each(config.scheduledData, function (i, v) {
                yaxisCat.push(config.scheduledData[i].y)
                arr.push([
                    parseInt(v.y),
                    v.myData,
                    //color: v.color
                ]);

                //var onlyDate = v.myData.replace(/\s([A-z])\w+/g, '');
                var split = v.myData.split(" ");
                var onlyDay = split[0];
                if (i == 0) {
                    onlyMonth = split[1];
                } else {
                    if (!onlyMonth.includes(split[1])) {
                        onlyMonth = onlyMonth + '-' + split[1];
                    }
                }
                var onlyYear = split[2];
                xaxisCat.push([onlyDay]);
            });
            var XColor = [];
            for (var i = 0 ; i < xaxisCat.length; i++) {
                var todayDate = new Date();
                if (todayDate.getDate() == xaxisCat[i]) {
                    XColor.push("#26a69a");
                }

                else {
                    XColor.push("#cfcac4");
                }
            };
            //Bar Width Calculation
            barwidth = $(that.element).width();
            barwidth = (barwidth / numberOfDaysToAdd) - 10;
            if (plot) {
                plot.destroy();
            }
            plot = $.jqplot($(that.element).attr('id'), [yaxisCat], {
                animate: true,

                seriesColors: XColor,
                title: {
                    text: 'Scheduled Change List',
                    fontSize: '14px',
                    textAlign: 'left',
                    renderer: $.jqplot.DivTitleRenderer,
                    angle: 90
                },

                seriesDefaults: {
                    color: '#cfcac4',
                    //lineWidth: '20',
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: {
                        varyBarColor: true,
                        highlightMouseOver: true,
                        highlightColors: '#26a69a',
                        shadow: false,
                        barWidth: barwidth
                    },
                    yaxis: 'y2axis'
                },
                grid: {
                    drawGridLines: true,       // wether to draw lines across the grid or not.
                    gridLineColor: '#d5d5d5',      // *Color of the grid lines.
                    background: 'white',        // CSS color spec for background color of grid.
                    borderColor: 'transparent',     // CSS color spec for border around grid.
                    borderWidth: 0,           // pixel width of border around grid.
                    shadow: false,               // draw a shadow for grid.
                    renderer: $.jqplot.CanvasGridRenderer,  // renderer to use to draw the grid.
                    rendererOptions: {}         // options to pass to the renderer.  Note, the default
                },
                axes: {
                    xaxis: {
                        label: 'Scheduled Days ( ' + onlyMonth + ' )',
                        fontSize: '13px',
                        renderer: $.jqplot.CategoryAxisRenderer,
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                        labelOptions: {
                            fontSize: '13px',
                        },
                        ticks: xaxisCat,
                    },

                    y2axis: {
                        min: 0,
                        //max: Yaxis,
                        //tickInterval: 1,
                        tickOptions: {
                            formatString: '%d'
                        },
                        label: 'Change List Count',
                        fontSize: '13px',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                        labelOptions: {
                            fontSize: '13px',
                            angle: 90
                        },
                    }
                },
                highlighter: {
                    tooltipContentEditor: function (str, seriesIndex, pointIndex) {
                        return arr[pointIndex][1] + "<br>" + arr[pointIndex][0] + " Scheduled";
                    },
                    show: true,
                    showTooltip: true,
                    tooltipFade: true,
                    sizeAdjust: 10,
                    tooltipLocation: 'n',
                    useAxesFormatters: false,

                }
            });



            $(window).resize(function () {
                plot.replot({ resetAxes: false });
            });

            $(that.element).on('jqplotDataHighlight', function () {
                $('.jqplot-event-canvas').css('cursor', 'pointer');
            });
            $(that.element).on('jqplotDataUnhighlight', function () {
                $('.jqplot-event-canvas').css('cursor', 'auto');
            });

        },
        refresh: function () {
            $(this.element).empty();
            this.init();
        },
        loaddata: function (_data) {
            plot.destroy();
            this.options.data = _data;
            this.init();
        },
        barclick: function () {
            $(this.element).bind('jqplotDataClick',
            function (ev, seriesIndex, pointIndex, data) {
                console.log(arr[pointIndex][1]);
            });
        },
        _monthIndicator: function () {
            //var canvas = $(this.element).find('.jqplot-base-canvas')
            //   .attr('id', 'jqplot-base-canvas')
            //   .text('unsupported browser');

            //var ctx = canvas.getContext("2d");
            //ctx.font = "13px Arial";
            //ctx.fillText("may", 10, 50);
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
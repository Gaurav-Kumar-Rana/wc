;
//<div class="smallTileBody  waves-effect">
//    <span class="heading">Slot Data</span>
//    <span class="statusCount error-text">132</span>
//    <span class="statusText">Un-enrolled Asset</span>
//    <div class="statusAvailable">
//        <span class="statusAvailableSec">
//            <span class="statusCount sucess-text">132</span>
//            <span class="statusText">Online</span>
//        </span>
//        <span class="statusAvailableSec">
//            <span class="statusCount normal-text">156</span>
//            <span class="statusText">Offline</span>
//        </span>
//    </div>
//</div>
var ProductStatusData =
[
{
    'listHead': 'Slot Data',
    'listCount': [{ 'Number': '54', 'flag': 'error' }],
    'listText': 'Un-enrolled Asset',
    'listBody': [
            { 'listBodyTxt': 'Online', 'listCount': '132', 'flag': 'sucess' },
            { 'listBodyTxt': 'Offline', 'listCount': '156', 'flag': 'normal' }
    ]
},
{
    'listHead': 'Progressive Data',
    'listCount': [{ 'Number': '54', 'flag': 'normal' }],
    'listText': 'EGM',
    'listBody': [
            { 'listBodyTxt': 'Connected', 'listCount': '32', 'flag': 'sucess' },
            { 'listBodyTxt': 'Not Connected', 'listCount': '41', 'flag': 'error' }
    ]
}
];
(function ($) {
    $.fn.InfoCard = function (data) {

        return this.each(function () {
            $(this).empty();
            var ProductStatus = '<div class="CardPanel"><div class="smallTile">';

            $.each(data, function (key, value) {
                ProductStatus += '<div class="smallTileBody">' +
                                 '<span class="heading">' + value.listHead + '</span>' +
                                 '<div class="statusContent waves-effect" id="' + value.listHead.split(" ").join("") + '"><span class="statusCount ' + value.listCount[0].flag + '-text">' + value.listCount[0].Number + '</span>' +
                                 '<span class="statusText">' + value.listText + '</span></div>' +
                                 '<div class="statusAvailable">';
                $.each(value.listBody, function (key1, value1) {

                    ProductStatus += '<span class="statusAvailableSec waves-effect"  id="' + value.listHead.split(" ").join("") + value1.listBodyTxt.split(" ").join("") + '">' +
                    '<span class="statusCount ' + value1.flag + '-text">' + value1.listCount + '</span>' +
                    '<span class="statusText">' + value1.listBodyTxt + '</span>' +
                    '</span>';
                });

                ProductStatus += '</div>';
                ProductStatus += '</div>';
            });

            ProductStatus += '</div></div>';
            $(this).append(ProductStatus);
        });
    }
}(jQuery));

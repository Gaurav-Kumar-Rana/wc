//<ul class="collapsible" data-collapsible="accordion">
//    <li>
//        <div class="collapsible-header active">Changelist Failed <span class="right count redFont">198</span></div>
//        <div class="collapsible-body">
//            <ul>
//                <li>Albinno Slot Game</li>
//                <li>Moraco Progressive</li>
//                <li>Eastwest Games</li>
//                <li>Update Moraco Software</li>
//                <li>Pub Lane Progressive</li>
//                <li>Como Game</li>
//                <li>Carmers Asset</li>
//                <li>Daveys Software</li>
//                <li>Mega Moolah Classic</li>
//                <li>Major Millions</li>
//                <li>Wowpot</li>
//                <li>Lotsallot</li>
//                <li>Dark Knight Rise</li>
//                <li>Mega Spin Millions</li>
//            </ul>
//        </div>
//    </li>
//</ul>

(function ($) {
    $.fn.Accordian = function (data) {
        return this.each(function () {
            $(this).empty();
            var collapsible = '<ul class="collapsible fullHeight" data-collapsible="accordion">';

            $.each(data, function (key, value) {

                collapsible += '<li>' +
                                        '<div class="collapsible-header">' + value.listHead + '<span class="right count normal-text" id="' + value.listHead.split(" ").join("") + '">' + value.Count + '</span></div>';
                                        if (value.listBody.length == 0)
                                        {
                                            collapsible += '<div class="collapsible-body dont-expand">';
                                        }
                                        else {
                                            collapsible += '<div class="collapsible-body">';
                                        }
                                            
                                        collapsible += '<ul>';
                    $.each(value.listBody, function (key1,value1) {
                        collapsible += '<li id="' + value.listHead.split(" ").join("") + '_' + value1.listBodyEle.split(" ").join("") + '"' + 'onClick="LoadMasterListByName(' +"'"+ value.listHead.split(" ").join("") + '_' + value1.listBodyEle.split(" ").join("")+"'"+ ')">' + value1.listBodyEle + '</li>';
                    });
                    collapsible += '</ul>' +
                            '</div>' +
                        '</li>';
            });

            $(this).append(collapsible);
            //This is materialize dependent funtion.
            $('.collapsible').collapsible();
            $('.collapsible').collapsible('open', 0);
        });
    }

}(jQuery));
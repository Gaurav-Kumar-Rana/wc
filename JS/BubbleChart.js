var BubbleControlApp  = angular.module('BubbleControlApp', ['checklist-model'])

.controller('BubbleControlController', ['$scope', '$compile', function ($scope, $compile) {
    $scope.activateView = function (ele) {
        $compile(ele.contents())($scope);
        $scope.$apply();
    };

    $scope.myAsset = [];

    $scope.$watch(
                    "myAsset",
                    function (newValue, oldValue) {
                        $scope.load();
                    }
                );

    var _b = $scope;
    _b.load = function () {
        _b.sortedAsset = _b.myAsset.sort(function (a, b) {
            var assetOne = parseInt(a.bubbleData.number);
            var assetTwo = parseInt(b.bubbleData.number);
            if (assetOne < assetTwo) {
                return -1;
            }
            if (assetOne > assetTwo) {
                return 1;
            }
            return 0;
        });

        _b.getStyle = function (index) {
            var locationArray = [];
            var left;
            var top = 0;
            var choice;
            var size = 0;
            for (var i = 0; i < _b.myAsset.length; i++) {
                if (_b.myAsset.length < 7) {

                    if (i > 0 && _b.myAsset[i].bubbleData.number == _b.myAsset[i - 1].bubbleData.number) {
                        if (size) {
                            size = size;
                        } else {
                            size = 55 + 10 * (i - 1);
                        }
                    }
                    else {
                        size = 55 + 10 * i;
                    }
                    if (_b.myAsset.length == 1) {
                        left = 40;
                        top: 23;
                    }
                    else {
                        (i % 2 == 0) ? choice = 'left' : choice = 'right';
                        switch (choice) {
                            case 'left':
                                left = 42 - (5 * i);

                                break;
                            case 'right':
                                left = 45 + (5 * i);

                                break;
                        }
                    }
                }
                else {
                    if (i > 0 && _b.myAsset[i].bubbleData.number == _b.myAsset[i - 1].bubbleData.number) {
                        if (size) {
                            size = size;
                        } else {
                            size = 28 + 8 * (i - 1);
                        }
                    }
                    else {
                        size = 28 + 8 * i;
                    }

                    if (_b.myAsset.length == 1) {
                        left = 40;
                        top: 23;
                    }
                    else {
                        (i % 2 == 0) ? choice = 'left' : choice = 'right';
                        switch (choice) {
                            case 'left':
                                left = 47 - (4 * i);

                                break;
                            case 'right':
                                left = 41 + (5 * i);

                                break;
                        }
                    }
                }
                locationArray.push({ left: "calc(" + left + "% - (" + size + "px" + "/2))", top: top + "%", height: size + "px", width: size + "px" });
            }




            for (var i = 0; i < locationArray.length; i++) {

                locationArray[0].top = 23 + "%";



                if (i - 1 > 1) {
                    if (locationArray[i - 2].top == 34 + "%" && locationArray[i - 1].top == 34 + "%") {
                        locationArray[i].top = 23 + "%";
                    }
                    if (locationArray[i - 2].top == 34 + "%" && locationArray[i - 1].top == 23 + "%") {
                        locationArray[i].top = 23 + "%";
                    }
                    if (locationArray[i - 2].top == 23 + "%" && locationArray[i - 1].top == 23 + "%") {
                        locationArray[i].top = 34 + "%";
                    }
                    if (locationArray[i - 2].top == 23 + "%" && locationArray[i - 1].top == 34 + "%") {
                        locationArray[i].top = 34 + "%";
                    }
                }
                else {
                    locationArray[i].top = 34 + "%";
                }
            }


            return locationArray[index];
        }
    };
    if (_b.myAsset.length > 0) {
        _b.load();
    }
}]);


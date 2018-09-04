/*
 ~   Copyright (c) 2018 WSO2 Inc. (http://wso2.com) All Rights Reserved.
 ~
 ~   Licensed under the Apache License, Version 2.0 (the "License");
 ~   you may not use this file except in compliance with the License.
 ~   You may obtain a copy of the License at
 ~
 ~        http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~   Unless required by applicable law or agreed to in writing, software
 ~   distributed under the License is distributed on an "AS IS" BASIS,
 ~   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~   See the License for the specific language governing permissions and
 ~   limitations under the License.
 */

$(document).ready(function () {
    $(".date-time").each(function (index) {
        var randomDateTime = randomDate(new Date(2018, 0, 1), new Date());
        $(this).text(moment(randomDateTime).format('DD/MM/YYYY hh:mm A'));
    });

    $(".year").text((new Date()).getFullYear());

    var request = $('#request').val();
    $('code.requestContent').val(JSON.stringify(request, null, 3));

});

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

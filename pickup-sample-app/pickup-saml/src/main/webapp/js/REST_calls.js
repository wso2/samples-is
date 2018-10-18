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


var driverRequest;


function shareRide(){

    var $timeline = $("#timeline-content");

    var request = $.ajax({
        url: "/restful/testbackend",
        method: "GET",
        data: driverRequest,
        dataType: "json",
        contentType: "application/json",
        beforeSend: function( xhr ) {
            xhr.setRequestHeader('Authorization', 'Bearer');
            var jsonStr = JSON.stringify(driverRequest, null, 4);
            $(".sending",  $timeline).show("slow");
            $(".sent",  $timeline).show();
            $(".sent code.copy-target1",  $timeline).html(jsonStr);
            $('.code-container pre code').each(function(i, e) {hljs.highlightBlock(e)});
            $(".received",  $timeline).hide();
            $(".loading-icon").show();
        }
    });

    request.done(function( msg ) {
        var jsonStr = JSON.stringify(msg, null, 4);
        $(".received code.copy-target3", $timeline).html(jsonStr);
        $('.code-container pre code').each(function(i, e) {hljs.highlightBlock(e)});
        $(".received", $timeline).show("slow");
        $(".sending",  $timeline).hide();

        $(".loading-icon").hide();
        $('.nav-tabs a[href="#nav-rides"]').tab('show');
        $('.no-rides-msg').hide();
        $('.rides').show();
        $('.action-response').show();
    });

    request.fail(function( jqXHR, textStatus ) {
        $(".request-response-details").append( "No data... " + textStatus);
    });
}


$(".share").on("click",function(){
    $('.action-response').hide();
    shareRide();
});




!function(){
    var timeToArrive = Date.parse('03/06/2020 21:43:01') / 1000;
    var buttonSiege = $('#route-control').find('.route-attack, .route-defend');
    var timeToGo = parseInt(buttonSiege.attr('ttg'));
    var timeToDepart = timeToArrive - timeToGo;
    var currenttime = Math.round(timingModel.getCurrentTime());
    var timeToWait = timeToDepart - currenttime;
    console.log(timeToWait);
    setTimeout(function() {
        console.log('Sending..');
        Route.mouseCord.x = 795;
        Route.mouseCord.y = 232;
        Route.saveRoute('siege', parseInt(buttonSiege.attr("timestamp")), gameController.worldMap.__routeConstructorSteps, gameController.worldMap.__routeConstructorArmyId, function() {
            console.log('Sent');
        });
    }, timeToWait * 1000);
}();
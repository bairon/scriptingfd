function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
function allArmiesAtHome() {
    for (let i in townModel.townData.Armies) {
        let army = townModel.townData.Armies[i];
        if (army.Status !== 0) {
            return false;
        }
    }
    return true;
}
var armySize;
var armyQty;
function execute() {
    if (allArmiesAtHome()) {
        gameController.loadTown();
        $('#town-control-button')[0].click();
        $('div[type="armies"]')[0].click();
        setTimeout(function() {
            if ($('.dismiss-button').length > 0) {
                $('.dismiss-button')[0].click();
            }
            setTimeout(function() {
                if ($('.dismiss-button').length > 0) {
                    $('.dismiss-button')[0].click();
                }
                setTimeout(function() {
                    if ($('.dismiss-button').length > 0) {
                        $('.dismiss-button')[0].click();
                    }
                    setTimeout(function() {
                        armySize = townModel.townData.Troops[6] / 3;
                        armyQty = 3;
                        if (armySize < 150) {
                            armySize = townModel.townData.Troops[6] / 2;
                            armyQty = 2;
                        }
                        if (armySize < 150) {
                            armySize = townModel.townData.Troops[6];
                            armyQty = 1;
                        }
                        $('#control-window-armies .empty-button')[0].click();
                        setTimeout(function() {
                            if (armyQty > 2) {
                                $('div[troop-id="6"] input').attr('value', armySize);
                                $('.create-army-button')[0].click();
                            }
                            setTimeout(function() {
                                if (armyQty > 1) {
                                    $('div[troop-id="6"] input').attr('value', armySize);
                                    $('.create-army-button')[0].click();
                                }
                                setTimeout(function() {
                                    $('div[troop-id="6"] .max-button')[0].click();
                                    $('.create-army-button')[0].click();
                                    setTimeout(function() {
                                        $('.town-control-window .close')[0].click();
                                    }, 700);
                                },2678);
                            }, 2345);
                        }, 300);
                    }, 1845);
                }, 576);
            }, 735);
        }, 650);

    } else {
        setTimeout(execute, 2000);
    }
}
setTimeout(execute, 1000);
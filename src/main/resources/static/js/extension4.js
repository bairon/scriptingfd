var baseDelay = 400;
var sielent = true;
var needReload = false;
var dungeon = {x:158, y:196};
var recipient = 'Greftung';

function rndBase() {
    return Math.round(Math.random() * baseDelay + baseDelay);
}

function rndShort() {
    return rndBase();
}

function rndMedium() {
    return rndBase() * 2;
}

function rndLong() {
    return rndBase() * 4;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleepS() {
    sleep(rndShort());
}

function sleepM() {
    sleep(rndMedium());
}

function sleepL() {
    sleep(rndLong());
}

function rnd(a, b) {
    return Math.round(Math.random() * (b - a) + a);
}

function initRnd() {
    gameController.rndVal = rnd(100, 800) * 100000 + rnd(140, 650);
}

function greaterOrZero(x) {
    if (x > 0) return x;
    return 0;
}

function roundLessBy1000(x) {
    var thousands = Math.floor(x / 1000);
    return thousands * 1000;
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
var sqrt2 = Math.sqrt(2);
function range(x1, y1, x2, y2) {
    var diagonals = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1));
    var streights = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) - diagonals;
    return diagonals * sqrt2 + streights;

}
function precious(t) {
    if (t === 4) return 0;
    return t - 1;
}
function dungeonCompare(a, b) {
    if (a.range < b.range) return -1;
    if (a.range > b.range) return 1;
    if (a.precious < b.precious) return -1;
    if (a.precious > b.precious) return 1;
    return 0;
}

function findDungeon(map, loc) {
    const dungeons = [];
    for (var i = loc.X - 10; i <= loc.X + 10; ++i) {
        for (var j = loc.Y - 10; j <= loc.Y + 10; ++j) {
            if (i === loc.X && j === loc.Y) {
                continue;
            }
            if (map[i][j] !== undefined && map[i][j].dungeon !== undefined) {
                map[i][j].dungeon.x = i;
                map[i][j].dungeon.y = j;
                map[i][j].home = loc;
                map[i][j].range = range(loc.X, loc.Y, i, j);
                map[i][j].precious = precious(map[i][j].dungeon.t);
                dungeons.push(map[i][j]);
            }
        }
    }
    dungeons.sort(dungeonCompare);
    return dungeons[0];
}

async function execute() {
    await sleep(rndLong());
    if (allArmiesAtHome()) {
        if (needReload) {
            location.reload();
        }
        gameController.loadTown();
        await sleep(rndLong());
        $('#town-control-button')[0].click();
        await sleep(rndShort());

        if (Object.keys(townModel.townData.RecruitingList).length < 2) {
            $('.town-control-window div[type="troops"]')[0].click();
            await sleep(rndMedium());
            $('div[troop-id="6"] .max')[0].click();
            await sleep(rndMedium());
            $('div[troop-id="6"] .recruit')[0].click();
            await sleep(rndMedium());
        }

        initRnd();
        $('.town-control-window div[type="armies"]')[0].click();
        await sleep(rndShort());
        if ($('.dismiss-button').length > 0) {
            $('.dismiss-button')[0].click();
            await sleep(rndMedium());
        }
        if ($('.dismiss-button').length > 0) {
            $('.dismiss-button')[0].click();
            await sleep(rndMedium());
        }
        if ($('.dismiss-button').length > 0) {
            $('.dismiss-button')[0].click();
            await sleep(rndMedium());
        }

        var armySize = Math.round(townModel.townData.Troops[6] / 3);
        var armyQty = 3;
        if (armySize < 200) {
            armySize = Math.round(townModel.townData.Troops[6] / 2);
            armyQty = 2;
        }
        if (armySize < 200) {
            armySize = townModel.townData.Troops[6];
            armyQty = 1;
        }

        initRnd();
        $('.town-control-window div[type="createArmy"]')[0].click();
        await sleep(rndShort());
        if (armyQty > 2) {
            $('div[troop-id="6"] input').attr('value', armySize);
            await sleep(rndShort());
            initRnd();
            $('.create-army-button')[0].click();
            await sleep(rndLong());
        }
        if (armyQty > 1) {
            $('div[troop-id="6"] input').attr('value', armySize);
            await sleep(rndShort());
            initRnd();
            $('.create-army-button')[0].click();
            await sleep(rndLong());
        }
        $('div[troop-id="6"] .max-button')[0].click();
        await sleep(rndShort());
        initRnd();
        $('.create-army-button')[0].click();
        await sleep(rndLong());
        $('.town-control-window .close')[0].click();

        await sleep(rndShort());

        gameController.loadMap();

        await sleep(rndLong());
        if (dungeon === undefined) {
            dungeon = findDungeon(gameController.gameData.map, townModel.townData.Location).dungeon;
        }

        gameController.goToMapPosition({left: dungeon.x, top: dungeon.y});

        await sleep(rndMedium());

        gameController.armyControl.initWindow(dungeon.x, dungeon.y);

        await sleep(rndLong());

        if ($('.attack.send').length > 0) {
            initRnd();
            $('.attack.send')[0].click();
            await sleep(rndLong());
        }
        if ($('.attack.send').length > 0) {
            initRnd();
            $('.attack.send')[0].click();
            await sleep(rndLong());
        }
        if ($('.attack.send').length > 0) {
            $('.attack.send')[0].click();
            await sleep(rndLong());
        }
        $('.close-button')[0].click();
        await sleep(rndShort());

        gameController.loadTown();
        await sleep(rndLong());
        var keep = {wood:17000, iron:10000, stone:17000, gold:15000};
        var wood = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.wood) - keep.wood));
        var iron = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.iron) - keep.iron));
        var stone = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.stone) - keep.stone));
        var gold = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.gold) - keep.gold));

        if (wood >= 1000 || iron >= 1000 || stone >= 1000 || gold >= 1000) {

            $('.system-button.commerce')[0].click();
            await sleep(rndShort());

            $('div[tab="send-resources"]')[0].click();
            await sleep(rndShort());

            $('.senders-list>:contains("' + recipient + '")')[0].click();
            await sleep(rndShort());

            $('.all-max-button')[0].click();
            await sleep(rndMedium());

            $('.resource input[title="wood"]').attr('value', wood);
            await sleep(rndShort());
            $('.resource input[title="iron"]').attr('value', iron);
            await sleep(rndShort());
            $('.resource input[title="stone"]').attr('value', stone);
            await sleep(rndShort());
            $('.resource input[title="gold"]').attr('value', gold);
            await sleep(rndShort());

            initRnd();
            $('.send-resources .send-button')[0].click();
            await sleep(rndLong());

            $('#wof-window-body .close')[0].click();
            await sleep(rndShort());
        }
        needReload = Math.random() * 100 <= 20 || allArmiesAtHome();
    }
    setTimeout(execute, 20000);
}

function launch() {
    if (!sielent) {
        var limit = prompt("Фарм.\n Нажмите Отмена для отмены.", "157 195");
        if ("undefined" != typeof limit && limit != null) {
            if (limit.trim() !== '') {
                var parts = limit.trim().split(' ');
                dungeon = {x: parseInt(parts[0]), y: parseInt(parts[1])};
            }
            recipient = prompt("Кормим:", "Greftung");
            setTimeout(execute, 1000);
        }
    } else {
        setTimeout(execute, 1000);
    }
}

setTimeout(launch, 3000);
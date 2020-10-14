let baseDelay = 400;
let silent = false;
let needReload = false;
let dungeonType;
let recipient;
let hire = true;
let attack = 0;
let armyMinimum;
let autoDungeon;
let keepPercent = 50;

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
    let thousands = Math.floor(x / 1000);
    return thousands * 1000;
}

function farmingArmiesNotAtHome() {
    let notAtHome = 0;
    for (let i in townModel.townData.Armies) {
        let army = townModel.townData.Armies[i];
        if (army.Status && army.Name === 'Новая армия') {
            notAtHome++;
        }
    }
    return notAtHome;
}

let sqrt2 = Math.sqrt(2);

function range(x1, y1, x2, y2) {
    let diagonals = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1));
    let streights = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) - diagonals;
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
    for (let i = loc.X - 10; i <= loc.X + 10; ++i) {
        for (let j = loc.Y - 10; j <= loc.Y + 10; ++j) {
            if (i === loc.X && j === loc.Y) {
                continue;
            }
            if (map[i][j] !== undefined && map[i][j].dungeon !== undefined) {
                if (dungeonType > 0 && dungeonType !== map[i][j].dungeon.t) {
                    continue;
                }
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

function dungeonTypeByLeastResourcePercent(r) {
    let dt = 0;
    let wp = (100.0 * r.wood) / r.woodMax;
    let ip = (100.0 * r.iron) / r.ironMax;
    let sp = (100.0 * r.stone) / r.stoneMax;
    let gp = (100.0 * r.gold) / r.goldMax;

    if (wp <= ip && wp <= sp && wp <= gp) {
        dt = 1;
    } else if (ip <= wp && ip <= sp && ip <= gp) {
        dt = 2;
    } else if (sp <= wp && sp <= ip && sp <= gp) {
        dt = 3;
    } else if (gp <= wp && gp <= ip && gp <= sp) {
        dt = 4;
    }
    console.log('Calculated dungeon type ' + dt);
    return dt;
}

function canBuild(id) {
    return $('.building[building-id="' + id + '"] .level-up.disabled').length === 0;
}

function build(id) {
    $('.building[building-id="' + id + '"] .level-up')[0].click();
}

async function settroop(id, qty) {
    if (qty === undefined || qty === null || qty === 0) return;
    $('div[troop-id="' + id + '"] input').attr('value', qty);
    await sleep(rndShort());
}

async function createArmy(farmmatrix) {
    if (farmmatrix === undefined) return;

    await settroop(1, farmmatrix[1]);
    await settroop(2, farmmatrix[2]);
    await settroop(3, farmmatrix[3]);
    await settroop(4, farmmatrix[4]);
    await settroop(5, farmmatrix[5]);
    await settroop(6, farmmatrix[6]);
    await settroop(7, farmmatrix[7]);
    await settroop(8, farmmatrix[8]);

    initRnd();
    $('.create-army-button')[0].click();
    await sleep(rndLong());
}

async function attackSend() {
    if ($('.attack.send').length > 0) {
        initRnd();
        $('.attack.send')[0].click();
        await sleep(rndLong());
    }
}

async function buildqueue() {
    if (townModel.townData.BuildingConstruction.length === 0) {
        $('.town-control-window div[type="buildings"]')[0].click();
        await sleep(rndShort());

        gameController.townControl.__leftWindow.setTab('buildings-main');
        await sleep(rndShort());

        if (canBuild(2)) {
            build(2);
            await sleep(rndLong());
        } else if (canBuild(10)) {
            build(10);
            await sleep(rndLong());
        } else if (canBuild(4)) {
            build(4);
            await sleep(rndLong());
        } else if (canBuild(12)) {
            build(12);
            await sleep(rndLong());
        } else {
            gameController.townControl.__leftWindow.setTab('buildings-military');
            await sleep(rndShort());
            if (canBuild(14)) {
                build(14);
                await sleep(rndLong());
            } else {
                gameController.townControl.__leftWindow.setTab('buildings-economic');
                await sleep(rndShort());
                if (canBuild(5)) {
                    build(5);
                    await sleep(rndLong());
                }
            }
        }
    }
}

async function hirequeue() {
    if (hire !== undefined && hire !== null && Object.keys(townModel.townData.RecruitingList).length < 2) {
        $('.town-control-window div[type="troops"]')[0].click();
        await sleep(rndMedium());
        $('div[troop-id="' + hire + '"] .max')[0].click();
        await sleep(rndMedium());
        $('div[troop-id="' + hire + '"] .recruit')[0].click();
        await sleep(rndMedium());
    }
}

async function dismissOne() {
    if ($('.dismiss-button').length > 0) {
        $('.dismiss-button')[0].click();
        await sleep(rndMedium());
    }
}

async function dismissAll() {
    initRnd();
    $('.town-control-window div[type="armies"]')[0].click();
    await sleep(rndShort());

    await dismissOne();
    await dismissOne();
    await dismissOne();
    await dismissOne();
    await dismissOne();
    await dismissOne();
    await dismissOne();
    await dismissOne();
    await dismissOne();
    await dismissOne();

}

function troopsQty(troops, types) {
    let qty = 0;
    for (let i in troops) {
        if (types.includes(i)) {
            let troopQty = troops[i];
            qty += troopQty;
        }
    }
    return qty;
}

function getFarmingMatrix() {
    let farmingMatrix = [];
    let allTroops = townModel.townData.Troops;
    let types = (attack === 0) ? ['1', '2', '3', '4', '5', '6', '7', '8'] : [attack];
    let qty = troopsQty(allTroops, types);

    let armiesCount = Math.floor(qty / armyMinimum);

    let usedTroops = {};
    for (let t in allTroops) {
        usedTroops[t] = 0;
    }

    for (let i = 1; i < armiesCount; ++i) {
        let matrix = {};
        for (let t in allTroops) {
            if (types.includes(t)) {
                let troopQty = allTroops[t];
                let oneArmyQty = Math.floor(troopQty / armiesCount);
                matrix[t] = oneArmyQty;
                usedTroops[t] = usedTroops[t] + oneArmyQty;
            } else {
                matrix[t] = 0;
            }
        }
        farmingMatrix.push(matrix);
    }

    let lastMatrix = {};
    for (let t in allTroops) {
        if (types.includes(t)) {
            lastMatrix[t] = allTroops[t] - usedTroops[t];
        } else {
            lastMatrix[t] = 0;
        }
    }
    farmingMatrix.push(lastMatrix);

    return farmingMatrix;
}

async function createArmies() {
    let farmingMatrix = getFarmingMatrix();

    initRnd();
    $('.town-control-window div[type="createArmy"]')[0].click();
    await sleep(rndShort());


    await createArmy(farmingMatrix[0]);
    await createArmy(farmingMatrix[1]);
    await createArmy(farmingMatrix[2]);
    await createArmy(farmingMatrix[3]);
    await createArmy(farmingMatrix[4]);
    await createArmy(farmingMatrix[5]);
    await createArmy(farmingMatrix[6]);
    await createArmy(farmingMatrix[7]);
    await createArmy(farmingMatrix[8]);
    await createArmy(farmingMatrix[9]);
    await createArmy(farmingMatrix[10]);

}

async function feed() {
    if (recipient !== undefined && recipient !== null) {
        let keep = {
            wood: playerModel.playerData.Resources.woodMax * keepPercent / 100,
            iron: playerModel.playerData.Resources.ironMax * keepPercent / 100,
            stone: playerModel.playerData.Resources.stoneMax * keepPercent / 100,
            gold: playerModel.playerData.Resources.goldMax * keepPercent / 100
        };
        let wood = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.wood - keep.wood)));
        let iron = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.iron - keep.iron)));
        let stone = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.stone - keep.stone)));
        let gold = roundLessBy1000(greaterOrZero(parseInt(playerModel.playerData.Resources.gold - keep.gold)));

        if (wood >= 2000 || iron >= 2000 || stone >= 2000 || gold >= 2000) {

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
    }

}

async function execute() {

    if (farmingArmiesNotAtHome() === 0) {
        if (needReload) {
            location.reload();
        }
        //$('#town-control-button')[0].click();
        gameController.townControl.show();
        await sleep(rndShort());

        //await buildqueue();

        await hirequeue();

        if (attack !== undefined && attack !== null) {
            await dismissAll();

            await createArmies();

            gameController.townControl.close();

            await sleep(rndShort());

            gameController.loadMap();

            await sleep(rndLong());

            if (autoDungeon) {
                dungeonType = dungeonTypeByLeastResourcePercent(playerModel.playerData.Resources);
            }
            dungeon = findDungeon(gameController.gameData.map, townModel.townData.Location).dungeon;
            if (dungeon !== undefined) {

                gameController.goToMapPosition({left: dungeon.x, top: dungeon.y});

                await sleep(rndMedium());

                gameController.armyControl.initWindow(dungeon.x, dungeon.y);

                await sleep(rndLong());

                await attackSend();
                await attackSend();
                await attackSend();
                await attackSend();
                await attackSend();
                await attackSend();
                await attackSend();
                await attackSend();
                await attackSend();
                await attackSend();


                $('.close-button')[0].click();
                await sleep(rndShort());
            } else {
                console.log("no dungeon found with type " + dungeonType);
            }
        }

        await feed();
        needReload = false;//Math.random() * 100 <= 20 || farmingArmiesNotAtHome() > 1;
    }
    setTimeout(execute, 20000);
}

/*function detectFarmingArmies() {
    for (const armyid in townModel.townData.Armies) {
        var army = townModel.townData.Armies[armyid];
        if (army.Status) {
            if (army.RouteId !== undefined && army.RouteId !== null) {}
            var route = Route.routesList[army]
        }
    }
}*/

function launch() {
    if (!silent) {
        dungeonType = parseInt(prompt("Фарм.\n 0 - ближайшее, 1 - лес, 2 - руда, 3 - камень, 4 - золото, 5 - автоопределение", "5").trim());
        if ("undefined" != typeof dungeonType && dungeonType != null) {
            if (dungeonType === 5) autoDungeon = true;
            recipient = prompt("Кормим:", "Greftung");
            hire = parseInt(prompt("Найм: 1 - ланс, 2 - меч, 3 - кава, 4 - рык, 5 - пика, 6 - бард, 7 - лук, 8 - арба", "6"));
            attack = parseInt(prompt("Фарм юнитами: 1 - ланс, 2 - меч, 3 - кава, 4 - рык, 5 - пика, 6 - бард, 7 - лук, 8 - арба, 0 - все", "0"));
            armyMinimum = parseInt(prompt("Минимальнай отряд: ", "100"));
            setTimeout(execute, 1000);
        }
    } else {
        //detectFarmingArmies();
        setTimeout(execute, 1000);
    }
}

setTimeout(launch, 3000);
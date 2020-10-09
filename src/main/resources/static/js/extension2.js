class ExtUtil {
    static isGreater(res1, res2) {
        return res1.wood > res2.wood &&
            res1.iron > res2.iron &&
            res1.stone > res2.stone &&
            res1.gold > res2.gold &&
            res1.food > res2.food;
    }
    static addRes(res1, res2) {
        res1.wood += res2.wood;
        res1.iron += res2.iron;
        res1.stone += res2.stone;
        res1.gold += res2.gold;
        res1.food += res2.food;
    }
    static resToStr(res) {
        return res.wood + ' ' + res.iron + ' ' + res.stone + ' ' + res.gold + ' ' + res.food;
    }
}
class AccumulateTask {
    set accumulate(value) {
        this._accumulate = value;
    }
    get accumulate() {
        return this._accumulate;
    }
    set accumulated(value) {
        this._accumulated = value;
    }
    get accumulated() {
        return this._accumulated;
    }
    set townId(value) {
        this._townId = value;
    }
    get townId() {
        return this._townId;
    }
    set townsChecked(value) {
        this._townsChecked = value;
    }
    get townsChecked() {
        return this._townsChecked;
    }
    set completed(value) {
        this._completed = value;
    }
    get completed() {
        return this._completed;
    }

    constructor(data) {
        this._accumulate = data.accumulate;
        this._townId = data.townId;
        this._accumulated = {wood: 0, iron: 0, stone: 0, gold: 0, food: 0};

    }
    doSome() {
        if (ExtUtil.isGreater(this.accumulated, this.accumulate) || playerModel.playerData.TownCount === 1 || this.townsChecked >= playerModel.playerData.TownCount) {
            this.completed = true;
            if (townModel.townData.Id !== this.townId) {
                playerController.switchToTown(this.townId);
            }
        } else {
            console.log('Getting ' + ExtUtil.resToStr(townModel.townData.Resources)+ ' from town ' + townModel.townData.Name);
            ExtUtil.addRes(this.accumulated, townModel.townData.Resources);
            playerController.switchToNextTown();
        }
    }
}
var cc = {
    tick:0,
    task: null,
    start: function() {
        this._loop();
    },
    _loop: function() {
        console.log(cc.tick++);
        if (cc.task != null) {
            cc.task.doSome();
            if (cc.task.completed) {
                cc.task = null;
            }
        }

        setTimeout(cc._loop, 3000);

    },
    accumulate(data) {
        this.task = new AccumulateTask({accumulate:data, townId: townModel.townData.Id});
    }

};
cc.start();
var lapi = {
    addRes: function(res, add) {
        res.wood += add.wood;
        res.iron += add.iron;
        res.stone += add.stone;
        res.gold += add.gold;
        res.food += add.food;
    },

    accumulate : function(accumulate, callback) {

        var accumulated = townModel.townData.Resources;
        var townId = townModel.townData.Id;

        lapi._accumulate(townId, accumulated, accumulate, callback);
    } ,
    _accumulate: function(townId, accumulated, accumulate, callback) {

    },
    summNextOne : function(startTownId, accumulated) {
        let toAdd = townModel.townData.Resources;
        lapi.addRes(accumulated, toAdd);
        setTimeout(lapi.summNextOne.bind(null, accumulated), 1500);
    },
    summasync : function() {
        var resources = {wood:0, iron:0, stone:0, gold:0, food:0};
        var startTownId = townModel.townData.Id;
        lapi.summNextOne(startTownId, resources);
        return resources;
    },
    summsync : function() {
        var resources = {wood:0, iron:0, stone:0, gold:0, food:0};
        var startTownId = townModel.townData.Id;
        var currentTownId = startTownId;
        do {
            if (playerModel.playerData.TownCount > 1) {
                playerController.switchToNextTown();
                currentTownId = townModel.townData.Id;
            }
            this.addRes(resources, townModel.townData.Resources);
        } while (currentTownId !== startTownId);
        return resources;
    }
};
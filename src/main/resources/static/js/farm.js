    var maxfleet;
    var currentTarget;
    var targets;
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
    function chooseNewTarget() {
        var target = targets[currentTarget];
        var text = target.value.substring(22, target.value.length - 2);
        let strings = text.split(',');

        var galaxy = parseInt(strings[0].trim());
        var system = parseInt(strings[1].trim());
        var planet = parseInt(strings[2].trim());
        var typeee = parseInt(strings[3].trim());
        console.log('Берем цель номер ' + currentTarget + ' , ' + target.innerHML);
        currFleet.pasteCoords(galaxy, system, planet, typeee);
    }

    function launchfarm() {
        maxfleet = parseInt(prompt("Макс флотов: ", "5"));
        targets = $('.fleetsend_select.fleet_bookmarks option');
        currentTarget = Math.floor(Math.random() * targets.length);
        if (currentTarget >= targets.length) currentTarget = 0;
        setTimeout(iterate, 3000);
    }
    async function iterate() {
        chooseNewTarget();
        await sleep(rndMedium());
        setTimeout(iterate, 3000);
    }

    async function farm() {
        var busyfleets = parseInt($('#flt_cnt_owner').text());
        if (busyfleets < maxfleet) {

            $('.fleetsend_mission_btn_1')[0].click();
            await sleep(rndMedium());

            $('.sendfleetbtn.button.btn-green')[0].click()
            await sleep(rndMedium());

        }
        setTimeout(farm, 10000)
    }

    setTimeout(launchfarm, 3000);
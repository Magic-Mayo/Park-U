$(document).ready(()=>{
    const modal1 = $('#game-modal1');
    const defeatModal = $('#defeat-modal')
    $('.modal').modal({
        endingTop: '28%'
    });
    modal1.modal({
        endingTop: '28%',
        dismissible: false
    });
    // defeatModal.modal('open');
    
    const parkUToken = localStorage.getItem('_ParkU');
    let gotCompStats = false;

    let userStats = {
        data: false,
        attack: {
            names: [],
            strength: [],
            accuracy: []
        },
        defense: null,
        luck: null,
        maxHP: null,
        currentHP: null
    }

    let compStats = {
        id: '',
        attack: {
            names: [],
            accuracy: [],
            strength: [],
        },
        defense: null,
        luck: null,
        maxHP: null,
        currentHP: null
    }

    let userAcc = userStats.attack.accuracy;
    let userAtk = userStats.attack.strength;
    let compAcc = compStats.attack.accuracy;
    let compAtk = compStats.attack.strength;
    let compAtkName = compStats.attack.names;

    const compId = window.location.href.split('/').pop();
    const id = window.location.href.split('=')[1];
    let windowTitle = $('title');
    const gameTitle = $('.game-title').not($('.game-title').hasClass('hide')).html();
    
    const getStats = (charId, comp) => {
        if (!userStats.data){
            $.get(`/user/char/${charId}/stats`, (stats)=>{
                const atk = userStats.attack;
                const stat = stats.Attack;
                console.log(stats)
                for (i in stat){
                    switch(i.toString().slice(-3)){
                        case 'ame': atk.names.push(stats.Attack[i]); break;
                        case 'Acc': atk.accuracy.push(stats.Attack[i]); break;
                        case 'Dmg': atk.strength.push(stats.Attack[i].split('-')); break;
                    }
                }
                userStats.maxHP = stats.maxHP;
                userStats.currentHP = stats.currentHP;
                userStats.defense = stats.defense;
                userStats.luck = stats.luck;
                userStats.data = true;
                console.log(userStats)
                for (i in stat){
                    const btn = $('<button>');
                    switch(i.toString().slice(-3)){
                        case 'ame':
                            btn.addClass('attack').attr('value', i.toString().split('N')[0]).append(stat[i]).attr('id', i.toString().split('N')[0]);
                            $('.atk-btn').append(btn); break;
                    }
                }
                $('.user-hp-bar').attr('value', `${userStats.currentHP}`).attr('max', `${userStats.maxHP}`);
                $('.user-hp-text').text(`${userStats.currentHP}/${userStats.maxHP}`)
                windowTitle.html(gameTitle);
            })
        }

        switch (comp){
            case '': getCompStats('Andrew'); break;
            case 'Andrew': getCompStats('Jason'); break;
            case 'Jason': getCompStats('Neill'); break;
            case 'Neill': getCompStats('David'); break;
            case 'David': getCompStats('JJ'); break;
        }
    }
    
    const getCompStats = (name) =>{
        $.get(`/comp/${name}/stats`).then(comp=>{
            console.log(comp)
            compStats.id = comp.charName;
            compStats.maxHP = comp.maxHP;
            compStats.currentHP = comp.currentHP;
            compStats.defense = comp.defense;
            compStats.luck = comp.luck;

            for (i in comp.Attack){
                switch(i.toString().slice(-3)){
                    case 'ame': compAtkName.push(comp.Attack[i]); break;
                    case 'Acc': compAcc.push(comp.Attack[i]); break;
                    case 'Dmg': compAtk.push(comp.Attack[i].split('-')); break;
                }
            }

            console.log(compStats)
            $('.comp-hp-bar').attr('value', `${compStats.currentHP}`).attr('max', `${compStats.maxHP}`);
            $('.comp-hp-text').text(`${compStats.currentHP}/${compStats.maxHP}`);
            gotCompStats = true;
        })
    }
    
    getStats(id, compStats.id);

    const handleAtk = (attackId) => {
        switch (attackId){
            case 'attackOne': attack(userAtk[0], userAcc[0], compStats.defense, userStats.luck, compStats.currentHP, 'user'); break;
            case 'attackTwo': attack(userAtk[1], userAcc[1], compStats.defense, userStats.luck, compStats.currentHP, 'user'); break;
            case 'attackThree': attack(userAtk[2], userAcc[2], compStats.defense, userStats.luck, compStats.currentHP, 'user'); break;
            case 'attackFour': attack(userAtk[3], userAcc[3], compStats.defense, userStats.luck, compStats.currentHP, 'user'); break;
        }
        
    }

    const handleCompAtk = () => {
        let atkChosen = Math.floor(Math.random()*4);
        attack(compAtk[atkChosen], compAcc[atkChosen], userStats.defense, compStats.luck, userStats.currentHP, 'comp')
    }

    const attack = (attack, acc, defense, luck, hp, who) => {
        console.log(attack, acc, defense, luck, hp, who)
        let finalAtk;
        const atkRng = Math.floor(Math.random()*5);
        const atk = Math.ceil(Math.random()*100);
        let dblDmg;
        let finalHP;

        switch (who){
            case 'user': dblDmg = Math.ceil(Math.random()*100); break;
            case 'comp': dblDmg = Math.ceil(Math.random()*50); break;
        }

        if (atk <= acc){
            console.log(compStats)
            let total = hp + defense;
            if (luck===dblDmg){
                finalAtk = attack[4]*2;
                total -= finalAtk;
                finalHP = total;
                $('.game-window').addClass('dbl-dmg');
                setTimeout(()=>{$('.game-window').removeClass('dbl-dmg')},300);
                console.log('dbl')
            } else {
                switch (atkRng){
                    case 0:
                        finalAtk = parseInt(attack[0]); break;
                    case 1:
                        finalAtk = parseInt(attack[1]); break;
                    case 2:
                        finalAtk = parseInt(attack[2]); break;
                    case 3:
                        finalAtk = parseInt(attack[3]); break;
                    case 4:
                        finalAtk = parseInt(attack[4]); break;
                }
                total -= finalAtk;
                finalHP = total;
                $('.game-window').addClass('hit');
                setTimeout(()=>{$('.game-window').removeClass('hit')},300);
            }
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Select: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${finalHP}`, `\n`,  `Dbl dmg: ${dblDmg}`, '\n', `Luck: ${luck}`)
        } else {
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Select: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${finalHP}`, `\n`,  `Dbl dmg: ${dblDmg}`, '\n', `Luck: ${luck}`)
            console.log('missed')
            // send to dialog attack was missed
        }
        if (who === 'user' && finalAtk !== undefined){
            if(finalHP <= 0){
                userStats.data = false;
                userStats.currentHP = userStats.maxHP;
                return compDefeat();
            } else {
                compStats.currentHP=finalHP;
                $('.comp-hp-text').text(`${compStats.currentHP}/${compStats.maxHP}`);
                $('.comp-hp-bar').val(compStats.currentHP);
                // return handleSpeech(who, finalAtk);
            }
        } else if(who === 'comp' && finalAtk !== undefined){
            if(finalHP <= 0){
                $('.user-hp-text').text(`0/${userStats.maxHP}`);
                $('.user-hp-bar').val(0);
                return userDefeat();
            } else {
                userStats.currentHP = finalHP;
                $('.user-hp-text').text(`${userStats.currentHP}/${userStats.maxHP}`);
                $('.user-hp-bar').val(userStats.currentHP);
                // return handleSpeech(who, finalAtk);
            }
        }
    }

    const handleSpeech = (who, hitOrMiss) =>{
        if (who === 'user'){
            $('.user-speech').removeClass('hide');
            setTimeout(()=>{$('.user-speech').addClass('hide')}, 2000)
            $('.attack').prop('disabled', true);
            if (hitOrMiss === undefined){

            }

        } else {
            $('.comp-speech').removeClass('hide');
            setTimeout(()=>{$('.comp-speech').addClass('hide')}, 2000)
            $('.attack').prop('disabled', false);
            if (hitOrMiss === undefined){

            }
        }
    }

    const userDefeat = () => {
        $('.battle-scene').addClass('defeat');
        $('.defeat-text').text(`Your coding prowess was no match for ${compStats.id}....this time`);
        setTimeout(()=>{$('.battle-scene').addClass('transparent')}, 2500);
        setTimeout(()=>{$('#defeat-modal').modal('open').css('opacity', '1')}, 2750);
    }

    const compDefeat = () => {
        gotCompStats = false;
        getStats(id, compStats.id);
    }

    const handleLogOut = (token) => {
        $.ajax({
            method: 'delete',
            url: `/logout/user/${token}`,
        }).then(logout=>{
            if (logout){
                window.location.href = '/'
            }
        })
    }
    
    $('#gameWindowRight').on('click', '.attack', function(){
        const atkChosen = $(this).val().trim();
        
        if (compStats.currentHP){
            handleAtk(atkChosen);
        }

        if (userStats.currentHP > 0 && gotCompStats){
            setTimeout(handleCompAtk, 1000);
        }
    });

    $('.nes-logo').click(function(){
        modal1.modal('open')
    })

    modal1.on('click', 'button', function(){
        switch ($(this).text()){
            case 'Resume': modal1.modal('close'); break;
            case 'Exit to Main Menu': window.location.href = '/'; break;
            case 'Log Out': handleLogOut(parkUToken); break;
        }
    })

    const verifyToken = (token) => {
        $.post(`/token/`, {token: token}).then(dbtoken=>{
            console.log(dbtoken)
            if (!dbtoken){
                window.location.href = '/'
            }
        })
    }

    if (parkUToken){
        verifyToken(parkUToken);
    } else {
        window.location.href = '/droppedout'
    }
})
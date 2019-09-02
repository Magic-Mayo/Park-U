$(document).ready(()=>{
    const modal1 = $('#game-modal1')
    $('.modal').modal({
        endingTop: '28%'
    });
    modal1.modal({
        endingTop: '28%',
        dismissible: false
    })
    
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
                            btn.addClass('attack nes-btn is-primary').attr('value', i.toString().split('N')[0]).append(stat[i]).attr('id', i.toString().split('N')[0]);
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
        const dblDmg = Math.ceil(Math.random()*100);
        let finalHP;
        if (atk <= acc){
            let total = hp + defense;
            if (luck===dblDmg){
                finalAtk = attack[4]*2;
                total -= finalAtk;
                finalHP = total;
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
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Select: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${finalHP}`, `\n`,  `Dbl dmg: ${dblDmg}`)
        } else {
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Select: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${finalHP}`, `\n`,  `Dbl dmg: ${dblDmg}`)
            console.log('missed')
            // send to dialog attack was missed
        }
        if (who==='user' && finalAtk !== undefined){
            if(finalHP<=0){
                userStats.data = false;
                userStats.currentHP = userStats.maxHP;
                compDefeat();
            } else {
                compStats.currentHP=finalHP;
                $('.comp-hp-text').text(`${compStats.currentHP}/${$('.user-hp-bar').attr('max')}`);
                $('.comp-hp-bar').val(compStats.currentHP);
                handleSpeech(who);
                handleCompAtk();
            }
        } else if(who==='comp' && finalAtk !== undefined){
            if(finalHP<=0){
                // modal for game over
            } else {
                userStats.currentHP=finalHP;
                $('.user-hp-text').text(`${userStats.currentHP}/${$('.user-hp-bar').attr('max')}`);
                $('.user-hp-bar').val(userStats.currentHP);
            }
        }
    }

    const handleSpeech = (who) =>{
        if (who==='user'){

        } else {

        }
    }

    const compDefeat = () => {
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
        handleAtk(atkChosen);
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
})
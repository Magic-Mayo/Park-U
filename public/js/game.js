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
    let userLuck = userStats.luck;
    let userDef = userStats.defense;
    let compDef = compStats.defense;
    let compLuck = compStats.luck;
    let compAcc = compStats.attack.accuracy;
    let compAtk = compStats.attack.strength;
    let compAtkName = compStats.attack.names;
    
    const id = window.location.href.split('=')[1];
    let windowTitle = $('title');
    const gameTitle = $('.game-title').html();
    
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
                // $('.comp-hp-bar').attr('value', `${compStats.hp}`).attr('max', `${compStats.hp}`)
                gotStats = true;
            })
        }

        switch (compStats.id){
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
            $('.comp-hp-text').text(`${compStats.currentHP}/${compStats.maxHP}`)
        })
    }
    
    getStats(id);

    const handleAtk = (attackId) => {
        switch (attackId){
            case 'attackOne': attack(userAtk[0], userAcc[0], compDef, userLuck, compStats.currentHP, 'user'); break;
            case 'attackTwo': attack(userAtk[1], userAcc[1], compDef, userLuck, compStats.currentHP, 'user'); break;
            case 'attackThree': attack(userAtk[2], userAcc[2], compDef, userLuck, compStats.currentHP, 'user'); break;
            case 'attackFour': attack(userAtk[3], userAcc[3], compDef, userLuck, compStats.currentHP, 'user'); break;
        }
        
    }

    const handleCompAtk = () => {
        let atkChosen = Math.floor(Math.random()*4);
        attack(compAtk[atkChosen], compAcc[atkChosen], userDef, compLuck, userStats.currentHP, 'comp')
    }

    const attack = (attack, acc, defense, luck, hp, who) => {
        let finalAtk;
        const atkRng = Math.floor(Math.random()*5);
        const atk = Math.ceil(Math.random()*100);
        const dblDmg = Math.ceil(Math.random()*100);
        let finalHP;
        console.log(hp)
        if (atk <= acc){
            console.log(finalHP)
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
                console.log(finalHP)
                $('.game-window').addClass('flash');
                setTimeout(()=>{$('.game-window').removeClass('flash')},300);
            }
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Select: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${finalHP}`, `\n`,  `Dbl dmg: ${dblDmg}`)
        } else {
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Select: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${finalHP}`, `\n`,  `Dbl dmg: ${dblDmg}`)
            console.log('missed')
            // send to dialog attack was missed
        }
        if (who==='user' && finalAtk !== undefined){
            compStats.currentHP=finalHP;
            $('.comp-hp-text').text(`${compStats.currentHP}/${$('.user-hp-bar').attr('max')}`);
            $('.comp-hp-bar').val(compStats.currentHP);
            handleCompAtk();
        } else if(who==='comp' && finalAtk !== undefined){
            userStats.currentHP=finalHP;
            $('.user-hp-text').text(`${userStats.currentHP}/${$('.user-hp-bar').attr('max')}`);
            $('.user-hp-bar').val(userStats.currentHP);
        }
    }

    const handleLogOut = (token) => {

        $.ajax({
            method: 'PATCH',
            url: `/logout/user/`,
            data: token
        }).then(logout=>{
            console.log(logout)
            if (logout){
                window.location.href = '/'
            }
        })
    }
    
    $('#gameWindowRight').on('click', '.attack', function(e){
        e.preventDefault();
        const atkChosen = $(this).val().trim();
        handleAtk(atkChosen);
    });

    $('.nes-logo').click(function(){
        // $.get(`/`
        modal1.modal('open')
    })

    modal1.on('click', 'button', function(){
        console.log($(this).text())
        switch ($(this).text()){
            case 'Resume': modal1.modal('close'); break;
            case 'Exit to Main Menu': window.location.href = '/'; break;
            case 'Log Out': handleLogOut(parkUToken); break;
        }
    })
})
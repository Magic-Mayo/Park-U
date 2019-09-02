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
    let compHP = 100;
    let userStats = {
        data: false,
        attack: {
            names: {
                attackOne: {},
                attackTwo: {},
                attackThree: {},
                attackFour: {}
            },
            strength: {
                attackOne: [],
                attackTwo: [],
                attackThree: [],
                attackFour: []
            },
            accuracy: {
                attackOne: {},
                attackTwo: {},
                attackThree: {},
                attackFour: {}
            }
        },
        defense: {},
        luck: {},
        maxHP: {},
        currentHP: {}
    }

    let compStats = {
        data: false,
        whichComp: null,
        attack: {
            attackOne: {},
            attackTwo: {},
            attackThree: {},
            attackFour: {}
        },
        strength: {
            attackOne: [],
            attackTwo: [],
            attackThree: [],
            attackFour: []
        },
        accuracy: {
            attackOne: {},
            attackTwo: {},
            attackThree: {},
            attackFour: {}
        },
        defense: {},
        luck: {},
        maxHP: {},
        currentHP: {}
    }

    const id = window.location.href.split('=')[1];
    let windowTitle = $('title');
    const title = $('.game-title').html();

    $('#gameWindowRight').on('click', '.attack', function(e){
        e.preventDefault();
        const atkChosen = $(this).val().trim();
        handleAtk(atkChosen);
    });

    
    const getStats = (charId, comp) => {
        console.log(userStats)
        if (!userStats.data){
            $.get(`/user/char/${charId}/stats`, (stats)=>{
                const atk = userStats.attack;
                const stat = stats.Attack;
                // for (i in stats){
                //     atk.names
                // }
                atk.names.attackOne = stat.attackOneName;
                atk.names.attackTwo = stat.attackTwoName;
                atk.names.attackThree = stat.attackThreeName;
                atk.names.attackFour = stat.attackFourName;
                atk.strength.attackOne = stat.attackOne.split('-');
                atk.strength.attackTwo = stat.attackTwo.split('-');
                atk.strength.attackThree = stat.attackThree.split('-');
                atk.strength.attackFour = stat.attackFour.split('-');
                atk.accuracy.attackOne = stat.attackOneAcc;
                atk.accuracy.attackTwo = stat.attackTwoAcc;
                atk.accuracy.attackThree = stat.attackThreeAcc;
                atk.accuracy.attackFour = stat.attackFourAcc;
                userStats.maxHP = stats.maxHP;
                userStats.currentHP = stats.currentHP;
                userStats.defense = stats.defense;
                userStats.luck = stats.luck;

                userStats.data = true;

                for (i in userStats.attack.names){
                    const name = userStats.attack.names;
                    const btn = $('<button>');
                    btn.addClass('attack nes-btn is-primary').attr('value', i).append(name[i]).attr('id', i);
                    $('.atk-btn').append(btn);
                }

                console.log(stats);
                $('.user-hp-bar').attr('value', `${userStats.currentHP}`).attr('max', `${userStats.maxHP}`);
                $('.user-hp-text').text(`${userStats.currentHP}/${userStats.maxHP}`)
                // $('.comp-hp-bar').attr('value', `${compStats.hp}`).attr('max', `${compStats.hp}`)
                gotStats = true;
            })
        }

        if(!compStats.data){
            $.get(`/comp/${comp}/stats`, stats=>{

            })
        }
    }

    getStats(id);

    const handleAtk = (attackId) => {
        const atk = userStats.attack.strength;
        const luck = userStats.luck;
        const acc = userStats.attack.accuracy[attackId];
        switch (attackId){
            case 'attackOne': attack(atk.attackOne, acc, 5, luck, compHP); break;
            case 'attackTwo': attack(atk.attackTwo, acc, 5, luck, compHP); break;
            case 'attackThree': attack(atk.attackThree, acc, 5, luck, compHP); break;
            case 'attackFour': attack(atk.attackFour, acc, 5, luck, compHP); break;
        }
        
    }

    const attack = (attack, acc, defense, luck, hp, who) => {
        let finalAtk;
        const atkRng = Math.floor(Math.random()*5);
        const atk = Math.ceil(Math.random() * 100);
        let total = hp + defense;
        const dblDmg = Math.ceil(Math.random()*100);
        if (atk <= acc){
            if (luck===dblDmg){
                finalAtk = attack[4]*2;
                total -= finalAtk;
                console.log('dbl')
            } else {
                console.log('normal')
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
                total-=finalAtk;
                compHP=total;
                $('.game-window').addClass('flash');
                setTimeout(()=>{$('.game-window').removeClass('flash')},300);
                $('.user-hp-text').text(`${compHP}/${$('.user-hp-bar').attr('max')}`);
                $('.user-hp-bar').val(compHP);
            }

            // if(){
            // } else {
            //     userHP=total;
            // }
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Range: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${total}`, `\n`,  `Dbl dmg: ${dblDmg}`)
        } else {
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Range: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${total}`, `\n`,  `Dbl dmg: ${dblDmg}`)
            console.log('missed')
            // send to dialog attack was missed
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
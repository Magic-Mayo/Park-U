$(document).ready(()=>{
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
        hp: {}
    }

    const id = $('.userId').val().trim();
    
    $('#gameWindow').on('click', '.attack', function(e){
        e.preventDefault();
        const atkChosen = $(this).val().trim();
        handleAtk(atkChosen);
    });
    
    const getStats = (id) => {
        console.log(userStats)
        if (!userStats.data){
            $.get(`user/stats/${id}`, (stats)=>{
                const atk = userStats.attack;
                atk.names.attackOne = stats.Attack.attackOneName;
                atk.names.attackTwo = stats.Attack.attackTwoName;
                atk.names.attackThree = stats.Attack.attackThreeName;
                atk.names.attackFour = stats.Attack.attackFourName;
                atk.strength.attackOne = stats.Attack.attackOne.split('-');
                atk.strength.attackTwo = stats.Attack.attackTwo.split('-');
                atk.strength.attackThree = stats.Attack.attackThree.split('-');
                atk.strength.attackFour = stats.Attack.attackFour.split('-');
                atk.accuracy.attackOne = stats.Attack.attackOneAcc
                atk.accuracy.attackTwo = stats.Attack.attackTwoAcc;
                atk.accuracy.attackThree = stats.Attack.attackThreeAcc;
                atk.accuracy.attackFour = stats.Attack.attackFourAcc;
                userStats.hp = stats.hp;
                userStats.defense = stats.defense;
                userStats.luck = stats.luck;

                userStats.data = true;

                for (i in userStats.attack.names){
                    const name = userStats.attack.names;
                    const form = $('<form>');
                    const btn = $('<button>');
                    form.addClass('atk');
                    btn.addClass('attack').attr('value', i).append(name[i]);
                    form.append(btn);
                    $('#gameWindow').append(form);
                }

                console.log(stats);
                gotStats = true;
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

    const attack = (attack, acc, defense, luck, hp) => {
        let finalAtk;
        const atkRng = Math.floor(Math.random()*5)
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
})
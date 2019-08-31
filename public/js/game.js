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
    // const getUserinfo = () => {
    //     $.get('')
    //     $('#userId').attr('value', )
    // }
    const id = $('#userId').val().trim();
    
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
                userStats.hp = stats.hp;
                userStats.defense = stats.defense;
                userStats.luck = stats.luck;

                userStats.data = true;

                for (i in userStats.attack.names){
                    const name = userStats.attack.names;
                    const form = $('<form>');
                    const btn = $('<button>');
                    form.addClass('atk');
                    btn.addClass('attack nes-btn is-primary').attr('value', i).append(name[i]);
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
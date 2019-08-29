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
    
    const getStats = (id) => {
        if (!userStats.data){
            $.get(`user/stats/${id}`, (stats)=>{
                userStats.attack.names.attackOne = stats.Attack.attackOneName;
                userStats.attack.names.attackTwo = stats.Attack.attackTwoName;
                userStats.attack.names.attackThree = stats.Attack.attackThreeName;
                userStats.attack.names.attackFour = stats.Attack.attackFourName;
                userStats.attack.strength.attackOne = stats.Attack.attackOne.split('-');
                userStats.attack.strength.attackTwo = stats.Attack.attackTwo.split('-');
                userStats.attack.strength.attackThree = stats.Attack.attackThree.split('-');
                userStats.attack.strength.attackFour = stats.Attack.attackFour.split('-');
                userStats.attack.accuracy.attackOne = stats.Attack.attackOneAcc
                userStats.attack.accuracy.attackTwo = stats.Attack.attackTwoAcc;
                userStats.attack.accuracy.attackThree = stats.Attack.attackThreeAcc;
                userStats.attack.accuracy.attackFour = stats.Attack.attackFourAcc;
                userStats.data = true;

                for (i in userStats.attack.strength){
                    console.log(i)
                    let j = 1;
                    const form = $('<form>');
                    const btn = $('<button>');
                    form.addClass('atk');
                    btn.addClass('attack').attr('id', `attack-${j}`).attr('atk-strength', i);
                    form.append(btn);
                    $('#gameWindow').append(form);
                    j++;
                }

                $('#attack-1').attr('value', 1).append(userStats.attack.names.attackOne);
                $('#attack-2').attr('value', 2).append(userStats.attack.names.attackTwo);
                $('#attack-3').attr('value', 3).append(userStats.attack.names.attackThree);
                $('#attack-4').attr('value', 4).append(userStats.attack.names.attackFour);

                console.log(stats);
                gotStats = true;
            })
        }
    }

    const handleAtk = (attackId) => {
        // switch (/* attack selected */){
        //     case 1: attack(attacks.strength.attackOne, 90, 5, userLuck, compHP); break;
        //     case 2: attack(attacks.strength.attackTwo, 90, 5, userLuck, compHP); break;
        //     case 3: attack(attacks.strength.attackThree, 90, 5, userLuck, compHP); break;
        //     case 4: attack(attacks.strength.attackFour, 90, 5, userLuck, compHP); break;
        // }
        
    }

    const attack = (attack, acc, defense, luck, hp) => {
        console.log(userHP)
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

            if(attack===userAtk){
            } else {
                userHP=total;
            }
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Range: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${total}`, `\n`,  `Dbl dmg: ${dblDmg}`)
        } else {
            console.log(`Attack power: ${finalAtk}`, `\n`, `Attack Range: ${atkRng}`, `\n`,  `Attack accuracy base: ${atk}`, `\n`,  `Accuracy: ${acc}`, `\n`,  `HP after defense: ${total}`, `\n`,  `Dbl dmg: ${dblDmg}`)
            console.log('missed')
            // send to dialog attack was missed
        }
    }

    // $('.atk').on('submit', handleAtkSubmit);

    $('.atk').on('click', function(e){
        e.preventDefault();
        const atkChosen = $(this).val().trim();
        handleAtk(atkChosen);
    })
    getStats(id);
    // $('#attack-2').on('click', function(e){
    //     e.preventDefault();
    //     atkChosen = $(this).val().trim();
    // })
    // $('#attack-3').on('click', function(e){
    //     e.preventDefault();
    //     atkChosen = $(this).val().trim();
    // })
    // $('#attack-4').on('click', function(e){
    //     e.preventDefault();
    //     atkChosen = $(this).val().trim();
    // })
})
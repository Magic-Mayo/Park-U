$(document).ready(()=>{
    let gotUserStats = false;
    let gotCompStats = false;
    let userHP;
    let userDef;
    let userAtk = [];
    let userLuck;
    let userAcc;
    let compHP = 100;
    console.log(userHP)
    const id = $('.userId').val().trim();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const atk = $('.atk-rng').val().trim();
        userAtk = atk.split('-');
        handleAtk(id)
    }

    const handleAtk = (id) => {
        if (!gotUserStats){
            $.get(`user/stats/${id}`, (stats)=>{
                if (userHP === undefined && userDef === undefined && userLuck === undefined){
                    userHP = stats.hp;
                    userDef = stats.defense;
                    userLuck = stats.luck;
                }
                console.log(stats)
                gotStats = true;
            })
        }
        attack(userAtk, 90, 5, userLuck, compHP)
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

    $('.atk').on('submit', handleSubmit)
})
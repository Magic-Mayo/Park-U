$(document).ready(()=>{
    let userHP;
    let userDef;
    let userAtk;
    let userLuck;
    let userAcc;

    $.get('/user/stats', (stats)=>{
        userHp = stats.dataValues.hp;
        userDef = stats.dataValues.defense;
        userLuck = stats.dataValues.luck;
        userAcc = stats.dataValues.accuracy
    })

    const handleAtk = () => {
        if (/* attack button clicked*/){
            attack(userAtk, userAcc, compDef, userLuck, compHP)
        } else {
            attack(compAtk, compAcc, userDef, compLuck, userHP)
        }
    }

    const attack = (attack, acc, defense, luck, hp) => {
        const atk = Math.floor(Math.random() * (100 - 0 + 1));
        let total = hp + defense;
        const dblDmg = Math.floor(Math.random()*100);
        if (atk <= acc){
            if (luck===dblDmg){
                attack=attack*2;
                total-=attack;
            } else {
                total-=attack;
            }

            if(attack===userAtk){
                compHP=total;
            } else {
                userHP=total;
            }
        } else {
            // send to dialog attack was missed
        }
    }
})
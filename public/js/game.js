$(document).ready(()=>{
    let userHP;
    let userDef;
    let userAtk;
    let userLuck;
    let userAcc;
    
    const url = window.location.search;
    
    
    
    const handleAtk = (id) => {
        let getStats;
        if (url.indexOf('?userId=') !== -1){
            getStats = url.split('=')[1];
        }

        console.log(getStats)
        const queryURL = '/user/stats/' + getStats
        $.get(queryURL, (stats)=>{
            // userHp = stats.dataValues.hp;
            // userDef = stats.dataValues.defense;
            // userLuck = stats.dataValues.luck;
            console.log(stats)
        
            // if (/* attack button clicked*/){
                // attack(userAtk, userAcc, 5, userLuck, 100)
            // } else {
            //     attack(compAtk, compAcc, userDef, compLuck, userHP)
            // }
        })
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
    $('#attack').on('submit', handleAtk)
})
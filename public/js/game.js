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
    defeatModal.modal({
        endingTop: '28%',
        dismissible: false
    })
    
    const parkUToken = localStorage.getItem('_ParkU');
    let gotCompStats = false;

    const jason = $('#jason');
    const david = $('#david');
    const neill = $('#neill');
    const jj = $('#jj');
    const andrew = $('#andrew');
    const userSpeech = $('.user-speech-text');
    const compSpeech = $('.comp-speech-text');
    const userBubble = $('.user-speech-bubble');
    const compBubble = $('.comp-speech-bubble');
    const battleScene = $('.battle-scene');

    const userMisses = ['I guess I must\'ve had a typo...', 'One sec...let me check stack overflow on why that didn\'t work', 'Shoot, I forgot a semicolon!!', ];
    const compMisses = [];

    let userStats = {
        data: false,
        class: '',
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

    const compId = window.location.href.split('/').pop();
    const id = window.location.href.split('=')[1];
    let windowTitle = $('title');
    const gameTitle = $('.game-title').not($('.game-title').hasClass('hide')).html();
    
    const getStats = (charId, comp) => {
        $('.attack').prop('disabled', false);
        if (!userStats.data){
            $.get(`/user/char/${charId}/stats`, (stats)=>{
                const atk = userStats.attack;
                const stat = stats.Attack;
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
                userStats.class = stats.class;
                
                for (i in stat){
                    const btn = $('<button>');
                    switch(i.toString().slice(-3)){
                        case 'ame':
                            btn.addClass('attack').attr('value', i.toString().split('N')[0]).append(stat[i]).attr('id', i.toString().split('N')[0]);
                            $('.atk-btn').append(btn); break;
                    }
                }
                $('.user-hp-bar').attr('value', `${userStats.currentHP}`).attr('max', `${userStats.maxHP}`);
                $('.user-hp-text').text(`${userStats.currentHP}/${userStats.maxHP}`);
            })
        } else {
            userStats.currentHP = userStats.maxHP;
            $('.user-hp-bar').attr('value', `${userStats.currentHP}`).attr('max', `${userStats.maxHP}`);
            $('.user-hp-text').text(`${userStats.currentHP}/${userStats.maxHP}`);
        }
        
        windowTitle.html(gameTitle);

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
            
            compStats.id = comp.charName;
            compStats.maxHP = comp.maxHP;
            compStats.currentHP = comp.currentHP;
            compStats.defense = comp.defense;
            compStats.luck = comp.luck;

            for (i in comp.Attack){
                switch(i.toString().slice(-3)){
                    case 'ame': compStats.attack.names.push(comp.Attack[i]); break;
                    case 'Acc': compStats.attack.accuracy.push(comp.Attack[i]); break;
                    case 'Dmg': compStats.attack.strength.push(comp.Attack[i].split('-')); break;
                }
            }

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
        attack(compStats.attack.strength[atkChosen], compStats.attack.accuracy[atkChosen], userStats.defense, compStats.luck, userStats.currentHP, 'comp', compStats.attack.names[atkChosen])
    }


    const attack = (attack, acc, defense, luck, hp, who, compAtkName) => {
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
            
            let total = hp + defense;
            if (luck===dblDmg){
                finalAtk = attack[4]*2;
                total -= finalAtk;
                finalHP = total;
                $('.game-window').addClass('dbl-dmg');
                setTimeout(()=>{$('.game-window').removeClass('dbl-dmg')},300);
                
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

        } else if (atk>acc){
            handleSpeech(who);
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
                handleSpeech(who, finalAtk);
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
                handleSpeech(who, finalAtk, attack, compAtkName);
            }
        }
    }

    const handleSpeech = (who, hit, attack, compAtkName) =>{

        if (who === 'user'){
            $('.attack').prop('disabled', true);
            let attackName;
            
            // if (userStats.class === 'CSS'){
            //     switch (attack){
            //         case 'attackOne': attackName = ; break;
            //         case 'attackTwo': attackName = ; break;
            //         case 'attackThree': attackName = ; break;
            //         case 'attackFour': attackName = ; break;
            //     }
                
            //     userSpeech.text(attackName);
            //     userSpeech.removeClass('hide');
                
            // } else if (userStats.class === 'HTML'){
            //     switch (attack){
            //         case 'attackOne': attackName = ; break;
            //         case 'attackTwo': attackName = ; break;
            //         case 'attackThree': attackName = ; break;
            //         case 'attackFour': attackName = ; break;
            //     }
                
            //     userSpeech.text(attackName);
            //     userSpeech.removeClass('hide');

            // } else if (userStats.class === 'Javascript'){
            //     switch (attack){
            //         case 'attackOne': attackName = ; break;
            //         case 'attackTwo': attackName = ; break;
            //         case 'attackThree': attackName = ; break;
            //         case 'attackFour': attackName = ; break;
            //     }
            //     userSpeech.text(attackName);
            //     userBubble.removeClass('hide');
            // }
            if (hit === undefined){
                const missSpeech = userMisses[Math.floor(Math.random()*3)];                
                userSpeech.text(missSpeech)
                userBubble.removeClass('hide');
            } else {
                userSpeech.text(attack);
            }

            setTimeout(()=>{userBubble.addClass('hide')}, 2000);

        } else if (who === 'comp') {

            if (hit === undefined){
                compSpeech.text('I missed');
                compBubble.removeClass('hide');                
            } else {               
                compSpeech.text(compAtkName);
                compBubble.removeClass('hide');
            }

            setTimeout(()=>{ 
                compBubble.addClass('hide');
                $('.attack').prop('disabled', false);
            }, 2000);
            
        } else {
        
        }
    }

    const userDefeat = () => {
        $('.battle-scene').addClass('defeat');
        $('.defeat-text').text(`Your coding prowess was no match for ${compStats.id}....this time`);
        setTimeout(()=>{$('.battle-scene').addClass('transparent')}, 2450);
        setTimeout(()=>{$('#defeat-modal').modal('open').css('opacity', '1')}, 2750);
    }

    const compDefeat = () => {
        gotCompStats = false;
        handleBannerChange(compStats.id);
        getStats(id, compStats.id);
    }

    const handleBannerChange = (comp) => {
        if (comp === 'Andrew') {
            jason.removeClass('hide');
            andrew.addClass('smashed');
            jason.addClass('smash');
            setTimeout(()=>{
                battleScene.css('background-image', 'url("/assets/images/jason.png")');
                andrew.addClass('hide');
                andrew.removeClass('smashed');
                jason.removeClass('smash');
            }, 1350);
        } else if (comp === 'Jason') {
            neill.removeClass('hide');
            jason.addClass('smashed');
            neill.addClass('smash');
            setTimeout(()=>{
                battleScene.css('background-image', 'url("/assets/images/neill.png")');
                jason.addClass('hide');
                jason.removeClass('smashed');
                neill.removeClass('smash');
            }, 1355);
        } else if (comp === 'Neill') {
            david.removeClass('hide');
            neill.addClass('smashed');
            david.addClass('smash');
            setTimeout(()=>{
                battleScene.css('background-image', 'url("/assets/images/FIGHTODAVID.png")');
                neill.addClass('hide');
                neill.removeClass('smashed');
                david.removeClass('smash');
            }, 1355);
        } else if (comp === 'David') {
            jj.removeClass('hide');
            david.addClass('smashed');
            jj.addClass('smash');
            setTimeout(()=>{
                battleScene.css('background-image', 'url("/assets/images/jj\ fight.png")');
                david.addClass('hide');
                david.removeClass('smashed');
                jj.removeClass('smash');
            }, 1355);
        }
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
            setTimeout(handleCompAtk, 1999);
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

    $('.game-over-btn').on('click', 'button', function(){
        switch($(this).text()){
            case 'Try Again': getStats(id, ''); break;
            case 'Main Menu': window.location.href = '/'; break;
            case 'Sign Out': handleLogOut(parkUToken);
        }
    })

    const verifyToken = (token) => {
        $.post(`/token/`, {token: token}).then(dbtoken=>{
            if (!dbtoken){
                window.location.href = '/droppedout'
            }
        })
    }

    defeatModal.on('click', 'button', ()=>{
        defeatModal.modal('close');
        $('.battle-scene').removeClass('transparent');
    })

    if (parkUToken){
        verifyToken(parkUToken);
    } else {
        window.location.href = '/droppedout'
    }
})
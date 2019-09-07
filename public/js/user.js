$(document).ready(()=>{
    $('.modal').modal({
        endingTop: '25%'
    });

    $('#modal1').modal({
        endingTop: '28%'
    });

    $('#modal3').modal({
        dismissible: false,
        endingTop: '25%'
    });

    $('#modal4').modal({
        dismissible: false,
        endingTop: '25%'
    });

    const parkUToken = localStorage.getItem('_ParkU');
    const newUser = $('#new-user');
    const newWord = $('#new-word');
    const user = $('#user');
    const userPass = $('#userPass');
    const charName = $('#char-name');
    const luck = $('#luck');
    let userId;
    let newClass;
    const passCheck = $('#pass-check');
    const pass = $('.pass');
    const modal1 = $('#modal1');
    const modal3 = $('#modal3');
    const modal4 = $('#modal4');
    let userName;

    const handleNewUser = (e) => {
        e.preventDefault();
        
        if(!newUser.val().trim() || !newWord.val().trim()){
            if (!newUser.val()){
                newUser.attr('placeholder', 'Please enter a user name!');
                newUser.addClass('placeholder-color');
            }
            if (!newWord.val()){
                newWord.attr('placeholder', 'Please enter a password!');
                newWord.addClass('placeholder-color');
            }

            return;
        } else if(newWord.val().match(/^(?=.*[0-9].*)(?=.*[a-z].*)(?=.*[A-Z].*)([a-zA-Z0-9]+)$/) && newWord.val().length>=8){
            if (newUser.hasClass('placeholder-color')){
                newUser.removeClass('placeholder-color');
            }
            if (newWord.hasClass('placeholder-color')){
                newWord.removeClass('placeholder-color');
            }
            createUser({userName: newUser.val().trim(), pass: newWord.val().trim()});
        } else {
            return;
        }
    }

    const handleNewCharacter = (e) => {
        e.preventDefault();

        if ($('#user-class-javascript').prop('checked')){
            newClass = 'Javascript';
        } else if ($('#user-class-html').prop('checked')){
            newClass = 'HTML';
        } else if ($('#user-class-css').prop('checked')){
            newClass = 'CSS';
        }
        if (!luck.val().trim() || !charName.val().trim()){
            if (!luck.val()){
                $('#luck').attr('placeholder', 'Please select a number from 1-100!');
                $('#luck').addClass('placeholder-color');
            }
            if(!charName.val()){
                $('#char-name').attr('placeholder', 'Please enter a name for your character!');
                $('#char-name').addClass('placeholder-color');
            }
            return;
        } else if (luck.val().trim() <= 100 && luck.val().trim() >= 1 && charName.val().trim()){
            if ($('#char-name').hasClass('placeholder-color')){
                $('#char-name').removeClass('placeholder-color');
            } else if($('#luck').addClass('placeholder-color')){
                $('#luck').removeClass('placeholder-color');
            }
            newCharacter({id: userId, name: charName.val().trim(), luckyNum: luck.val().trim(), class: newClass})
        }

        if (parkUToken){
            $.post(`/token/`, {token: parkUToken}).then(uid=>{
                userId = uid.userId
            })
        }

    }

    const handleVerifyPass = (e) => {
        e.preventDefault();

        verifyPass({userName: user.val().trim(), password: userPass.val().trim()})
    }

    const createUser = (user) => {
        $.post('/new/user', user).then(token=>{
            if(token){
                localStorage.setItem('_ParkU', token.token);
                $('.create-modal-title').text(`${token.userName}, Create A Character!`);
                modal1.modal('close');
                modal4.modal('open');
                userId = token.uid;
            } else {
                modal1.append(`<p style='color: red; font-size: .8rem; text-align: center;position: relative; bottom: 26px;'>User name not available! Please choose another!</p>`);
            }
        })
    }

    // Future for resetting passwords
    const forgotWord = (pass) => {
        $.post(`/new/word/`, pass)
    }

    const newCharacter = (newChar) => {
        $.post(`/new/char/${newChar.id}`, newChar).then(char=>{
            if (char){
                window.location.href = `/start/id=${char}`;
            } else {
                // .text('Looks like you're missing some info!)
            }
        })
    }

    const handleDeleteUser = (e) => {
        e.preventDefault();
        const user = $('#delete-user').val().trim();
        deleteUser(user);
    }

    const deleteUser = (id) => {
        $.ajax({
            method: 'DELETE',
            url: `delete/${id}`})
    }

    const verifyPass = (pass) => {
        $('.char-btn').empty();
        $.post('/word/verify', pass).then(verified=>{
            userPass.val('');
            if (verified.valid){
                localStorage.setItem('_ParkU', verified.token);
                userId = verified.uid;
                userName = verified.userName;
                if (verified.token && verified.character.length > 0){
                    for (let i=0; i<verified.character.length; i++){
                        const btn = $('<button>');
                        btn.append(`<h4 class='char-name'>${verified.character[i].charName}</h4>`)
                        .append(`<p class='char-stats'>Class: ${verified.character[i].class} && HP: ${verified.character[i].currentHP}`)
                        .addClass('user-char-btn')
                        .data('id', verified.character[i].id);
                        $('.char-btn').append('<br>').append(btn);
                    }
                    modal3.modal('open');
                } else {
                    $('.char-select-btn').addClass('hide');
                    $('.create-modal-title').text(`${verified.userName}, Create A Character!`);
                    modal4.modal('open');
                }
            } else if(verified.locked){
                $('.invalid-pass').text(verified.msg);
            } else {
                $('.invalid-pass').text(verified.msg);
            }
        })
    }

    const verifyToken = (token) => {
        $.post(`/token/`, {token: token}).then(dbtoken=>{
            if (!dbtoken){
                return;
            } else if (dbtoken.characters.length > 0){
                $('.char-btn').empty();
                userName = dbtoken.userName;
                userId = dbtoken.id;
                for (let i=0; i<dbtoken.characters.length; i++){
                    const btn = $('<button>')
                    btn.append(`<h4 class='char-name'>${dbtoken.characters[i].charName}</h4>`)
                    .append(`<p class='char-stats'>Class: ${dbtoken.characters[i].class} && HP: ${dbtoken.characters[i].currentHP}`)
                    .addClass('user-char-btn')
                    .data('id', dbtoken.characters[i].id);
                    $('.char-btn').append('<br>').append(btn);
                }
                modal3.modal('open');
            } else {
                userName = dbtoken.userName;
                userId = dbtoken.userId;
                $('.char-select-btn').addClass('hide');
                $('.create-modal-title').text(`${dbtoken.userName}, Create A Character!`);
                modal4.modal('open');
            }
        })
    }

    if (parkUToken){
        verifyToken(parkUToken);
    }

    $(document).on('submit', '#add-user', handleNewUser);
    $(document).on('submit', '#delete-user', handleDeleteUser);
    $(document).on('submit', '#add-char', handleNewCharacter);
    $(document).on('submit', '#login', handleVerifyPass);
    
    $('.signout').click((e)=>{
        e.preventDefault();
        $.ajax({
            method: 'DELETE',
            url: `/logout/user/${parkUToken}`
        }).then(logout=>{
            if (logout){
                modal4.modal('close');
                modal3.modal('close');
            }
        })
    })
    
    $('.char-btn').on('click', '.user-char-btn', function(){
        window.location.href = `/start/id=${$(this).data('id')}`
    })

    newUser.change(()=>{
        $.get(`/user/${newUser.val().trim()}`).then(user=>{
            if(user){
                $('.user-check').css('color', 'red').text('Not available!');
            } else {
                $('.user-check').css('color', '#17e73a').text('Available!');
            }
        })
    })

    passCheck.keyup(function(){
        if (passCheck.val().trim()===newWord.val().trim()){
            $('.pass-check').text('Passwords Match!').css('color', '#17e73a')
        } else {
            $('.pass-check').text('Passwords don\'t match!').css('color', 'red')
        }
    })

    newWord.keyup(function(){
        if (newWord.val().match(/^(?=.*[0-9].*)(?=.*[a-z].*)(?=.*[A-Z].*)([a-zA-Z0-9]+)$/) && newWord.val().length>=8){
            pass.css('color', '#17e73a').text('Password is Valid!')
        } else {
            pass.css('color', 'red').text('Invalid Password!')
        }
    })

    $('#create-new-char').click(()=>{
        $('.create-modal-title').text(`${userName}, Create A Character!`);
        modal4.modal('open');
        modal3.modal('close');
    })

    $('.char-select-btn').click((e)=>{
        e.preventDefault();
        modal3.modal('open');
        modal4.modal('close');
    })
})
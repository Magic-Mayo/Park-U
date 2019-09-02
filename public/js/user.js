$(document).ready(()=>{
    $('.modal').modal({
        endingTop: '25%'
    });

    $('#modal1').modal({
        endingTop: '28%'
    })

    $('#modal3').modal({
        dismissible: false,
        endingTop: '25%'
    })

    const parkUToken = localStorage.getItem('_ParkU');
    const newUser = $('#new-user');
    const newWord = $('#new-word');
    const user = $('#user');
    const userPass = $('#userPass');
    const charName = $('#char-name');
    const luck = $('#luck');
    let userId;
    const newClass = $('input:checked').val();
    const passCheck = $('#pass-check');
    const pass = $('.pass')

    const handleNewUser = (e) => {
        e.preventDefault();
        
        if(!newUser.val().trim() || !newWord.val().trim()){
            return
        }

        createUser({userName: newUser.val().trim(), pass: newWord.val().trim()});
    }

    const handleNewCharacter = (e) => {
        e.preventDefault();
        if (!luck.val().trim() || !charName.val().trim()){
            return;
        }
        if (parkUToken){
            $.get(`/token/${parkUToken}`).then(uid=>{
                userId = uid.userId
            })
        }

        newCharacter({id: userId, name: charName.val().trim(), luckyNum: luck.val(), class: newClass})
    }

    const handleVerifyPass = (e) => {
        e.preventDefault();

        verifyPass({userName: user.val().trim(), password: userPass.val().trim()})
    }

    const createUser = (user) => {
        $.post('/new/user', user).then(token=>{
            console.log(token)
            if(token){
                localStorage.setItem('_ParkU', token.token);
                $('#modal4').modal('open');
                userId = token.uid;
            } else {
                $('#modal1').append(`<p style='color: red; font-size: .8rem; text-align: center;position: relative; bottom: 26px;'>User name not available! Please choose another!</p>`);
            }
        })
    }

    // Future for resetting passwords
    const forgotWord = (user, pass) => {
        $.post(`/new/word/${user}`, pass)
    }

    const newCharacter = (newChar) => {
        $.post(`/new/char/${newChar.id}`, newChar).then(char=>{
            window.location.href = `/start/id=${char}`;
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
        $.post('/word/verify', pass).then(verified=>{
            if (verified){
                localStorage.setItem('_ParkU', verified.token);
                userId = verified.uid;
                
                if (verified.token && verified.character.length > 0){
                    // uid = verified.
                    for (let i=0; i<verified.character.length; i++){
                        const btn = $('<button>');
                        btn.append(`<h4 class='char-name'>${verified.character[i].charName}</h4>`)
                        .append(`<p class='char-stats'>Class: ${verified.character[i].class} && HP: ${verified.character[i].currentHP}`)
                        .addClass('user-char-btn')
                        .data('id', verified.character[i].id);
                        $('.char-btn').append('<br>').append(btn);
                    }
                    $('#modal3').modal('open');
                } else {
                    $('#modal4').modal('open');
                }
            } else {
                
            }
        })
    }

    const verifyToken = (token) => {
        $.post(`/token/`, {token: token}).then(dbtoken=>{
            if (dbtoken){
                userId = dbtoken.characters.id
                for (let i=0; i<dbtoken.characters.length; i++){
                    const btn = $('<button>')
                    btn.append(`<h4 class='char-name'>${dbtoken.characters[i].charName}</h4>`)
                    .append(`<p class='char-stats'>Class: ${dbtoken.characters[i].class} && HP: ${dbtoken.characters[i].currentHP}`)
                    .addClass('user-char-btn')
                    .data('id', dbtoken.characters[i].id);
                    $('.char-btn').append('<br>').append(btn);
                }
                $('#modal3').modal('open');
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
    
    $('#signout').click(()=>{
        $.ajax({
            method: 'DELETE',
            url: `/logout/user/${parkUToken}`
        }).then(logout=>{
            if (logout){
                $('#modal3').modal('close');
            }
        })
    })
    
    $('.char-btn').on('click', '.user-char-btn', function(){
        window.location.href = `/start/id=${$(this).data('id')}`
    })

    $('#new-user').change(()=>{
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
            // .css('left', '438px')
        } else {
            $('.pass-check').text('Passwords don\'t match!').css('color', 'red')
            // .css('left', '388px')
        }
    })

    newWord.keyup(function(){
        if (newWord.val().match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)){
            pass.css('color', '#17e73a').text('Password is Valid!')
        } else {
            pass.css('color', 'red').text('Invalid Password!')
        }
    })
})
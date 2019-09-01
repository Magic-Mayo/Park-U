$(document).ready(()=>{
    $('.modal').modal({
        endingTop: '25%'
    });

    const parkUToken = localStorage.getItem('_ParkU');
    const newUser = $('#new-user');
    const newWord = $('#new-word');
    const user = $('#user');
    const userPass = $('#userPass');
    const charName = $('#char-name');
    const luck = $('#luck');
    let userId = $('#userId').val();
    const newClass = $('input:checked').val();

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
        console.log(newClass)
        newCharacter({id: userId, name: charName.val().trim(), luckyNum: luck.val(), class: newClass})
    }

    const handleVerifyPass = (e) => {
        e.preventDefault();

        verifyPass({userName: user.val().trim(), password: userPass.val().trim()})
    }

    const createUser = (user) => {
        $.post('/new/user', user).then(token=>{
            localStorage.setItem('_ParkU', token);
            $('#modal4').modal('open');
        })
    }

    // Future for resetting passwords
    const forgotWord = (user, pass) => {
        $.post(`/new/word/${user}`, pass)
    }

    const newCharacter = (newChar) => {
        console.log(newChar)
        $.post(`/new/char/${newChar.id}`, newChar).then(newChar=>{
            
            window.location.href = `/start/id=${newChar.id}`;
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
                    console.log('verified')
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
                    console.log('modal 4')
                    $('#modal4').modal('open');
                }
            } else {
                console.log('wrong')
                // let user know wrong password was entered
            }
        })
    }
    let uid;
    const verifyToken = (token) => {
        $.get(`/token/${token}`, (dbtoken)=>{
            console.log(dbtoken.characters)
            if (dbtoken){
                for (let i=0; i<dbtoken.characters.length; i++){
                    const btn = $('<button>')
                    btn.append(`<h4 class='char-name'>${dbtoken.characters[i].charName}</h4>`)
                    .append(`<p class='char-stats'>Class: ${dbtoken.characters[i].class} && HP: ${dbtoken.characters[i].currentHP}`)
                    .addClass('flex-btn')
                    .data('id', dbtoken.characters[i].id);
                    $('.char-btn').append('<br>').append(btn);
                }
                $('#modal4').modal('open');
            } else {
                console.log('sign in')
            }
        })
    }

    // if (parkUToken){
    //     console.log('token here')
    //     console.log(userId.val())
    //     verifyToken(parkUToken);
    // }

    $(document).on('submit', '#add-user', handleNewUser);
    $(document).on('submit', '#delete-user', handleDeleteUser);
    $(document).on('submit', '#add-char', handleNewCharacter);
    $(document).on('submit', '#login', handleVerifyPass);
    
    $('.char-btn').on('click', '.user-char-btn', function(){
        window.location.href = `/start/id=${$(this).data('id')}`
    })
})
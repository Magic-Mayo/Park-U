$(document).ready(()=>{
    $('.modal').modal({
        endingTop: '25%'
    });

    const parkUToken = localStorage.getItem('_ParkU');
    const newUser = $('#new-user');
    const newWord = $('#new-word');
    const user = $('#user');
    const userPass = $('#userPass');


    const formSubmit = (e) => {
        e.preventDefault();
        
        if(!newUser.val().trim() || !newWord.val().trim()){
            return
        }

        createUser({userName: newUser.val().trim(), pass: newWord.val().trim()});
    }

    const handleVerifyPass = (e) => {
        e.preventDefault();

        verifyPass({userName: user.val().trim(), password: userPass.val().trim()})
    }

    const createUser = (user) => {
        $.post('/new/user', user).then(token=>{
            localStorage.setItem('_ParkU',token)
        })
    }

    // Future for resetting passwords
    const userWord = (pass) => {
        $.post('/new/word', pass)
    }

    const newCharacter = (newClass) => {
        $.post('/new/char/:user', newClass)
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
        $.post('/word/verify', pass).then((verified)=>{
            if (verified){
                window.location.href = '/start'
            } else {
                // let user know wrong password was entered
            }
        })
    }

    const verifyToken = (token) => {
        $.get(`/token/${token}`, (dbtoken)=>{
            console.log(dbtoken.characters)
            if (dbtoken){
                for (let i=0; i<dbtoken.characters.length; i++){
                    const btn = $('<button>')
                    btn.append(`<h4 class='char-name'>${dbtoken.characters[i].charName}</h4>`)
                    .append(`<p class='char-stats'>Class: ${dbtoken.characters[i].class} || HP: ${dbtoken.characters[i].hp}`);
                    $('.char-btn').append(btn)
                }
                $('#modal3').modal('open');
            } else {
                console.log('sign in')
            }
        })
    }

    if (parkUToken){
        console.log('token here')
        verifyToken(parkUToken);
    }

    $(document).on('submit', '#add-user', formSubmit);
    $(document).on('click', '#delete-user', handleDeleteUser);
    $(document).on('click', '#new-char', newCharacter);
    $(document).on('submit', '#login', handleVerifyPass)
})
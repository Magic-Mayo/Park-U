$(document).ready(()=>{
    const newUser = $('#new-user');
    const newWord = $('#new-word');


    const formSubmit = (e) => {
        e.preventDefault();
        
        if(!newUser.val().trim()){
            return
        }

        createUser({userName: newUser.val().trim(), pass: newWord.val().trim()});
    }

    const handleVerifyPass = (e) => {
        e.preventDefault();

        verifyPass({userName: user.val().trim(), pass: userPass.val().trim()})
    }

    const createUser = (user) => {
        $.post('/new/user', user)
    }

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
        $.get('/word/verify', pass).then((next)=>{
            console.log(next)
        })
    }

    $(document).on('submit', '#add-user', formSubmit);
    $(document).on('click', '#delete-user', handleDeleteUser);
    $(document).on('click', '#new-char', newCharacter);
    $(document).on('click', '#login', handleVerifyPass)

})
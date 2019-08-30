$(document).ready(()=>{
    $('.modal').modal();
    const newUser = $('#new-user');
    const newWord = $('#new-word');


    const formSubmit = (e) => {
        e.preventDefault();
        
        if(!newUser.val().trim()){
            return
        }

        createUser({userName: newUser.val().trim()}, userWord({pass: newWord.val().trim()}));
    }

    const createUser = (user, pass) => {
        // $.get('/api/')
        $.post('/new/user', user).then(
            pass(pw))
    }

    const userWord = (pass) => {
        $.post('/new/word', pass)
    }

    const newCharacter = (newClass) => {
        $.post('/new/char/:user', newClass)
    }

    const handleDeleteUser = () => {
        
    }

    const deleteUser = (id) => {
        $.ajax({
            method: 'DELETE',
            url: `delete/${id}`})
    }
    $(document).on('submit', '#add-user', formSubmit);
    $(document).on('click', '#delete-user', handleDeleteUser);
    $(document).on('click', '#new-char', newCharacter);

})
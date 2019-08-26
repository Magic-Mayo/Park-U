$(document).ready(()=>{
    const newUser = $('#new-user');
    const newWord = $('#new-word');

    $(document).on('submit', '#add-user', formSubmit);
    $(document).on('click', '#delete-user', handleDeleteUser);
    $(document).on('click', '#new-char', newCharacter);

    const formSubmit = (e) => {
        e.preventDefault();
        
        if(!newUser.val().trim()){
            return
        }

        createUser({
            userName: newUser.val().trim()
        });
    }

    const createUser = (user) => {
        $.post('/new/user', user).then(
            userWord({
                pass: newWord.val().trim()
            })    
        )
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
})
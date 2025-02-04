// const signUpButton=document.getElementById('signUpButton');
// const signInButton=document.getElementById('signInButton');
// const signInForm=document.getElementById('signIn');
// const signUpForm=document.getElementById('signup');

// signUpButton.addEventListener('click',function(){
//     signInForm.style.display="none";
//     signUpForm.style.display="block";
// })
// signInButton.addEventListener('click', function(){
//     signInForm.style.display="block";
//     signUpForm.style.display="none";
// })
// Handle navigation to respective pages based on role
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const role = card.getAttribute('data-role'); // Get role from data attribute
        let targetPage;

        // Map roles to their respective pages
        switch (role) {
            case 'teacher':
                targetPage = 'teacher.html';
                break;
            case 'parent':
                targetPage = 'parent.html';
                break;
            case 'student':
                targetPage = 'student.html';
                break;
            case 'admin':
                targetPage = 'admin.html';
                break;
            default:
                console.error('Invalid role!');
                return;
        }

        // Redirect to the selected page
        window.location.href = targetPage;
    });
});

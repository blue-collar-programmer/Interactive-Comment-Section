const mainContainer = document.getElementById('mainContainer');


async function getCommentsData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data, '<=heres the data');
        return data;
    } catch (e) {
        return console.log('Check this error and handle=>', e);
    }
}

getCommentsData('data.json')
    .then((data) => {
        // first render the comments properties
        // next add a .then and render the replies, assigning their on container/ class etc. to them
        const comments = data.comments;
        console.log(comments);
        comments.forEach(row => {

            const commentContainer = document.createElement('div');
            mainContainer.appendChild(commentContainer);
            commentContainer.classList.add('commentConatiner');

            const userInfoFlexContainer = document.createElement('div');
            commentContainer.appendChild(userInfoFlexContainer);
            userInfoFlexContainer.classList.add('userInfoFlexContainer');
            userInfoFlexContainer.innerHTML = `
                <img class= avatar src= "${row.user.image.png}"/>
                <h5 class= username>${row.user.username}</h5>
                <p class= commentDate>${row.createdAt}</p>
            `



            const userCommentText = document.createElement('p');
            commentContainer.appendChild(userCommentText);
            userCommentText.classList.add('userCommentText');
            userCommentText.innerHTML = `${row.content}`;

            const userActionsFlexContainer = document.createElement('div');
            commentContainer.appendChild(userActionsFlexContainer);
            userActionsFlexContainer.classList.add('userActionsFlexContainer');
        });

    })
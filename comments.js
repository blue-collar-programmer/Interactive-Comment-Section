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


            const plusButton = document.createElement('plusButton');
            userActionsFlexContainer.appendChild(plusButton);
            plusButton.classList.add('plusButton');
            plusButton.innerHTML = `
            <img src="../images/icon-plus.svg">
            `

            // Create a div that displays the number of votes in real time 
            const voteCount = document.createElement('p');
            userActionsFlexContainer.appendChild(voteCount);
            voteCount.classList.add('voteCount')

// tracking the original state of the score value by saving to localStorage, then updating by clearing
            for(let i = 0; i < row.length; i++){
            let origScore = 'origScore' + i
            localStorage.setItem(`${origScore}`, `${row.score}`)
            console.log(localStorage.getItem(`${origScore}`))
            }        
            voteCount.innerHTML = `
            ${row.score}
            `

            plusButton.addEventListener('click', (e) => {
                let clickCount = 0;
                if ( /*localStorage.getItem('plusCount')*/ clickCount >= 1) {
                    alert('you can only give one upvote per user')
                } else {

                    clickCount++
                    // saving the current users (clients) click count in the localStorage to prevent voting twice
                    localStorage.setItem('plusCount', `${clickCount}`)
                    // Testing the type of row.score because when adding plusCount in the locaStorage it would concat not evaluate                
                    console.log(typeof row.score, 'plusButton fire test');

                    voteCount.innerHTML = `
                ${row.score + Number(localStorage.getItem('plusCount'))}
                `
                    let newScoreValue = row.score + Number(localStorage.getItem('plusCount'))
                    localStorage.setItem('newUpScore', newScoreValue)
                }
            })

            const minusButton = document.createElement('minusButton');
            userActionsFlexContainer.appendChild(minusButton);
            minusButton.classList.add('minusButton');
            minusButton.innerHTML = `
            <img src="../images/icon-minus.svg">
            `
            minusButton.addEventListener('click', (e) => {
                let clickCount = 0;
                if ( /*localStorage.getItem('plusCount')*/ clickCount >= 1) {
                    alert('you can only give one upvote per user')
                }

                if (localStorage.getItem('newUpScore') > row.score) {

                    clickCount++

                    localStorage.setItem('minusCount', `${clickCount}`)

                    console.log(typeof row.score, 'minusButton fire test');

                    voteCount.innerHTML = `
                ${Number(localStorage.getItem('newUpScore')) - Number(localStorage.getItem('minusCount'))}
                
                `
                localStorage.clear('newUpScore');

                } else if(localStorage.getItem('originalScore') === row.score) {
                    console.log(true, 'YES')
                    clickCount++

                    localStorage.setItem('minusCount', `${clickCount}`)

                    voteCount.innerHTML = `
                ${row.score - Number(localStorage.getItem('minusCount'))}
                `

                }
            })
            /* Create plus and minus button, insert img tag as the content
                        -in the middle of these buttons place a div and give it the id = voteCount
                        - add click event to both, but use Id to determine the behaviour
                        - example: plus.addEventListener('click', (e)=>{
                            voteCount.innerHTML = ""
                        })
            */

        });

    })
const allCommentsContainer = document.getElementById('allCommentsContainer');
const createNewCommentBox = document.createElement('div');
const currentUsersAvatar = document.getElementById('currentUsersAvatar');
const commentTextArea = document.getElementById('commentTextArea');
let clickCount = 0;

// Comment area eventListener
commentTextArea.addEventListener('click', (e) => {
    clickCount++
    console.log('this is the eventTarget=>', e)
    if (clickCount % 2 === 0) {
        unActiveBorderStyles(e.target)
    } else {
        activeBorderStyles(e.target)
    }

})
//gives a border shadow to the textarea
let activeBorderStyles = (el) => {
    let textArea = el;
    return textArea.style.cssText = "box-shadow: 0px 0px 8px  hsl(238, 40%, 52%);"

}
//removes border shadow from the textarea
let unActiveBorderStyles = (el) => {
    let textArea = el;
    return textArea.style.cssText = "box-shadow: none;"

}



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

        //  Tracking the original state of the score property value by saving to localStorage, then updating by clearing
        /*      But why did I initiate this outside of the loop?
                So that there would be only one iteration and not two
                -By placing this inside of the forEach loop, the local storage would simply be replaced with the current comment objects score
                -This means I would only have access to the last rendered objects and the rest would not have survived the last iteration
        */
        let origScore = [];
        for (let i = 0; i < data.comments.length; i++) {
            if (i != origScore[i]) {
                origScore.push(i)
                localStorage.setItem(`${origScore[i]}`, `${data.comments[i].score}`)
                console.log(localStorage.getItem(`${origScore[i]}`))
            }
        }
        console.log('Final score test=>', origScore)
        currentUsersAvatar.src = `${data.currentUser.image.png}`
        // first render the comments properties
        // next add a .then and render the replies, assigning their on container/ class etc. to them

        // Initiated the data obj and the comment properties to a const variable named, "comments"
        const comments = data.comments;
        console.log('Testing each comment object=> ', comments);

        comments.forEach((row, i) => {

            const commentContainer = document.createElement('div');
            allCommentsContainer.appendChild(commentContainer);
            commentContainer.classList.add('commentContainer');

            const userInfoFlexContainer = document.createElement('div');
            commentContainer.appendChild(userInfoFlexContainer);
            userInfoFlexContainer.classList.add('userInfoFlexContainer');
            userInfoFlexContainer.innerHTML = `
                <img class= 'userinfo avatar' src= "${row.user.image.png}"/>
                <h5 class= 'userinfo username'>${row.user.username}</h5>
                <p class= 'userinfo commentDate'>${row.createdAt}</p>
            `



            const userCommentText = document.createElement('p');
            commentContainer.appendChild(userCommentText);
            userCommentText.classList.add('userCommentText');
            userCommentText.innerHTML = `${row.content}`;

            const userActionsFlexContainer = document.createElement('div');
            commentContainer.appendChild(userActionsFlexContainer);
            userActionsFlexContainer.classList.add('userActionsFlexContainer');

            const votingContainer = document.createElement('div');
            userActionsFlexContainer.appendChild(votingContainer);
            votingContainer.classList.add('votingContainer');

            const plusButton = document.createElement('plusButton');
            votingContainer.appendChild(plusButton);
            plusButton.classList.add('iconButtons');
            plusButton.innerHTML = `
            <img class= "votingIcons" src="../images/icon-plus.svg">
            `

            // Create a div that displays the number of votes in real time 
            const voteCount = document.createElement('p');
            votingContainer.appendChild(voteCount);
            voteCount.classList.add('voteCount');

            const replyButton = document.createElement('button')
            replyButton.className = "replyButton";
            replyButton.innerHTML = `
            <img class= "replyIcon" src = "../images/icon-reply.svg"> Reply
            `
            userActionsFlexContainer.appendChild(replyButton);

            voteCount.innerHTML = `
            ${localStorage.getItem(origScore[i])}
            `
            const minusButton = document.createElement('minusButton');
            votingContainer.appendChild(minusButton);
            minusButton.classList.add('iconButtons');
            minusButton.classList.add('minusButton');
            minusButton.innerHTML = `
            <img class = "votingIcons minus" src="../images/icon-minus.svg">
            `

            plusButton.addEventListener('click', (e) => {


                let plusClicks = 0;
                plusClicks++
                let newVoteCount;

                if (localStorage.getItem('newVoteCount') < localStorage.getItem(origScore[i]) || localStorage.getItem('newVoteCount') === undefined) {
console.log('fired')

                    newVoteCount = Number(localStorage.getItem(origScore[i]));
                    localStorage.setItem('newVoteCount', newVoteCount);
                    
                    voteCount.innerHTML = `
                    ${Number(localStorage.getItem('newVoteCount'))}
                    `


                } else if (Number(localStorage.getItem('newVoteCount')) === Number(localStorage.getItem(origScore[i]))) {
                    console.log('fired2')
                    
                    newVoteCount = Number(localStorage.getItem(origScore[i])) + plusClicks;
                    localStorage.setItem('newVoteCount', newVoteCount)
                    
                    voteCount.innerHTML = `
                    
                    ${Number(localStorage.getItem('newVoteCount'))}
                    
                    `

                }


                /*if ( clickCount >= 1) {
                    alert('you can only give one upvote per user')
                } */

                plusClicks = 0;
            })

            minusButton.addEventListener('click', (e) => {
                let minusClicks = 0;
                minusClicks++
                //localStorage.setItem('minusClicks', minusClicks)

                let newVoteCount;

                if (localStorage.getItem('newVoteCount') > localStorage.getItem(origScore[i]) || localStorage.getItem('newVoteCount') === undefined) {
                    
                    newVoteCount = Number(localStorage.getItem(origScore[i])) ;
                    localStorage.setItem('newVoteCount', newVoteCount)
                    
                    voteCount.innerHTML = `
                
                ${Number(localStorage.getItem('newVoteCount'))}

                `

                } else if (Number(localStorage.getItem('newVoteCount')) === Number(localStorage.getItem(origScore[i]))) {
                    
                    newVoteCount = Number(localStorage.getItem(origScore[i])) - minusClicks;
                    localStorage.setItem('newVoteCount', newVoteCount);
                    
                    voteCount.innerHTML = `

                    ${Number(localStorage.getItem('newVoteCount'))}

                    `
                }
                // localStorage.removeItem('minusClicks');
                minusClicks = 0;
            })

            window.location.refresh = function() {
                console.log('LOAD EVENT FIRED ')
                voteCount.innerHTML = `
                ${localStorage.getItem('newVoteCount')}
                `
            }
        })

    })


// add clickCount as the parameter to a function whos job is to increase the displayed vote count:
// - then saving it to the local storage ,and displaying it to in the innerHTML = '';
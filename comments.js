const allCommentsContainer = document.getElementById('allCommentsContainer');
const createNewCommentBox = document.createElement('div');
const currentUsersAvatar = document.getElementById('currentUsersAvatar');
const commentTextArea = document.getElementById('commentTextArea');
let clickCount = 0;

// Comment area eventListener
commentTextArea.addEventListener('click', (e)=>{
    clickCount++
    console.log('this is the eventTarget=>', e)
    if (clickCount % 2 === 0){
        unActiveBorderStyles(e.target)
    } else {
        activeBorderStyles(e.target)    
    }

})
//gives a border shadow to the textarea
let activeBorderStyles = (el)=>{
    let textArea = el;
    return textArea.style.cssText = "box-shadow: 0px 0px 8px  hsl(238, 40%, 52%);"
    
}
//removes border shadow from the textarea
let unActiveBorderStyles = (el)=>{
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
        currentUsersAvatar.src=`${data.currentUser.image.png}`
        // first render the comments properties
        // next add a .then and render the replies, assigning their on container/ class etc. to them
        const comments = data.comments;
        console.log('Testing each comment object=> ', comments);
        comments.forEach((row, i )=> {

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
                let clickCount = 0;
                /*if ( clickCount >= 1) {
                    alert('you can only give one upvote per user')
                } */

                if(localStorage.getItem('newDownScore') === localStorage.getItem(origScore[i]) - 1){
                    clickCount++
                    localStorage.setItem('plusCount', `${clickCount}`)

                    //${Number(localStorage.getItem('newDownScore')) + 1}//Number(localStorage.getItem('plusCount')) };
                    voteCount.innerHTML = `
                    ${localStorage.getItem(origScore[i])}
                    `
                    
                } 
                
                else {

                    clickCount++
                    // saving the current users (clients) click count in the localStorage to prevent voting twice
                    localStorage.setItem('plusCount', `${clickCount}`)
                    // Testing the type of row.score because when adding plusCount in the locaStorage it would concat not evaluate                
                    //console.log(typeof row.score, 'plusButton fire test');
                    console.log(true, 'THIS IS THE VALUE',  origScore[i] )//A TEST 
                    voteCount.innerHTML = `
                    ${row.score + Number(localStorage.getItem('plusCount'))}
                    `
                    let newScoreValue = row.score + Number(localStorage.getItem('plusCount'))
                    
                    localStorage.setItem('newUpScore', newScoreValue)
                    localStorage.removeItem('newDownScore');
                    localStorage.removeItem('plusCount');
                }
            })

            minusButton.addEventListener('click', (e) => {
                let clickCount = 0;
                if ( /*localStorage.getItem('plusCount')*/ clickCount >= 1) {
                    alert('you can only give one downvote per user')
                }

                if (localStorage.getItem('newUpScore') > origScore[i]) {

                    clickCount++

                    localStorage.setItem('minusCount', `${clickCount}`)

                    console.log('original score index=>' ,origScore[i], 'minusButton fire test');

                    voteCount.innerHTML = `
                ${Number(localStorage.getItem('newUpScore')) - Number(localStorage.getItem('minusCount'))}
                
                `
                localStorage.removeItem('minusCount')

                    // the above needs error handling- what if newUpScore was erased and doesn't exist?                
                    let newScoreValue = Number(localStorage.getItem('newUpScore')) - 1;//Number(localStorage.getItem('minusCount'))
                    console.log('newDownScore VALUE IN THE 2ND IF MINUS BLOCK =>',newScoreValue, Number(localStorage.getItem('newUpScore')))
                    localStorage.removeItem('newUpScore');
                    localStorage.setItem('newDownScore', `${newScoreValue}`);
                }
                
                if (localStorage.getItem('newDownScore') >= row.score) {
                    console.log(true, 'YES', 'heres new score=>', localStorage.getItem('newDownScore'))
                    //clickCount++

                   // localStorage.setItem('minusCount', `${clickCount}`)




                    voteCount.innerHTML = `
                ${localStorage.getItem('newDownScore') - 1}                 `

                //-START HERE!!!!!!!!!!

                }
                let newScore = localStorage.getItem('newDownScore') - 1;
                localStorage.setItem(`newDownScore`, newScore);// localStorage should read 11 or 5
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
    



    /* HERE I NEED TO TEST THE COMMENT TEXT BOX 
    - How it is rendered? on the bottom of allComments?
    - or on the top
    - why create outside of the api call?
    - because everytime a user post a comment I want to
        1. an event listener fired on the POST button
        2. I want a function specifically named createNewComment to be called in that eventListener
        3. createNewComment, will pretty much copy the rendered style names of the dynamically rendered content in the original api call
        4. how to udate the server data i.e the JSON file when a new comment is created? 
            - Create a seperate function for that? and call in the the createNewComment function using Logic
            - new function name will ansyn function postNewComment (url) // find out how to make a post call with RESTful api fetch/ headers  
    
    */

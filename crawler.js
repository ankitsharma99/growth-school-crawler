const request = require('request');
const cheerio = require('cheerio');

request('https://stackoverflow.com/questions', (err, res, html) => {
    if(err) {
        console.log(
            `An error occured: ${err}`
        );
    }
    else {
        let question = cheerio.load(html);
        let questionArr = question('.question-hyperlink');
        let vote = cheerio.load(html);
        let voteArr = vote('.vote-count-post>strong');
        let ans = cheerio.load(html);
        let answerArr = ans('.status>strong');
        handleHtml(question, questionArr, vote, voteArr, ans, answerArr, 0);
    }
});

function handleHtml(question, questionArr, vote, voteArr, ans, answerArr, i) {
    if(i >= questionArr.length || i >= voteArr.length || i >= answerArr.length) return;
    
    let ques = question(questionArr[i]).text();
    let votes = vote(voteArr[i]).text();
    let answer = ans(answerArr[i]).text();
    
    console.log('Question: ' +  ques + ', Votes: ' + votes +  ', Answers: ' + answer);
    handleHtml(question, questionArr, vote, voteArr, ans, answerArr, i+1);
}
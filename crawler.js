const request = require('request');
const cheerio = require('cheerio');
const xl = require('excel4node');
const fs = require('fs');

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
        const ques = [], votes = [], answer = [];
        handleHtml(question, questionArr, vote, voteArr, ans, answerArr, 0, ques, votes, answer);

        const json =
        {
            "ques": ques,
            "votes": votes,
            "answers": answer
        };
         // let newWb = xlsx.utils.book_new();
        // let newWs = xlsx.utils.json_to_sheet(obj);
        // // console.log(JSON.stringify(json));
        // xlsx.utils.book_append_sheet(newWb, newWs, 'sheet-1');
        // xlsx.writeFile(newWb, 'data.xlsx');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('sheet');
        const headingColNames = [
            'Question',
            'Votes',
            'Answers'
        ]
        let headingColIndex  = 1;
        headingColNames.forEach(heading => {
            ws.cell(1, headingColIndex++).string(heading);
        });

        let rowIndex = 2;
        let colIndex = 1;   
        json['ques'].forEach(record => {
            Object.keys(record).forEach(columnName => {
                ws.cell(rowIndex++, colIndex++).string(record[columnName]);
            });
        });
        wb.write('data.xlsx');

    }
});

function handleHtml(question, questionArr, vote, voteArr, ans, answerArr, i, ques, votes, answer) {
    if(i >= questionArr.length || i >= voteArr.length || i >= answerArr.length) return;
    
    ques.push(question(questionArr[i]).text());
    votes.push(vote(voteArr[i]).text());
    answer.push(ans(answerArr[i]).text());
    
    // console.log('Question: ' +  ques + ', Votes: ' + votes +  ', Answers: ' + answer);
    
    handleHtml(question, questionArr, vote, voteArr, ans, answerArr, i+1, ques, votes, answer);
}

const request = require('request');     
const cheerio = require('cheerio');     // for sending cheerio requests
const xl = require('excel4node');       // for writing to excel files

const URL = 'https://stackoverflow.com/questions';

request(URL, (err, res, html) => {
    if(err) {
        console.log(
            `An error occured: ${err}`
        );
    }
    else {
        let question = cheerio.load(html);
        let questionArr = question('.question-hyperlink');      // selects the hyperlink
        let vote = cheerio.load(html);
        let voteArr = vote('.vote-count-post>strong');          // selects the vote count
        let ans = cheerio.load(html);
        let answerArr = ans('.status>strong');              // selects the answer count
        const ques = [], votes = [], answer = [];
        handleHtml(question, questionArr, vote, voteArr, ans, answerArr, 0, ques, votes, answer);       
        //ques, votes and answer are changed by handleHtml function

        const json = {
            "ques": ques,
            "votes": votes,
            "answers": answer
        };

        const wb = new xl.Workbook();       // creates a new workbook
        const ws = wb.addWorksheet('sheet');        // adds a new worksheet named 'sheet'
        const headingColNames = [           // for the heading of three columns 
            'Question',
            'Votes',
            'Answers'
        ]
        let headingColIndex  = 1;
        headingColNames.forEach(heading => {
            ws.cell(1, headingColIndex++).string(heading);
        });

        let rowIndex = 2;           // rowIndex starts from 2 because index 1 has the heading string
        for(let i  = 0; i<json['ques'].length; i++) {
            ws.cell(rowIndex++, 1).string(json['ques'][i]);     
        }
        rowIndex = 2;
        for(let i  = 0; i<json['votes'].length; i++) {
            ws.cell(rowIndex++, 2).string(json['votes'][i]);
        }
        
        rowIndex = 2;
        for(let i  = 0; i<json['answers'].length; i++) {
            ws.cell(rowIndex++, 3).string(json['answers'][i]);
        }
        
        wb.write('data.xlsx');
    }
});

function handleHtml(question, questionArr, vote, voteArr, ans, answerArr, i, ques, votes, answer) {
    // handleHtml is a recursive function
    
    if(i >= questionArr.length || i >= voteArr.length || i >= answerArr.length) return;
    
    ques.push(question(questionArr[i]).text());
    votes.push(vote(voteArr[i]).text());
    answer.push(ans(answerArr[i]).text());

    handleHtml(question, questionArr, vote, voteArr, ans, answerArr, i+1, ques, votes, answer);
}

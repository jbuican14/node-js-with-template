const fs = require('fs'); 
const http = require('http'); 
const url = require('url'); 

///////////////////////////
// FILES

// Non-blocking, async
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn); 

// const textOut = `This is what we now about the avocado::: ${textIn}. \nCreated on ${Date.now()}`; // TODO convert the time
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written'); 

// Non-blocking,  asynchromous
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log('ERROR!  🤯')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=> {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written !!')
//             })
//         })
//     })
// });

// console.log('Will read file');

///////////////////
// SERVER

const replaceTemplate = (template, product) => {
    const {productName, image, price, quantity, description, id, organic, nutrients} = product; 
    console.log("🚀 ~ file: index.js ~ line 38 ~ replaceTemplate ~ product", productName)
    let output = template.replace(/{%PRODUCTNAME%}/g, productName); 
        output = output.replace(/{%IMAGE%}/g, image); 
        output = output.replace(/{%PRICE%}/g, price); 
        output = output.replace(/{%NUTRIENTS%}/g, nutrients); 
        output = output.replace(/{%QUANTITY%}/g, quantity); 
        output = output.replace(/{%DESCRIPTION%}/g, description); 
        output = output.replace(/{%ID%}/g, id); 
        
        if(!organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); 
        return output
}

// READ DATA ONCE
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const pathName = req.url;

    if(pathName === '/'|| pathName === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output);

    } else if (pathName === '/product') {
        res.end('This is the PRODUCT!'); 
    } else {
        res.writeHead(404);
        res.end('Page not found!'); 
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000'); 
});







// https://github.com/jonasschmedtmann/complete-node-bootcamp/tree/master/1-node-farm/starter
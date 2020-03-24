const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://footballdatabase.com/ranking/";

if (process.argv.length > 2) {
    let country = process.argv[2];
    
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: country + '_footballdatabase.csv',
        header: [
            {id: 'club', title: 'Club'},
            {id: 'points', title: 'Points'}
        ]
    });
    
    fetchData(url + country).then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        const rankingTable = $('.table.table-hover > tbody > tr');
        
        let ranking = [];
    
        rankingTable.each(function() {
            let club = $(this).find('td').find('.limittext');
            let points = $(this).find('td.rank');
            
            if (points.length > 0){
                ranking.push({ club:  club.text(), points: points.last().text()})
            }
        });
    
        csvWriter.writeRecords(ranking)
        .then(() => {
            console.log('Done! CSV file created.');
        });
    })
    
    async function fetchData(url) {
        let response = await axios(url).catch((err) => console.log(err));
    
        if (response.status !== 200) {
            console.log("Erro while fetch");
            return;
        }
    
        return response;
    }
}
else {
    console.log("country not informed");
}
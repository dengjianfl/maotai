const axios =require('axios');
const cheerio =require('cheerio');
const xlsx =require('xlsx');
const fs =require('fs');

const pagePath='http://quotes.money.163.com/f10/zycwzb_600519,year.html';

axios.get(pagePath).then(res=>{
    const $=cheerio.load(res.data);
    const $trs=$('.table_bg001.border_box.limit_sale.scr_table > tbody > tr[class="dbrow"]');
    const $title=$trs.eq(0).children();
    const $moneyData=$trs.eq(5).children();
    let data=[];
    $title.each((ind,item)=>{
        data.push([$(item).text()]);
    });
    data.forEach((item,ind)=>{
        item.push($($moneyData.eq(ind)).text())
    })
    data.unshift(["报告日期","净利润(万元)"]);
    createXlsx(data);
})

function createXlsx(data) {
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, workSheet, '茅台利润');
    const result = xlsx.write(workBook, {
        bookType: 'xlsx',
        type: 'buffer',
        compression: true
    });
    fs.writeFile('茅台利润.xlsx', result,(err)=>{
        if(err) {
            console.log('导出失败！')
        }
        console.log('导出 excel 成功！')
    })
}
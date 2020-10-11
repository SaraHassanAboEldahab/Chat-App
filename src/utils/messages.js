////////// 13. Working with Time && 14. Timestamps for Location Messages //////
const generateMsg=(username,text)=>{
    return{
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const generateLocationMsg=(username,url)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMsg,
    generateLocationMsg
}
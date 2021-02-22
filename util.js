'use strict'
const crypt=require('crypto');
let id =null;

module.exports.getId=()=>{
    if(id!=null)
    {
        id=crypt.randomBytes(20);
        Buffer.from('-VJT0001-').copy(id, 0);
    }
    return id;
}
'use strict';

const crypto = require('crypto'); 
const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const urlParse = require('url').urlParse;

module.exports.getpeers=(torrent,callback)=>{
    const socket=dgram.createSocket('udp4');
    const url = torrent.announce.toString('utf8');
    udpSend(socket,builtconnectionReq(),url);

    socket.on('message',response=>{
        if(resType(response)=='connect')
        {
            const ConenctionRes=parseConenctionRes(response);
            const announceReq = buildAnnounceReq(ConenctionRes.ConnectionId);
            udpSend(socket, announceReq, url);

        }
        else if(resType(response)=='annouce')
        {
            const announceResp = parseAnnounceResp(response);
            callback(announceResp.peers);
        }
    }
    )
    function udpSend(socket,msg,rawurl,callback=()=>{
            const url=urlParse(rawurl);
            socket.send(msg,0,msg.length,url.port,url.host,callback);
    });
    function parseConenctionRes(response){
        return 
        {
            action: response.readUInt32BE(0);
            transactionId : response.readUInt32BE(4);
            ConnectionId: response.slice(8);
        }
    }

    function builtconnectionReq() {
        const buf = Buffer.alloc(16);
        buf.writeUInt32BE(0x417, 0); 
        buf.writeUInt32BE(0x27101980, 4);
        buf.writeUInt32BE(0, 8);
        crypto.randomBytes(4).copy(buf, 12);
        return buf;
    }

}
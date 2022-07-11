const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
const fs = require('fs')


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}



const connect_web3 = () => {
    const web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/<project-id>");
    return web3
}
web3 = connect_web3()


const get_accounts = () =>{
    connect_web3().eth.getAccounts().then(e => console.log(e));
}

const create_address = (password)=>{
   var data  =  connect_web3().eth.accounts.create()
    fs.writeFileSync(`./address/${makeid("15")}.json`, JSON.stringify({
        address : data.address,
        privateKey : data.privateKey
    }));
   return data
}

const get_balance = (addr)=>{
    connect_web3().eth.getBalance(addr).then((balance)=>{
      
            let ethBalance = connect_web3().utils.fromWei(balance, 'ether');
            console.log(ethBalance);
        
    }); //Will give value in.
    
}

 
const send_trans = async (address, receiver, amount, pvKey) => {
	try {
		var privateKey = Buffer.from(pvKey, 'hex');
		web3.eth.getTransactionCount(address, (err, txnCount) => {
			if (!err) {
				const txObject = {
					nonce: web3.utils.toHex(txnCount),
					to: receiver,
					value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
					gasLimit: web3.utils.toHex(21000),
					gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))

				};

				const tx = new Tx(txObject, { chain: 'ropsten' });
				tx.sign(privateKey);

				const serializedTx = tx.serialize();
				const raw = '0x' + serializedTx.toString('hex');

				web3.eth.sendSignedTransaction(raw, (err, txnHash) => {
					console.log(txnHash)
				})
			} else throw {success: false, error: {message: "Unable to get nounce", stack: err}}
		});
	} catch (ex) {
		console.error(ex);
		return ex;
	}
}; 
 

const getTxnDetails =  (txn) => {
 
		web3.eth.getTransactionReceipt(txn, (err, reciept) =>{
			if(err){
                console.log(err)
            }else{
                console.log(reciept)
            }
		})
	 
};

//send transaction example
// console.log(send_trans("0x6D3C012617EEE3Cb71f7832E0E80cF2f53EA527B","0x668978dB250931C1748B7E6E726e86c82DB13070","1","c254f21ccac3595e000dd60c2d86af167f6dd10a4b794a203618c81a1d22d18c"))

//get wallet balance example
// console.log(get_balance("0x6D3C0126f7EEd3Cb71f78e2E0E80cF2f53EA527B"))

//create new address example
// console.log(create_address())

//get accounts 

// console.log(get_accounts())

//get transaction details 

// getTxnDetails("0xbd179d100ec79ede22979e97f928eb3121b49456d9ef944ad77b7c472cc9e2a2")
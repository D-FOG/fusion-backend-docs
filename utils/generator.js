const crypto = require('crypto');

exports.generateUniqueID = () => {
  const timestamp = Date.now().toString(); 
  const randomBytes = crypto.randomBytes(16).toString('hex');

  const hash = crypto.createHash('sha256').update(timestamp + randomBytes).digest('hex');

  const id = ('0000000000' + (parseInt(hash, 16) % 10000000000)).slice(-10);
   
  return id;
} 

exports.generateUsername = async (username1) =>{
  const checckk = await User.findOne({
    username: username1
  });
  if (!checckk) {
    return username1.toLowerCase();
  }
  while (true) {
    let randomUsername = `${username1}${
      Math.floor(Math.random() * 10000) + 1
    }`;
    const userWithSameUsername = await User.findOne({
      username: randomUsername
    });
    if (!userWithSameUsername) {
      return username1.toLowerCase();
    }
  }
}

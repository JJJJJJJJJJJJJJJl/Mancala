const crypto = require('crypto');

const generate_game_hash = (hn, hv, nick) => {
    const step1 = hn + "" + hv + "" + nick;
    let final = crypto.createHash('md5').update(step1).digest('hex');
    return final;
}

const hash_pw = (pw) => {
    return crypto.createHash('sha256').update(pw).digest('hex');
}

module.exports = {
    generate_game_hash,
    hash_pw,
}
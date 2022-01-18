const crypto = require('crypto');

const generate_game_hash = (hn, hv, time) => {
    const step1 = hn + "" + hv + "" + time;
    let final = crypto.createHash('md5').update(step1).digest('hex');
    return final;
}

module.exports = {
    generate_game_hash,
}
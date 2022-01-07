const generate_game_hash = (hn, hv, time) => {
    const step1 = hn + "" + hv + "" + time;
    let final = "";
    for(let i=0; i<step1.length; i++){
        const min = Math.floor(Math.random() * (92783 - 739 + 1) + 739)
        const max = Math.floor(Math.random() * (666 - 77 + 1) + 77);
        final += (step1[i] + Math.floor(Math.random() * (max - min + 1) + min)) + "";
        final += (step1[i] + Math.floor(Math.random() * (max - min + 1) + min)) + "";
    }
    return final;
}

module.exports = {
    generate_game_hash,
}
const game_size = {
    g103: 'normal_game_10_3',
    g105: 'normal_game_10_5',
    g123: 'normal_game_12_3',
    g125: 'normal_game_12_5',
}

class Queue{
    constructor(type){
        if(type == game_size.g103) this.ngqueue103 = [];
    }
    length(type){
        if(type == game_size.g103) return this.ngqueue103.length;
    }
    enqueue(type, user, gh){
        const waiting = {username: user, game_hash: gh};
        if(type == game_size.g103 && this.find(type, user) == 0){
            this.ngqueue103.push(waiting);
            console.log(this.ngqueue103[0].username + " queued up for " + game_size.g103);
        }
    }
    dequeue(type){
        if(type == game_size.g103){
            const player = this.ngqueue103[0];
            this.ngqueue103.shift();
            return player;
        }
    }
    peek(type){
        if(type == game_size.g103){
            return this.ngqueue103[0];
        }
    }
    find(type, user){
        const len = this.length(type);
        if(type == game_size.g103){
            for(let i=0; i<len; i++){
                if(this.ngqueue103[i].username == user) return 1;
            }
            return 0;
        }
    }
    get_player(type, index){
        if(type == game_size.g103){
            return this.ngqueue103[index];
        }
    }
}

let normal_game_103 = new Queue(game_size.g103);
let normal_game_105 = new Queue(game_size.g105);
let normal_game_123 = new Queue(game_size.g123);
let normal_game_125 = new Queue(game_size.g125);

module.exports = {
    normal_game_103,
}
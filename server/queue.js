class Queue{
    constructor(type){
        if(type == 'normal_game') this.ngqueue = [];
    }
    length(type){
        if(type == 'normal_game') return this.ngqueue.length;
    }
    enqueue(type, user, gh){
        const waiting = {username: user, game_hash: gh};
        if(type == 'normal_game' && this.find(type, user) == 0) this.ngqueue.push(waiting);
    }
    dequeue(type){
        if(type == 'normal_game'){
            const player = this.ngqueue[this.ngqueue.length(type) - 1];
            this.ngqueue.shift();
            return player;
        }
    }
    find(type, user){
        const len = this.length(type);
        if(type == 'normal_game'){
            for(let i=0; i<len; i++){
                if(this.ngqueue[i].username == user) return 1;
            }
            return 0;
        }
    }
}

let normal_game_queue = new Queue("normal_game");
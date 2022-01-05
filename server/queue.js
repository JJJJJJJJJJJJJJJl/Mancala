class Queue{
    constructor(type){
        if(type == 'normal_game') this.ngqueue = [];
    }
    length(type){
        if(type == 'normal_game') return this.ngqueue.length;
    }
    enqueue(type, user){
        if(type == 'normal_game' && this.find(type, user) == 0) this.ngqueue.push(user);
    }
    dequeue(type){
        if(type == 'normal_game') this.ngqueue.shift();
    }
    find(type, user){
        const len = this.length(type);
        if(type == 'normal_game'){
            for(let i=0; i<len; i++){
                if(this.ngqueue[i] == user) return 1;
            }
            return 0;
        }
    }
}

let normal_game = new Queue("normal_game");
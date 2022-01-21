class Queue{
    constructor(){
        this.queue = [];
    }
    length(){
        return this.queue.length;
    }
    enqueue(user, gh){
        const waiting = {username: user, game_hash: gh};
        this.queue.push(waiting);
        console.log(this.queue[0].username + " queued up");
    }
    dequeue(){
        const player = this.queue[0];
        this.queue.shift();
        return player;
    }
    peek(){
        return this.queue[0].username;
    }
    find(user){
        const len = this.length(type);
        for(let i=0; i<len; i++){
            if(this.queue[i].username == user) return 1;
        }
        return 0;
    }
    get_player(index){
        return this.queue[index];
    }
}

const leave_queue = (user) => {
    if(normal_game_103.peek() == user){
        normal_game_103.dequeue()
    }
    else if(normal_game_105.peek() == user){
        normal_game_105.dequeue()
    }
    else if(normal_game_123.peek() == user){
        normal_game_123.dequeue()
    }
    else if(normal_game_125.peek() == user){
        normal_game_125.dequeue()
    }
    else{
        console.log(data.nick + " wasnt in queue");
    }
}

let normal_game_103 = new Queue();
let normal_game_105 = new Queue();
let normal_game_123 = new Queue();
let normal_game_125 = new Queue();

module.exports = {
    normal_game_103,
    normal_game_105,
    normal_game_123,
    normal_game_125,
    leave_queue,
}
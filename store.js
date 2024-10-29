class inMemoryStore{
    constructor(){
        this.store = new Map();
    }

    set(key , value){
        this.store.set(key, value);
        return "OK";
    }

    get(key){
        return this.store.has(key) ? this.store.get(key) : null;
    }

    del(key){
        return this.store.delete(key) ? 1 : 0;
    }
}

module.exports = inMemoryStore;
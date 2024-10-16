class DB {
    ids: string[] = []

    insertOne(id: string) {
        this.ids.push(id)
    }

    insertMany(ids: string[]) {
        this.ids = this.ids.concat(ids)
    }

    getAll() {
        return this.ids
    }
}

const db = new DB()

export {db}

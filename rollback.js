import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb'

const mongoDBV4 = new MongoClient(process.env.ORIGIN_URL)
const mongoDBV5 = new MongoClient(process.env.DESTINATION_URL)

const origin_ids = [
    '5fd917471d342d00166b1c66',
    '5f3eced1f61184001355d22e',
    '64ac6937eee9b6001b2bbc21',
    '64ac69c6eee9b6001b2bbc2f'
]

async function run() {
    try {
        const dbV4 = mongoDBV4.db(process.env.ORIGIN_DB)
        const dbV5 = mongoDBV5.db(process.env.DESTINATION_DB)

        const storesCollectionV4 = dbV4.collection(process.env.ORIGIN_COLLECTION)
        const storesCollectionV5 = dbV5.collection(process.env.DESTINATION_COLLECTION)

        const storesDataV4 = storesCollectionV4.find()

        let count = 0
        for await (const store of storesDataV4) {
            if (!origin_ids.includes(store._id)) {
                await storesCollectionV5.deleteOne({ _id: new ObjectId(store._id)})
                console.log(`A document was deleted with the _id: ${store._id}`);
                count++
            }
        }

        console.log(`Total of documents deleted: ${count}`)
    }
    finally {
        await mongoDBV4.close()
        await mongoDBV5.close()
    }
}

run().catch(console.dir)

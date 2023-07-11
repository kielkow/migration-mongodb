import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb'

const mongoDBOrigin = new MongoClient(process.env.ORIGIN_URL)
const mongoDBDestination = new MongoClient(process.env.DESTINATION_URL)

const origin_ids = [
    '5fd917471d342d00166b1c66',
    '5f3eced1f61184001355d22e',
    '64ac6937eee9b6001b2bbc21',
    '64ac69c6eee9b6001b2bbc2f'
]

async function run() {
    try {
        const dbOrigin = mongoDBOrigin.db(process.env.ORIGIN_DB)
        const dbDestination = mongoDBDestination.db(process.env.DESTINATION_DB)

        const collectionOrigin = dbOrigin.collection(process.env.ORIGIN_COLLECTION)
        const collectionDestination = dbDestination.collection(process.env.DESTINATION_COLLECTION)

        const dataOrigin = collectionOrigin.find()

        let count = 0
        for await (const doc of dataOrigin) {
            if (!origin_ids.includes(doc._id)) {
                await collectionDestination.deleteOne({ _id: new ObjectId(doc._id)})
                console.log(`A document was deleted with the _id: ${doc._id}`);
                count++
            }
        }

        console.log(`Total of documents deleted: ${count}`)
    }
    finally {
        await mongoDBOrigin.close()
        await mongoDBDestination.close()
    }
}

run().catch(console.dir)

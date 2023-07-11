import 'dotenv/config'
import { MongoClient } from 'mongodb'

const mongoDBOrigin = new MongoClient(process.env.ORIGIN_URL)
const mongoDBDestination = new MongoClient(process.env.DESTINATION_URL)

async function run() {
	try {
		const dbOrigin = mongoDBOrigin.db(process.env.ORIGIN_DB)
		const dbDestination = mongoDBDestination.db(process.env.DESTINATION_DB)

		const collectionOrigin = dbOrigin.collection(process.env.ORIGIN_COLLECTION)
		const collectionDestination = dbDestination.collection(process.env.DESTINATION_COLLECTION)

		const dataOrigin = collectionOrigin.find()

		let count = 0
		for await (const doc of dataOrigin) {
			const result = await collectionDestination.insertOne(doc)
			console.log(`A document was inserted with the _id: ${result.insertedId}`);
			count++
		}

		console.log(`Total of documents inserted: ${count}`)
	}
	finally {
		await mongoDBOrigin.close()
		await mongoDBDestination.close()
	}
}

run().catch(console.dir)

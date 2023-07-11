import 'dotenv/config'
import { MongoClient } from 'mongodb'

const mongoDBV4 = new MongoClient(process.env.ORIGIN_URL)
const mongoDBV5 = new MongoClient(process.env.DESTINATION_URL)

async function run() {
	try {
		const dbV4 = mongoDBV4.db(process.env.ORIGIN_DB)
		const dbV5 = mongoDBV5.db(process.env.DESTINATION_DB)

		const storesCollectionV4 = dbV4.collection(process.env.ORIGIN_COLLECTION)
		const storesCollectionV5 = dbV5.collection(process.env.DESTINATION_COLLECTION)

		const storesDataV4 = storesCollectionV4.find()

		let count = 0
		for await (const store of storesDataV4) {
			const result = await storesCollectionV5.insertOne(store)
			console.log(`A document was inserted with the _id: ${result.insertedId}`);
			count++
		}

		console.log(`Total of documents inserted: ${count}`)
	}
	finally {
		await mongoDBV4.close()
		await mongoDBV5.close()
	}
}

run().catch(console.dir)

import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ebate-kujuu.azure.mongodb.net/test?retryWrites=true&w=majority`

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export const getConnection = async () => await mongoClient.connect()

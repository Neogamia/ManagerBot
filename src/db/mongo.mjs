import { MongoClient } from "mongodb";
let uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

export async function getCollections(dbname, channel) {
    try {
        await client.connect();
        const db = client.db(dbname);
        const collections = await db.collections();
        collections.forEach(c=>channel.send(c.collectionName));
    } catch (err) {
        channel.send(`Error: ${err}`);
    } finally {
        client.close();
    }
}

export async function createCollection(dbname, collectionName, channel) {
    try {
        await client.connect();
        const db = client.db(dbname);
        db.createCollection(collectionName);
        channel.send(`created collection with name: ${collectionName}`)
    } catch (err) {
        channel.send(`Error: ${err}`);
    } finally {
        client.close();
    }
}

export async function add(dbname, collectionName, insertobj, channel) {
    try {
        await client.connect();
        const db = client.db(dbname);
        const collection = db.collection(collectionName);
        collection.insertOne(insertobj, function(err, res) {
            if(err) throw err;
            channel.send('added 1 document');
        });
        channel.send(`created collection with name: ${collectionName}`);
    } catch (err) {
        channel.send(`Error: ${err}`);
    } finally {
        client.close();
    }
}

export async function find(dbname, collectionName, obj, channel) {
    try {
        await client.connect();
        const db = client.db(dbname);
        const collection = db.collection(collectionName);
        collection.find(obj);
        channel.send(`created collection with name: ${collectionName}`);
    } catch (err) {
        channel.send(`Error: ${err}`);
    } finally {
        client.close();
    }
}
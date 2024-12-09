const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// MongoDB Configuration
const uri = "mongodb://localhost:27017"; // Change if your MongoDB server URI is different
const dbName = "socialmedia"; // Replace with your database name
const collectionName = "users"; // Replace with your collection name

// Load user data from users.js
const users = require(path.join(__dirname, "data", "users"));
const posts = require(path.join(__dirname, "data", "posts"));

// MongoDB client
const client = new MongoClient(uri);

const importData = async () => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        const postsCollection = db.collection('posts');

        // Insert data into the collection
        await usersCollection.insertMany(users);
        await postsCollection.insertMany(posts);
        console.log("Data imported successfully!");
    } catch (err) {
        console.error("Error importing data:", err);
    } finally {
        await client.close();
    }
};

const removeData = async () => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        const postsCollection = db.collection('posts');

        // Delete all documents in the collection
        await usersCollection.deleteMany({});
        await postsCollection.deleteMany({});
        console.log("Data removed successfully!");
    } catch (err) {
        console.error("Error removing data:", err);
    } finally {
        await client.close();
    }
};

const main = async () => {
    const command = process.argv[2];

    if (!command) {
        console.error("Please provide a command: import or remove");
        process.exit(1);
    }

    if (command === "import") {
        await importData();
    } else if (command === "remove") {
        await removeData();
    } else {
        console.error("Invalid command. Use 'import' or 'remove'.");
        process.exit(1);
    }
};

main();
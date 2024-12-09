// MongoDB URI
const uri = 'mongodb://localhost:27017';
const dbName = 'socialmedia';

const { MongoClient, ObjectId } = require('mongodb');
const colors = require("colors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { log } = require('console');
const path = require("path")

// MongoDB client
let db;
let usersCollection;

// Connect to MongoDB
MongoClient.connect(uri)
    .then(client => {
        console.log('Connected to MongoDB'.cyan);
        db = client.db(dbName);
        usersCollection = db.collection('users');
        postsCollection = db.collection('posts');
    })
    .catch(err => {
        console.error('MongoDB connection error', err);
    });



// test api
// route -> /
// method -> GET
exports.testApi = (req, res) => {
    res.send("test api")
}

// register user
// route -> /users
// method -> POST
exports.register = async (req, res) => {
    const { username, password, avatar } = req.body;

    if (!username || !password) {
        // return res.status(400).send('username and password are required.');
        req.session.message = 'All fields are required.';
        return res.redirect('/M00964713/signup');
    }

    try {
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            // return res.status(400).send('username is already taken.');
            req.session.message = 'username is already taken.';
            return res.redirect('/M00964713/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = await usersCollection.insertOne({ username, password: hashedPassword,avatar:'https://cdn-icons-png.flaticon.com/128/12497/12497210.png' });
        req.session.message = 'Registration successful. Please log in.';
        res.redirect('/M00964713/signin');
        // res.json({
        //     msg: "user register",
        //     user: newUser
        // })
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
}




// login user
// route -> /login
// method -> POST
exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        // return res.status(400).send('username and password are required.');
        req.session.message = 'All fields are required.';
        return res.redirect('/M00964713/signin');
    }

    try {
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username });
        if (!user) {
            req.session.message = 'Invalid username or password.';
            return res.redirect('/M00964713/signin');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            req.session.message = 'Incorrect password.';
            return res.redirect('/M00964713/signin');
        }


        req.session.user = user;
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.avatar = user.avatar;
        req.session.message = 'Login successful.';

        res.redirect('/M00964713');
        // res.json({
        //     msg:"user login",
        //     user
        // })

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
}


// check login status
// route -> /login
// method -> GET
exports.checkLogin = (req, res) => {

    // Check if session exists and contains user information
    if (req.session && req.session.userId) {
        return res.status(200).json({
            success: true,
            message: 'User is logged in.',
            user: req.session.userId // Provide user data from session
        });
    }

    // If no user session exists, return unauthorized response
    return res.status(401).json({
        success: false,
        message: 'User is not logged in.'
    });
}



// logout user
// route -> /login
// method -> DELETE
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/M00964713');
        // res.send("user logout")
    });
}


// get user
// route -> /me
// method -> GET
exports.getUser = async (req, res) => {
    if (!req.params.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.userId) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get all followers
exports.followers = async (req, res) => {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the followers
        res.status(200).json({ followers: user.followers || [] });
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// get all followings
exports.followings = async (req, res) => {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the followings
        res.status(200).json({ followings: user.followings || [] });
    } catch (error) {
        console.error('Error fetching followings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



// update user
exports.updateUser = async (req, res) => {

    console.log(req.body);

    const userId = req.params.userId; // User ID from request parameters
    const updatedData = req.body; // Data to update from request body

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    try {

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated successfully', result });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// update avatar
exports.updateAvatar = async (req, res) => {
    const userId = req.params.userId;

    try {

        // Validate file upload
        if (!req.file) {
            return res.status(400).json({ error: 'Avatar file is required' });
        }

        const avatarPath = path.resolve(req.file.path);
        // Update the user's avatar in the database
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { avatar: avatarPath } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Avatar updated successfully', avatar: avatarPath });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// *********************************** ***** ***********************************
// *********************************** posts ***********************************
// *********************************** ***** ***********************************

// create posts
// route -> /contents
// method -> POST
exports.createPost = async (req, res) => {
    try {
        const { userId, content, title } = req.body;
        if (!userId || !content) {
            return res.status(400).json({ message: 'userId and content are required' });
        }

        // Add post to the database
        const postCollection = db.collection("posts");
        const result = await postCollection.insertOne({
            userId,
            title,
            content,
            image: req.files.image[0].filename,
            createdAt: new Date(),
        });

        res.status(201).json({ message: "Post created", postId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating post" });
    }
};


// get all posts from followings
// route -> /my-posts
// method -> GET
exports.myPosts = async (req, res) => {
    try {
        if (req.session && req.session.userId) {
            const postCollection = db.collection("posts");
            let posts = await postCollection.find().toArray();

            let userPosts = []

            console.log(req.session.userId);
            

            for (let i = 0; i < posts.length; i++) {
                if (posts[i].userId === req.session.userId) {
                    userPosts.push(posts[i])
                }
            }

            res.status(200).json({
                count: userPosts.length,
                posts: userPosts
            });
        } else {
            res.send("user should login")
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching posts" });
    }
}


exports.getAllPosts = async (req, res) => {

    try {
        const userId = req.params.userId; // Assume userId is passed as a query parameter

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // Find the user and their followings list
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const followings = user.followings || []; // List of account IDs the user follows

        if (followings.length === 0) {
            return res.status(200).json({ posts: [] });
        }


        // Fetch posts from the accounts the user follows
        const posts = await postsCollection
            .find()
            .toArray();

        let results = []

        for (let i = 0; i < posts.length; i++) {
            for (let j = 0; j < followings.length; j++) {
                if (posts[i].userId === followings[j]) {
                    results.push(posts[i])
                }
            }
        }

        res.status(200).json({ count: results.length, posts: results });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts.' });
    }
}

// follow 
// route -> /follow
// method -> POST
exports.follow = async (req, res) => {


    const { followerId, followeeId } = req.body;

    if (!ObjectId.isValid(followerId) || !ObjectId.isValid(followeeId)) {
        return res.status(400).json({ error: 'Invalid user IDs' });
    }

    if (followerId === followeeId) {
        return res.status(400).json({ error: 'Users cannot follow themselves' });
    }

    try {
        // Add followeeId to the following list of followerId
        const updateFollower = await usersCollection.updateOne(
            { _id: new ObjectId(followerId) },
            { $addToSet: { followings: followeeId } }
        );

        // Add followerId to the followers list of followeeId
        const updateFollowee = await usersCollection.updateOne(
            { _id: new ObjectId(followeeId) },
            { $addToSet: { followers: followerId } }
        );

        if (updateFollower.modifiedCount > 0 && updateFollowee.modifiedCount > 0) {
            res.status(200).json({ message: 'Followed successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

// unfollow 
// route -> /follow
// method -> DELETE
exports.unfollow = async (req, res) => {
    const { followerId, followeeId } = req.body;

    if (!ObjectId.isValid(followerId) || !ObjectId.isValid(followeeId)) {
        return res.status(400).json({ error: 'Invalid user IDs' });
    }

    try {
        // Remove followeeId from the following list of followerId
        const updateFollower = await usersCollection.updateOne(
            { _id: new ObjectId(followerId) },
            { $pull: { followings: followeeId } }
        );

        // Remove followerId from the followers list of followeeId
        const updateFollowee = await usersCollection.updateOne(
            { _id: new ObjectId(followeeId) },
            { $pull: { followers: followerId } }
        );

        if (updateFollower.modifiedCount > 0 && updateFollowee.modifiedCount > 0) {
            res.status(200).json({ message: 'Unfollowed successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}


// search users 
// route -> /users/search
// method -> GET
exports.searchUsers = async (req, res) => {
    try {
        const { username } = req.query;

        // Build the query object dynamically based on provided parameters
        const query = {};
        if (username) query.username = { $regex: username, $options: 'i' }; // Case-insensitive username search

        // Fetch users from the database
        const users = await db.collection('users').find(query).toArray();

        res.status(200).json(users.filter(item => item.username !== req.session.username));

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// search contents 
// route -> /contents/search
// method -> POST
exports.searchContents = async (req, res) => {
    try {
        const { title, content } = req.query;

        // Build the query object dynamically based on provided parameters
        const query = {};
        if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive name search
        if (content) query.content = { $regex: content, $options: 'i' }; // Case-insensitive name search

        // Fetch posts from the database
        const posts = await db.collection('posts').find(query).toArray();

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


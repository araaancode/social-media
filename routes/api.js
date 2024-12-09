const express = require("express")
const router = express.Router()

const apiControllers = require("../controllers/api")

const { imageUpload } = require("../config/upload")

// pages
router.get('/', (req, res) => {
    if (req.session.userId) {
        return res.render('dashboard', { username: req.session.username, userId: req.session.userId, user: req.session.user });
    }
    res.render('index');
});

router.get('/signup', (req, res) => {
    if (!req.session.userId) {
        return res.render('register');
    } else {
        res.redirect('/M00964713')
    }
});


router.get('/signin', (req, res) => {
    if (!req.session.userId) {
        return res.render('login');
    } else {
        res.redirect('/M00964713')
    }
});

router.get('/profile', (req, res) => {
    if (req.session.userId) {
        console.log(req.session);
        return res.render('profile', { username: req.session.username });
    }
    res.render('login');
});

router.get('/users', (req, res) => {
    if (req.session.userId) {
        return res.render('users', { username: req.session.username });
    }
    res.render('login');
});

router.get('/contents', (req, res) => {
    if (req.session.userId) {
        return res.render('contents', { username: req.session.username });
    }
    res.render('login');
});

// search
router.get('/contents/search', apiControllers.searchContents)
router.get('/users/search', apiControllers.searchUsers)


// authentication
router.get('/user/:userId', apiControllers.getUser)
router.post('/users', apiControllers.register)
router.post('/login', apiControllers.login)
// router.get('/login', apiControllers.checkLogin)
router.delete('/login', apiControllers.logout)
router.get('/followers/:userId', apiControllers.followers)
router.get('/followings/:userId', apiControllers.followings)
router.put('/user/:userId/update-user', apiControllers.updateUser)
router.put('/user/:userId/update-avatar', imageUpload.single('avatar'), apiControllers.updateAvatar)

// posts
router.post('/contents', imageUpload.fields([{ name: "image", maxCount: 1 }]), apiControllers.createPost)
router.get('/contents/:userId', apiControllers.getAllPosts)
router.get('/my-posts', apiControllers.myPosts)

// follow - unfollow
router.post('/follow', apiControllers.follow)
router.delete('/follow', apiControllers.unfollow)



module.exports = router
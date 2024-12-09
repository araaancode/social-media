const bcrypt = require("bcryptjs")
const { ObjectId } = require("mongodb")

const users = [
    {
        "_id": new ObjectId("674f29ef6d78affe694103df"),
        "firstname": "user one",
        "lastname": "lastname",
        "username": "username one",
        "phone": "09383901120",
        "email": "test@example1.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
        "createdAt":new Date()
       
    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e0"),
        "firstname": "user two",
        "lastname": "lastname",
        "username": "username two",
        "phone": "09383901121",
        "email": "test@example2.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
        "createdAt":new Date()
    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e1"),
        "firstname": "user three",
        "lastname": "lastname",
        "username": "username three",
        "phone": "09383901122",
        "email": "test@example3.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/6997/6997662.png",
        "createdAt":new Date()
    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e2"),
        "firstname": "user four",
        "lastname": "lastname",
        "username": "username four",
        "phone": "09383901123",
        "email": "test@example4.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/16683/16683419.png",
        "createdAt":new Date()
    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e3"),
        "firstname": "user five",
        "lastname": "lastname",
        "username": "username five",
        "phone": "09383901124",
        "email": "test@example5.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/4140/4140047.png",
        "createdAt":new Date()

    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e4"),
        "firstname": "user six",
        "lastname": "lastname",
        "username": "username six",
        "phone": "09383901125",
        "email": "test@example6.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
        "createdAt":new Date()

    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e5"),
        "firstname": "user seven",
        "lastname": "lastname",
        "username": "username seven",
        "phone": "09383901126",
        "email": "test@example7.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/1999/1999625.png",
        "createdAt":new Date()

    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e6"),
        "firstname": "user eight",
        "lastname": "lastname",
        "username": "username eight",
        "phone": "09383901127",
        "email": "test@example8.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/11498/11498793.png",
        "createdAt":new Date()

    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e7"),
        "firstname": "user nine",
        "lastname": "lastname",
        "username": "username nine",
        "phone": "09383901128",
        "email": "test@example9.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/4333/4333609.png",
        "createdAt":new Date()

    },
    {
        "_id": new ObjectId("674f29ef6d78affe694103e8"),
        "firstname": "user ten",
        "lastname": "lastname",
        "username": "username ten",
        "phone": "09383901129",
        "email": "test@example10.com",
        "password": bcrypt.hashSync('12345678', 12),
        "avatar": "https://cdn-icons-png.flaticon.com/128/848/848006.png",
        "createdAt":new Date()

    },
]


module.exports = users
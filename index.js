const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json())

//mongoDb atlas
const uri = "mongodb+srv://jihad:<jihad>@cluster0.bgttmgf.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function verifyJWT(req, res, next) {
    const authHeder = req.headers.authorization;
    if (!authHeder) {
        return res.status(401).send('This parson unAthorizetion access')
    }

    const token = authHeder.split(' ')[1];
    jwt.verify(token, process.env.ACCSS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(402).send({ message: "forbiden access" })
        }

        req.decoded = decoded;
        next()
    })

}

async function run() {

    try {
        const categories = client.db('resaleapp').collection('categories');
        const products = client.db('resaleapp').collection('products');
        const booked_products = client.db('resaleapp').collection('booked_products');
        const users = client.db('resaleapp').collection('users');
        const advertises = client.db('resaleapp').collection('advertises');

        app.get('/cetegories', async (req, res) => {
            const query = {};
            const result = await categories.find(query).toArray();
            res.send(result);
        })

        app.post('/productAdd', async (req, res) => {
            const review = req.body;
            const result = await products.insertOne(review);
            res.send(result)
        })

        app.get('/cetegories/:id', async (req, res) => {
            const product = req.params.id;
            const query = { id: product };
            const result = await products.find(query).toArray();
            res.send(result);

        })

        app.get('/allProduct', async (req, res) => {
            const query = {};
            const result = await products.find(query).toArray();
            res.send(result)
        })
        app.get('/allProduct/:email', async (req, res) => {
            const user = req.params.email
            const query = { email: user };
            const result = await products.find(query).toArray();
            res.send(result)
        })

        app.post('/booking', async (req, res) => {
            const boking = req.body;
            const result = await booked_products.insertOne(boking);
            res.send(result);
        })
        
        app.post('/advertic', async (req, res) => {
            const boking = req.body;
            const result = await advertises.insertOne(boking);
            res.send(result);
        })
        
        app.get('/advertic/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await advertises.find(query).toArray();
            res.send(result);
        })
        
        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await booked_products.find(query).toArray();
            res.send(result);
        })
        
        app.get('/bookings', async (req, res) => {
            const query = {};
            const result = await booked_products.find(query).toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await users.insertOne(users);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const result = await users.find(query).toArray();
            res.send(result)
        })
        
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await users.find(query).toArray();
            res.send(result)
        })
        
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await users.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCSS_TOKEN, { expiresIn: '1h' });
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
        })


    }
    catch (error) {
        console.log(error.name, error.message, error.stack);
    }

}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('Hello from resale application')
})
app.listen(port, () => console.log(`Resale applicationserver running at: ${port}`))
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())


const reviewSchema = new mongoose.Schema({
    title: String,
    content: String,
    dateTime: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

app.get('/reviews', async (req, res) => {
    const reviews = await Review.find({});
    res.json(reviews);
});

app.get('/reviews/:id', async (req, res) => {
    const id = req.params.id;
    const review = await Review.findById(id);
    if (!review) {
        return res.status(404).send('Review not found');
    }
    res.json(review);
});

app.post('/reviews', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }
    const review = new Review({ title, content });
    await review.save();
    res.json(review);
});

app.put('/reviews/:id', async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }
    const review = await Review.findByIdAndUpdate(
        id,
        { title, content, dateTime: Date.now() },
        { new: true }
    );
    if (!review) {
        return res.status(404).send('Review not found');
    }
    res.json(review);
});

app.delete('/reviews/:id', async (req, res) => {
    const id = req.params.id;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
        return res.status(404).send('Review not found');
    }
    res.json(review);
});



//connection to db
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('connected to db');
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        })
    }).catch(err => {
        console.log(err);
    })
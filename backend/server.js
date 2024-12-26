const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


mongoose.connect('mongodb://127.0.0.1:27017/reviewsDB')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });


const reviewSchema = new mongoose.Schema({
    username: String,
    email: String,
    rating: Number,
    reviewSummary: String,
    reviewDetail: String,
    photos: [String],
    recommend: Number,
});

const Review = mongoose.model('Review', reviewSchema);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});


app.post('/submit-review', upload.array('photos'), async (req, res) => {
    console.log(req.body); 

    try {
        const newReview = new Review({
            username: req.body.username,
            email: req.body.email,
            rating: req.body.rating,
            reviewSummary: req.body.reviewSummary,
            reviewDetail: req.body.reviewDetail,
            recommend: req.body.recommend
        });
        await newReview.save();
        res.status(201).send('Review submitted successfully');
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});

app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});


app.get('/reviews-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'reviews.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
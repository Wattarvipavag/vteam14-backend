import express from 'express';
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Hello world!!!!' });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

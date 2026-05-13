const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;


app.use(express.static('public')); // "posluzuje" index.html
// Automatski koristi sve iz mape public
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.set('view engine', 'ejs');

app.get('/slike', (req, res) => {
 const folderPath = path.join(__dirname, 'public', 'images');
 const files = fs.readdirSync(folderPath);

 const images = files
 .filter(file => file.endsWith('.jpg') || file.endsWith('.svg'))
 .map((file, index) => ({
 url: `/images/${file}`,
 id: `slika${index + 1}`,
 title: `Slika ${index + 1}`
 }));

 res.render('slike', { images });
});

app.get('/slike/:id', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'images');
    const files = fs.readdirSync(folderPath);

    const images = files
        .filter(file => file.endsWith('.jpg') || file.endsWith('.svg'))
        .map((file, index) => ({
            url: `/images/${file}`,
            id: `slika${index + 1}`,
            title: `Slika ${index + 1}`
        }));

    const image = images.find(img => img.id === req.params.id);

    if (!image) {
        return res.status(404).send("Slika nije pronađena");
    }

    res.render('Slika', { image });
});


app.listen(PORT, () => {
console.log("Server pokrenut na http://localhost:3000");
})
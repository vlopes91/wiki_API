const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lodash = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const docSchema = {
    title: String,
    content: String,
}

const Article = mongoose.model('article', docSchema);

// const item = new Article({
//     title:'Made by Server',
//     content:'Article made by server'
// })

// item.save();

app.route('/articles')
    .get((req, res) => {
        Article.find({}, (err, resp) => {
            if (!err) {
                res.send(resp);
            } else {
                res.send(err);
            }
        })
    })
    .post((req, res) => {
        // console.log(req.body.title);
        // console.log(req.body.content);
        const newPost = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newPost.save((err) => {
            if (!err) {
                res.send('Data Posted sucessfully');
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err, resp) => {
            if (!err) {
                res.send("All documents deleted sucessfully!");
            } else {
                res.send(err);
            }
        })
    })
app.route('/articles/:requested')

.get((req, res) => {
    const articlesearch = lodash.capitalize(req.params.requested);
    Article.findOne({
        title: articlesearch
    }, (err, article) => {
        if (!err) {
            res.send(article);
        } else {
            res.send(err)
        }
    })
})

app.listen(4000, () => {
    console.log('Server started on port 4000');
})
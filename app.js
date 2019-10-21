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

        Article.findOne({
            title: newPost.title
        }, (err, article) => {
            if (article) {
                res.send('This article already exists!');
            } else {
                newPost.save((err) => {
                    if (!err) {
                        res.send('Data Posted sucessfully');
                    } else {
                        res.send(err);
                    }
                });
            }
        })
       
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
    let articlesearch = lodash.capitalize(req.params.requested);
    Article.findOne({
        title: articlesearch
    }, (err, article) => {
        if (article) {
            res.send(article);
        } else {
            res.send('None article was found based on the search tag provided.')
        }
    })
})

.put((req,res)=>{
    let articlesearch = lodash.capitalize(req.params.requested);
    Article.findOne({
        title: articlesearch
    }, (err, article) => {
        if (article) {
            Article.updateOne({title:articlesearch},{title:req.body.title,content:req.body.content},(err,article)=>{
                if(!err){
                    res.send('Article '+ articlesearch +' was sucessfully updated.')
                }else{
                    res.send(err);
                }
            })
        } else {
            res.send('The article you are trying to update doesn\'t exists')
        }
    })
    
})

.patch((req,res)=>{
    let articlesearch = lodash.capitalize(req.params.requested);
    Article.findOne({
        title: articlesearch
    }, (err, article) => {
        if (article) {
            Article.updateOne({title:articlesearch},{$set:req.body},(err,article)=>{
                if(!err){
                    res.send('Article '+ articlesearch +' was sucessfully updated.')
                }else{
                    res.send(err);
                }
            })
        } else if (err){
            res.send(err)
        }else{
            res.send('The article you are trying to update doesn\'t exists')
        }
    })
})

.delete((req,res)=>{
    let articlesearch = lodash.capitalize(req.params.requested);
    Article.findOne({title:articlesearch},(err,article)=>{
        if(article) {
            Article.deleteOne({title:articlesearch},(err)=>{
                if(!err){
                    res.send('Article '+ articlesearch +' was sucessfully deleted.')
                }else{
                    res.send(err);
                }   
            }) 
        }else{
            res.send('The article you are trying to delete doesn\'t exists')
        }
    })
   
})

app.listen(4000, () => {
    console.log('Server started on port 4000');
})
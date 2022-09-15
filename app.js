const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const {Schema} = mongoose;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
    imageUrl: String
});

const Blog = mongoose.model('blog', blogSchema)

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/blog', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views/blogs.html'))
});
app.get('/api/blog', async (req, res) => {
    try {

        let posts = await Blog.find({});
        return res.status(200).send({
            message: 'posts fetched successfully',
            posts
        });

    } catch(err){
        return res.status(500).send({
            message: err.message
        });
    }
});

app.post('/blog', async(req, res) => {
    try {
        const {title, imageUrl, author, body} = req.body
        const newBlog = await Blog.create({
        title,
        author,
        imageUrl,
        body
    });
    return res
    .status(200)
    .send({message: 'blog post created successfully', data: newBlog});
    } catch (err) {
        return res.status(500).send({
            message: err.message,
        })
    }
});

app.get('/blog/new', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views/new.html'))
})

app.get('/blog/:id', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views/blog.html'))
})

app.get('/blog/:id/edit', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views/edit.html'))
})

app.get('/api/blog/:id', async(req, res) => {
    try{
        const blogId = req.params.id
        const post = await Blog.findById(blogId)
        return res.status(200).send({
            message: 'single post fetched',
            post: post
        })
    }catch(err){
        return res.status(500)
        .send({message: err.message});
    }
})

app.put('/api/blog/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
            title : req.body.title,
            author : req.body.author,
            imageUrl : req.body.imageUrl,
            body : req.body.body
        });
       return res.status(200).send({message: 'blog post updated successfully'})
    } catch(err) {
        return res.status(500).send({message: err.message});
    }
});
app.delete('/api/blog/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        return res.status(204).send({message: 'blog deleted successfully'});
    } catch(err){
       res.status.send({message: err.message});
    } 
})

app.listen(5001, async ()=>{
    try {
        let db = await mongoose.connect('mongodb://localhost/blogapp')
    } catch (err) {
        console.log(err.message)
    } finally {
        console.log('app running on port 5001')
    }
});
                                                                                                                                 
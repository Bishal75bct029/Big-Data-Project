const express = require("express")
const mongoose = require("mongoose")
const { Client } = require("@elastic/elasticsearch")

const Blog = mongoose.model(
    "userdb",
    new mongoose.Schema({ name: String, email: String })
)

const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://bishallc:mongo123@cluster0.gfktjah.mongodb.net/?retryWrites=true&w=majority")
const client = new Client({
    cloud: {
        id: "Test:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRhYzM1ZmE1MzVmZDY0OGRmOTliNzM3MzljZGIwYjc2OSQ2NDBmOWMwNGI0YTI0YTVmOTI5MjMzMzE2ZDIzNjBiNQ==",
    },
    auth: { username: "elastic", password: "xAhAjdXu4Cl7HAwLAPDOT61Z" },
})

app.get("/create", async (req, res) => {
    const blog = await new Blog({
        title: "Rockin blog",
        content: "This is my long ass blog",
    }).save()

    await client.index({
        index: "blogs",
        body: {
            id: blog._id,
            title: blog.title,
            content: blog.content,
        },
    })

    res.json(blog)
})

app.get("/search/:query", async (req, res) => {
    const data = await client.search({
        index: "blogs",
        body: {
            query: {
                multi_match: {
                    query: req.params.query,
                    fields: ["title", "content"],
                },
            },
        },
    })

    const found = data.hits.hits

    const ids = found
        .map((item) => item._source.id)
        .filter((item) => item)
        .map((id) => new mongoose.Types.ObjectId(id))

    const blogs = await Blog.find({
        _id: { $in: ids },
    })

    console.log(blogs)

    res.json({ found: blogs })
})

app.get("/blogs", async (req, res) => {
    const blogs = await Blog.find()

    res.json(blogs)
})




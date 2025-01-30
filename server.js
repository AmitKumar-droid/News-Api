const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

const API_KEY = "b02331c5a6974b93a9aaeaa7ae186a17"; // Replace with your own API key

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the News API proxy!");
});

// Route to serve news as HTML
app.get("/news", async (req, res) => {
    const { query = "sports", page = 1 } = req.query;
    const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&page=${page}&sortBy=popularity&apiKey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const articles = response.data.articles;

        // Generate HTML content from the articles
        let htmlContent = `
            <h1>News Articles for "${query}"</h1>
            <div class="news-container">
        `;

        articles.forEach(article => {
            htmlContent += `
                <div class="news-item">
                    <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                    <p>${article.description}</p>
                    <img src="${article.urlToImage}" alt="${article.title}" width="100%">
                </div>
            `;
        });

        htmlContent += "</div>";
        res.send(htmlContent);
    } catch (error) {
        console.error("Error fetching news from NewsAPI:", error);
        res.status(500).send("Error fetching the news.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const { google } = require('googleapis');
const ytDlp = require('yt-dlp-exec');
const app = express();

const PORT = process.env.PORT || 8000;
const YT_API_KEY = 'AIzaSyCzRJTOldgh-T2qK-BTNUKHZWNDbs1Ia3c'; // Google Cloud API Key

const youtube = google.youtube({ version: 'v3', auth: YT_API_KEY });

app.get('/', (req, res) => {
    res.json({ status: 'YouTube Downloader API is Live' });
});

// Endpoint: /ytdl?name=වීඩියෝවේ_නම
app.get('/ytdl', async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'කරුණාකර නම ලබා දෙන්න.' });

    try {
        // 1. YouTube API හරහා වීඩියෝව සෙවීම
        const search = await youtube.search.list({
            part: 'snippet',
            q: query,
            maxResults: 1,
            type: 'video'
        });

        if (!search.data.items.length) return res.json({ success: false, message: 'හමු නොවීය' });

        const videoId = search.data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // 2. yt-dlp මගින් වීඩියෝවේ Direct Download Link එක ලබා ගැනීම
        const info = await ytDlp(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            format: 'best[ext=mp4]/best', // WhatsApp වලට ගැළපෙන MP4
        });

        res.json({
            success: true,
            title: info.title,
            thumbnail: info.thumbnail,
            download_url: info.url, // බොට් එකට අවශ්‍ය Direct Link එක
            videoId: videoId
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));

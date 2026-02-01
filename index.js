const express = require('express');
const { google } = require('googleapis');
const ytDlp = require('yt-dlp-exec');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 8000;
const YT_API_KEY = 'AIzaSyCzRJTOldgh-T2qK-BTNUKHZWNDbs1Ia3c'; 

// --- Cookies කළමනාකරණය ---
// Koyeb එකේ YT_COOKIES කියන Variable එකට JSON එක දාලා තියෙන්න ඕනේ
if (process.env.YT_COOKIES) {
    try {
        fs.writeFileSync('./cookies.json', process.env.YT_COOKIES);
        console.log('✅ Cookies file created successfully.');
    } catch (err) {
        console.error('❌ Cookies error:', err.message);
    }
}

const youtube = google.youtube({ version: 'v3', auth: YT_API_KEY });

app.get('/', (req, res) => {
    res.json({ status: 'YouTube Downloader API is Live' });
});

app.get('/ytdl', async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'කරුණාකර නම ලබා දෙන්න.' });

    try {
        // 1. YouTube API හරහා සෙවීම
        const search = await youtube.search.list({
            part: 'snippet',
            q: query,
            maxResults: 1,
            type: 'video'
        });

        if (!search.data.items.length) return res.json({ success: false, message: 'හමු නොවීය' });

        const videoId = search.data.items[0].id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // 2. yt-dlp මගින් Direct Link එක ගැනීම
        const info = await ytDlp(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            format: 'best[ext=mp4]/best',
            // YouTube Bot Detection එක නැති කරන settings
            cookies: fs.existsSync('./cookies.json') ? './cookies.json' : undefined,
            addHeader: [
                'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ],
            noWarnings: true,
            geoBypass: true
        });

        res.json({
            success: true,
            title: info.title,
            thumbnail: info.thumbnail,
            download_url: info.url,
            videoId: videoId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));

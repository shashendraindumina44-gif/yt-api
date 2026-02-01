# Node.js 18 වෙනුවට Node.js 20 පාවිච්චි කරන්න
FROM node:20

# System dependencies install කිරීම
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp අලුත්ම version එක ඉන්ස්ටෝල් කිරීම
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]

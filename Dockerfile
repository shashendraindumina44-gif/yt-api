FROM node:20

# System dependencies install කිරීම
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp binary එක download කරලා permissions දීම
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Python check එකක් (Optional but helpful for debugging)
RUN python3 --version && yt-dlp --version

WORKDIR /app

# Dependencies install කිරීම (Layers cache වෙන්න මුලින් මේවා කරන්න)
COPY package*.json ./
RUN npm install --production

COPY . .

# Port එක expose කරන්න (Koyeb වලට මේක වැදගත්)
EXPOSE 8000

CMD ["npm", "start"]

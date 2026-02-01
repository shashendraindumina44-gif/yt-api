FROM node:20

# පද්ධතියට අවශ්‍ය මෘදුකාංග ඉන්ස්ටෝල් කිරීම
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python binary එක නිවැරදිව පෙන්වීම
RUN ln -s /usr/bin/python3 /usr/bin/python

# yt-dlp අලුත්ම version එක download කිරීම
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8000
CMD ["npm", "start"]

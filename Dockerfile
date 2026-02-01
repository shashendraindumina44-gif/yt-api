FROM node:20

# 1. පද්ධතිය Update කර Python සහ අනෙකුත් අවශ්‍ය දේවල් ඉන්ස්ටෝල් කිරීම
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 2. Python binary එක 'python' ලෙස පද්ධතියට හඳුන්වා දීම (මේක තමයි error එකට විසඳුම)
RUN ln -s /usr/bin/python3 /usr/bin/python

# 3. yt-dlp binary එක download කර permissions දීම
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# 4. Dependencies ඉන්ස්ටෝල් කිරීම (දැන් Python තියෙන නිසා Error එකක් එන්නේ නැහැ)
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]

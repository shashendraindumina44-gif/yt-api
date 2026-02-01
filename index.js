const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const ytDlp = require('yt-dlp-exec');
const qrcode = require('qrcode-terminal');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const from = msg.key.remoteJid;

        if (text && text.includes('youtube.com/watch') || text.includes('youtu.be/')) {
            await sock.sendMessage(from, { text: '📥 වීඩියෝව බාගත වෙමින් පවතියි, කරුණාකර රැඳී සිටින්න (Speed: Max)...' });

            try {
                // yt-dlp හරහා වීඩියෝව බාගත කිරීම
                const output = await ytDlp(text, {
                    dumpSingleJson: true,
                    noCheckCertificates: true,
                    preferFreeFormats: true,
                });

                await sock.sendMessage(from, { 
                    video: { url: output.url }, 
                    caption: `✅ සාර්ථකයි: ${output.title}` 
                });
            } catch (e) {
                await sock.sendMessage(from, { text: '❌ දෝෂයක් සිදු විය. නැවත උත්සාහ කරන්න.' });
                console.log(e);
            }
        }
    });
}

startBot();

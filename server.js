import express from 'express';
import axios from 'axios';
import {time} from './models/time.js'
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


//#region   MIDDLEWARES
app.use(express.json({ extended: true }));
app.use(express.static("public"));
//#endregion


app.listen(PORT, () => {
    console.log(`App listening port: ${PORT}`);
});

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post('/calculate', async (req,res) => { 
    const rawUserInput = JSON.stringify(req.body.listUrl) ;
    const TplaylistId = arrangeRequestInfo(rawUserInput);
    console.log("TplaylistId")
    console.log(TplaylistId)
    const playlistId = TplaylistId;

    const result = await calculateDuration(playlistId);

    res.send(result);
})


// AXIOS QUERIES
async function getPlaylistItems(playlistId,apiKey){
    let videoIds= []; 

    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: {
            part: 'snippet', 
            playlistId: playlistId,
            key: apiKey,
            maxResults: 300 
        }
    });

    response.data.items.forEach(item => {
        videoIds.push(item.snippet.resourceId.videoId);
    });

    return videoIds;
}

async function getVideoLenght(videoUrl,apiKey){

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoUrl}&part=contentDetails&key=${apiKey}`);
        const videoDetails = response.data.items[0].contentDetails;
   
        let strVideoDuration = JSON.stringify(videoDetails.duration)

        return strVideoDuration;
    } catch (error) {
        console.log(`GetVideoLenght Request ERROR: ${error}`);   
    }
}
 
// HELPER FUNCS

async function calculateDuration(playlistId){
    let apiToken =  getQueryToken();
    let videoListDuration = 0;

    let playlistItems = await getPlaylistItems(playlistId,apiToken);

    let videoLenght;

    for(const element of playlistItems){
        videoLenght = await getVideoLenght(element,apiToken);
        videoListDuration += convertDurationToSeconds(videoLenght);
    }

   let result = convertSecondsToDuration(videoListDuration);
    console.log(result);

    console.log(`Total Duration Result: ${ JSON.stringify(result) }`);   

    return result;  
}

function convertDurationToSeconds(duration){
    let videoDurationSecond = 0;

    const matches = duration.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/);

    if (matches) {
        const days = parseInt(matches[1]) || 0;
        const hours = parseInt(matches[2]) || 0;
        const minutes = parseInt(matches[3]) || 0;
        const seconds = parseInt(matches[4]) || 0;

        // Toplam saniyeyi hesapla
        videoDurationSecond = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    }
    return videoDurationSecond;
}

function convertSecondsToDuration(totalDurationSecons){
    let result = [];
    result.push(new time(totalDurationSecons,1).getDuration());
    result.push(new time(totalDurationSecons,1.25).getDuration());
    result.push(new time(totalDurationSecons,1.5).getDuration());
    result.push(new time(totalDurationSecons,1.75).getDuration());
    result.push(new time(totalDurationSecons,2).getDuration());
    
    return result;
}


function getQueryToken() {return process.env.youtubeApiToken;}


function arrangeRequestInfo(userInput){
    console.log(`user value: ${userInput}`);
    
        const regex = /[&?]list=([a-zA-Z0-9_-]+)/;
        const match = userInput.match(regex);
    
        if (match && match[1]) {
            console.log(`test: ${match[1]}`);
            return match[1];
        }
        return userInput;
}

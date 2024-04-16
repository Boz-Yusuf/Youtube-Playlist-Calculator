const submitButton = document.getElementById('submitButton');
const userInput = document.getElementById('playlistURL');

const result = document.getElementById('result');
const result_1_25 = document.getElementById('result_1_25');
const result_1_5 = document.getElementById('result_1_5');
const result_1_75 = document.getElementById('result_1_75');
const result_2 = document.getElementById('result_1_2');


// || EVENT LISTENERS
submitButton.addEventListener('click', function() {
    calculate();
});

// || FUNCTIONS
async function calculate(){
    let listUrl = userInput.value;
    const data = await sendPost(listUrl);
    fillAreas(data);
    //show areas
}

function fillAreas(data){
    console.log('test');
    console.log(data[0].day);
    result.innerText  = `Total Playlist Duration: ${data[0].day} Gün ${data[0].hour} Saat ${data[0].minute} Dakika ${data[0].second} Saniye`;
    result_1_25.innerText  = `${data[1].day} Gün ${data[1].hour} Saat ${data[1].minute} Dakika ${data[1].second} Saniye`;
    result_1_5.innerText  = `${data[2].day} Gün ${data[2].hour} Saat ${data[2].minute} Dakika ${data[2].second} Saniye`;
    result_1_75.innerText  = `${data[3].day} Gün ${data[3].hour} Saat ${data[3].minute} Dakika ${data[3].second} Saniye`;
    result_2.innerText  = `${data[4].day} Gün ${data[4].hour} Saat ${data[4].minute} Dakika ${data[4].second} Saniye`;
}


async function sendPost(url) {
    const data = { listUrl: url };

    try {
        const response = await fetch('http://localhost:3000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const jsonData = await response.json();
        console.log(jsonData);
        return jsonData;
    } catch (error) {
        console.error('Error:', error);
        return null; 
    }
}









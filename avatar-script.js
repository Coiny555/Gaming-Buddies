const optionDivs = document.querySelectorAll('.options div');

optionDivs.forEach(div => {
    div.addEventListener('click', () => {
        const layer = div.dataset.layer;
        const src = div.dataset.src;

        document.getElementById(`avatar-${layer}`).src = src;

        div.parentElement.querySelectorAll('div').forEach(d => d.classList.remove('selected'));
        div.classList.add('selected');
    });
});

// initialize default selection as first option for each group (skin1, eyes1, etc.)
document.querySelectorAll('.options').forEach(options => {
    options.querySelector('div').classList.add('selected');
});

document.getElementById("bgColorPicker").addEventListener("input", function () {
    document.querySelector(".avatar-preview").style.backgroundColor = this.value;
});

// generate random avatar
randomButton.addEventListener('click', () => {
    const layers = ["skin", "eyes", "eyebrows", "nose", "mouth", "hair"];

    layers.forEach(layer => {
        const options = Array.from(document.querySelectorAll(`.options div[data-layer='${layer}']`));
        const randomOption = options[Math.floor(Math.random() * options.length)];

        // update avatar preview
        document.getElementById(`avatar-${layer}`).src = randomOption.dataset.src;

        // update selection border
        options.forEach(d => d.classList.remove('selected'));
        randomOption.classList.add('selected');
    });

    // generate random background color
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

    document.getElementById("bgColorPicker").value = randomColor;
    document.querySelector(".avatar-preview").style.backgroundColor = randomColor;
});

document.getElementById("saveAvatarBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter a username!");
        return;
    }

    const canvas = document.getElementById("avatarCanvas");
    const ctx = canvas.getContext("2d");

    // Draw layers in the correct order
    const layers = [
        "avatar-skin",
        "avatar-eyes",
        "avatar-eyebrows",
        "avatar-nose",
        "avatar-mouth",
        "avatar-hair"
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(id => {
        const img = document.getElementById(id);
        ctx.drawImage(img, 0, 0, 500, 500);
    });

    // Convert to Base64 PNG
    const avatarPNG = canvas.toDataURL("image/png");

    // Send to backend
    fetch("http://localhost:3000/api/save-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            avatar: avatarPNG
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert("Avatar saved successfully!");
    })
    .catch(err => console.error("Error:", err));
});

function loadImage(src) { 
    return new Promise(res => { 
        const image = new Image(); 
        image.crossOrigin = "Anonymous"; 
        image.onload = () => res(image); 
        image.src = src; 
    });
}

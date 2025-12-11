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
    const canvas = document.getElementById("avatarCanvas");
    const ctx = canvas.getContext("2d");

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const layers = ["skin", "eyes", "eyebrows", "nose", "mouth", "hair"];

    // draw all image layers on the canvas
    for (const layer of layers) {
        const img = document.getElementById(`avatar-${layer}`);
        const loadedImg = await loadImage(img.src);
        ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
    }

    // get final PNG image
    const finalImage = canvas.toDataURL("image/png");

    // send PNG
    fetch("/api/save-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: finalImage })
    })
    .then(res => res.json())
    .then(data => alert("Avatar saved!"))
    .catch(err => console.error("Save failed:", err));
});

// helper to load each layer image
function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.src = src;
    });
}

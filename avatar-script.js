const optionDivs = document.querySelectorAll('.options div');
const USER_ID = "6938bc7a4f114b26e1ead57f";

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const layers = ["skin", "eyes", "eyebrows", "nose", "mouth", "hair"];

    // Draw all avatar layers onto canvas
    for (const layer of layers) {
        const img = document.getElementById(`avatar-${layer}`);
        const loadedImg = await loadImage(img.src);
        ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
    }

    const final_avatar = canvas.toDataURL("image/png");
    /*fetch('http://localhost:3000/api/users/save-avatar', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        userId: USER_ID,
        avatar: final_avatar
    })
})*/
try {
    const data = { userId: USER_ID, avatar: final_avatar };

    const response = await fetch("http://localhost:3000/api/users/save-avatar", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
      userId: USER_ID,
      avatar: final_avatar
  })
});

const result = await response.json();
console.log("Server response:", result);

  } catch (err) {
    console.error("Error saving avatar:", err);
  }

});

function loadImage(src) { 
    return new Promise(res => { 
        const image = new Image(); 
        image.crossOrigin = "Anonymous"; 
        image.onload = () => res(image); 
        image.src = src; 
    });
}

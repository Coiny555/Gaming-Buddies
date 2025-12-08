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

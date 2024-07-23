const URL = "https://teachablemachine.withgoogle.com/models/XjD51jOFX/";

let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Handle the image upload event
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
        const image = new Image();
        image.src = event.target.result;
        image.onload = async () => {
            document.getElementById("imagePreview").src = image.src;
            await predict(image);
        };
    };
    reader.readAsDataURL(file);
}

// run the image through the image model
async function predict(image) {
    const prediction = await model.predict(image);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

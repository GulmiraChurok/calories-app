// get the DOM elements:
const fileInput = document.querySelector('input');
const sendBtn = document.querySelector('button');
const uploadedImg = document.querySelector('#uploaded-img');
const calCountP = document.querySelector('#calorie-count');
const mealNameP = document.querySelector('#meal-name');
const descriptionP = document.querySelector('#description');
const prepInstructions = document.querySelector('#instructions');
const calsPerItemP = document.querySelector('#cal-per-item');
const gramsP = document.querySelector('#grams');
// get the checkboxes
const vitaminsCB = document.querySelector('#vitamins-cb');
const mineralsCB = document.querySelector('#minerals-cb');
const vitaminsP = document.querySelector('#vitamins');
const mineralsP = document.querySelector('#minerals');

// call a function when fileInput changes (which occurs whenever an image is browsed to and its name appears)
fileInput.addEventListener('change', displayUploadedImage);
sendBtn.addEventListener('click', sendImageToPythonFlask);
// instantiate a new FormData obj and add the uploaded file to the form data obj
let formData;
let uploadedFile

// function runs when choose file gets image file.
function displayUploadedImage() {
    // store the uploaded img obj as variable. uploaded umg exists as item 0 of files array - property of the fileInput obj
    uploadedFile = fileInput.files[0];
    // instantiate a new, fresh FormData obj which will erase previous image that may have been uploaded by mistake
    formData = new FormData();
    formData.append("image", uploadedFile);
    // calCountP.textContent = formData;
    // set the src of the uploaded img tag to be the uploaded image(as oppsed to no source)
    uploadedImg.src = URL.createObjectURL(uploadedFile);
}

// funciton runs when user clicks Send Image button
function sendImageToPythonFlask() {
    // check if checkboxes are checked
    console.log("Vitamins checked:", vitaminsCB.checked);
    console.log("Mnierals checked:", mineralsCB.checked);
    let isVitamins = vitaminsCB.checked;
    let isMinerals = mineralsCB.checked;

    formData.append("isVitamins", isVitamins);
    formData.append("isMinerals", isMinerals);

    // if no image uploaded return/exit. uploadedFile the global var is still undefined, so it is falsey, therefor !uploadedFile
    if(!uploadedFile) {
        console.log("No uploaded file!")
        calCountP.textContent = "You must upload a food image file before sending";
        return
    }
    // do a fetch()-then()-then triple play, sending the formData to python route, which iwll take if from there by sending image with prompt to AI for analysis
    // calCountP.textContent = "hello from the sendImageToPythonFlask() function";
    fetch('/upload', {
        method: "POST",
        body: formData,
    })
    .then(resJson => resJson.json())
    .then(resObj => {console.log(resObj)
        // console.log('resObj.total_calories:',resObj.total_calories)
        mealNameP.textContent = resObj.meal_name;
        descriptionP.textContent = resObj.description;
        calCountP.textContent = "Total Calories: " + resObj.total_calories;
        prepInstructions.innerHTML = "<b>Prep Instructions:</b> " + resObj.prep_instructions;
        const itemCalories = resObj.calories_per_item;
        calsPerItemP.innerHTML = "<b>Itemized Calories:</b>"
        for(let i=0; i<itemCalories.length; i++) {
            // console.log(itemCalories[i])
            calsPerItemP.innerHTML += `<br>${itemCalories[i].name} : ${itemCalories[i].cals} cals`;
        }
        gramsP.innerHTML = `Protein: ${resObj.grams_protein}g 
                            | Fat: ${resObj.grams_fat}g
                            | Carbs: ${resObj.grams_carbs}g`
        //outputting vitramins and minerals:
        if(resObj.vitamins) {
            vitaminsP.innerHTML = "<b>Vitamins:</b>";
            vitaminsP.innerHTML += `<br>A: ${resObj.vitamins.A.mg}mg - RDA: ${resObj.vitamins.A.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B1: ${resObj.vitamins.B1.mg}mg - RDA: ${resObj.vitamins.B1.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B2: ${resObj.vitamins.B2.mg}mg - RDA: ${resObj.vitamins.B2.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B3: ${resObj.vitamins.B3.mg}mg - RDA: ${resObj.vitamins.B3.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B5: ${resObj.vitamins.B5.mg}mg - RDA: ${resObj.vitamins.B5.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B6: ${resObj.vitamins.B6.mg}mg - RDA: ${resObj.vitamins.B6.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B7: ${resObj.vitamins.B7.mg}mg - RDA: ${resObj.vitamins.B7.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B9: ${resObj.vitamins.B9.mg}mg - RDA: ${resObj.vitamins.B9.pct_rda}%`;
            vitaminsP.innerHTML += `<br>B12: ${resObj.vitamins.B12.mg}mg - RDA: ${resObj.vitamins.B12.pct_rda}%`;
            vitaminsP.innerHTML += `<br>C: ${resObj.vitamins.C.mg}mg - RDA: ${resObj.vitamins.C.pct_rda}%`;
            vitaminsP.innerHTML += `<br>D2: ${resObj.vitamins.D2.mg}mg - RDA: ${resObj.vitamins.D2.pct_rda}%`;
            vitaminsP.innerHTML += `<br>D3: ${resObj.vitamins.D3.mg}mg - RDA: ${resObj.vitamins.D3.pct_rda}%`;
            vitaminsP.innerHTML += `<br>E: ${resObj.vitamins.E.mg}mg - RDA: ${resObj.vitamins.E.pct_rda}%`;
        }
        if(resObj.minerals) {
            mineralsP.innerHTML = "<b>Minerals:</b>";
            mineralsP.innerHTML += `<br>Calcium: ${resObj.minerals.calcium.mg}mg - RDA: ${resObj.minerals.calcium.pct_rda}%`;
            mineralsP.innerHTML += `<br>Chromium: ${resObj.minerals.chromium.mg}mg - RDA: ${resObj.minerals.chromium.pct_rda}%`;
            mineralsP.innerHTML += `<br>Copper: ${resObj.minerals.copper.mg}mg - RDA: ${resObj.minerals.copper.pct_rda}%`;
            mineralsP.innerHTML += `<br>Iodine: ${resObj.minerals.iodine.mg}mg - RDA: ${resObj.minerals.iodine.pct_rda}%`;
            mineralsP.innerHTML += `<br>Iron: ${resObj.minerals.iron.mg}mg - RDA: ${resObj.minerals.iron.pct_rda}%`;
            mineralsP.innerHTML += `<br>Magnesium: ${resObj.minerals.magnesium.mg}mg - RDA: ${resObj.minerals.magnesium.pct_rda}%`;
            mineralsP.innerHTML += `<br>Manganese: ${resObj.minerals.manganese.mg}mg - RDA: ${resObj.minerals.manganese.pct_rda}%`;
            mineralsP.innerHTML += `<br>Phosphorous: ${resObj.minerals.phosphorous.mg}mg - RDA: ${resObj.minerals.phosphorous.pct_rda}%`;
            mineralsP.innerHTML += `<br>Iron: ${resObj.minerals.potassium.mg}mg - RDA: ${resObj.minerals.potassium.pct_rda}%`;
            mineralsP.innerHTML += `<br>Iron: ${resObj.minerals.selenium.mg}mg - RDA: ${resObj.minerals.selenium.pct_rda}%`;
            mineralsP.innerHTML += `<br>Sodium: ${resObj.minerals.sodium.mg}mg - RDA: ${resObj.minerals.sodium.pct_rda}%`;
            mineralsP.innerHTML += `<br>Sulfur: ${resObj.minerals.sulfur.mg}mg - RDA: ${resObj.minerals.sulfur.pct_rda}%`;
            mineralsP.innerHTML += `<br>Zinc: ${resObj.minerals.zinc.mg}mg - RDA: ${resObj.minerals.zinc.pct_rda}%`;
        }
    })
    .catch(error => console.log(error))
    }
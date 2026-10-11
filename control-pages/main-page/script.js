"use strict";

let main_file_handle;
let works_file_handle;

let main_file;
let works_file;
let folder;

async function get_folder()
{
    try{
        folder = await window.showDirectoryPicker();

        main_file_handle = await folder.getFileHandle("control.json");
        works_file_handle = await folder.getFileHandle("main-3-selected-works.json");

        const main_file_row = await main_file_handle.getFile();
        const main_file_text = await main_file_row.text();
        main_file = JSON.parse(main_file_text);

        const works_file_row = await works_file_handle.getFile();
        const works_file_text = await works_file_row.text();
        works_file = JSON.parse(works_file_text);

        document.getElementById("select-folder").style.outline = "none";

        load_data();
    }
    catch (error){
        if (error.name === "AbortError")
            return;

        alert("ERROR: Cannot find or load the .json files!");
        return;
    }
}

function load_data(){
    document.getElementById("cv-url").value = main_file["cv-url"];

    document.getElementById(`thumb0-filepath`).textContent = main_file["main-image"];
    document.getElementById("specification").value = main_file["specification"];
    document.getElementById("about-bio").value = main_file["about-bio"];
    document.getElementById("experiene-years").value = main_file["experiene-years"].replace("+", "");
    document.getElementById("projects-completed").value = main_file["projects-completed"].replace("+", "");
    document.getElementById("happy-clients").value = main_file["happy-clients"].replace("+", "");

    document.getElementById("selected-works-bio-red-part").value = main_file["selected-works-bio-red-part"];
    document.getElementById("selected-works-bio-white-part").value = main_file["selected-works-bio-white-part"];

    document.getElementById("tools-bio").value = main_file["tools-bio"];

    
    document.getElementById("behance-id").value = main_file["behance-id"];
    document.getElementById("behance-url").value = main_file["behance-url"];

    document.getElementById("instagram-id").value = main_file["instagram-id"];
    document.getElementById("instagram-url").value = main_file["instagram-url"];

    document.getElementById("whatsapp-id").value = main_file["whatsapp-id"];
    document.getElementById("whatsapp-url").value = main_file["whatsapp-url"];

    document.getElementById("linkedin-name").value = main_file["linkedin-name"];
    document.getElementById("linkedin-url").value = main_file["linkedin-url"];

    document.getElementById("facebook-name").value = main_file["facebook-name"];
    document.getElementById("facebook-url").value = main_file["facebook-url"];

    document.getElementById("email").value = main_file["email"];

    load_projects();
}

function load_projects()
{
    let counter = 1;

    works_file.forEach(work => {
        document.getElementById(`work${counter}-title`).value = work["title"];
        document.getElementById(`video${counter}-url`).value = work["video-url"];
        document.getElementById(`alt${counter}`).value = work["alt"];
        document.getElementById(`thumb${counter}-filepath`).textContent = (work["thump"]);
        if (work["is-short"] === "yes"){
            document.getElementById(`is-short${counter}`).checked = true;
        }
        else{
            document.getElementById(`is-short${counter}`).checked = false;
        }

        counter++;
    });
}

document.getElementById("select-folder").addEventListener("click", get_folder);


async function save_file(file, data)
{
    const writable = await file.createWritable();
    await writable.write(JSON.stringify(data, null, 4));
    await writable.close();

    alert("Saved.");
}

function save_input(eleId, jsonId, isNum = false)
{
    let element = document.getElementById(eleId);

    if (element.value === main_file[jsonId]) return;
    if (isNum && element.value === main_file[jsonId].replace("+", "")) return;

    if (isNum){
        main_file[jsonId] = element.value + "+";
    }
    else{
        main_file[jsonId] = element.value;
    }
}

async function save_header()
{
    save_input("cv-url", "cv-url");

    try{
        await save_file(main_file_handle, main_file);
    }
    catch{
        alert("ERROR: Cannot save the file!");
    }
}

let portrait;
async function save_about()
{
    if (portrait)
    {
        try{
            await copy_portrait()
        }
        catch {return;}
    }

    save_input("specification", "specification");
    save_input("about-bio", "about-bio");
    save_input("experiene-years", "experiene-years", true);
    save_input("projects-completed", "projects-completed", true);
    save_input("happy-clients", "happy-clients", true);

    try{
        await save_file(main_file_handle, main_file);
    }
    catch{
        alert("ERROR: Cannot save the file!");
    }
}

async function save_selected_works_text()
{
    save_input("selected-works-bio-red-part", "selected-works-bio-red-part");
    save_input("selected-works-bio-white-part", "selected-works-bio-white-part");

    try{
        await save_file(main_file_handle, main_file);
    }
    catch{
        alert("ERROR: Cannot save the file!");
    }
}

async function save_tools()
{
    save_input("tools-bio", "tools-bio");

    try{
        await save_file(main_file_handle, main_file);
    }
    catch{
        alert("ERROR: Cannot save the file!");
    }
}

async function save_contacts()
{
    save_input("behance-id", "behance-id");
    save_input("behance-url", "behance-url");

    save_input("instagram-id", "instagram-id");
    save_input("instagram-url", "instagram-url");

    save_input("whatsapp-id", "whatsapp-id");
    save_input("whatsapp-url", "whatsapp-url");

    save_input("linkedin-name", "linkedin-name");
    save_input("linkedin-url", "linkedin-url");

    save_input("facebook-name", "facebook-name");
    save_input("facebook-url", "facebook-url");

    save_input("email", "email");

    try{
        await save_file(main_file_handle, main_file);
    }
    catch{
        alert("ERROR: Cannot save the file!");
    }
}


let thumb1;
let thumb2;
let thumb3;

async function get_image_file()
{
    try{
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: "Images",
                    accept: {
                        "image/*": [
                            ".jpg",
                            ".jpeg",
                            ".png",
                            ".gif",
                            ".webp",
                            ".svg",
                            ".bmp",
                            ".avif"
                        ]
                    }
                }
            ]
        });

        return await fileHandle.getFile();
    }
    catch (error){
        if (error.name === "AbortError")
            return;
    }
}

async function get_thumb(num)
{
    const thumb = await get_image_file();

    if (!thumb) return;

    let thumb_span = document.getElementById(`thumb${num}-filepath`);

    thumb_span.innerHTML = "selected-project-folder/images/" + thumb.name +
     "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: blue\">Auto copy + auto replace on save.</span>";

    thumb_span.setAttribute("image-name", thumb.name);

    return thumb;
}

async function select_thumb(num) {

    const thumb = await get_thumb(num);

    if (!thumb) return;

    switch (num)
    {
        case 0:
            {
                portrait = thumb;
                break;
            }
        case 1:
            {
                thumb1 = thumb;
                break;
            }
        case 2:
            {
                thumb2 = thumb;
                break;
            }
        case 3:
            {
                thumb3 = thumb;
                break;
            }
    }
}

async function copy_images()
{
    try{
        const images_folder = await folder.getDirectoryHandle("images", {create: true});

        if (thumb1)
        {
            await copy_image(thumb1, images_folder);
        }

        if (thumb2)
        {
            await copy_image(thumb2, images_folder);
        }

        if (thumb3)
        {
            await copy_image(thumb3, images_folder);
        }
    }
    catch (error){
        if (error.name === "AbortError")
            return;

        alert("ERROR: When copying image files.");
        throw Error();
    }

    let counter = 1;

    works_file.forEach(work => {
        let thumb_span = document.getElementById(`thumb${counter}-filepath`);

        if (thumb_span.hasAttribute("image-name"))
        {
            work["thump"] = "images/" + thumb_span.getAttribute("image-name");
        }

        counter++;
    });
}

async function copy_image(file, imagesFolder)
{
    try{
        const newFile = await imagesFolder.getFileHandle(file.name, {
            create: true
        });

        const writable = await newFile.createWritable();

        await writable.write(file);

        await writable.close();
    }
    catch{
        alert(`ERROR: When copying ${file.name ?? undefined}.`);
        throw Error();
    }
}

async function save_selected_works(){

    try{
        await copy_images()
    }
    catch {return;}

    let counter = 1;
    works_file.forEach(work => {
        work["title"] = document.getElementById(`work${counter}-title`).value;
        work["video-url"] = document.getElementById(`video${counter}-url`).value;
        work["alt"] = document.getElementById(`alt${counter}`).value;
        if (document.getElementById(`is-short${counter}`).checked === true){
            work["is-short"] = "yes";
        }
        else{
            work["is-short"] = "no";
        }

        counter++;
    });

    try{
        await save_file(works_file_handle, works_file);
    }
    catch{
        alert("ERROR: Cannot save the file!");
        return;
    }
}

async function copy_portrait()
{
    try{
        const images_folder = await folder.getDirectoryHandle("images", {create: true});

        await copy_image(portrait, images_folder);
    }
    catch (error){
        if (error.name === "AbortError")
            return;

        alert("ERROR: When copying image files.");
        throw Error();
    }

    let thumb_span = document.getElementById(`thumb0-filepath`);

    if (thumb_span.hasAttribute("image-name"))
    {
        main_file["main-image"] = "images/" + thumb_span.getAttribute("image-name");
    }
}
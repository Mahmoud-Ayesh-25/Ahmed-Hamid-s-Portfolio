"use strict";

let file_handle;

let file;
let folder;

async function get_folder()
{
    try{
        folder = await window.showDirectoryPicker();

        const page_folder = await folder.getDirectoryHandle("all-works-page");
        file_handle = await page_folder.getFileHandle("works.json");

        const file_row = await file_handle.getFile();
        const file_text = await file_row.text();
        file = JSON.parse(file_text);

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

let works_counter;
let works_number;
function load_data()
{
    let container = document.getElementById("all-works-fs");
    container.replaceChildren();
    works_counter = 1;

    file.forEach(work => {
        container.insertAdjacentHTML("beforeend",` <div id="${works_counter}" class="work-div">
                <fieldset>
                    <legend>Work ${works_counter}</legend>

                    <label for="work${works_counter}-title">Title</label>
                    <input class="work-title" id="work${works_counter}-title" type="text">
                    <br>
                    <label for="description${works_counter}">Description</label>
                    <textarea class="description" id="description${works_counter}"></textarea>
                    <br>
                    <label for="category${works_counter}">Category</label>
                    <select class="category" id="category${works_counter}">
                        <option value="VIDEOEDITING">VIDEO EDITING</option>
                        <option value="MOTIONGRAPHICS">MOTION GRAPHICS</option>
                        <option value="TYPOGRAPHY">TYPOGRAPHY</option>
                        <option value="ILLUSTRATION">ILLUSTRATION</option>
                        <option value="BRANDIDENTITIES">BRAND IDENTITIES</option>
                    </select>
                    <br>
                    <label>Thumbnail</label>
                    <div>
                        <button class="get_image_button" onclick="get_thumb(this)">Select File</button>
                        <span class="thumb-filepath"></span>
                    </div>
                    <br>
                    <label for="video${works_counter}-url">Video URL</label>
                    <input class="video-url" id="video${works_counter}-url" type="text">
                    <br>
                    <label for="is-short${works_counter}">
                        <input class="is-short" id="is-short${works_counter}" type="checkbox">
                        Is Short
                    </label>
                </fieldset>
                <div class="all-works-buttons">
                    <button onclick="move_up(${works_counter})">MOVE UP</button>
                    <button onclick="delete_work(${works_counter})" class="delete-button">DELETE</button>
                </div>
            </div>`);

        if (works_counter !== file.length)
            container.insertAdjacentHTML("beforeend", "<br>");

        document.getElementById(`work${works_counter}-title`).value = work["title"];
        document.getElementById(`description${works_counter}`).value = work["description"];
        document.getElementById(`category${works_counter}`).value = work["catagory"].replace(/\s/g, "");
        document.getElementById(`${works_counter}`).querySelector(".thumb-filepath").textContent = work["thumbnail"];
        document.getElementById(`video${works_counter}-url`).value = work["video-url"];

        if (work["is-short"] === "yes")
        {
            document.getElementById(`is-short${works_counter}`).checked = true;
        }
        else{
            document.getElementById(`is-short${works_counter}`).checked = false;
        }

        works_counter++;
    });

    works_counter--;
    works_number = works_counter;
    document.getElementById("add-new-button").style.display = "block";
    document.getElementById("save-button").style.display = "block";
}

function delete_work(num)
{
    let current = document.getElementById(`${num}`);

    
    if (works_counter > 1)
    {
        if (num === works_counter){
            current.previousElementSibling.remove();
        }
        else{
            current.nextElementSibling.remove();
        }
    }
    
    current.remove();
    
    if (num !== works_counter)
    {
        currect_nums_down(num);
    }
        
    works_counter--;
}

function currect_nums_down(num)
{
    for(let i = num + 1; i <= works_counter; i++){
        let current = document.getElementById(`${i}`);
        current.id = `${i - 1}`;
        current.querySelectorAll("[onclick]").forEach(element => {
            element.setAttribute("onclick", element.getAttribute("onclick").replaceAll(`(${i})`, `(${i - 1})`));
        });
    }
}

function move_up(num)
{
    let current = document.getElementById(`${num}`);
    let previous = document.getElementById(`${num - 1}`);

    if (!previous){
        alert("ERROR: No space.");
        return;
    }

    current.previousElementSibling.remove();

    current.id = `${num - 1}`;
    previous.id = `${num}`;

    current.querySelectorAll("[onclick]").forEach(element => {
        element.setAttribute("onclick", element.getAttribute("onclick").replaceAll(`(${num})`, `(${num - 1})`));
    });

    previous.querySelectorAll("[onclick]").forEach(element => {
        element.setAttribute("onclick", element.getAttribute("onclick").replaceAll(`(${num - 1})`, `(${num})`));
    });

    current.parentNode.insertBefore(current, previous);

    previous.insertAdjacentHTML("beforebegin", "<br>");
}

function add_new_work()
{
    let container = document.getElementById("all-works-fs");

    works_counter++;
    works_number++;

    container.insertAdjacentHTML("beforeend",` <br><div id="${works_counter}" class="work-div">
                <fieldset>
                    <legend>Work ${works_number}</legend>

                    <label for="work${works_number}-title">Title</label>
                    <input class="work-title" id="work${works_number}-title" type="text">
                    <br>
                    <label for="description${works_number}">Description</label>
                    <textarea class="description" id="description${works_number}"></textarea>
                    <br>
                    <label for="category${works_number}">Category</label>
                    <select class="category" id="category${works_number}">
                        <option value="VIDEOEDITING">VIDEO EDITING</option>
                        <option value="MOTIONGRAPHICS">MOTION GRAPHICS</option>
                        <option value="TYPOGRAPHY">TYPOGRAPHY</option>
                        <option value="ILLUSTRATION">ILLUSTRATION</option>
                        <option value="BRANDIDENTITIES">BRAND IDENTITIES</option>
                    </select>
                    <br>
                    <label>Thumbnail</label>
                    <div>
                        <button class="get_image_button" onclick="get_thumb(this)">Select File</button>
                        <span class="thumb-filepath"></span>
                    </div>
                    <br>
                    <label for="video${works_number}-url">Video URL</label>
                    <input class="video-url" id="video${works_number}-url" type="text">
                    <br>
                    <label for="is-short${works_number}">
                        <input class="is-short" id="is-short${works_number}" type="checkbox">
                        Is Short
                    </label>
                </fieldset>
                <div class="all-works-buttons">
                    <button onclick="move_up(${works_counter})">MOVE UP</button>
                    <button onclick="delete_work(${works_counter})" class="delete-button">DELETE</button>
                </div>
            </div>`);
}



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

let thumbs = new Map();

async function get_thumb(button)
{
    const thumb = await get_image_file();

    if (!thumb) return;

    let work = button.closest(".work-div");
    let thumb_span = work.querySelector(".thumb-filepath");

    thumb_span.innerHTML = "selected-project-folder/all-works-page/images/" + thumb.name +
     "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color: blue\">Auto copy + auto replace on save.</span>";

    thumb_span.setAttribute("image-name", thumb.name);
    thumbs.set(button, thumb);
}

async function copy_images()
{
    try{
        const page_folder = await folder.getDirectoryHandle("all-works-page");
        const images_folder = await page_folder.getDirectoryHandle("images", {create: true});

        for (const work of document.querySelectorAll(".work-div")) {
            const thumb_span = work.querySelector("fieldset div .thumb-filepath");

            if (thumb_span.hasAttribute("image-name"))
            {
                
                    await copy_image(thumbs.get(work.querySelector(".get_image_button")), images_folder);
                
                
            }
        };
    }
    catch{
        alert("ERROR: When copying " + thumb_span.getAttribute("image-name"))
        throw Error();
    }
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

async function save_works(){

    try{
        await copy_images();
    }
    catch{
        return;
    }

    let works_to_save = [];

    document.querySelectorAll(".work-div").forEach(work => {
        let thumb = work.querySelector("fieldset .thumb-filepath");

        works_to_save.push({
            title: work.querySelector("fieldset .work-title").value,
            description: work.querySelector("fieldset .description").value,
            catagory: work.querySelector("fieldset .category").selectedOptions[0].textContent,
            thumbnail: ((thumb.hasAttribute("image-name")) ? "images/" + thumb.getAttribute("image-name") : thumb.textContent),
            "video-url": work.querySelector("fieldset .video-url").value,
            "is-short": ((work.querySelector("fieldset .is-short").checked) ? "yes" : "no" )
        });

    });

    let json_file = new File(
        [JSON.stringify(works_to_save, null, 4)],
        "works.json",
        { type: "application/json" }
    );

    try{
        await save_file(file_handle, json_file);
    }
    catch{
        alert("ERROR: Cannot save the file!");
        return;
    }
}

async function save_file(file, data)
{
    const writable = await file.createWritable();
    await writable.write(data);
    await writable.close();

    alert("Saved.");
}
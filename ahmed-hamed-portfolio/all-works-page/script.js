
let works;

let works_elements;

let is_fetch_done = false;

function add_works_to_html()
{
    works.forEach(work => {
        document.getElementById("works").insertAdjacentHTML("beforeend", `<article data-is-short="${work["is-short"]}" data-video-url="${work["video-url"]}">
                    <figure>
                        <img src="${work["thumbnail"]}" alt="Work Thumbnail">
                    </figure>
                    <div>
                        <p class="catagory">${work["catagory"]}</p>
                        <p class="title">${work["title"]}</p>
                        <p class="description">${work["description"]}</p>
                    </div>
                    <svg aria-label="Play video icon"><use href="../icons.svg#play"></use></svg>
                </article>`);
    });
};

async function load_works(){
    let response = await fetch("works.json");
    works = await response.json();
    add_works_to_html();
    works_elements = document.querySelectorAll("#works article");
    document.querySelector("#works").addEventListener("click", open_video);
    is_fetch_done = true;
};

load_works();


let dialog = document.querySelector("dialog");

function open_video(event)
{
    let clicked_btn = event.target.closest("article");

    let video_player = document.getElementById("video-player");
    let close_btn = document.getElementById("close-dialog");

    if (!clicked_btn) return;

    video_player.setAttribute("src", clicked_btn.getAttribute("data-video-url"));
    
    if(clicked_btn.getAttribute("data-is-short") === "yes"){
        video_player.classList.add("short");
        close_btn.classList.add("short");
    }
    else{
        video_player.classList.remove("short");
        close_btn.classList.remove("short");
    }

    dialog.showModal();

    function close_dialog(){
        dialog.close(); 
        video_player.setAttribute("src", "");
        close_btn.removeEventListener("click", close_dialog);
        dialog.removeEventListener("click", close_dialog_from_background);
    }

    close_btn.addEventListener("click", close_dialog);

    function close_dialog_from_background(event){
        if (event.target === document.querySelector("dialog div")){
            dialog.close();
            video_player.setAttribute("src", "");
            dialog.removeEventListener("click", close_dialog_from_background);
            close_btn.removeEventListener("click", close_dialog);
        }
    }

    dialog.addEventListener("click", close_dialog_from_background);
}



function change_catagory(catagory)
{
    if (is_fetch_done)
    {
        if (catagory === "ALL"){
            works_elements.forEach(element => {
                element.style.display = "block";
            });
            return;
        }

        works_elements.forEach(element => {

            let element_catagory = element.querySelector(".catagory");

            if (element_catagory.textContent === catagory){
                element.style.display = "block";
            }
            else{
                element.style.display = "none";
            }
        });
    }
}


let catagory_list = document.querySelector("ul");

catagory_list.addEventListener("click", (event) => {
    let clicked_btn = event.target.closest(".catagory-option");

    if (!clicked_btn) return;

    let selected_btn = catagory_list.querySelector(".catagory-option.selected");

    selected_btn.classList.remove("selected");

    clicked_btn.classList.add("selected");

    change_catagory(clicked_btn.textContent);
});

window.addEventListener("scroll", function () { 
    if (window.scrollY > 800) { 
        document.getElementById("back-to-top").classList.add("on");
     }
     else{
        document.getElementById("back-to-top").classList.remove("on");
     }
 });

 document.getElementById("back-to-home").addEventListener("click", () => {
    window.location.replace("../index.html");
 })
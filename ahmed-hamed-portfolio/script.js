

async function load_data()
{
    let response = await fetch("control.json");
    let data = await response.json();

    document.getElementById("specification").textContent = data["specification"];
    document.getElementById("about-bio").textContent = data["about-bio"];
    document.getElementById("experiene-years").textContent = data["experiene-years"];
    document.getElementById("projects-completed").textContent = data["projects-completed"];
    document.getElementById("happy-clients").textContent = data["happy-clients"];
    document.getElementById("red-part").textContent = data["selected-works-bio-red-part"];
    document.getElementById("white-part").textContent = data["selected-works-bio-white-part"];
    document.getElementById("tools-bio").textContent = data["tools-bio"];
    document.querySelectorAll(".cv-anchor").forEach(anchor => {
        anchor.setAttribute("href", data["cv-url"]);
    })
    document.getElementById("behance-id").textContent = data["behance-id"];
    document.getElementById("instagram-id").textContent = data["instagram-id"];
    document.getElementById("whatsapp-id").textContent = data["whatsapp-id"];
    document.getElementById("linkedin-name").textContent = data["linkedin-name"];
    document.getElementById("facebook-name").textContent = data["facebook-name"];
    document.getElementById("behance-url").setAttribute("href", data["behance-url"]);
    document.getElementById("instagram-url").setAttribute("href", data["instagram-url"]);
    document.getElementById("whatsapp-url").setAttribute("href", data["whatsapp-url"]);
    document.getElementById("linkedin-url").setAttribute("href", data["linkedin-url"]);
    document.getElementById("facebook-url").setAttribute("href", data["facebook-url"]);
    document.getElementById("email").setAttribute("href", "mailto:" + data["email"]);
    document.getElementById("main-image").setAttribute("src", data["main-image"]);
}

load_data();

window.addEventListener("scroll", function check_cards () {
    const rect = document.getElementById("selected-works-cards").getBoundingClientRect();

    if (rect.top <= window.innerHeight * 0.6){
        start_animation();
        window.removeEventListener("scroll", check_cards);
    }
})

function start_animation () {
    document.getElementById("card1").classList.add("open");
    document.getElementById("card2").classList.add("open");
    document.getElementById("card3").classList.add("open");
}

let main_works;

async function load_3_selected_works()
{
    let response = await fetch("main-3-selected-works.json");
    main_works = await response.json();

    let counter = 0;

    main_works.forEach(card => {
        counter++;
        let card_element = document.getElementById(`card${counter}`);
        card_element.querySelector("img").setAttribute("src", card["thump"]);
        card_element.querySelector("img").setAttribute("alt", card["alt"]);
        card_element.setAttribute("title", card["title"]);
    });
}

load_3_selected_works();

let video_player_dialog = document.getElementById("video-player-dialog");

document.querySelector("#selected-works-cards").addEventListener("click", (event) => {
    let selected_card = event.target.closest(".card");

    main_works.forEach(card => {


        if (selected_card.getAttribute("title") === card["title"]) {
            
            let video_player = document.getElementById("video-player");
            let close_btn = document.getElementById("close-dialog");

            video_player.setAttribute("src", card["video-url"]);
            
            if(card["is-short"] == "yes"){
                video_player.classList.add("short");
                close_btn.classList.add("short");
            }
            else{
                video_player.classList.remove("short");
                close_btn.classList.remove("short");
            }

            video_player_dialog.showModal();


            function close_dialog(){
                video_player_dialog.close(); 
                video_player.setAttribute("src", "");
                close_btn.removeEventListener("click", close_dialog);
                video_player_dialog.removeEventListener("click", close_dialog_from_background);
            }

            close_btn.addEventListener("click", close_dialog);

            function close_dialog_from_background(){
                video_player_dialog.close();
                video_player.setAttribute("src", "");
                video_player_dialog.removeEventListener("click", close_dialog_from_background);
                close_btn.removeEventListener("click", close_dialog);
            }

            video_player_dialog.addEventListener("click", close_dialog_from_background);

            return;
        }

    });
})

let options_dialog = document.getElementById("options-dialog");
let dialog_options_container = document.getElementById("dialog-options-container");

document.getElementById("header-options-button").addEventListener("click", () => {
    options_dialog.showModal();

    function close_dialog_from_background(){

        dialog_options_container.classList.remove("open");
        dialog_options_container.classList.add("close");

        setTimeout(() => {
            options_dialog.removeEventListener("click", close_dialog_from_background);
            options_dialog.close();
        }, 300)
    }

    options_dialog.addEventListener("click", close_dialog_from_background);
    dialog_options_container.classList.remove("close");
    dialog_options_container.classList.add("open");
})
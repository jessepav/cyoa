import TOML from '../lib/smol-toml.min.mjs';

const rootEl = document.documentElement;

const passageNameEl = document.getElementById('passage-name');
const passageImageEl = document.getElementById('passage-image');
const passageTextEl = document.getElementById('passage-text');
const choiceListEl = document.getElementById('choice-list');

let imageBaseURL;

let story;
let choicePassageIds = [];

const HTML_SPECIALCHARS_RE = /[<>&'"\n]/g;

function escapeHTML(s, nltobr = false) {
    return s.replaceAll(HTML_SPECIALCHARS_RE, (c) => {
        switch (c) {
          case '<': return "&lt;";
          case '>': return "&gt;";
          case '&': return "&amp;";
          case "'": return "&apos;";
          case '"': return "&quot;";
          case '\n': return nltobr ? '<br>' : '\n';
        }
    });
}

function showError(msg) {
    passageTextEl.innerText = msg;
}

function showPassage(id) {
    const passage = story[id];
    if (!passage) {
        passageNameEl.textContent = `Passage "${id}" missing`;
        return;
    }
    passageNameEl.textContent = passage.name;
    passageTextEl.innerHTML = escapeHTML(passage.text).replaceAll("\n\n", "<br><br>");
    passageImageEl.replaceChildren();
    if (passage.img) {
        const img = document.createElement('img');
        img.src = new URL(passage.img.src, imageBaseURL).href;
        if (passage.img.width)
            img.style.width = passage.img.width;

        if (passage.img.float)
            passageImageEl.className = `float-${passage.img.float}`;
        else if (passage.img.align)
            passageImageEl.className = `align-${passage.img.align}`;
        else
            passageImageEl.className = "";

        passageImageEl.appendChild(img);
    }

    choicePassageIds.length = 0;
    choiceListEl.replaceChildren();
    let choiceNum = 0;
    for (const choice of passage.choices) {
        const li = document.createElement('li');
        li.textContent = choice.text;
        li.dataset.choiceNum = choiceNum++;
        choiceListEl.appendChild(li);
        choicePassageIds.push(choice.destId);
    }
}

async function main() {
    const searchParams = new URLSearchParams(location.search);
    const tomlUrl = searchParams.get('story');
    if (!tomlUrl) {
        showError('No "story" search parameter given');
        return;
    }
    try {
        const tomlText = await fetch(tomlUrl, { cache: 'no-cache' }).then(res => res.text());
        story = TOML.parse(tomlText);
    } catch(err) {
        showError(`Error reading TOML from ${tomlUrl}:\n\n${err.message}`);
        return;
    }

    const config = story.config ?? {};
    imageBaseURL = config.imageBaseURL ?? location.href;
    if (config.title)
        document.title = config.title;
    if (config.backgroundColor)
        rootEl.style.setProperty("--background-color", config.backgroundColor);
    if (config.textColor)
        rootEl.style.setProperty("--text-color", config.textColor);
    if (config.fontSize)
        rootEl.style.setProperty("--font-size", config.fontSize);
    if (config.imageRendering)
        rootEl.style.setProperty("--image-rendering", config.imageRendering);
    if  (config.fontFamily) {
        const link = document.createElement('link');
        link.rel = "stylesheet";
        const family = config.fontFamily.replaceAll(' ', '+');
        link.href = `https://fonts.googleapis.com/css2?family=${family}:ital`;
        document.head.appendChild(link);
        // await document.fonts.ready;
        rootEl.style.setProperty('--font-family', config.fontFamily);
    }

    choiceListEl.addEventListener('click', ev => {
        const choiceLi = ev.target.closest('[data-choice-num]');
        if (choiceLi) {
            const destId = choicePassageIds[Number.parseInt(choiceLi.dataset.choiceNum)];
            showPassage(destId);
        }
    });
    showPassage(config.startId);
}

main();

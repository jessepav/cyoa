import TOML from '../lib/smol-toml.min.mjs';

const rootEl = document.documentElement;

const mainHolderEl = document.getElementById('main-holder');
const passageNameEl = document.getElementById('passage-name');
const passageImageEl = document.getElementById('passage-image');
const passageTextEl = document.getElementById('passage-text');
const choiceListEl = document.getElementById('choice-list');

let imageBaseURL;

let story;
let choicePassageIds = [];
let currentPassageId;

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

const ALLOWED_HTML_RE = /&lt;(\/?[iubs])&gt;/g;

function showPassage(id) {
    const passage = story[id];
    if (!passage) {
        passageNameEl.textContent = `Passage "${id}" missing`;
        return;
    }
    passageNameEl.textContent = passage.name;
    passageTextEl.innerHTML = escapeHTML(passage.text)
        .replaceAll("\n\n", "<br><br>")
        .replaceAll(ALLOWED_HTML_RE, (match, p1) => '<' + p1 + '>');
    passageImageEl.replaceChildren();
    passageImageEl.className = "";
    if (passage.img) {
        const img = document.createElement('img');
        img.src = new URL(passage.img.src, imageBaseURL).href;
        if (passage.img.width)
            img.style.width = passage.img.width;

        if (passage.img.float)
            passageImageEl.className = `float-${passage.img.float}`;
        else if (passage.img.align)
            passageImageEl.className = `align-${passage.img.align}`;

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
    mainHolderEl.style.opacity = '1';
    location.hash = id;
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
    if (config.fontFamily) {
        if (config.fontURL) {
            const link = document.createElement('link');
            link.rel = "stylesheet";
            link.href = config.fontURL;
            document.head.appendChild(link);
            // await document.fonts.ready;
        }
        rootEl.style.setProperty('--font-family', `'${config.fontFamily}'`);
    }
    if (config.useBold) {
        passageNameEl.style.fontWeight = 'bold';
        choiceListEl.style.fontWeight = 'bold';
    }

    choiceListEl.addEventListener('click', ev => {
        const choiceLi = ev.target.closest('[data-choice-num]');
        if (choiceLi) {
            currentPassageId = choicePassageIds[Number.parseInt(choiceLi.dataset.choiceNum)];
            mainHolderEl.style.opacity = '0';
        }
    });
    mainHolderEl.addEventListener('transitionend', () => {
        if (currentPassageId && mainHolderEl.style.opacity == '0')
            showPassage(currentPassageId);
    });
    if (location.hash)
        currentPassageId = location.hash.slice(1);
    else
        currentPassageId = config.startId;
    mainHolderEl.style.opacity = '0';  // this will trigger the transitionend listener
}

main();

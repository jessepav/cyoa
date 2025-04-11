import TOML from '../lib/smol-toml.min.mjs';
import { Howl } from '../lib/howler.min.mjs';

const rootEl = document.documentElement;

const mainHolderEl = document.getElementById('main-holder');
const passageNameEl = document.getElementById('passage-name');
const passageImageEl = document.getElementById('passage-image');
const passageTextEl = document.getElementById('passage-text');
const choiceListEl = document.getElementById('choice-list');

let storyURL;

let story;
let choicePassageIds = [];
let currentPassageId;
let currentPassageHowl;

const blobUrlMap = Object.create(null);  // for filesystem mode

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

const ALLOWED_HTML_RE = /&lt;(\/?(?:[iubs]|br))&gt;/g;
const SPLIT_PAR_RE = /\n(?:[ \t]*\n)+/;
const PASSAGE_LINK_RE = /\[\[(\w+)\|(.*?)\]\]/g;

function showPassage(id) {
    const passage = story[id];
    if (!passage) {
        passageNameEl.textContent = `Passage "${id}" missing`;
        passageTextEl.replaceChildren();
        passageImageEl.replaceChildren();
        currentPassageHowl?.unload();
        choiceListEl.replaceChildren();
        return;
    }
    passageNameEl.textContent = passage.name;
    const pars = passage.text.trim().split(SPLIT_PAR_RE).map(parText => {
        parText = parText.trim();
        let textAlign = "left";
        if (parText.startsWith("==") && parText.endsWith("==")) {
            parText = parText.slice(2, -2);
            textAlign = "center";
        } else if (parText.endsWith("==")) {
            parText = parText.slice(0, -2);
            textAlign = "right";
        }
        const p = document.createElement('p');
        p.style.textAlign = textAlign;
        p.innerHTML = escapeHTML(parText)
            .replaceAll(ALLOWED_HTML_RE, (match, p1) => '<' + p1 + '>')
            .replaceAll(PASSAGE_LINK_RE, (match, passageId, text) =>
                `<span class="passage-link" data-passage-id="${passageId}">${text}</span>`
            );
        return p;
    });
    passageTextEl.replaceChildren(...pars);
    passageImageEl.replaceChildren();
    passageImageEl.className = "";
    if (passage.img) {
        const img = document.createElement('img');
        img.src = blobUrlMap[passage.img.src] ?? new URL(passage.img.src, storyURL).href;
        if (passage.img.width)
            img.style.width = passage.img.width;
        if (passage.img.height)
            img.style.height = passage.img.height;

        if (passage.img.float)
            passageImageEl.className = `float-${passage.img.float}`;
        else if (passage.img.align)
            passageImageEl.className = `align-${passage.img.align}`;
        else
            passageImageEl.className = "align-center";

        passageImageEl.appendChild(img);
    }
    if (currentPassageHowl)
        currentPassageHowl.unload();
    if (passage.music) {
        const music = passage.music;
        currentPassageHowl = new Howl({
            src: blobUrlMap[music.src] ?? new URL(music.src, storyURL).href,
            format: music.src.slice(music.src.lastIndexOf('.') + 1).toLowerCase(),
            volume: music.volume ?? 1.0,
            html5: music.stream ?? false,
            loop: music.loop ?? false,
            preload: true,
            autoplay: true,
        });
    }

    choicePassageIds.length = 0;
    choiceListEl.replaceChildren();
    let choiceNum = 0;
    if (passage.choices) {
        for (const choice of passage.choices) {
            const li = document.createElement('li');
            li.textContent = choice.text;
            li.dataset.choiceNum = choiceNum++;
            choiceListEl.appendChild(li);
            choicePassageIds.push(choice.destId);
        }
    }
    location.hash = id;
}

async function main() {
    const searchParams = new URLSearchParams(location.search);
    storyURL = searchParams.get('story');
    if (!storyURL) {
        const { promise, resolve, reject } = Promise.withResolvers();

        const div = document.createElement('div');
        div.style.textAlign = 'center';
        const button = document.createElement('button');
        button.className = "choose-dir-button";
        button.textContent = 'Choose Story Directory';
        div.append(button);
        passageTextEl.append(div);

        button.addEventListener('click', async () => {
            let dirHandle;
            try {
                dirHandle = await window.showDirectoryPicker({ id: 'cyoa-story-dir', mode: 'read' });
            } catch (err) {
                return;
            }
            const fileNames = await Array.fromAsync(dirHandle.keys());
            const storyFile = fileNames.find(name => name.toLowerCase().endsWith(".toml"));
            if (!storyFile) {
                window.alert(`I couldn't find a story file in "${dirHandle.name}"`);
                return;
            }
            const storyFileHandle = await dirHandle.getFileHandle(storyFile);
            const storyText = await storyFileHandle.getFile().then(file => file.text());
            try {
                story = TOML.parse(storyText);
            } catch(err) {
                window.alert(`Error parsing story:\n\n${err.message}`);
                return;
            }
            for (const [name, passage] of Object.entries(story)) {
                if (name == 'config')
                    continue;
                const urls = [];
                if (passage.img?.src)
                    urls.push(passage.img.src);
                if (passage.music?.src)
                    urls.push(passage.music.src);
                for (const url of urls) {
                    try {
                        const fileHandle = await dirHandle.getFileHandle(url);
                        const objectURL = URL.createObjectURL(await fileHandle.getFile());
                        blobUrlMap[url] = objectURL;
                    } catch (err) {
                        window.alert(`I couldn't find "${url}" in your story directory`);
                        return;
                    }
                }
            }
            console.log(`Loaded ${storyFile} + ${Object.keys(blobUrlMap).length} resources`);
            resolve();
        });
        await promise;
        div.remove();
    } else {
        storyURL = new URL(storyURL, location.href).href;
        const storyText = await fetch(storyURL, { cache: 'no-cache' }).then(res => res.ok ? res.text() : undefined);
        if (!storyText) {
            window.alert("Error fetching story from " + storyURL);
            return;
        }
        try {
            story = TOML.parse(storyText);
        } catch(err) {
            window.alert(`Error parsing story:\n\n${err.message}`);
            return;
        }
    }

    const config = story.config ?? {};
    if (config.title)
        document.title = config.title;
    if (config.backgroundColor)
        rootEl.style.setProperty("--background-color", config.backgroundColor);
    if (config.textColor)
        rootEl.style.setProperty("--text-color", config.textColor);
    if (config.maxWidth)
        rootEl.style.setProperty("--max-width", config.maxWidth);
    if (config.fontSize)
        rootEl.style.setProperty("--font-size", config.fontSize);
    if (config.imageRendering)
        rootEl.style.setProperty("--image-rendering", config.imageRendering);
    if (config.fontFamily) {
        if (config.fontLinkHref) {
            const link = document.createElement('link');
            link.rel = "stylesheet";
            link.href = config.fontLinkHref;
            document.head.appendChild(link);
        } else if (config.fontCSS) {
            const style = document.createElement('style');
            style.textContent = config.fontCSS;
            document.head.appendChild(style);
        }
        rootEl.style.setProperty('--font-family', `'${config.fontFamily}'`);
        await document.fonts.ready;
    }
    if (config.useBold) {
        passageNameEl.style.fontWeight = 'bold';
        choiceListEl.style.fontWeight = 'bold';
    }

    choiceListEl.addEventListener('click', ev => {
        const choiceLi = ev.target.closest('[data-choice-num]');
        if (choiceLi) {
            currentPassageId = choicePassageIds[Number.parseInt(choiceLi.dataset.choiceNum)];
            mainHolderEl.style.opacity = '0'; // will trigger the transitionend listener below
        }
    });
    mainHolderEl.addEventListener('transitionend', () => {
        if (currentPassageId && mainHolderEl.style.opacity == '0') {
            showPassage(currentPassageId);
            mainHolderEl.style.opacity = '1';
        }
    });
    passageTextEl.addEventListener('click', ev => {
        const linkEl = ev.target.closest('[data-passage-id]');
        if (linkEl) {
            currentPassageId = linkEl.dataset.passageId;
            mainHolderEl.style.opacity = '0';
        }
    });
    if (location.hash)
        currentPassageId = location.hash.slice(1);
    else
        currentPassageId = config.startId;
    mainHolderEl.style.opacity = '0';  // this will trigger the transitionend listener
}

main();

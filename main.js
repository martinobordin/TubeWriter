let isInitialized = false;

const downloadIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="16" height="16" fill="currentColor"><!--! Font Awesome Free --><path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39L344 184c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 134.1-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"/></svg>';
const copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" height="16" fill="currentColor"><!--! Font Awesome Free --><path d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>';

const createButton = (title, className, icon, onClick) => {
  const button = document.createElement("button");
  button.title = title;
  button.classList.add("btn", className);
  
  const span = document.createElement("span");
  span.innerHTML = icon;
  button.appendChild(span);

  const text = document.createTextNode(` ${title}`);
  button.appendChild(text);

  button.onclick = onClick;
  return button;
};

const collectTranscript = (contentSection, transcriptElementsSelector) => {
  const transcriptElements = contentSection.querySelectorAll(transcriptElementsSelector);
  return transcriptElements.length > 0 
    ? Array.from(transcriptElements).map(el => el.innerText).join("\n\n") 
    : null;
};

const initialize = () => {
  if (isInitialized) return;

  const transcriptSectionSelector = 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]';
  const headerSectionSelector = "#header #header";
  const contentSectionSelector = "#content #content";
  const transcriptElementsSelector = "ytd-transcript-segment-renderer yt-formatted-string";
  const menuSelector = "#menu";

  const transcriptSection = document.querySelector(transcriptSectionSelector);
  if (!transcriptSection) return;

  const headerSection = transcriptSection.querySelector(headerSectionSelector);
  const contentSection = transcriptSection.querySelector(contentSectionSelector);
  if (!headerSection || !contentSection) return;

  const btnDownload = createButton("Download transcript", "btn-download", downloadIcon, () => {
    const transcript = collectTranscript(contentSection, transcriptElementsSelector);
    if (!transcript) return;

    const fileName = `${new Date().toISOString()}-tubewriter.txt`;
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`);
    element.setAttribute("download", fileName);

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });

  const btnCopy = createButton("Copy transcript", "btn-copy", copyIcon, () => {
    const transcript = collectTranscript(contentSection, transcriptElementsSelector);
    if (!transcript) return;

    navigator.clipboard.writeText(transcript)
      .then(() => alert("Transcript copied to clipboard!"))
      .catch(err => console.error("Could not copy transcript:", err));
  });

  const menu = headerSection.querySelector(menuSelector);
  headerSection.insertBefore(btnDownload, menu);
  headerSection.insertBefore(btnCopy, menu);
  
  isInitialized = true;
};

chrome.runtime.onMessage.addListener(() => {
  initialize();
});

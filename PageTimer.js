let startTime = Date.now(),
    totalTime = 0,
    lastTime = startTime,
    isPageVisible = !0;
const scriptTag = document.querySelector('script[KehemIT]'),
    apiUrl = scriptTag.getAttribute("data-api-url"),
    params = {};
scriptTag.getAttributeNames().forEach(e => {
    if (e.startsWith("data-") && "data-api-url" !== e) {
        const t = e.replace("data-", ""),
            a = scriptTag.getAttribute(e);
        params[t] = a
    }
});

function updateTime() {
    isPageVisible && (totalTime += Date.now() - lastTime), lastTime = Date.now()
}
document.addEventListener("visibilitychange", function() {
    document.hidden ? (isPageVisible = !1, updateTime()) : (isPageVisible = !0, lastTime = Date.now())
}), setInterval(updateTime, 1e3), window.onbeforeunload = function() {
    updateTime();
    const e = {
        activeTime: Math.floor(totalTime / 1e3),
        ...params
    };
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(e)
    }).catch(e => {
        console.error("Error sending POST request:", e)
    })
};

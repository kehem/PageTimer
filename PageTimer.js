let startTime = Date.now();
let totalTime = 0;
let lastTime = startTime;
let isPageVisible = true;

// Access the script tag that is loading this JavaScript file
const scriptTag = document.querySelector('script[src="counter.js"]');

// Get the API URL from the data-api-url attribute
const apiUrl = scriptTag.getAttribute('data-api-url');

// Create an empty object to store the dynamic parameters
const params = {};

// Loop through all attributes of the script tag
const attributes = scriptTag.getAttributeNames();

// Filter and extract all `data-*` attributes
attributes.forEach(attr => {
    if (attr.startsWith('data-') && attr !== 'data-api-url') {
        // Extract the key and value of each data attribute
        const paramName = attr.replace('data-', '');  // Remove the 'data-' prefix
        const paramValue = scriptTag.getAttribute(attr);
        params[paramName] = paramValue;
    }
});

function updateTime() {
    if (isPageVisible) {
        totalTime += (Date.now() - lastTime);
    }
    lastTime = Date.now();
}

// Listen for page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isPageVisible = false;
        updateTime();
    } else {
        isPageVisible = true;
        lastTime = Date.now();
    }
});

// Update time every second
setInterval(updateTime, 1000);

// Log the time and send a POST request before the user leaves the page
window.onbeforeunload = function() {
    updateTime();

    // Log total active time
    console.log("Total active time (in seconds):", Math.floor(totalTime / 1000));
    const postData = {
        activeTime: Math.floor(totalTime / 1000),
        ...params  // Spread the dynamic parameters into the postData object
    };

    // POST request
    fetch(apiUrl, {  // Use the API URL from the script tag's data-api-url attribute
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).catch(error => {
        console.error('Error sending POST request:', error);
    });
};

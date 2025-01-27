# Page Tracking Script

This JavaScript script tracks the total time a user spends on a page and sends the data via a POST request when the user leaves the page. It allows you to dynamically pass unlimited parameters via HTML `data-*` attributes, which will be included in the POST request.

## Features
- Tracks the total active time the user spends on a page.
- Sends a POST request with tracking data when the user leaves the page.
- Dynamically handles any number of `data-*` parameters passed through the `<script>` tag.
- Logs the active time in seconds to the console.

## Usage

### 1. Include the Script in Your HTML

You can include the `counter.js` script in your HTML file. In the `<script>` tag, pass the required API URL and any number of custom parameters using `data-*` attributes.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Tracking</title>
</head>
<body>
    <!-- Your page content here -->

    <!-- Include the script and pass unlimited data parameters -->
    <script src="counter.js" 
            data-api-url="https://your-api-endpoint.com/track" 
            data-param1="value1" 
            data-param2="value2" 
            data-param3="value3" 
            data-customParam="example"></script>
</body>
</html>
```
### 2. JavaScript Configuration

In your counter.js file, you don’t need to hard-code the parameters. The script dynamically retrieves all the data-* attributes from the <script> tag and sends them along with the tracking data.
```
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

// Send a POST request before the user leaves the page
window.onbeforeunload = function() {
    updateTime();

    const url = window.location.href;
    const postData = {
        url: url, 
        activeTime: Math.floor(totalTime / 1000),
        ...params  // Spread dynamic parameters into the postData object
    };

    // POST request
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).catch(error => {
        console.error('Error sending POST request:', error);
    });
};
```
 ### 3. Data Parameters

You can pass unlimited data-* attributes in the <script> tag. The script will automatically detect them and include them in the POST request.

Example:
```
<script src="counter.js" 
        data-api-url="https://your-api-endpoint.com/track" 
        data-userId="12345" 
        data-pageType="article" 
        data-category="tech"></script>

The POST request payload will look like:

{
    "url": "https://yourwebsite.com/article",
    "activeTime": 120,
    "userId": "12345",
    "pageType": "article",
    "category": "tech"
}
```
 ### 4. POST Request Structure

When the user leaves the page, the following data will be sent to the specified API endpoint:

    url: The current URL of the page.
    activeTime: The total active time spent on the page in seconds.
    Additional dynamic parameters: All the data-* attributes passed via the <script> tag.

Example POST request:
```
{
    "url": "https://yourwebsite.com/somepage",
    "activeTime": 120,
    "userId": "12345",
    "pageType": "article"
}
```
Dependencies

    None! This script does not rely on any external libraries or dependencies.

Contributing

If you would like to contribute, feel free to fork the repository, create a new branch, and submit a pull request with your changes.
License

This project is licensed under the MIT License - see the LICENSE file for details.


### Key Notes:
- The file is formatted with proper syntax highlighting for code blocks.
- It provides clear instructions on including the script in your HTML, configuring it, and passing dynamic parameters.
- It also includes details about the POST request structure and the dependencies (none, in this case).

You should now be able to use this in your GitHub project!

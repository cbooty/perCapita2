

function getData(){  //check the stoage.local to see if a result has already been returned for this URL and if so, displays it.  If not, it sends the request to OpenAI to analyze

    //first check to see if we already have a response cached for this URL
    try {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            chrome.tabs.sendMessage(tabs[0].id, {action: "getURL"}, function(response) {
            

                var activeTabURL = response.urlForActiveTab;
                
                console.log("PU: URL for active tab is: "+ activeTabURL);
                document.getElementById("resultsGoHere").innerHTML = activeTabURL;
                activeTabURL = String(activeTabURL);
                
                chrome.storage.local.get([activeTabURL], function(data) {
                    if (typeof data[activeTabURL] === 'undefined') {
                    // if already set it then nothing to do 
                    document.getElementById("resultsGoHere").innerHTML = "Result 1: " + activeTabURL;
                    document.getElementById("resultsGoHere").innerHTML = document.getElementById("resultsGoHere").innerHTML + "<br>Cached HTML: " + data[activeTabURL];

                    
                    console.log("PU: No Cache found for this URL; sending to server for analysis: "+ activeTabURL);
                    chrome.tabs.sendMessage(tabs[0].id, {action: "analyzeStory"}, function(response) {} );
                    console.log("PU: Ok after analysis");

                    } else {
                    // if not set then set it 
                    console.log("PU: activeTabURL is : "+ activeTabURL);
                    document.getElementById("resultsGoHere").innerHTML = data[activeTabURL];
                    }
                });

            });
        });
    } catch (error) {
        console.error('### popup.js > getData > Error #3');

    }

}

console.log("PU: popup.js loaded from popup");
console.log("PU: ok after add listener for click event");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "popup_html_updated") {
            //  To do something
            console.log("PU: Received message that popup_html_updated");
            console.log("PU: " + request.data.subject);
            console.log("PU: " + request.data.content);

            document.getElementById("resultsGoHere").innerHTML = request.data.content;

        }
    }
);

try{
    getData();  
} catch(error){
    console.log("### popup.js > getData() > Failed");
}






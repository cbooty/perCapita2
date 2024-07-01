//Part of default behaviour for Google Chrome Plugins.  Script runs in the background persistanly.


//https://www.youtube.com/watch?v=3Yc7u2Bhg9w
//https://www.youtube.com/watch?v=0n809nd4Zu4


//USES 'EXTENSION MESSAGING SYSTEM'

chrome.tabs.onActivated.addListener(function(activeInfo) {  //Add listener to handle when different tabs are activated on changes the 
                                                            //icon color to show if anaylsis has already been done on this page
    var tabID = activeInfo.tabID;
    var windowID = activeInfo.windowID;
    
    console.log("BG: Clicked Tab");
    console.log(activeInfo.tabId);

    chrome.tabs.get(activeInfo.tabId, function(tab){
        console.log('BG: '+tab.url);
        console.log('BG: Saving URL Info');

      

            var activeTabURL = tab.url;
            activeTabURL = String(activeTabURL);
            console.log("BG: URL for active tab is: "+ activeTabURL);

            chrome.storage.local.get([activeTabURL], function(data) {  //get the URL for the current page and check if we have a cache of already
                                                                        //having analyzed this page
                if (typeof data[activeTabURL] === 'undefined') {
                  //No cache, so turn grey
                  chrome.action.setIcon({
                    path :"/icons/icon-bw-16.png"
                  });

                } else {
                  //Has cache, so turn colored
                  chrome.action.setIcon({
                    path : "/icons/icon16.png"
                  });
                }
              });

            chrome.storage.local.set({ activeTabID: activeInfo.tabId, activeTabURL: "www.google.ca"  }, function() {
            chrome.storage.local.get(["activeTabID"], function(data) {
            console.log('BG: Value currently is ' + data.activeTabID);
            
          });
  });

     });


});

console.log("background.js loaded, before listener")

chrome.runtime.onMessage.addListener(  //used to receive messages passed from content.js based on status of ChatGPT analysis
    function(request, sender, sendResponse) {
      console.log("\nBG: Message Received");
      console.log(sender.tab.url );
      console.log(request);
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.chatGPTStatus === "In Progress"){
        
            console.log("BG: Received in Progress Messaage");
            console.log("BG: "+request.htmlForPopUp);
            key = "CurrentTabGPTAnalysisInHTML"
            value = request.htmlForPopUp
            //chrome.storage.local.set( {key: value} )

            chrome.action.setIcon({
                path :"/icons/icon-bw-16.png"
                   
                
              });
              console.log("BG: Completed updating Not Available SetIcon");

      
        } else if (request.chatGPTStatus === "Complete") {

            console.log("BG: Received in Complete Messaage");
            console.log(request.htmlForPopUp);
            key = "CurrentTabGPTAnalysisInHTML";
            value = request.htmlForPopUp;
          


            chrome.action.setIcon({
                path : "/icons/icon16.png"
                
              });
              console.log("BG: Completed updating Complete SetIcon");
            //sends a message to popup.js worker to update popup window
            console.log("OK before send message");

            

            console.log("OK after send message");
            
        } else if (request.chatGPTStatus === "Not Available") {

            console.log("BG: Received in Not Available Message");
            console.log(request.htmlForPopUp);
            key = "CurrentTabGPTAnalysisInHTML"
            value = request.htmlForPopUp
            //chrome.storage.local.set( {key: value} )
            chrome.action.setIcon({
                path :"/icons/icon-bw-16.png"
                    
              });
              console.log("BG: Completed updating In Progress SetIcon");


        }
    }
  );

console.log("BG: background.js loaded")
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });




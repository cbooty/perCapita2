

//default ChatGPT prompt, that the user can overwrite.
var prelimGPT = "I want you to analyze the biggest dollar values from a news article that I will provide at the following prompt.\n\n";
var prelimGPT = prelimGPT + "I want you to build an html table and include the following columns:\n";
var prelimGPT = prelimGPT + "Add a column called [Description] that displays a [short description of the dollar value]\n";
var prelimGPT = prelimGPT + "Add a column called [Amount] that displays [the dollar value].  This column should not include anything other than dollars.\n";
var prelimGPT = prelimGPT + "Add a column called [Location] that displays [the location referenced in the article for this value, which should be either a country, state, province or city, if this location is listed.  If you are unsure of the city, use the province or state. If there is no location listed in the article for this value, use the location referenced for the overall article]\n";
var prelimGPT = prelimGPT + "Add a column called [Population] that displays a [the population for this location.  Use your latest information for the population]\n";
var prelimGPT = prelimGPT + "Add a column called [Amount per Resident] that is calculated as [Amount] diviced by [Population].  Round to nearest dollar if this is greater than $10.\n";
var prelimGPT = prelimGPT + "Next, remove all rows where [Amount] = N/A, [Amount] is not in dollars or [Amount] = $0.\n";
var prelimGPT = prelimGPT + "Ensure you format this table as HTML starting with an <Table> tag and only include the table in your response.\n";

var modelName = "gpt-3.5-turbo-instruct";

// Saves options to chrome.storage
const saveOptions = () => {
    const openAIKey = document.getElementById('openAIKey').value;
    const chatGPTPrompt = document.getElementById('chatGPTPrompt').value;
    const openAIModelName = document.getElementById('openAIModelName').value;
  
    chrome.storage.sync.set(
      { myOpenAIKey: openAIKey, myChatGPTPrompt: chatGPTPrompt, myOpenAIModelName: openAIModelName },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  };
  
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { myOpenAIKey: '<Paste from link below>', myChatGPTPrompt: prelimGPT, myOpenAIModelName: modelName},
      (items) => {
        document.getElementById('openAIKey').value = items.myOpenAIKey;
        document.getElementById('chatGPTPrompt').value = items.myChatGPTPrompt;
        document.getElementById('openAIModelName').value = items.myOpenAIModelName;
        if (items.myChatGPTPrompt=="") {
          resetChatPrompt();
          saveOptions();
        }
      }
    );
  };

  const resetChatPrompt = () => {

    console.log("Requested Prompt Reset");
    document.getElementById('chatGPTPrompt').value = prelimGPT;
    document.getElementById('openAIModelName').value = modelName;
    console.log("Prompt Reset Complete");
  }
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('resetPrompt').addEventListener('click', resetChatPrompt);





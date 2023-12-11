document.addEventListener('DOMContentLoaded', function() {
    const myCheckbox = document.getElementById('myCheckbox');
    const main = document.getElementById('main');
    const sub = document.getElementById('sub');
    const blockButton = document.getElementById('blockButton');
    const getdataButton = document.getElementById('get_data');
    const url = document.getElementById('web_address');
    const ul = document.getElementById('list');
    const back = document.getElementById('maskedImage');
    const del = document.getElementById('del');

    blockButton.addEventListener('click', function() {
        if (url != null && url.value != "") {
            let new_url = url.value.split(',').map(url => url.trim());
            chrome.storage.local.get('myArray', function(data) {
                const retrievedArray = data.myArray || [];                
                if (retrievedArray.length > 0) {
                    new_url.forEach(function(url){
                        if (!retrievedArray.includes(url)){
                            retrievedArray.push(url);
                        }
                    });                    
                    chrome.storage.local.set({ 'myArray': retrievedArray }, function() {
                        console.log('Mảng đã được cập nhật:', retrievedArray);
                    });
                } else {
                    chrome.storage.local.set({ 'myArray': new_url }, function() {
                        console.log('Mảng mới đã được tạo và lưu trữ:', new_url);
                    });
                }
            });
            url.value = '';
            chrome.tabs.query({url: '*://*.google.com/*'}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.reload(tab.id);
                });
            });
        } else {
            url.focus();
        }
    });

    getdataButton.addEventListener('click', function(){
        load_data();
    });

    back.addEventListener('click', function(){
        ul.innerHTML = '';
        main.style.display = 'block';
        sub.style.display = 'none';
    }); 
  
    if (myCheckbox){
        chrome.management.get(chrome.runtime.id, function(info) {
            myCheckbox.checked = info.enabled;
        });
        
        myCheckbox.addEventListener('click', function() {            
            chrome.management.get(chrome.runtime.id, function(info) {
                const newState = !info.enabled;
                chrome.management.setEnabled(chrome.runtime.id, newState, function() {
                    //do st
                });
            });
        });
    }  
    
    del.addEventListener('click', function(){
        chrome.storage.local.get('myArray', function(data) {
            const retrievedArray = data.myArray || [];
            const checkedCheckboxIDs = getCheckedCheckboxIDs();
            checkedCheckboxIDs.forEach(function(checkedID) {
                const index = retrievedArray.indexOf(checkedID);
                if (index !== -1){
                    retrievedArray.splice(index, 1);
                }
            });
            chrome.storage.local.set({ "myArray": retrievedArray }, function() {
                load_data();
            });
        });
    });

    function getCheckedCheckboxIDs() {
        const checkboxes = document.querySelectorAll('.urls');
        const checkedCheckboxIDs = [];
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                checkedCheckboxIDs.push(checkbox.id);
            }
        });
        return checkedCheckboxIDs;
    }
    
    function load_data(){
        chrome.storage.local.get('myArray', function(data) {
            const retrievedArray = data.myArray || [];   
            ul.innerHTML = '';         
            if (retrievedArray.length > 0) {
                main.style.display = 'none';
                sub.style.display = 'block';
                retrievedArray.forEach(function(url){
                    ul.innerHTML += '<li><input type="checkbox" class="urls" id="' + url + '"/>' + url + '</li>';
                });  
            }
        });
    }
    
    
});




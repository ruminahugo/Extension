function hideBlockedSites() {
    try{
        chrome.storage.local.get('myArray', function(data) {
            var retrievedArray = data.myArray || []; // Mảng rỗng nếu không có dữ liệu được lưu trữ        
            const searchResults = document.querySelectorAll('div.g');
            searchResults.forEach(result => {
                retrievedArray.forEach(function(specify_url){
                    const link = result.querySelector('a[href*="' + specify_url + '"]');
                    if (link) {
                        result.style.display = 'none'; // Ẩn kết quả chứa liên kết đến trang cụ thể
                    }
                });
            });        
        });  
    }catch(e){/*console.error(e);*/}  
}
  
// Gọi hàm hideBlockedSites khi trang được tải hoàn tất
window.addEventListener('load', hideBlockedSites);
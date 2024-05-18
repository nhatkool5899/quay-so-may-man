let data = []; // Mảng chứa toàn bộ dữ liệu từ file Excel
let intervalId; // Biến lưu trữ interval để chạy và dừng việc hiển thị mã code
const audioElement = document.getElementById('spin-audio'); 

// Hàm để đọc file Excel từ đường dẫn cố định
async function loadExcel() {
    await fetch('data-code.xlsx')
        .then(response => response.arrayBuffer())
        .then(d => {
            const workbook = XLSX.read(d, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            // Lưu dữ liệu vào biến data
            data = jsonData;
            // document.getElementById('code-display').innerText = 'Dữ liệu đã sẵn sàng';

        })
        .catch(error => console.error('Error loading Excel file:', error));
        
    }
    
    // Gọi hàm loadExcel khi trang được tải
window.onload = loadExcel;
async function startRandom() {
    await loadExcel()

    audioElement.play();

    if (data.length === 0) {
        alert('Dữ liệu chưa được tải xong.');
        return;
    }
    intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomEntry = data[randomIndex];

        document.getElementById('code-display').innerText = randomEntry[0]; // Cột mã quay số
    }, 100); // Thay đổi mã code mỗi 100ms

    // Tự động dừng sau 10 giây
    
    
    setTimeout(stopRandom, 9400);
}


async function stopRandom() {

    await loadExcel();

    clearInterval(intervalId);
    // const finalCode = document.getElementById('code-display').innerText;
    // const finalEntry = data.find(entry => entry[0] === finalCode);


    // if (finalEntry) {
    //     document.getElementById('final-result').innerText = finalEntry[0];
    //     document.getElementById('final-phone').innerText = finalEntry[2];
    // }

    const finalCode = document.getElementById('code-display').innerText;
    const finalEntryIndex = data.findIndex(entry => entry[0] === finalCode);

    console.log(finalEntryIndex);

    if (finalEntryIndex !== -1) {
        const finalEntry = data.splice(finalEntryIndex, 1)[0]; // Xóa và lấy ra phần tử đã quay trúng

        document.getElementById('final-result').innerText = finalEntry[0];
        document.getElementById('final-phone').innerText = finalEntry[2];
    }
}
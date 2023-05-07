const generateRandomBinary = () => {
    let binary = '';
    for (let i = 0; i < 64; i++) {
        binary += Math.floor(Math.random() * 2);
    }
    return binary;
};

const createFavicon = () => {
    const binary = generateRandomBinary();
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    for (let i = 0; i < binary.length; i++) {
        const x = i % 4;
        const y = Math.floor(i / 4);
        const colorIndex = Math.floor(Math.random() * colors.length);
        const color = binary[i] === '1' ? colors[colorIndex] : '#FFFFFF';
        ctx.fillStyle = color;
        ctx.fillRect(x * 4, y * 4, 4, 4);
    }
    const dataURL = canvas.toDataURL('image/png');
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        const head = document.getElementsByTagName('head')[0];
        link = document.createElement('link');
        link.rel = 'icon';
        head.appendChild(link);
    }
    link.href = dataURL;
};

createFavicon();

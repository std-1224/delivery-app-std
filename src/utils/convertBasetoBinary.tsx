export const base64ToArrayBuffer = (base64: any): any => {
    const imageData = base64.toString()
    if (imageData?.includes("data:image") || imageData?.includes("data:application")) {
        let binary_string;
        if (imageData?.includes("data:image")) {
            binary_string = window.atob(imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
        } else {
            binary_string = window.atob(imageData.replace("data:application/octet-stream;base64,", ''));
        }
        var len = new Array(binary_string.length);
        for (var i = 0; i < binary_string.length; i++) {
            len[i] = binary_string.charCodeAt(i);
        }
        var byteArray = new Uint8Array(len);
        var blob = new Blob([byteArray]);
        return blob;
    }
    else {
        return base64;
    }
}
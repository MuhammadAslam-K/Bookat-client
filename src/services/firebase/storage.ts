import { storage } from "./config";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const uploadImageToStorage = async (image: string | null, imageName: string | null, folder1: string, folder2: string) => {
    try {
        if (image) {
            const aadharBlob = dataURItoBlob(image);
            const aadharFile = new File([aadharBlob], imageName || "default-image-name.jpg", { type: 'image/jpeg' });

            const storageRef = ref(storage, `/images/${folder1}/${folder2}/${aadharFile.name}`);
            await uploadBytes(storageRef, aadharFile);
            const downloadURL = await getDownloadURL(storageRef);
            console.log("download", downloadURL)
            return downloadURL;
        }
        else {
            throw new Error("Invalid image data");
        }
    } catch (error) {
        throw new Error("Invalid image data");
    }
};
function dataURItoBlob(dataURI: string): Blob {
    const arr = dataURI.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
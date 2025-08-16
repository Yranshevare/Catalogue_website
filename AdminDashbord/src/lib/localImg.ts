"use server"
import { writeFile } from "fs/promises";

export default async function addImageToLocalServer(image: File) {
try {
    const byte = await image.arrayBuffer();      // It returns a Promise that resolves to an ArrayBuffer representing the contents of a file. An ArrayBuffer is a low-level, fixed-length binary data buffer used in JavaScript to represent raw data in the form of bytes.
    const buffer = Buffer.from(byte)    //you can convert it to a Buffer using Buffer.from().  Buffer is a built-in class in Node.js that allows you to work with binary data directly.
    // const path = join('@','/','public','/','temp',file.name)
    const path = `/tmp/${image.name}`
    await writeFile(path,buffer)
    console.log(`/tmp/${image.name}`)
    return path
} catch (error) {
    console.log(error)
}
}
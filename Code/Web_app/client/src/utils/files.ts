export async function parseJsonFile(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) =>
      resolve(JSON.parse(event.target?.result as string));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

export async function fileToString(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) =>
      resolve(event.target?.result as string);
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}
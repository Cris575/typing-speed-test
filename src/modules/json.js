export async function getData() {
  try {
    const response = await fetch("/data/data.json");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    // return error.message;
  }
}

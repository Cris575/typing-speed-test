export async function getData() {

  try{
    const response = await fetch("data/data.json");
    const data = await response.json();
    return data;
  }catch(error){
    console.log(error)
    // return error.message;
  }
  
}

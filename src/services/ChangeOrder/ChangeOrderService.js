const baseURL = process.env.VUE_APP_BASE_URL;
export async function fetchImplementedCOs() {
  const response = await fetch(`${baseURL}/CO.properties`); 
  const rawText = await response.text();

  console.log("rawText",rawText)
  let lines = rawText.trim().split('\n');

  return lines
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const value = line.split('=')[1];
      return value.split(';')
    })
    .filter(parts => parts.length >= 3 && parts[1].toLowerCase() === 'implemented')
    .map(parts => ({
      coNumber: parts[0],
      status: parts[1],
      date: parts[2]
    }));
}
async function fetchCV(id = 1) {
  const response = await fetch(`/backendApi/cv/${id}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

function bytesToImageUrl(bytesObj) {
  const bytes = new Uint8Array(Object.values(bytesObj));
  const blob = new Blob([bytes], { type: 'image/png' });
  return URL.createObjectURL(blob);
}
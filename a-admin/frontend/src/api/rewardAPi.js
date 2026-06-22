const API_BASE = "http://localhost:5000/api/rewards"; // adjust to your server's host/port

export async function getRewards() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch rewards");
  return res.json();
}

export async function createReward({ name, points, stocks, imageFile }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("points", points);
  formData.append("stocks", stocks);
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(API_BASE, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to create reward");
  return res.json();
}

export async function updateReward(id, { name, points, stocks, imageFile }) {
  const formData = new FormData();
  if (name !== undefined) formData.append("name", name);
  if (points !== undefined) formData.append("points", points);
  if (stocks !== undefined) formData.append("stocks", stocks);
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${API_BASE}/${id}`, { method: "PUT", body: formData });
  if (!res.ok) throw new Error("Failed to update reward");
  return res.json();
}

export async function deleteReward(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete reward");
  return res.json();
}
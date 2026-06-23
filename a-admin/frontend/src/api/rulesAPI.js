const API_BASE = "http://localhost:5000/api/rules"; // adjust to your server's host/port

export async function getRules() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch rules");
  return res.json();
}

export async function createRule({ name, decs, points, freq, auto, imageFile }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("decs", decs);
  formData.append("points", points);
  formData.append("freq", freq);
  formData.append("auto", auto ?? false);
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(API_BASE, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to create rule");
  return res.json();
}

export async function updateRule(id, { name, decs, points, freq, auto, imageFile }) {
  const formData = new FormData();
  if (name !== undefined) formData.append("name", name);
  if (decs !== undefined) formData.append("decs", decs);
  if (points !== undefined) formData.append("points", points);
  if (freq !== undefined) formData.append("freq", freq);
  if (auto !== undefined) formData.append("auto", auto);
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${API_BASE}/${id}`, { method: "PUT", body: formData });
  if (!res.ok) throw new Error("Failed to update rule");
  return res.json();
}

export async function deleteRule(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete rule");
  return res.json();
}
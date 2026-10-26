// receiver.js - saves the receiver form to the blood_requests table

var form = document.getElementById("receiverForm");
var msg = document.getElementById("formMessage");
var btn = document.getElementById("submitBtn");
var currentUser = null;

function showMessage(text, isError) {
  msg.textContent = text;
  msg.style.color = isError ? "#b00020" : "#1a7f37";
  msg.style.display = "block";
}

async function startPage() {
  // guard: sends to login if not logged in
  await requireLogin();

  var result = await db.auth.getUser();
  if (!result.data.user) return;
  currentUser = result.data.user;

  // required-by date can't be in the past
  var today = new Date().toISOString().split("T")[0];
  document.getElementById("requiredBy").min = today;

  // prefill contact details from profiles
  var p = await db.from("profiles")
    .select("full_name, email, phone")
    .eq("id", currentUser.id)
    .maybeSingle();
  if (p.data) {
    document.getElementById("contactName").value = p.data.full_name || "";
    document.getElementById("contactPhone").value = p.data.phone || "";
    document.getElementById("contactEmail").value = p.data.email || currentUser.email;
  } else {
    document.getElementById("contactEmail").value = currentUser.email;
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!currentUser) {
    showMessage("Please log in first.", true);
    return;
  }

  var row = {
    user_id: currentUser.id,
    patient_name: document.getElementById("patientName").value.trim(),
    patient_age: parseInt(document.getElementById("patientAge").value),
    relationship: document.getElementById("relationship").value,
    blood_group: document.getElementById("bloodGroup").value,
    component: document.getElementById("component").value,
    units_needed: parseInt(document.getElementById("units").value),
    hospital_name: document.getElementById("hospitalName").value.trim(),
    hospital_city: document.getElementById("city").value,
    hospital_reference_id: document.getElementById("hospitalRef").value.trim() || null,
    required_by: document.getElementById("requiredBy").value,
    contact_name: document.getElementById("contactName").value.trim(),
    contact_phone: document.getElementById("contactPhone").value.trim(),
    contact_email: document.getElementById("contactEmail").value.trim(),
    consent_given: document.getElementById("consent").checked
  };

  btn.disabled = true;
  btn.textContent = "Submitting...";
  msg.style.display = "none";

  var res = await db.from("blood_requests").insert(row);

  if (res.error) {
    console.log(res.error);
    showMessage("Could not submit: " + res.error.message, true);
    btn.disabled = false;
    btn.textContent = "Submit blood request →";
    return;
  }

  showMessage("Request submitted! Taking you to blood banks...", false);
  window.location.href = "banks.html";
});

startPage();

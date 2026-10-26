// donor.js - saves the donor form to the donor_profiles table

var form = document.getElementById("donorForm");
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

  // prefill name, email, phone from the profiles table
  var p = await db.from("profiles")
    .select("full_name, email, phone")
    .eq("id", currentUser.id)
    .maybeSingle();
  if (p.data) {
    document.getElementById("fullName").value = p.data.full_name || "";
    document.getElementById("email").value = p.data.email || currentUser.email;
    document.getElementById("phone").value = p.data.phone || "";
  } else {
    document.getElementById("email").value = currentUser.email;
  }

  // if donor already filled this before, show the saved values
  var d = await db.from("donor_profiles")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();
  if (d.data) {
    var x = d.data;
    document.getElementById("fullName").value = x.full_name || "";
    document.getElementById("phone").value = x.phone || "";
    document.getElementById("dob").value = x.date_of_birth || "";
    document.getElementById("gender").value = x.gender || "Male";
    document.getElementById("bloodGroup").value = x.blood_group;
    document.getElementById("lastDonation").value = x.last_donation_date || "";
    document.getElementById("availability").value = x.availability || "open";
    document.getElementById("city").value = x.city;
    document.getElementById("locality").value = x.locality || "";
    document.getElementById("pinCode").value = x.pin_code || "";
    document.getElementById("byPhone").checked = (x.contact_preference == "phone" || x.contact_preference == "both");
    document.getElementById("byEmail").checked = (x.contact_preference == "email" || x.contact_preference == "both");
  }
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!currentUser) {
    showMessage("Please log in first.", true);
    return;
  }

  // work out contact preference from the two checkboxes
  var phoneOn = document.getElementById("byPhone").checked;
  var emailOn = document.getElementById("byEmail").checked;
  var contactPref = "none";
  if (phoneOn && emailOn) contactPref = "both";
  else if (phoneOn) contactPref = "phone";
  else if (emailOn) contactPref = "email";

  var availability = document.getElementById("availability").value;

  var row = {
    user_id: currentUser.id,
    full_name: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    date_of_birth: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    blood_group: document.getElementById("bloodGroup").value,
    last_donation_date: document.getElementById("lastDonation").value || null,
    availability: availability,
    is_available: availability != "not_now",
    city: document.getElementById("city").value,
    locality: document.getElementById("locality").value.trim(),
    pin_code: document.getElementById("pinCode").value.trim(),
    contact_preference: contactPref,
    consent_given: document.getElementById("consent").checked
  };

  btn.disabled = true;
  btn.textContent = "Saving...";
  msg.style.display = "none";

  // upsert = insert the first time, update after that (user_id is unique)
  var res = await db.from("donor_profiles").upsert(row, { onConflict: "user_id" });

  if (res.error) {
    console.log(res.error);
    showMessage("Could not save: " + res.error.message, true);
    btn.disabled = false;
    btn.textContent = "Submit donor profile →";
    return;
  }

  showMessage("Saved! Taking you to the next page...", false);
  window.location.href = "thank-you.html";
});

startPage();

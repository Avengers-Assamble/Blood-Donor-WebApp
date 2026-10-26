// topbar.js - makes the top bar match the login state

async function setupTopbar() {
  var right = document.querySelector(".topbar .right");
  if (!right) return;

  var result = await db.auth.getSession();
  var session = result.data.session;

  // not logged in -> show Sign in / Join
  if (!session) {
    right.innerHTML = '<a href="login.html" style="margin-right:12px">Sign in</a>' +
                      '<a class="btn btn-primary" href="register.html">Join</a>';
    return;
  }

  // logged in -> get name and role from profiles
  var p = await db.from("profiles")
    .select("full_name, role")
    .eq("id", session.user.id)
    .maybeSingle();

  var name = session.user.email;
  var role = "user";
  if (p.data) {
    if (p.data.full_name) name = p.data.full_name;
    role = p.data.role;
  }

  // first letters of the name for the round avatar
  var parts = name.trim().split(" ");
  var initials = parts[0][0];
  if (parts.length > 1) initials = initials + parts[parts.length - 1][0];
  initials = initials.toUpperCase();

  // welcome line on the home page (does nothing on other pages)
  var welcome = document.getElementById("welcomeName");
  if (welcome) welcome.textContent = ", " + parts[0];

  // fill the existing user box, or make one
  var userBox = right.querySelector(".user");
  if (!userBox) {
    userBox = document.createElement("div");
    userBox.className = "user";
    right.appendChild(userBox);
  }
  userBox.textContent = "";
  var avatar = document.createElement("span");
  avatar.className = "avatar";
  avatar.textContent = initials;
  userBox.appendChild(avatar);
  userBox.appendChild(document.createTextNode(name));

  // admin link only for admins
  if (role == "admin") {
    var adminLink = document.createElement("a");
    adminLink.href = "admin-users.html";
    adminLink.textContent = "Admin";
    adminLink.style.marginRight = "12px";
    right.insertBefore(adminLink, right.firstChild);
  }

  // logout button
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-outline";
  btn.textContent = "Log out";
  btn.style.marginLeft = "12px";
  btn.addEventListener("click", logout);
  right.appendChild(btn);
}

setupTopbar();

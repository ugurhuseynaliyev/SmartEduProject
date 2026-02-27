export async function getIndexPage(req, res) {
  res.status(200).render("index", {
    page_name: "index",
  });
}

export async function getAboutPage(req, res) {
  res.status(200).render("about", {
    page_name: "about",
  });
}

export async function getRegisterPage(req, res) {
  res.status(200).render("register", {
    page_name: "register",
  });
}

export async function getLoginPage(req, res) {
  res.status(200).render("login", {
    page_name: "login",
  });
}

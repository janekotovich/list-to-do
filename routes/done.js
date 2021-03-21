/* Call required package modules */
const express = require("express");
const router = express.Router();
const session = require("express-session");
/* Call database */
const { pool } = require("../database.js");
const app = express();
//ssessions
app.use(
  session({
    resave: false,
    secret: "shh/its1asecret",
    saveUninitialized: false,
    //secure:false
  })
);

//Can put this function in route to force login
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.get("/", (req, res) => {
  res.redirect("/");
});

router.post("/", checkNotAuthenticated, (req, res) => {
  const itemsDone = req.body.item_id;
  for (let i = 0; i < itemsDone.length; i++) {
    const itemToTick = Number(itemsDone[i]);
    alreadyDone = true;
    console.log(itemToTick);
    pool
      .query(`UPDATE list_to_do SET done = $1 WHERE item_id = $2;`, [
        alreadyDone,
        itemToTick,
      ])
      .then(() => {
        console.log("it reached herer 333");
        pool.query(`DELETE from list_to_do WHERE item_id = $1;`, [itemToTick]);
      })
      .catch(
        (err) => {
          return console.log("its error here!");
        }
        // res.status(404).render("pages/error", {
        //   err: { message: "HTTP ERROR 404. This page can not be found" },
        //   title: "Error ",
        //   current_user: req.session.user,
        // })
      );
  }
  req.flash("success_msg", `Great job! you have done this!`);
  res.redirect("/");
});

/* Export router to app.js */
module.exports = router;

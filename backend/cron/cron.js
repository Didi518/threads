import cron from "cron";
import https from "https";

const URL = `${process.env.APP_URL}`;

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("Requête GET envoyée");
      } else {
        console.log("Echec de la requête GET", res.statusCode);
      }
    })
    .on("error", (e) => {
      console.error("Echec lors de l'envoie de la requête GET", e);
    });
});

export default job;

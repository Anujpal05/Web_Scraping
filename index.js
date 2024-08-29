import axios from "axios";
import * as cheerio from "cheerio";
import express from "express";
const app = express();

const fetch = async () => {
  const url = "https://internshala.com/jobs/";
  let job = [];
  try {
    const res = await axios.get(url);
    let $ = cheerio.load(res.data);

    $("#internship_list_container .individual_internship").each(
      (index, element) => {
        let job_name = $(element).find(".job-internship-name").text().trim();

        let internship_pid = $(element).attr("internshipid")
          ? $(element).attr("internshipid")
          : Date.now().toString().slice(-7);

        const cleanedCompanyNames = $(element)
          .find(".company_and_premium .company-name")
          .text()
          .split("\n")
          .map((str) => str.trim())
          .filter((str) => str !== "")
          .toString();

        let company_name = cleanedCompanyNames
          ? cleanedCompanyNames
          : "Unknown Job";

        let locations = $(element)
          .find(".individual_internship_job .locations a")
          .text();
        let duration = $(element)
          .find(".individual_internship_job .item_body")
          .text();

        let stipent = $(element)
          .find(".individual_internship_job .desktop")
          .text()
          .trim();

        let job_url = "https://internshala.com" + $(element).attr("data-href");

        job.push({
          internship_pid: internship_pid,
          job_name: job_name,
          company_name: company_name,
          locations: locations,
          duration: duration,
          stipent: stipent,
          job_url: job_url,
        });
      }
    );
    return job;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Usage example

app.get("/get-internshala", (req, res) => {
  fetch().then((job) => {
    res.status(200).send(job);
  });
});

app.listen(3000, () => {
  console.log("app is listen on port 3000");
});

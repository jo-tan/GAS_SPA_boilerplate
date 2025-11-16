# GAS_SPA_boilerplate

> **Warning:** This is an ongoing project and may contain errors. Please use with caution.

A simple boilerplate for creating a Single Page Application (SPA) using Google Apps Script. This project demonstrates how to build a web app that can interact with Google Sheets for data storage and retrieval, and use Google Mail to send emails.

It provides a basic structure for:
*   A multi-page feel in a single web app.
*   Fetching and displaying data from a Google Sheet.
*   Submitting data from a form to a Google Sheet.
*   Generating and sending emails based on sheet data.

### A Note on Performance
Due to the nature of Google Apps Script, you may notice a slight delay when loading data or submitting the form. This is expected. Every call from the web app to the backend script involves a round-trip to Google's servers, which also perform tasks like opening spreadsheets and sending emails. This server-side processing is the primary reason for the latency.

### Great Reference Resources
*  google-apps-script-aewsome-list[https://github.com/oshliaer/google-apps-script-awesome-list?tab=readme-ov-file#awesome-code--things]
*  google-apps-script-cheat-sheet[https://github.com/jc324x/google-apps-script-cheat-sheet]
*  Google Apps Script Snippets [https://apps-script-snippets.contributor.pw/sheets/]
*  Scripting with Shiva[https://scriptingwithshiva.blogspot.com/]
*  Google's Developer Resource[https://developers.google.com/apps-script]

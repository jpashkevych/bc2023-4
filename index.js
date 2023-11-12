const fs = require("fs");
const express = require("express");
const xml = require("fast-xml-parser");

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  fs.readFile("data.xml", "utf8", (err, data) => {
    if (err === null) {
      const parser = new xml.XMLParser();
      const obj = parser.parse(data);

      const auctions = obj.auctions.auction;

      const outputData = {
        data: {
          auction: auctions.map((auction) => ({
            code: auction.StockCode,
            currency: auction.ValCode,
            attraction: auction.Attraction,
          })),
        },
      };

      const builder = new xml.XMLBuilder();
      const xmlStr = builder.build(outputData);

      res.set("Content-Type", "text/xml");
      res.send(xmlStr);
    } else {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express')
const cors = require('cors')
const app = express();
const port = 8000;
require('./storage/db')

const cheff = require("./routes/cheff");
const customer = require("./routes/customer");
const meal = require("./routes/meal");
const waiter = require("./routes/waiter");
const order = require("./routes/order");

app.use(express.json());
app.use(cors())
app.use("/cheffs", cheff);
// app.use("/customer", customer);
// app.use("/meal", meal);
app.use("/waiters", waiter);
// app.use("/order", order);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

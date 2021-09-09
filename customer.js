const Customer = require("../models/Customer");
const bodyParser = require("body-parser");



exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;


  try {
    const customers = await Customer.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await Customer.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("customers", {
      customers: customers,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message
    });
  } catch (e) {
    res.status(404).send({ message: "could not list tastings" });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id);
    if (!customer) throw Error('cant find customer');
    res.render('update-customer', {
      customer: customer,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('create-customer', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could find customer ${id}`,
    });
  }
};

exports.create = async (req, res) => {
  try {

    const customer = await Customer.findById(req.body.customer_id);
    await Customer.create({
      title: req.body.title,
      taster_name: taster.name,
      taster_twitter_handle: taster.twitter_handle,
      points: parseInt(req.body.points),
      taster_id: req.body.taster_id,
      regions: req.body.regions
    })

    res.redirect('/customers/?message=customer has been created')
  } catch (e) {
    if (e.errors) {
      res.render('create-customer', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.createView = async (req, res) => {
  try {
    const countries = await Country.find({});
    const tasters = await Taster.find({});
    const regions = await Region.find({});
    res.render("create-customer", {
      countries: countries,
      tasters: tasters,
      regions: regions,
      errors: {}
    });

  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Tasting.findByIdAndRemove(id);
    res.redirect("/customers");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};


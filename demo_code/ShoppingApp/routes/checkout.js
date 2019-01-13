var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Variant = require('../models/variant');
var Order = require('../models/order');
var Department = require('../models/department');
var Discount = require('../models/discount');
var paypal2 = require('paypal-rest-sdk');
paypal2.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AX7-wOpXyLvxU7LCgkesV8qM-wlh9aR9opraa1X29OtiZudE9Q_p6IXBeDYtw2hS12790nUaVGm7rBY6',
  'client_secret': 'EKIDu14ToOF9urgQ0RDkziS04RTpFyvcOEG8ZJ8hpga7kr51Jz2gUjiXlDP0x3KdXpFQATf5Oy1bxtrg'
});


/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests to the checkout page
//
// This basically renders checkout page and set the discount price
// to 0 always.
//
/////////////////////////////////////////////////////////////////////
router.get('/', ensureAuthenticated, function(req, res, next) {
  let cart = new Cart(req.session.cart);
  req.session.cart.discountPrice = 0;
  res.render('checkout', {
    title: 'Checkout Page',
    items: cart.generateArray(),
    totalPrice: cart.totalPrice.toFixed(2),
    bodyClass: 'registration',
    containerWrapper: 'container'
  });
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for adding discount
//
// This basically rediercts to checkout page. I need this because
// I in the post request for apply discount I am rendering another page
// so '/apply-discount' keeps in the address bar. Therefore I just
// created redirect middleware for that reason.
//
/////////////////////////////////////////////////////////////////////
router.get('/apply-discount', ensureAuthenticated, function(req, res, next) {
  res.redirect('/checkout')
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles POST requests for adding discount
//
// Checks for the discount codes and if it is applicable then returns
// discounted price.
//
/////////////////////////////////////////////////////////////////////
router.post('/apply-discount', ensureAuthenticated, function(req, res, next) {
  let discountCode = req.body.discountCode;
  Discount.getDiscountByCode(discountCode, function(e, discount) {
    if (e) {
      console.log("Failed on router.get('/checkout/apply-discount')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      let cart = new Cart(req.session.cart);
      if (discount) {
        let totalDiscount = (cart.totalPrice * discount.percentage) / 100
        totalDiscount = parseFloat(totalDiscount.toFixed(2))
        let totalPrice = cart.totalPrice - totalDiscount;
        totalPrice = parseFloat(totalPrice.toFixed(2))
        cart.discountPrice = totalPrice
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPriceAfterDiscount: totalPrice.toFixed(2),
          totalDiscount: totalDiscount,
          actualPrice: cart.totalPrice,
          discountPercentage: discount.percentage,
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        cart.discountPrice = 0;
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: cart.totalPrice.toFixed(2),
          discountCode: discountCode,
          bodyClass: 'registration',
          containerWrapper: 'container',
          msg: "This discount code is not applicable"
        });
      }
    }
  })
})

/////////////////////////////////////////////////////////////////////
//
// checkout-process - checkout-success - checkout-cancel
// MIDDLEWARE - Handles POST & GET requests
//
// They are just middleware for paypal API. Nothing special about them
// Derived from https://github.com/paypal/PayPal-node-SDK
//
/////////////////////////////////////////////////////////////////////
router.post('/checkout-process', function(req, res) {
  let cart = new Cart(req.session.cart);
  //console.log(req);
  console.log(cart);
  Object.keys(cart.items).map(function(i,v){console.log(cart.items[i].item);})
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice;
  var didPaymentSucceed = Math.random()
	var create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://127.0.0.1:3000/checkout/checkout-success",
			"cancel_url": "http://127.0.0.1:3000/checkout/checkout-cancel"
		},
		"transactions": [{
			/*"item_list": {
				"items": [{
					"name": "item",
					"sku": "item",
					"price": "1.00",
					"currency": "CAD",
					"quantity": 1
				}]
			},*/
			"amount": {
				"currency": "CAD",
				"total": totalPrice.toFixed(2)
			},
			"description": "This is the payment description."
		}]
	};
	

	paypal2.payment.create(create_payment_json, function (error, payment) {
    if (error) {
		console.log(error.response);
        throw error;
    } else {
		for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
            if (payment.links[index].rel === 'approval_url') {
				res.redirect(payment.links[index].href);
                //console.log(payment.links[index].href);
            }
        }
        //console.log(payment);

    }
});
	
  //TODO: IMPLEMENT PAYMENT THROUGH PAYPAL
  //FOR NOW -randomly choose whether payment was approved or cancelled
  //redirect client to the success or cancel screens
/*
  if (didPaymentSucceed >= 0.5) {
    //either of these two could work
    //res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
    res.redirect(302, '/checkout/checkout-success')
  } else {
    //either of these two could work
    //res.render('checkoutCancel', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
    res.redirect(302, '/checkout/checkout-cancel')
  }*/
});

router.get('/checkout-success', ensureAuthenticated, function(req, res) {
  //TODO: IMPLEMENT PAYMENT THROUGH PAYPAL
  let cart = new Cart(req.session.cart);
  console.log(req.query);
	paypal2.payment.get(req.query.paymentId, function (err, payment) {
		if (err) return console.error(err);
		console.log(payment.payer.payer_info.shipping_address);
		var newOrder = new Order({
			orderID             : payment.id,
			username            : req.user.username,
			address             : payment.payer.payer_info.shipping_address.line1 + " " + payment.payer.payer_info.shipping_address.city + " " + payment.payer.payer_info.shipping_address.state + " " + payment.payer.payer_info.shipping_address.postal_code + " " + payment.payer.payer_info.shipping_address.country_code,
			orderDate           : payment.create_time,
			shipping            : true
		});
		newOrder.save(function (err, newOrder) {
		if (err) return console.error(err);
			console.log(newOrder);
		});
	});
	console.error(req.session);
	try{req.session.cart = cart.clear();}catch(err){console.error(err);}
	
  //console.log(url.parse(req.url));
  //console.log(url.parse(req.url).query.paymentId);
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice;
  res.render('checkoutSuccess', {
    title: 'Successful',
    containerWrapper: 'container'
  });
});

router.get('/checkout-cancel', ensureAuthenticated, function(req, res) {
  res.render('checkoutCancel', {
    title: 'Successful',
    containerWrapper: 'container'
  });
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for the buy now page
//
// This middleware works for in couple steps;
//      if there is no product in the shopping bag then creates a bag
//      then add to item in the bag then go to checkout page.
//
//      if there is a product in the shopping bag then add to selected
//      item in the bag then go to checkout page.
//
/////////////////////////////////////////////////////////////////////
router.get('/buy-now/:id', ensureAuthenticated, function(req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(e, product) {
    if (e) {
      console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      if (product) {
        cart.add(product, product.id);
        cart.userId = req.user._id;
        req.session.cart = cart;
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: cart.totalPrice,
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        Variant.findById(productId, function(e, variant) {
          if (e) {
            console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
            e.status = 406;
            next(e);
          } else {
            Product.findById(variant.productID, function(e, p) {
              let color = (variant.color) ? "- " + variant.color : "";
              variant.title = p.title + " " + color
              variant.price = p.price
              cart.add(variant, variant.id);
              req.session.cart = cart;
              res.render('checkout', {
                title: 'Checkout Page',
                items: cart.generateArray(),
                totalPrice: cart.totalPrice,
                bodyClass: 'registration',
                containerWrapper: 'container'
              });
            })
          }
        })
      }
    }
  })
});


/////////////////////////////////////////////////////////////////////
//
// Function decreaseInventory
//
// Decrease the inventory quantity whenever a customer buy an item.
//
/////////////////////////////////////////////////////////////////////
function decreaseInventory(cartItems, callback) {
  for (let item in cartItems) {
    let qty = cartItems[item].qty;
    console.log("QTY IS: ", qty)
    Product.getProductByID(item, function(e, p) {
      if (p) {
        Product.findOneAndUpdate({
          "_id": item
        }, {
          $set: {
            "quantity": p.quantity - qty,
          }
        }, {
          new: true
        }, function(e, result) {

        });
      } else {
        Variant.getVariantByID(item, function(e, v) {
          Variant.findOneAndUpdate({
            "_id": item
          }, {
            $set: {
              "quantity": v.quantity - qty,
            }
          }, {
            new: true
          }, function(e, result) {

          });
        });
      }
    });
  }

  return callback(true)
}

/////////////////////////////////////////////////////////////////////
//
// Function ensureAuthenticated()
//
// Check if the user authenticated or not. If not returns to login page
//
/////////////////////////////////////////////////////////////////////
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    Department.getAllDepartments(function(e, departments) {
      req.session.department = JSON.stringify(departments)
      return next();
    })
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/');
  }
};

module.exports = router;

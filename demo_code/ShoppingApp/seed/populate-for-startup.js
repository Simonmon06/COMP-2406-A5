var User        = require('../models/user');
var Category    = require('../models/categories');
var Department  = require('../models/department');
var Product     = require('../models/product');
//var Variant     = require('../models/variant');
var mongoose    = require('mongoose');
//mongoose.connect('mongodb://localhost/shoppingApp');
//mongoose.connect('mongodb://localhost/myShoppingApp3', { useNewUrlParser: true, useCreateIndex: true, });
mongoose.connect('mongodb://localhost/myShoppingApp3');


var categories =
[
    new Category({
        categoryName        : 'Basketball'
    }),
    new Category({
        categoryName        : 'Football'
    }),
    new Category({
        categoryName        : 'Running'
    }),
    new Category({
        categoryName        : 'Lifestyle'
    }),
    new Category({
        categoryName        : 'Tennis'
    })
]

for (let i = 0; i < categories.length; i++){
    categories[i].save(function(e, r) {
        if (i === categories.length - 1){
            exit();
        }
    });
}

var departments =
[
    new Department({
        departmentName      : 'Women',
        categories          : 'Lifestyle,Tennis'

    }),
    new Department({
        departmentName      : 'Men',
        categories          : 'Basketball,Football,Running'
    })
]

for (let i = 0; i < departments.length; i++){
    departments[i].save(function(e, r) {
        if (i === departments.length - 1){
            exit();
        }
    });
}

var products =
[
    new Product({
        _id: "5bedf31cc14d7822b39d9d43",
        imagePath: 'https://c.static-nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/ntwy9k1aiztp9nxshyff/air-zoom-vomero-14-running-shoe-r03CSP.jpg',
        title: 'Nike Air Zoom Vomero 14',
        description: 'The Nike Air Zoom Vomero 14 takes responsive cushioning to the next level. A full-length Zoom Air unit works with Nike React cushioning to deliver a super-snappy, smooth ride. On the top, the sleek design is engineered to support your stride.',
        price: 190.99,
        color: 'Black',
        size: '10,10.5,11,11.5',
        quantity: 20,
        department: 'Men',
        category: 'Running',
    }),
    new Product({
        _id: "5bedf3b9c14d7822b39d9d45",
        imagePath: 'https://c.static-nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/wh5sf3o5ybuzmwr7bazo/flex-contact-2-running-shoe-7znPxE.jpg',
        title: 'Nike Flex Contact 2',
        description: 'The Nike Flex Contact 2 delivers a natural feel in a sleek design. In the forefoot, mesh stretches for toe splay, while tighter mesh through the midfoot offers support. Underfoot, the geometric pattern works with the rounded heel design to adapt to your every step.',
        price: 100.99,
        color: 'Red',
        size: '10,10.5,11',
        quantity: 15,
        department: 'Men',
        category: 'Running',
    }),
    new Product({
        _id: "5bedf448c14d7822b39d9d47",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/vv0fbc0hk018t9a7xdtb/mercurial-superfly-6-elite-se-fg-football-boot-s4PgvZ.jpg',
        title: 'Nike Mercurial Superfly 6 Elite SE FG',
        description: 'The Nike Mercurial Superfly 6 Elite SE FG Boot has a Flyknit construction that wraps your foot for a second-skin fit straight out of the box. The lightweight, 2-part podular plate system flexes for speed with every step. ',
        price: 405.99,
        color: 'Grey',
        size: '9.5,10,10.5,11',
        quantity: 90,
        department: 'Men',
        category: 'Football',
    }),
    new Product({
        _id: "5bedf55bc14d7822b39d9d4b",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/nzmxxpxbzmokylfl1vho/lebron-soldier-12-sfg-basketball-shoe-RPoO39.jpg',
        title: 'LeBron Soldier 12 SFG',
        description: 'The LeBron Soldier 12 SFG Basketball Shoe delivers lightweight, responsive cushioning for the court with Nike Zoom Air cushioning. Adjustable hook-and-loop straps offer adjustable, secure lockdown.',
        price: 190.99,
        color: 'Black',
        size: '10.5,11,11.5',
        quantity: 4,
        department: 'Men',
        category: 'Basketball',
    }),
    new Product({
        _id: "5bedf5eec14d7822b39d9d4e",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/ijkoyasw5j5p6pxanjif/mamba-rage-basketball-shoe-nnTrqNYW.jpg',
        title: 'Nike Mamba Rage',
        description: 'For more than 20 years, Kobe Bryant played with relentless passion. The Nike Mamba Rage Mens Basketball Shoe honours his legend with signature Kobe details and excellent support and comfort on the court.',
        price: 140.99,
        color: 'Gren',
        size: '10,10.5,11',
        quantity: 5,
        department: 'Men',
        category: 'Basketball',
    }),
    new Product({
        _id: "5bedf6b5c14d7822b39d9d51",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/ademozsk4tjsfhyqxnfd/air-force-1-sage-low-lx-shoe-dk5xZ0.jpg',
        title: 'Nike Air Force 1 Sage Low LX',
        description: 'Taking both height and craft to new levels, the Nike Air Force 1 Sage Low LX features a platform midsole and a pared-down upper. Traditional overlays have been replaced with rolled edges and clean lines for a bold look.',
        price: 165.99,
        color: 'Light Purple',
        size: '8,8.5,8,9',
        quantity: 30,
        department: 'Women',
        category: 'Lifestyle',
    }),
    new Product({
        _id: "5bedf720c14d7822b39d9d52",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/yictoifd3ate18zkchzf/air-force-1-jester-xx-shoe-0nTgDmNN.jpg',
        title: 'Nike Air Force 1 Jester XX',
        description: 'The Nike Air Force 1 Jester XX Womens Shoe is a mischievous re-imagining of the iconic AF-1. Logos appear to have fallen off before being haphazardly slapped back on, as if by an impish jester.',
        price: 145.99,
        color: 'White',
        size: '8,8.5',
        quantity: 8,
        department: 'Women',
        category: 'Lifestyle',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d55",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/ahjjnbv8placryvxiqfp/nikecourt-air-zoom-vapor-hard-court-tennis-shoe-bkTvGWJw.jpg',
        title: 'NikeCourt Air Zoom Vapor X',
        description: 'With Nike Zoom Air and a Dynamic Fit system, the NikeCourt Air Zoom Vapor X provides exceptional control on the hard court.',
        price: 190.99,
        color: 'Red',
        size: '8,8.5,9,9.5',
        quantity: 12,
        department: 'Women',
        category: 'Tennis',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d57",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/frg4d0xbbeqqrc1wakau/nikecourt-zoom-cage-3-hard-court-tennis-shoe-NwTznnrm.jpg',
        title: 'NikeCourt Zoom Cage 3',
        description: 'The NikeCourt Zoom Cage 3 is made for the player seeking strength and speed on the hard court. The shoes unique cage design provides maximum durability and cushioning, and is also lighter than ever.',
        price: 175.99,
        color: 'White',
        size: '8,9,9.5',
        quantity: 20,
        department: 'Women',
        category: 'Tennis',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d59",
        imagePath: 'https://c.static-nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/ss5omhciobepo7i5qoga/af-1-rebel-xx-shoe-3zTb1Kd2.jpg',
        title: 'Nike AF-1 Rebel XX',
        description: 'Air-Sole units provide excellent cushioning for all-day comfort.',
        price: 215.99,
        color: 'Blue',
        size: '8,9,9.5',
        quantity: 25,
        department: 'Women',
        category: 'Lifestyle',
    })
];

for (let i = 0; i < products.length; i++){
    products[i].save(function(e, r) {
        if (i === products.length - 1){
            exit();
        }
    });
}


var newUser = new User({
    username    : 'admin@admin.com',
    password    : 'admin',
    fullname    : 'Cuneyt Celebican',
    admin       : true
});
User.createUser(newUser, function(err, user){
    if(err) throw err;
    console.log(user);
});

var newUser1 = new User({
    username    : 'zeyegu@gmail.com',
    password    : 'zeyegu',
    fullname    : 'Zeye Gu',
    admin       : false
});
User.createUser(newUser1, function(err, user){
    if(err) throw err;
    console.log(user);
});



function exit() {
    mongoose.disconnect();
}

var products = {  
  1 : {
    id : "01",
    name : "Nektarinen gelb",
    desc : "Herkunft: Spanien",
    img : "productimages/nektarinen.jpg",
    price : 5.25
  },
  2 : {
    id : "02",
    name : "Rispentomaten",
    desc : "Tomaten verfügen über einen hohen Gehalt an Vitamin C.",
    img : "productimages/tomaten.jpg",
    price : 3.15
  },
  3 : {
    id : "03",
    name : "Kalbs-Bratwürste",
    desc : "Terra Suisse Kalbs-Bratwurst 3x2 Stück",
    img : "productimages/kalbsbratwuerste.jpg",
    price : 16.55
  },
  4 : {
    id : "04",
    name : "Appenzeller Classic",
    desc : "Schweizer Halbhartkäse und vollfett aus Rohmilch",
    img : "productimages/appenzeller.jpg",
    price : 3.45
  },
  5 : {
    id : "05",
    name : "Eier",
    desc : "9 Schweizer Eier aus Freilandhaltung",
    img : "productimages/eier.jpg",
    price : 4.55
  },
  6 : {
    id : "06",
    name : "Krustenkranz",
    desc : "Terra Suisse",
    img : "productimages/krustenkranz.jpg",
    price : 2.35
  },
  7 : {
    id : "07",
    name : "Magnum Almond",
    desc : "Vanilleglace und Milchschokolade mit Mandeln",
    img : "productimages/vanille_glace.jpg",
    price : 9.95
  },
  8 : {
    id : "08",
    name : "Iced Green Tea",
    desc : "AriZona Green Tea - Grünteegrtränk",
    img : "productimages/icedtea.jpg",
    price : 10.85
  },
  9 : {
    id : "09",
    name : "Senf",
    desc : "Senf mild",
    img : "productimages/senf.jpg",
    price : 3.45
  },
  10 : {
    id : "10",
    name : "Olivenöl",
    desc : "Bertolli Olivenöl extra vergine originale",
    img : "productimages/olivenoel.jpg",
    price : 17.95
  }
};

//HTML Grid generator for products
window.addEventListener("load", function(){
  var container = document.getElementById("cart-products"),
      item = null, part = null;
  for (let i in products) {
    item = document.createElement("div");
    item.classList.add("p-item");

    // Product Image
    part = document.createElement("img");
    part.src = products[i]['img'];
    part.classList.add("p-img");
    item.appendChild(part);

    // Product Name
    part = document.createElement("div");
    part.innerHTML = products[i]['name'];
    part.classList.add("p-name");
    item.appendChild(part);

    // Product Price
    part = document.createElement("div");
    part.innerHTML = "CHF " + products[i]['price'];
    part.classList.add("p-price");
    item.appendChild(part);

    // Product Description
    part = document.createElement("div");
    part.innerHTML = products[i]['desc'];
    part.classList.add("p-desc");
    item.appendChild(part);

    // Add to cart
    part = document.createElement("input");
    part.type = "button";
    part.value = "Zum Warenkorb hinzufügen";
    part.classList.add("p-add");
    part.onclick = cart.add;
    part.dataset.id = i;
    item.appendChild(part);

    container.appendChild(item);
  }
});

//SHOPPING CART
var cart = {
  data : null, // current shopping cart

  // LOCALSTORAGE
  load : function(){
  // load() -load previous shopping cart

    cart.data = localStorage.getItem("cart");
    if (cart.data == null) { cart.data = {}; }
    else { cart.data = JSON.parse(cart.data); }
  },

  save : function(){
  // save() -save current cart

    localStorage.setItem("cart", JSON.stringify(cart.data));
  },

  // CART ACTIONS
  add : function(){
  // add() : add selected item to cart

    // Update current cart
    if (cart.data[this.dataset.id] == undefined) {
      var product = products[this.dataset.id];
      cart.data[this.dataset.id] = {
        name : product['name'],
        desc : product['desc'],
        img : product['img'],
        price : product['price'],
        qty : 1
      };
    } else {
      cart.data[this.dataset.id]['qty']++;
    }

    // Save local storage + HTML update
    cart.save();
    cart.list();
  },

  list : function(){
  // list() : update HTML

    var container = document.getElementById("cart-list"),
        item = null, part = null, product = null;
    container.innerHTML = "";

    // Empty cart
    var isempty = function(obj){
      for (var key in obj) {
        if(obj.hasOwnProperty(key)) { return false; }
      }
      return true;
    };
    if (isempty(cart.data)) {
      item = document.createElement("div");
      item.innerHTML = "Cart is empty";
      container.appendChild(item);
    }

    // Not empty
    else {
      // List items
      var total = 0, subtotal = 0;
      for (var i in cart.data) {
        item = document.createElement("div");
        item.classList.add("c-item");
        product = cart.data[i];

        // Quantity
        part = document.createElement("input");
        part.type = "number";
        part.value = product['qty'];
        part.dataset.id = i;
        part.classList.add("c-qty");
        part.addEventListener("change", cart.change);
        item.appendChild(part);

        // Name
        part = document.createElement("span");
        part.innerHTML = product['name'];
        part.classList.add("c-name");
        item.appendChild(part);

        // Subtotal
        subtotal = product['qty'] * product['price'];
        total += subtotal;

        container.appendChild(item);
      }

      // EMPTY BUTTONS
      item = document.createElement("input");
      item.type = "button";
      item.value = "Empty";
      item.addEventListener("click", cart.reset);
      item.classList.add("c-empty");
      container.appendChild(item);

      // CHECKOUT BUTTONS
      item = document.createElement("input");
      item.type = "button";
      item.value = "Checkout - " + "CHF " + total;
      item.addEventListener("click", cart.checkout);
      item.classList.add("c-checkout");
      container.appendChild(item);
    }
  },

  change : function(){
  // change() : change quantity

    if (this.value == 0) {
      delete cart.data[this.dataset.id];
    } else {
      cart.data[this.dataset.id]['qty'] = this.value;
    }
    cart.save();
    cart.list();
  },

  reset : function(){
  // reset() : empty cart

    if (confirm("Empty cart?")) {
      cart.data = {};
      cart.save();
      cart.list();
    }
  },

  checkout : function(){
    window.location.href = 'checkout.html'
  }
};

// Load previous cart and update HTML on load
window.addEventListener("load", function(){
  cart.load();
  cart.list();
});
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	root: (req, res) => {
		// Do the magic
		res.render("products", {
			products: products,
		})
	},
	
	// Detail - Detail from one product
	detail: function(req, res, next) {
		var product = products.find(function(element) {
		return element.id == req.params.productId;
	  	});
        res.render("detail", {
            aMiles: toThousand,
			producto: product,
        });
    },
	
	// Create - Form to create
	create: (req, res) => {
		// Do the magic	
		res.render("product-create-form")		
	},

	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		let nuevoProducto={}
		if(products==""){
			nuevoProducto.id=1
		} else { 
		let ultimoProducto=products[products.length-1]
		nuevoProducto.id=ultimoProducto.id+1
		}
		nuevoProducto.name=req.body.name
		nuevoProducto.price=req.body.price
		nuevoProducto.discount=req.body.discount
		nuevoProducto.category=req.body.category
		nuevoProducto.description=req.body.description
		//res.send(nuevoProducto)
		products.push(nuevoProducto)

		let productosModificadosJSON = JSON.stringify(products)
		fs.writeFileSync(productsFilePath, productosModificadosJSON)
	},
		

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		var product = products.find(function(element) {
			return element.id == req.params.productId;
		});

		res.render("product-edit-form", {
			productToEdit: product,
		});	
	},

	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		products.forEach(element=>{
			if(element.id==req.params.productId){
				element.name=req.body.name
				element.price=req.body.price
				element.discount=req.body.discount
				element.category=req.body.category
				element.description=req.body.description
			}
		})

		let productosModificadosJSON = JSON.stringify(products)
		fs.writeFileSync(productsFilePath, productosModificadosJSON)
		
		res.redirect("../");	
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		let productsQueQuedan = products.filter(function(element) {
			return element.id != req.params.productId;
		});

		let productosModificadosJSON = JSON.stringify(productsQueQuedan)
		fs.writeFileSync(productsFilePath, productosModificadosJSON)
		res.send(productsQueQuedan)
	}
};

module.exports = controller;
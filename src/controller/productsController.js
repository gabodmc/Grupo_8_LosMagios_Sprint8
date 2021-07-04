const { Product, Brand, Category } = require('../database/models');
const { Op } = require("sequelize");
const imagesController = require('./imagesController');



const productsController = {

// Función que muestra el formulario de crear Productos
    create: async (req, res) => {        
        let brands = await Brand.findAll();
        let categories = await Category.findAll();
        res.render('products/createProducts', { brands, categories });
    },
    
// Función que simula el almacenamiento, en este caso en array
    store: async (req, res) => {
        try{
            let productCreated = await Product.create({
                name: req.body.name,
                model: req.body.model,
                description: req.body.description,
                specs: req.body.specs,
                keywords: req.body.keywords,
                price: req.body.price,
                discount: req.body.discount,
                stock: req.body.stock,
                stockMin: req.body.stockMin,
                stockMax: req.body.stockMax,
                categoryId: req.body.category,
                brandId: req.body.brand
            });


            let imagesForProduct = [];
                                

            req.body.image1 = req.files[0] ? req.files[0].filename : '';
            imagesForProduct.push({ name: req.body.image1 });            
            req.body.image2 = req.files[1] ? req.files[1].filename : '';
            imagesForProduct.push({ name: req.body.image2 });
            req.body.image3 = req.files[2] ? req.files[2].filename : '';
            imagesForProduct.push({ name: req.body.image3 });
            /*req.body.image4 = req.file[3] ? req.file.filename[3] : '';
            imagesForProduct.push({ name: req.body.image4 });
            req.body.image5 = req.file[4] ? req.file.filename[4] : '';
            imagesForProduct.push({ name: req.body.image5 });*/

                     
            await imagesController.bulkCreate(productCreated.id, imagesForProduct)

        

            res.redirect('/products/productList');

        } catch (error) {
            res.send(error)
        }
    }, 

       

        

// // Función que muestra la información almacenada
    show: async (req, res) => {        
        let product = await Product.findByPk(req.params.id, {
            include: ['brand'], });            
        if (product) {            
            res.render('products/productDetail', { product });
        } else {
            res.render('error404');
        }
    },

// Función que borra información almacenada
    destroy: async (req, res) => {
        await Product.destroy({ where: {id: req.params.id}});        
        res.redirect('/products/productList');
    },

//Función para listar los productos
    list: async (req, res) => {        
        if (req.query) {            
        const query = req.query;            
        const productNameKeyword = query.product_name ? query.product_name: '';
        let products = await Product.findAll({
            where: { name: { [Op.substring]: productNameKeyword }} 
        });
        return res.render('products/productList', { products });
    } else {
        let products = await Product.findAll();        
        return res.render('products/productList', { products });
    }},

// Función para traer datos los productos para editar
    edit: async (req, res) => {
        let brands = await Brand.findAll();
        let categories = await Category.findAll();
        let product = await Product.findByPk(req.params.id, {
            include: ['brand', 'category'], });
        if (product) {
            res.render('products/editProducts', { product, brands, categories });
        } else {
            res.render('error404');
        }
    },
        
// Función para actualizar información editada de los producto
    update: (req, res) => {
        let product = req.body;
        product.id = req.params.id;
        //product.image = req.file ? req.file.filename : req.body.old_image;
        // if (req.body.image===undefined) {
        //     product.image = req.body.old_image
        // }
        // delete product.oldImage;
        try {    
            Product.update({
                id: req.params.id,
                name: req.body.name,
                model: req.body.model,
                description: req.body.description,
                specs: req.body.specs,
                keywords: req.body.keywords,
                price: req.body.price,
                discount: req.body.discount,
                stock: req.body.stock,
                stockMin: req.body.stockMin,
                stockMax: req.body.stockMax,
                categoryId: req.body.category,
                brandId: req.body.brand
            }, {
                where: {id: req.params.id}
            })
            
            res.redirect("/products/productDetail/" + req.params.id);
        
        } catch (error) {
            res.send(error)
        }
        
    }, 



// // Función para guardar y mostrar el carrito de compras
//     cart: (req, res) => {
//         res.render('products/productCart');
//     }
};


module.exports = productsController;
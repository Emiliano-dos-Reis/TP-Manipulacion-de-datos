const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order : [
                ['name','ASC']
            ]
        })
        .then(genres => {
           
            return res.render('moviesAdd',{
                genres
            })

        })
        .catch(error => console.log(error))
    },
    create: function (req, res) {
        const {title,awards,release_date,genre_id,length,rating} = req.body
        db.Movie.create ({
            title : title.trim(),
            awards : +awards,
            release_date,
            length : +length,
            rating: +rating,
            genre_id : +genre_id
        })
        .then(movie => {
            console.log(movie);
            return res.redirect('/movies')
        })

        .catch(error => console.log(error))
    },
    edit: function(req, res) {
        db.Movie.findByPk(req.params.id)
        .then(Movie => {
            return res.render('moviesEdit',{
                Movie
            })
        })
    },
    update: function (req,res) {
        const { title, awards, release_date, genre_id, length, rating} = req.body;
        db.Movie.update(
            {
            title : title.trim(),
            awards : +awards,
            release_date,
            length : +length,
            rating: +rating,
            
            },
            {
            where : {
            id : req.params.id
            }
            }
        ) 
        .then( () => res.redirect('/movies'))
        .catch(error => console.log(error))
    },
    delete: function (req, res) {
       db.Movie.findByPk(req.params.id)
       .then(Movie => res.render('moviesDelete',{
        Movie
       }))
       .catch(error => console.log(error))
    },


    destroy: function (req, res) {
       db.Movie.destroy({
        where : {
            id : req.params.id
        }
       })
       .then(() => res.redirect('/movies'))
       .catch(error => console.log(error))
    },

};

module.exports = moviesController;
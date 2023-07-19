const express = require('express');
const bodyparser = require('body-parser');
// const cookieparser = require('cookie-parser');
const session = require('express-session');
// const morgan = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { Timestamp } = require('bson');
// const user = require('./models/user');
const DB_URL = "mongodb+srv://nodedemo:nodedemo@nodecazzy.zasfn3a.mongodb.net/Session?retryWrites=true&w=majority";

const app = express();


// --------------------------------------------session-----------------------------------------------------------------------
const mongoStore = MongoStore.create({
    mongoUrl: DB_URL,
    collectionName: "sessions",
});

app.use(session({
    secret:"kishanakbari",
    resave:false,
    saveUninitialized:true,
    store: mongoStore,
    cookie:{maxAge:1000*20}
}))

// ---------------------------------------------body-patser,ejs,set,use----------------------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.set("strictQuery", false);
app.set('views', __dirname+'/views');
app.set('view engine','ejs');


// --------------------------------------------routes-----------------------------------------------------------------------

const authction = (req,res,next)=>{
    console.log(req.session.isAuth);
    if(req.session.isAuth){
        next();
    }
    else{
        res.redirect('/login');
    }
}


app.get('/login',(req,res)=>{
    res.render('login',{err:null});
});


app.get('/desktop',authction,(req,res)=>{
    res.render('desktop');
})

app.post('/login',async (req,res)=>{

    console.log(req.body);
    if(1)
    {
        req.session.regenerate(async (err)=>{
            console.log('+++');
            if(err){
                console.log(err);
                return ;
            }
        });

        setTimeout(() => {
            req.session.isAuth = true;
            res.redirect('/desktop');
        }, 500);
    }
    else
    {
        res.redirect('/login');
    }

});

app.post('/register',(req,res)=>{
    console.log(req.body);
    return res.redirect('/login');
});



app.get('/register',(req,res)=>{
    //console.log
    res.render('regiter',{err:null});
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }
    })

      

})




// ----------------------------------------database-----------------------------------------------------------------------------------

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) =>{
    console.log('Database connected....')
}
).catch((err) => console.log(err))

// -------------------------------------------server---------------------------------------------------------------------------------------------
app.listen(3000,()=>{
    console.log('here we go');
})

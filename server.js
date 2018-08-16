const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL);
const path = require('path');

const User = conn.define('user', {
    name: Sequelize.STRING
})
const Department = conn.define('department', {
    name: Sequelize.STRING
})
User.belongsTo(Department);
Department.hasMany(User);

const sync = () => conn.sync({force: true});

const seed = () => {
    let moe, larry, curly, hr, admin, engineering;
    return Promise.all([
        Department.create({name: 'hr'}),
        Department.create({name: 'admin'}),
        Department.create({name: 'engineering'})
    ])
    .then(departments =>{
        [hr, admin, engineering] = departments;
        return Promise.all([
            User.create({name: 'moe'}),
            User.create({name: 'larry'}),
            User.create({name: 'curly'})
        ])
        .then(users =>{
            [moe, larry, curly] = users;
            return Promise.all([
                admin.addUser(moe),
                admin.addUser(larry),
                hr.addUser(curly)
            ])
        })

    }) 
}

sync()
.then(()=> seed());
app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.get('/', (req,res,next)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/api/departments', (req, res, next)=>{
    Department.findAll({
        include: [User]
    })
    .then(departments => res.send(departments))
    .catch(next);
})
app.get('/api/departments/:id', (req,res,next)=>{
    Department.findById(req.params.id, {
        include: [User]
    })
    .then(department => res.send(department))
    .catch(next);
})



app.listen(port, ()=> console.log(`listening on port ${port}`));
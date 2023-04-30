const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../model/tourModel')

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => console.log(err));

//Read Json

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('data successsfully loaded!')
    }catch(err){
        console.log(err);
    }
    process.exit()
}

// Delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Data successfully deleted')
        process.exit()
    }catch(err){
        console.log(err)
    }
}
if(process.argv[2] === '--import'){
    importData()
} else if(process.argv[2] === '--delete'){
    deleteData();
}
console.log(process.argv)
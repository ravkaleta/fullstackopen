const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('give password as an argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mcvacer:${password}@cluster0.ykrpiqp.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
}) 

const PhonebookEntry = mongoose.model('PhonebookEntries', phonebookSchema);

if(process.argv.length > 3){
    const name = process.argv[3];
    const number = process.argv[4];

    const phonebookEntry = new PhonebookEntry({
        name: name,
        number: number,
    })
    
    phonebookEntry.save().then(result => {
        console.log(`added ${phonebookEntry.name} number ${phonebookEntry.number} to phonebook`);
        mongoose.connection.close();
    })

} else {
    PhonebookEntry.find({}).then(result => {
        result.forEach(result => {
            console.log(result.name + ' ' + result.number)
        })
        mongoose.connection.close();
    })
}



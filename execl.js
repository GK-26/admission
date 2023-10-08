const mongoose = require('mongoose');
const xlsx = require('xlsx');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Define a Mongoose schema and model
    const Schema = mongoose.Schema;
    const MyModelSchema = new Schema({
      name: String,
      age: Number,
      email: String
    });
    const MyModel = mongoose.model('MyModel', MyModelSchema);

    // Fetch data from MongoDB
    MyModel.find({}, (err, data) => {
      if (err) {
        console.error('Error fetching data:', err);
        return;
      }

      // Prepare data for Excel sheet
      const worksheetData = data.map(item => ({
        Name: item.name,
        Age: item.age,
        Email: item.email
      }));

      // Create a new workbook and worksheet
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(worksheetData);

      // Add the worksheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

      // Save the workbook to a file
      xlsx.writeFile(workbook, 'output.xlsx');

      console.log('Excel sheet created successfully!');
      mongoose.connection.close();
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
